const { parse } = require('pg-connection-string');
const db = require('sharedb-postgres')({
  ...parse(process.env.DATABASE_URL),
  ssl: true
});
const shareDbBackend = require('sharedb')({ db });

module.exports = {
  db,
  shareDbBackend
};
