/* eslint-disable no-console */
const express = require('express');
const next = require('next');
const compression = require('compression');
const LRUCache = require('lru-cache');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const ShareDB = require('sharedb');
const richText = require('rich-text');
const WebSocket = require('ws');
const WebSocketJSONStream = require('websocket-json-stream');

dotenv.config();

ShareDB.types.register(richText.type);
const db = require('sharedb-postgres')({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: true
});
const shareDbBackend = require('sharedb')({ db });

const isDev = process.env.NODE_ENV !== 'production';
const isProd = !isDev;
const ngrok = isDev && process.env.ENABLE_TUNNEL ? require('ngrok') : null;
const router = require('./routes');
const logger = require('./server/logger');

const customHost = process.env.HOST;
const host = customHost || null;
const prettyHost = customHost || 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;
const publicEnvFilename = 'public.env';

const nextApp = next({ dev: isDev });
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
// TODO:
// - convert to rich text format
// - figure out how to have a connection for each textbox in the meeting

startNextServer().then(nextServer => {
  // Start the web socket server on the same port as the nextjs server
  function startWebSocketServer() {
    // Connect any incoming WebSocket connection to ShareDB
    const wss = new WebSocket.Server({ server: nextServer });
    wss.on('connection', ws => {
      const stream = new WebSocketJSONStream(ws);
      shareDbBackend.listen(stream);
    });
  }

  // Create initial document then fire callback
  const connection = shareDbBackend.connect();
  const doc = connection.get('examples', 'richtext');
  doc.fetch(err => {
    if (err) throw err;
    if (doc.type === null) {
      doc.create([], 'rich-text', startWebSocketServer);
      return;
    }
    startWebSocketServer();
  });
});
