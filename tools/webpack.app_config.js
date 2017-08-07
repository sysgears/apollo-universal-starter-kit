// App-specific back-end Webpack config should be here
const server = {
//  entry: {
//    index: [
//      'babel-polyfill',
//      './src/server/index.js'
//    ]
//  }
};

// App-specific web front-end Webpack config should be here
const web = {
//  entry: {
//    index: [
//      'babel-polyfill',
//      './src/client/index.jsx'
//    ]
//  }
};

// App-specific Android React Native front-end Webpack config should be here
const android = {
//  entry: {
//    'index.mobile.bundle': [
//      require.resolve('./react-native-polyfill.js'),
//      './src/mobile/index.js'
//    ]
//  }
};

// App-specific iOS React Native front-end Webpack config should be here
const ios = {
//  entry: {
//    'index.mobile.bundle': [
//      require.resolve('./react-native-polyfill.js'),
//      './src/mobile/index.js'
//    ]
//  }
};

const dependencyPlatforms = {
  "body-parser": "server",
  "bootstrap": "web",
  "dataloader": "server",
  "expo": ["ios", "android"],
  "express": "server",
  "graphql-server-express": "server",
  "graphql-subscriptions": "server",
  "graphql-tools": "server",
  "history": "web",
  "immutability-helper": ["ios", "android", "web"],
  "isomorphic-fetch": "server",
  "knex": "server",
  "persistgraphql": ["server", "web"],
  "performance-now": "server",
  "react-dom": "web",
  "react-ga": "web",
  "react-helmet": "web",
  "react-hot-loader": "web",
  "react-native": ["ios", "android"],
  "react-native-web": "web",
  "react-redux": "web",
  "react-router": "web",
  "react-router-dom": "web",
  "react-router-redux": "web",
  "react-transition-group": "web",
  "reactstrap": "web",
  "redux-devtools-extension": "web",
  "redux-form": "web",
  "serialize-javascript": "server",
  "source-map-support": "server",
  "sqlite3": "server",
  "styled-components": ["server", "web"],
  "subscriptions-transport-ws": ["ios", "android", "web"]
};

module.exports = { server, web, android, ios, dependencyPlatforms };
