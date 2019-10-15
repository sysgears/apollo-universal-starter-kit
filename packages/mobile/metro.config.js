const { createMetroConfiguration } = require('expo-yarn-workspaces');

const baseConfig = createMetroConfiguration(__dirname);
const config = {
  ...baseConfig,
  transformer: {
    babelTransformerPath: require.resolve('./custom-transformer'),
    minifierPath: 'metro-minify-terser',
    minifierConfig: {
      ecma: 8,
      keep_classnames: true,
      keep_fnames: true,
      module: true,
      mangle: {
        module: true,
        keep_classnames: true,
        keep_fnames: true
      }
    }
  }
};

module.exports = config;
