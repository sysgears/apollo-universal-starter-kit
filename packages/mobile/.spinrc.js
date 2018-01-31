const url = require('url');

const config = {
  builders: {
    android: {
      entry: './src/index.js',
      buildDir: 'build/android',
      dllBuildDir: 'build/android/dll',
      stack: ['react-native', 'android'],
      defines: {
        __CLIENT__: true
      },
      enabled: false
    },
    ios: {
      entry: './src/index.js',
      buildDir: 'build/ios',
      dllBuildDir: 'build/ios/dll',
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
    stack: ['apollo', 'react', 'styled-components', 'es6', 'webpack'],
    cache: '../../.cache',
    webpackDll: true,
    reactHotLoader: false,
    persistGraphQL: false,
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
}

const extraDefines = {
  __PERSIST_GQL__: config.options.persistGraphQL
};

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;