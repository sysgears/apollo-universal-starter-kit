const url = require('url');

const config = {
  builders: {
    server: {
      buildDir: 'build/server',
      stack: ['react-native-web', 'server'],
      defines: {
        __BACKEND_URL__: '"http://localhost:8080/graphql"',
        __SERVER__: true
      },
      enabled: true
    },
    web: {
      buildDir: 'build/client/web',
      stack: ['react-native-web', 'web'],
      openBrowser: true,
      defines: {
        __CLIENT__: true
      },
      // Wait for backend to start prior to letting webpack load frontend page
      waitOn: ['tcp:localhost:8080'],
      enabled: true
    },
    android: {
      buildDir: 'build/client/android',
      stack: ['react-native', 'android'],
      defines: {
        __CLIENT__: true
      },
      enabled: false
    },
    ios: {
      buildDir: 'build/client/ios',
      stack: ['react-native', 'ios'],
      defines: {
        __CLIENT__: true
      },
      enabled: false
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
    dllBuildDir: 'build/dll',
    overridesConfig: 'tools/webpackAppConfig.js',
    stack: ['apollo', 'react', 'styled-components', 'css', 'sass', 'less', 'es6', 'webpack'],
    ssr: true,
    webpackDll: true,
    devProxy: true,
    reactHotLoader: false,
    persistGraphQL: false,
    frontendRefreshOnBackendChange: true,
    defines: {
      __DEV__: process.env.NODE_ENV !== 'production',
      __BACKEND_URL__: '"http://localhost:8080/graphql"'
    }
  }
};

if (process.env.NODE_ENV === 'production') {
  config.builders.android.enabled = true;
  config.builders.ios.enabled = true;
  config.options.defines.__BACKEND_URL__ = '"https://apollo-universal-starter-kit.herokuapp.com/graphql"';
  // Generating source maps for production will slowdown compilation for roughly 25%
  config.options.sourceMap = false;
  // Enable Babel and other caching for production builds too. Might be dangerous!
  config.options.cache = true;
}

const extraDefines = {
  __SSR__: config.options.ssr,
  __PERSIST_GQL__: config.options.persistGraphQL,
  __FRONTEND_BUILD_DIR__: `"${config.builders.web.buildDir}"`,
  __DLL_BUILD_DIR__: `"${config.options.dllBuildDir}"`
};

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;