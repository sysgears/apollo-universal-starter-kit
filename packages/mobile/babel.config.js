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
        ['@babel/plugin-transform-for-of', { loose: true }],
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
      presets: ['babel-preset-expo'],
      plugins: [
        'transform-inline-environment-variables',
        ['styled-components', { ssr: true }],
        ['import', { libraryName: 'antd-mobile' }]
      ],
      env: {
        production: {
          compact: true
        }
      }
    };
  }
};
