module.exports = api => {
  api.cache(true);
  return {
    compact: false,
    presets: ['@babel/preset-typescript', '@babel/preset-react', ['@babel/preset-env', { modules: 'commonjs' }]],
    plugins: [
      '@babel/plugin-transform-modules-commonjs',
      '@babel/plugin-transform-destructuring',
      '@babel/plugin-transform-regenerator',
      '@babel/plugin-transform-runtime',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      '@babel/plugin-proposal-object-rest-spread'
    ],
    env: {
      production: {
        compact: true
      }
    }
  };
};
