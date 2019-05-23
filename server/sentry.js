/* eslint-disable import/prefer-default-export */
const uuidv4 = require('uuid/v4');

// middleware to only allow source maps for sentry
export const sourcemapsForSentryOnly = token => (req, res, next) => {
  const dev = process.env.NODE_ENV !== 'production';

  // In production we only want to serve source maps for sentry
  if (!dev && !!token && req.headers['x-sentry-token'] !== token) {
    res
      .status(401)
      .send(
        'Authentication access token is required to access the source map.'
      );
    return;
  }
  next();
};

export const sessionCookie = (req, res, next) => {
  const htmlPage =
    !req.path.match(/^\/(_next|static)/) &&
    !req.path.match(/\.(js|map)$/) &&
    req.accepts('text/html', 'text/css', 'image/png') === 'text/html';

  if (!htmlPage) {
    next();
    return;
  }

  if (!req.cookies.sid || req.cookies.sid.length === 0) {
    req.cookies.sid = uuidv4();
    res.cookie('sid', req.cookies.sid);
  }

  next();
};
