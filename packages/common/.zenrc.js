const config = {
  builders: {
    test: {
      stack: ['server'],
      roles: ['test'],
      defines: {
        __DEV__: false,
        __API_URL__: '"/graphql"',
        __TEST__: true
      }
    }
  },
  options: {
    cache: '../../.cache',
    stack: ['ts', 'webpack', 'i18next'],
  }
};

module.exports = config;