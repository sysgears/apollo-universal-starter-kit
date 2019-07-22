const { createMetroConfiguration } = require('expo-yarn-workspaces');

const baseConfig = createMetroConfiguration(__dirname);

const config = {
  ...baseConfig,
  transformer: {
    babelTransformerPath: require.resolve('./custom-transformer')
  },
  resolver: {
    sourceExts: ['jsx', 'js', 'json', 'ts', 'tsx', 'graphql', 'gql']
  }
};

module.exports = config;
