require('babel-register')({
  presets: ['es2015', 'stage-0', 'flow'],
  ignore: /node_modules(?!\/(haul|react-native))/,
  retainLines: true,
  sourceMaps: 'inline',
});
require('babel-polyfill');

module.exports = require('./webpack.config');
