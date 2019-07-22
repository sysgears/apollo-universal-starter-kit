const config = {
  ...require('../../build.config'),
  __CLIENT__: false,
  __SERVER__: true,
  __DEV__: process.env.NODE_ENV !== 'production',
  __TEST__: false,
  'process.env.NODE_ENV': process.env.NODE_ENV || 'development',
  __SERVER_PORT__: process.env.SERVER_PORT || process.env.PORT || 8080,
  __API_URL__: process.env.BACKEND_API_URL || '/graphql',
  __WEBSITE_URL__: process.env.WEBSITE_URL || 'http://localhost:3000',
  __CDN_URL__: process.env.CDN_URL || '',
  __FRONTEND_BUILD_DIR__: process.env.FRONTEND_BUILD_DIR || '../client/build'
};

module.exports = config;
