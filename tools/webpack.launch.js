require('babel-register')({
  presets: ['es2015', 'flow'],
  ignore: /node_modules(?!\/haul-cli)/,
  retainLines: true,
  sourceMaps: 'inline',
});

require('./webpack.run');
