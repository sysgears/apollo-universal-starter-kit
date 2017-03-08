const pkg = require('../package.json');
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  require(path.join(__dirname, '..', pkg.app.backendBuildDir));
} else {
  require('./webpack.run');
}
