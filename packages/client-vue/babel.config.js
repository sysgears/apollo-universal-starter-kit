module.exports = {
  compact: false,
  presets: ['babel-preset-vue', ['@babel/preset-env', { modules: false }]],
  plugins: [
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-regenerator',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-object-rest-spread',
    'syntax-jsx',
    'transform-vue-jsx',
    'jsx-event-modifiers',
    'jsx-v-model'
  ],
  env: {
    production: {
      compact: true
    }
  }
};
