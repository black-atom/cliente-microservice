const getConfig = require('./index');

const config = getConfig({
    development: {
        url: "mongodb://localhost/test",
        username: '',
        password: ''
    },

    test: {
        url: "mongodb://localhost/test",
        username: '',
        password: ''
    },

    production: {
        url: process.env.DB_URL,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    }
});

module.exports = config;