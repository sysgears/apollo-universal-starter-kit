module.exports = {
  compact: false,
  presets: [['@babel/preset-env', { modules: false }]],
  plugins: [
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-for-of',
    '@babel/plugin-transform-regenerator',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
  ],
  env: {
    production: {
      compact: true,
    },
  },
};
