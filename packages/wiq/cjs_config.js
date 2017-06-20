require('babel-register')({
  presets: [
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-stage-0'),
    require.resolve('babel-preset-flow')],
  ignore: /node_modules(?!\/(haul|react-native))/,
  retainLines: true,
  sourceMaps: 'inline',
});

module.exports = require('./config');
