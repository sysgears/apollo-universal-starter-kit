module.exports = {
  compact: false,
  presets: ['@babel/preset-react', ['@babel/preset-env', { modules: false }]],
  plugins: [
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-regenerator',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-object-rest-spread',
    ['styled-components', { ssr: true }]
  ],
  env: {
    production: {
      compact: true
    }
  }
};
