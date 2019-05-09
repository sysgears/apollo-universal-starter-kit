const config = {
  builders: {
    test: {
      roles: ['test'],
      defines: {
        __DEV__: false,
        __API_URL__: '"/graphql"',
        __TEST__: true
      }
    }
  },
  options: {
    cache: '../../.cache'
  }
};

module.exports = config;