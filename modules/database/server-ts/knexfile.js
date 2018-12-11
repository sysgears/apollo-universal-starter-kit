require('dotenv/config');
require('@babel/register')({ cwd: __dirname + '/../..' });
require('@babel/polyfill');

console.log(1);
const config = require('./knexdata');

module.exports = config;
