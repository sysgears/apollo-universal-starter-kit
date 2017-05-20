require('babel-register')({
  presets: ['es2015', 'flow'],
  ignore: /node_modules(?!\/haul-cli)/,
  retainLines: true,
  sourceMaps: 'inline',
});

if (process.argv.indexOf('--webpack-config') >= 0 ||
  process.argv.indexOf('--ext') >= 0) {
  module.exports = require('./webpack.config');
} else {
  require('./webpack.run');
}