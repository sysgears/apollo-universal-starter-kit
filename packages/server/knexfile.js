/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
require('dotenv/config');

const BABEL_CONFIG = path.resolve(require.resolve('../../babel.config.knex.js'));
require('@babel/register')({ cwd: path.dirname(BABEL_CONFIG), configFile: BABEL_CONFIG });
require('@babel/polyfill');
const config = require('./knexdata');

module.exports = config;
