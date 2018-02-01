const url = require('url');

const config = {
  builders: {
    web: {
      entry: './src/index.js',
      stack: ['react-native-web', 'web'],
      openBrowser: true,
      defines: {
        __CLIENT__: true
      },
      // Wait for backend to start prior to letting webpack load frontend page
      waitOn: ['tcp:localhost:8080'],
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
  config.options.defines.__BACKEND_URL__ = '"https://apollo-universal-starter-kit.herokuapp.com/graphql"';
  // Generating source maps for production will slowdown compilation for roughly 25%
  config.options.sourceMap = false;
}

const extraDefines = {
  __SSR__: config.options.ssr,
  __PERSIST_GQL__: config.options.persistGraphQL
};

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;