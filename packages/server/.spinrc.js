const url = require('url');

const config = {
  builders: {
    server: {
      entry: './src/index.js',
      stack: ['react-native-web', 'server'],
      defines: {
        __BACKEND_URL__: '"http://localhost:8080/graphql"',
        __SERVER__: true
      },
      enabled: true
    },
    test: {
      stack: ['react-native-web', 'server'],
      roles: ['test'],
      defines: {
        __TEST__: true
      }
    }
  },
  options: {
    stack: ['apollo', 'react', 'styled-components', 'css', 'sass', 'less', 'es6', 'webpack'],
    cache: '../../.cache',
    ssr: true,
    webpackDll: true,
    reactHotLoader: false,
    persistGraphQL: false,
    frontendRefreshOnBackendChange: true,
    defines: {
      __DEV__: process.env.NODE_ENV !== 'production',
      __BACKEND_URL__: '"http://localhost:8080/graphql"'
    }
  }
};

config.options.devProxy = config.options.ssr;

if (process.env.NODE_ENV === 'production') {
  // Generating source maps for production will slowdown compilation for roughly 25%
  config.options.sourceMap = false;
}

const extraDefines = {
  __SSR__: config.options.ssr,
  __PERSIST_GQL__: config.options.persistGraphQL,
  __FRONTEND_BUILD_DIR__: `"../client/build"`,
  __DLL_BUILD_DIR__: `"../client/build/dll"`
};

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;