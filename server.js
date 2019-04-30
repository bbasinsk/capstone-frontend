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
const { parse } = require('pg-connection-string');

const { ApolloClient } = require('apollo-client');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { HttpLink } = require('apollo-link-http');
const fetch = require('node-fetch');
const gql = require('graphql-tag');

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://meeting-magic-backend.herokuapp.com/v1alpha1/graphql',
    credentials: 'include',
    fetch
  }),
  cache: new InMemoryCache()
});

dotenv.config();

ShareDB.types.register(richText.type);
const db = require('sharedb-postgres')({
  ...parse(process.env.DATABASE_URL),
  ssl: true
});
const shareDbBackend = require('sharedb')({ db });

const isDev = process.env.NODE_ENV !== 'production';
const isProd = !isDev;
const ngrok = isDev && process.env.ENABLE_TUNNEL ? require('ngrok') : null;
const router = require('./routes');
const logger = require('./server/logger');

const customHost = process.env.HOST;
const host = customHost || '0.0.0.0';
const prettyHost = customHost || 'localhost';
const port = process.env.PORT || 3000;
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
    server.use(express.json());

    server.post(`/events/email/agenda`, async (req, res) => {
      const meeting = req.body.event.data.new;

      const { data } = await client.query({
        query: gql`
          query getMeeting($meetingId: uuid!) {
            meeting(where: { id: { _eq: $meetingId } }) {
              agenda_items {
                id
                title
                desc
                duration
              }
              meeting_members {
                member_user {
                  email
                }
              }
            }
          }
        `,
        variables: { meetingId: meeting.id }
      });

      const agendaItems = data.meeting[0].agenda_items;
      const emails = data.meeting[0].meeting_members.map(
        member => member.member_user.email
      );

      const emailPayload = {
        Messages: [
          {
            From: {
              Email: 'noreply@neatmeet.co',
              Name: 'NeatMeet'
            },
            To: emails.map(email => ({ Email: email })),
            TemplateID: 780768,
            TemplateLanguage: true,
            Subject: 'Your Meeting Agenda',
            Variables: {
              meeting_name: meeting.name,
              meeting_location: meeting.location,
              meeting_url: `https://www.neatmeet.co/meeting/${meeting.id}`,
              agenda_items: agendaItems
            }
          }
        ]
      };

      await fetch('https://api.mailjet.com/v3.1/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.MAILJET_AUTH
        },
        body: JSON.stringify(emailPayload)
      });

      return res.json(emailPayload);
    });

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

startNextServer().then(nextServer => {
  // Start the web socket server on the same port as the nextjs server
  const wss = new WebSocket.Server({ server: nextServer });

  wss.on('connection', ws => {
    const stream = new WebSocketJSONStream(ws);
    shareDbBackend.listen(stream);
  });
});
