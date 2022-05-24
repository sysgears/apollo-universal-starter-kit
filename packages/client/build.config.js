const config = {
  ...require('../../build.config'),
  __CLIENT__: true,
  __SERVER__: false,
  __DEV__: process.env.NODE_ENV !== 'production',
  __TEST__: false,
  'process.env': {
    NODE_ENV: '"' + (process.env.NODE_ENV || 'development') + '"',
    STRIPE_PUBLIC_KEY: '"' + process.env.STRIPE_PUBLIC_KEY + '"',
  },
  __API_URL__: process.env.API_URL || '/graphql',
};

module.exports = config;
