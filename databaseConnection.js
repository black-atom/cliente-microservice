const mongoose = require('mongoose');
const bluebird = require('bluebird');
const { isNil } = require("ramda");
const databaseConfig = require("./config/database")();

let db = null;

const  defaultOpt = {
    db: { native_parser: true },
    server: { poolSize: 10 },
    promiseLibrary: bluebird,
}


mongoose.connect(databaseConfig.url , defaultOpt);
mongoose.Promise = bluebird;

db = mongoose.connection;

global.db = db;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
    console.log('Database is successfully running');
});


module.exports = db;
