const root = __dirname + '/../../../..';

require('@babel/register')({
  root,
  cwd: root,
  configFile: root + '/packages/server/babel.config.js',
  extensions: ['.js', '.jsx', '.ts', '.tsx']
});

require.extensions['.scss'] = () => {};

Object.assign(global, {
  __CLIENT__: false,
  __SERVER__: true,
  __DEV__: true,
  __TEST__: true,
  __SSR__: false,
  __FRONTEND_BUILD_DIR__: __dirname + '/../client/build',
  __DLL_BUILD_DIR__: __dirname + '/../../.cache/dll',
  __API_URL__: '/graphql'
});

const { setup } = require('@gqlapp/testing-server-ts');
require('..');

module.exports = setup;
