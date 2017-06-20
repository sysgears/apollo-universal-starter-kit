#!/usr/bin/env node
if (process.argv[2] === 'test') {
  process.argv.shift();
  require('.bin/mocha-webpack');
} else {
  require('babel-register')({
    presets: [
      require.resolve('babel-preset-es2015'),
      require.resolve('babel-preset-stage-0'),
      require.resolve('babel-preset-flow')],
    ignore: /node_modules(?!\/(haul|react-native))/,
    retainLines: true,
    sourceMaps: 'inline',
  });
  require('babel-polyfill');

  require('./webpack.run');
}
