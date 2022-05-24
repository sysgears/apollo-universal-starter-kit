module.exports = (api) => {
  const isTest = api.env('test');
  api.cache(true);
  if (isTest) {
    return {
      compact: false,
      presets: ['@babel/preset-typescript', '@babel/preset-react', ['@babel/preset-env', { modules: 'commonjs' }]],
      plugins: [
        'babel-plugin-dynamic-import-node',
        '@babel/plugin-transform-destructuring',
        ['@babel/plugin-transform-for-of'],
        '@babel/plugin-transform-regenerator',
        '@babel/plugin-transform-runtime',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-optional-chaining',
        ['styled-components', { ssr: true }],
      ],
    };
  }
  return {
    compact: false,
    presets: ['@babel/preset-typescript', '@babel/preset-react', ['@babel/preset-env', { modules: false }]],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
      '@loadable/babel-plugin',
      '@babel/plugin-transform-destructuring',
      ['@babel/plugin-transform-for-of'],
      '@babel/plugin-transform-regenerator',
      '@babel/plugin-transform-runtime',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/plugin-proposal-optional-chaining',
      ['styled-components', { ssr: true }],
    ],
    env: {
      production: {
        compact: true,
      },
    },
  };
};
