module.exports = {
  compact: false,
  presets: ['@babel/preset-react', 'babel-preset-vue', '@babel/preset-env'],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-regenerator',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'syntax-jsx',
    'transform-vue-jsx',
    'jsx-event-modifiers',
    'jsx-v-model',
    '@babel/plugin-proposal-class-properties',
    ['styled-components', { ssr: true }],
    ['import', { libraryName: 'antd-mobile' }]
  ],
  env: {
    production: {
      compact: true
    }
  }
};
