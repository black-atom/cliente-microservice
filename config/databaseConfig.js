const getConfig = require('./index');

const config = getConfig({
    development: {
        url: process.env.DB_URL || "mongodb://localhost/test",
        username: process.env.DB_USERNAME || '',
        password: process.env.DB_PASSWORD || ''
    },

    test: {
        url: process.env.DB_URL || "mongodb://localhost/test",
        username: process.env.DB_USERNAME || '',
        password: process.env.DB_PASSWORD || ''
    },

    production: {
        url: process.env.DB_URL,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    }
});

module.exports = config;