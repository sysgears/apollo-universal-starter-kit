const config = {
  builders: {
    web: {
      dllExcludes: [ 'bootstrap' ],
      openBrowser: true,
      // Wait for backend to start prior to letting webpack load frontend page
      waitOn: [ 'tcp:localhost:8080' ],
      defines: {
        __CLIENT__: true
      },
      enabled: false
    }
  },
  options: {
    cache: '../../.cache',
    ssr: false,
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

const extraDefines = {
  __SSR__: config.options.ssr
};

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;
