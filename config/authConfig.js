const R = require('ramda');
const getConfig = require('./index');

const config = getConfig({
    development: {
        bypass: true,
        secret: "realponto"
    },

    test: {
        bypass: true,
        secret: "realponto"
    },

    production: {
        bypass: false,
        secret: "realponto"
    }
});

module.exports = config;