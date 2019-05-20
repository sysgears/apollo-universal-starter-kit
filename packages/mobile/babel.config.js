module.exports = api => {
  const isTest = api.env('test');
  api.cache(true);
  if (isTest) {
    return {
      compact: false,
      presets: [
        '@babel/preset-typescript',
        'module:metro-react-native-babel-preset',
        ['@babel/preset-env', { modules: 'commonjs' }]
      ],
      plugins: [
        '@babel/plugin-transform-destructuring',
        '@babel/plugin-transform-regenerator',
        '@babel/plugin-transform-runtime',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        '@babel/plugin-proposal-object-rest-spread',
        ['styled-components', { ssr: true }]
      ]
    };
  } else {
    return {
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
  }
};
