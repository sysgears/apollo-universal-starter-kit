const root = __dirname + '/../../../..';

require('@babel/register')({
  root,
  cwd: root,
  configFile: root + '/packages/server/babel.config.js',
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  cache: false
});

require.extensions['.scss'] = () => {};
require.extensions['.css'] = () => {};
require.extensions['.less'] = () => {};

Object.assign(global, require('../../jest.config').globals);

const { setup } = require('@gqlapp/testing-server-ts');
require('..');

module.exports = setup;
