module.exports = {
  compact: false,
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'haul/src/utils/fixRequireIssues',
    ['styled-components', { ssr: true }],
    ['import', { libraryName: 'antd-mobile' }],
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          'react-native-vector-icons': '@expo/vector-icons'
        }
      }
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }]
  ],
  env: {
    production: {
      compact: true
    }
  }
};
