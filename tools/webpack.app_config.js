// App-specific front-end config should be here
const clientConfig = {
  entry: {
    bundle: ['babel-polyfill', './src/client/index.jsx']
  }
};

// App-specific back-end config should be here
const serverConfig = {
  // Uncomment the next line and set URL if you use external GraphQL server
  // url: 'http://localhost:8080/graphql',
  entry: {
    index: ['babel-polyfill', './src/server/index.js']
  }
};

module.exports = {
  clientConfig: clientConfig,
  serverConfig: serverConfig
};
