const R = require('ramda');
const getConfig = require('./index').getConfig;

const config = getConfig({
    development: {
        url: "mongodb://localhost/test",
    },

    test: {
        url: "mongodb://localhost/test",
    }
});

module.exports = config;