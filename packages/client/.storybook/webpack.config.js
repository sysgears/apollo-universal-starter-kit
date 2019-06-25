module.exports = async ({ config, mode }) => {
  process.env.NODE_ENV = mode.toLowerCase();
  global.STORYBOOK_MODE = true;
  const webpackConfig = require('../webpack.config');
  const result = { ...config };
  result.module = webpackConfig.module;
  result.resolve = webpackConfig.resolve;
  result.watchOptions = webpackConfig.watchOptions;
  result.plugins = [...config.plugins, ...webpackConfig.plugins];
  return result;
};
