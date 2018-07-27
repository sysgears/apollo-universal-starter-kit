/* eslint import/no-extraneous-dependencies: 0 */
require('dotenv/config');
require('babel-register')({ presets: ['env'], plugins: ['transform-class-properties'] });
require('babel-polyfill');
const config = require('./knexdata');

module.exports = config;
