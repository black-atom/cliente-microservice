const mongoose = require('mongoose');
const bluebird = require('bluebird');
const { isNil } = require("ramda");
const dbConfig = require("./config/databaseConfig")();

let db = null;

let options = {
  db: { native_parser: true },
  server: { poolSize: 10 },
  promiseLibrary: bluebird,
  user: dbConfig.username,
  pass: dbConfig.password
}

mongoose.connect(dbConfig.url, options);
mongoose.Promise = bluebird;

db = mongoose.connection;

global.db = db;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log('Database is successfully running');
});


module.exports = db;
