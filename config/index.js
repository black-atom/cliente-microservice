const R = require('ramda');

/**
 * This approach is from a pagar.me code. All the credits goes do grvcoelho
 */

/**
 * Gets the environment variable accordint 
 * @param {*} env a string, development, test, production
 */
const getEnv = (env) => env || process.env.NODE_ENV || 'test';

/**
 * Gets the configuration according to the environment 
 * @param {*} config 
 */
const getConfig = config => (env) => R.prop(getEnv(env), config);

module.exports = {
    getEnv,
    getConfig
}