// App-specific front-end config should be here
const webConfig = {
  entry: {
    bundle: [
      'babel-polyfill',
      './src/client/index.jsx'
    ]
  }
};

// App-specific back-end config should be here
const serverConfig = {
  // Uncomment the next line and set URL if you use external GraphQL server
  // url: 'http://localhost:8080/graphql',
  entry: {
    index: [
      'babel-polyfill',
      './src/server/index.js'
    ]
  }
};

// App-specific iOS React Native config should be here
const androidConfig = {
  entry: {
    'index.android.bundle': [
      'babel-polyfill',
      './src/mobile/index.js'
    ]
  }
};

// App-specific iOS React Native config should be here
const iOSConfig = {
  entry: {
    'index.ios.bundle': [
      'babel-polyfill',
      require.resolve('./react-native-polyfill.js'),
      './src/mobile/index.js'
    ]
  }
};

module.exports = {
  webConfig: webConfig,
  serverConfig: serverConfig,
  androidConfig: androidConfig,
  iOSConfig: iOSConfig
};
