// App-specific front-end config should be here
const clientConfig = {
  entry: {
    bundle: ['babel-polyfill', './src/client/index.jsx']
  }
};

// App-specific back-end config should be here
const serverConfig = {
  entry: {
    index: ['babel-polyfill', './src/server/index.js']
  }
};

// App-specific iOS React Native config should be here
const androidConfig = {
  entry: {
    'index.android.bundle': [
      'babel-polyfill',
      require.resolve('haul-cli/src/utils/polyfillEnvironment.js'),
      './src/mobile/index.js'
    ]
  }
};

// App-specific iOS React Native config should be here
const iOSConfig = {
  entry: {
    'index.ios.bundle': [
      'babel-polyfill',
      require.resolve('haul-cli/src/utils/polyfillEnvironment.js'),
      './src/mobile/index.js'
    ]
  }
};

module.exports = {
  clientConfig: clientConfig,
  serverConfig: serverConfig,
  androidConfig: androidConfig,
  iOSConfig: iOSConfig
};
