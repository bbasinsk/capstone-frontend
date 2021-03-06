/* eslint-disable no-console */

const express = require('express');
const nextJS = require('next');
const compression = require('compression');
const sslRedirect = require('heroku-ssl-redirect');
const LRUCache = require('lru-cache');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const richText = require('rich-text');
const WebSocket = require('ws');
const WebSocketJSONStream = require('websocket-json-stream');
const ShareDB = require('sharedb');

ShareDB.types.register(richText.type);
dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';
const isProd = !isDev;
const ngrok = isDev && process.env.ENABLE_TUNNEL ? require('ngrok') : null;
const router = require('./routes');
const events = require('./server/events');
const auth = require('./server/auth');
const logger = require('./server/logger');
const { sourcemapsForSentryOnly, sessionCookie } = require('./server/sentry');
const { shareDbBackend } = require('./server/db');

const sentry = require('./shared/utils/sentry');

const customHost = process.env.HOST;
const host = customHost || '0.0.0.0';
const prettyHost = customHost || 'localhost';
const port = process.env.PORT || 3000;
const publicEnvFilename = 'public.env';

const nextApp = nextJS({ dev: isDev });
const handle = nextApp.getRequestHandler();

const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60 // 1hour
});

// share public env variables (if not already set)
try {
  if (fs.existsSync(path.resolve(__dirname, publicEnvFilename))) {
    const publicEnv = dotenv.parse(
      fs.readFileSync(path.resolve(__dirname, publicEnvFilename))
    );
    Object.keys(publicEnv).forEach(key => {
      if (!process.env[key]) {
        process.env[key] = publicEnv[key];
      }
    });
  }
} catch (err) {
  // silence is golden
}

const buildId = isProd
  ? fs.readFileSync('./.next/BUILD_ID', 'utf8').toString()
  : null;

/*
 * NB: make sure to modify this to take into account anything that should trigger
 * an immediate page change (e.g a locale stored in req.session)
 */
const getCacheKey = function getCacheKey(req) {
  return `${req.url}`;
};

const renderAndCache = function renderAndCache(
  req,
  res,
  pagePath,
  queryParams
) {
  const key = getCacheKey(req);

  if (ssrCache.has(key) && !isDev) {
    console.log(`CACHE HIT: ${key}`);
    res.send(ssrCache.get(key));
    return;
  }

  nextApp
    .renderToHTML(req, res, pagePath, queryParams)
    .then(html => {
      // Let's cache this page
      if (!isDev) {
        console.log(`CACHE MISS: ${key}`);
        ssrCache.set(key, html);
      }

      res.send(html);
    })
    .catch(err => {
      nextApp.renderError(err, req, res, pagePath, queryParams);
    });
};

const routerHandler = router.getRequestHandler(
  nextApp,
  ({ req, res, route, query }) => {
    renderAndCache(req, res, route.page, query);
  }
);

const startNextServer = () =>
  nextApp.prepare().then(() => {
    const { Sentry } = sentry(nextApp.buildId);

    const server = express();

    server.use(compression({ threshold: 0 }));
    server.use(
      cors({
        origin:
          prettyHost.indexOf('http') !== -1
            ? prettyHost
            : `http://${prettyHost}`,
        credentials: true
      })
    );
    server.use(helmet());

    // force https
    server.use(sslRedirect());

    // allow json for email sending
    server.use(express.json());

    // This attaches request information to sentry errors
    server.use(Sentry.Handlers.requestHandler());
    server.use(cookieParser());
    server.use(sessionCookie);
    server.get(/\.map$/, sourcemapsForSentryOnly(process.env.SENTRY_TOKEN));

    // serve routes for hasura event webhooks
    server.use('/events', events);

    // serve routes for hasura auth webhooks
    server.use('/auth', auth);

    // serve routes for nextjs application
    server.use(routerHandler);

    server.get(`/favicon.ico`, (req, res) =>
      nextApp.serveStatic(req, res, path.resolve('./static/icons/favicon.ico'))
    );

    server.get('/sw.js', (req, res) =>
      nextApp.serveStatic(req, res, path.resolve('./.next/sw.js'))
    );

    server.get('/manifest.html', (req, res) =>
      nextApp.serveStatic(req, res, path.resolve('./.next/manifest.html'))
    );

    server.get('/manifest.nextAppcache', (req, res) =>
      nextApp.serveStatic(
        req,
        res,
        path.resolve('./.next/manifest.nextAppcache')
      )
    );

    if (isProd) {
      server.get('/_next/-/nextApp.js', (req, res) =>
        nextApp.serveStatic(req, res, path.resolve('./.next/nextApp.js'))
      );

      const hash = buildId;

      server.get(`/_next/${hash}/nextApp.js`, (req, res) =>
        nextApp.serveStatic(req, res, path.resolve('./.next/nextApp.js'))
      );
    }

    server.get('*', (req, res) => handle(req, res));

    // This handles errors if they are thrown before raching the app
    server.use(Sentry.Handlers.errorHandler());

    return server.listen(port, host, err => {
      if (err) {
        return logger.error(err.message);
      }

      if (ngrok) {
        ngrok.connect(
          port,
          (innerErr, url) => {
            if (innerErr) {
              return logger.error(innerErr);
            }
            logger.appStarted(port, prettyHost, url);
          }
        );
      } else {
        logger.appStarted(port, prettyHost);
      }
    });
  });

// ShareDB connection ============================================================

startNextServer().then(nextServer => {
  // Start the web socket server on the same port as the nextjs server
  const wss = new WebSocket.Server({ server: nextServer });

  wss.on('connection', ws => {
    const stream = new WebSocketJSONStream(ws);
    shareDbBackend.listen(stream);
  });
});
