const url = require('url');

const config = {
  builders: {
    server: {
      defines: {
        __SERVER__: true
      },
      enabled: true
    },
    test: {
      defines: {
        __TEST__: true
      }
    }
  },
  options: {
    cache: '../../.cache',
    nodeDebugger: false,
    tsLoaderConfig: { transpileOnly: false, configFile: 'tsconfig.node.json' },
    ssr: true,
    minify: false,
    defines: {
      __DEV__: process.env.NODE_ENV !== 'production',
      __SERVER_PORT__: 8080,
      __API_URL__: '"/graphql"', // Use full URL if API is external, e.g. https://example.com/graphql
      __WEBSITE_URL__: '"http://localhost:3000"'
    }
  }
};

config.options.devProxy = config.options.ssr;

if (process.env.NODE_ENV === 'production') {
  config.options.defines.__SERVER_PORT__ = 8080;
  config.options.defines.__WEBSITE_URL__ = '"https://apollo-universal-starter-kit.herokuapp.com"';
}

const extraDefines = {
  __SSR__: config.options.ssr,
  __FRONTEND_BUILD_DIR__: `"../client/build"`,
  __DLL_BUILD_DIR__: `"../../.cache/dll"`
};

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;
