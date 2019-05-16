require('@babel/register')({
  root: __dirname + '/../../../..',
  configFile: __dirname + '/../../babel.config.js',
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  ignore: [/.*node_modules.*/, /build\/main.js/]
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
