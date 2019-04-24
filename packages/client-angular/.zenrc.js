const config = {
  builders: {
    web: {
      dllBuildDir: '../../.cache/dll',
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
    webpackDll: true,
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
