module.exports = {
  compact: false,
  presets: ['babel-preset-expo'],
  plugins: [
    'haul/src/utils/fixRequireIssues',
    ['styled-components', { ssr: true }],
    ['import', { libraryName: 'antd-mobile' }]
  ],
  env: {
    production: {
      compact: true
    }
  }
};
