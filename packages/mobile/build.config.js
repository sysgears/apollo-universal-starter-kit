const config = {
  ...require('../../build.config'),
  __SERVER__: false,
  __CLIENT__: true,
  __SSR__: false,
  __TEST__: false,
  __API_URL__: process.env.API_URL || 'http://localhost:8080/graphql',
  __WEBSITE_URL__: process.env.WEBSITE_URL || 'http://localhost:8080'
};

module.exports = config;
