const root = __dirname + '/../../../..';

require('@babel/register')({
  root,
  cwd: root,
  configFile: root + '/packages/server/babel.config.js',
  extensions: ['.js', '.jsx', '.ts', '.tsx']
});

require.extensions['.scss'] = () => {};

Object.assign(global, require('../../jest.config').globals);

const { setup } = require('@gqlapp/testing-server-ts');
require('..');

module.exports = setup;
