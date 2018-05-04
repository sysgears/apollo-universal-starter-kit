const url = require('url');

const config = {
  builders: {
    web: {
      entry: './src/index.tsx',
      stack: ['web'],
      openBrowser: false,
      dllExcludes: ['bootstrap'],
      defines: {
        __CLIENT__: true
      },
      // Wait for backend to start prior to letting webpack load frontend page
      waitOn: ['tcp:localhost:8080'],
      enabled: true
    },
    test: {
      stack: ['server'],
      roles: ['test'],
      defines: {
        __TEST__: true
      }
    }
  },
  options: {
    stack: ['apollo', 'react', 'styled-components', 'css', 'sass', 'less', 'es6', 'ts', 'webpack', 'i18next'],
    cache: '../../.cache',
    ssr: true,
    webpackDll: true,
    reactHotLoader: false,
    frontendRefreshOnBackendChange: true,
    defines: {
      __DEV__: process.env.NODE_ENV !== 'production',
      __API_URL__: '"/graphql"'
    },
    webpackConfig: {
      devServer: {
        disableHostCheck: true
      }
    }
  }
};

config.options.devProxy = config.options.ssr;

if (process.env.NODE_ENV === 'production') {
  // Generating source maps for production will slowdown compilation for roughly 25%
  config.options.sourceMap = false;
}

const extraDefines = {
  __SSR__: config.options.ssr
};

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;