require('dotenv/config');
require('@babel/register')({ cwd: __dirname + '/../..' });
require('@babel/polyfill');
const config = require('./knexdata');

module.exports = config;
