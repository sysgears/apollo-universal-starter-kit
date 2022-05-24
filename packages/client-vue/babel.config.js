module.exports = {
  compact: false,
  presets: ['babel-preset-vue', '@babel/preset-typescript', ['@babel/preset-env', { modules: false }]],
  plugins: [
    '@babel/transform-typescript',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-for-of',
    '@babel/plugin-transform-regenerator',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    'syntax-jsx',
    'transform-vue-jsx',
    'jsx-event-modifiers',
    'jsx-v-model',
  ],
  env: {
    production: {
      compact: true,
    },
  },
};
