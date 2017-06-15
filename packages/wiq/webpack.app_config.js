// App-specific back-end Webpack config should be here
const serverConfig = {
  // Uncomment the next line and set URL if you use external GraphQL server
  // url: 'http://localhost:8080/graphql',
  entry: {
    index: [
      require.resolve('babel-polyfill'),
      './index.js'
    ]
  }
};

// App-specific web front-end Webpack config should be here
const webConfig = {
  entry: {
    bundle: [
      require.resolve('babel-polyfill'),
      './index.jsx'
    ]
  }
};

// App-specific Android React Native front-end Webpack config should be here
const androidConfig = {
  entry: {
    'index.android.bundle': [
      require.resolve('./react-native-polyfill.js'),
      './index.js'
    ]
  }
};

// App-specific iOS React Native front-end Webpack config should be here
const iOSConfig = {
  entry: {
    'index.ios.bundle': [
      require.resolve('./react-native-polyfill.js'),
      './index.js'
    ]
  }
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

export { webConfig, serverConfig, androidConfig, iOSConfig, dependencyPlatforms };
