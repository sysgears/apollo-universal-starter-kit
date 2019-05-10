module.exports = {
  compact: false,
  presets: ['@babel/preset-react', ['@babel/preset-env', { targets: { node: true }, modules: false }]],
  plugins: [
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
