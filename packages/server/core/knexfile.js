require('babel-register')({presets: ['es2015', 'stage-0']}) ;
require('babel-polyfill');
const config = require('./knexdata');

module.exports = config;