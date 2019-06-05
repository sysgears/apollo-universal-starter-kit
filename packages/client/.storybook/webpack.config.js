const createConfig = require('@larix/zen').createConfig;

module.exports = async ({ config, mode }) => {
  return createConfig({
    cmd: mode === 'DEVELOPMENT' ? 'watch' : 'build',
    builderOverrides: { stack: ['storybook'] },
    genConfigOverrides: Object.assign({ merge: { entry: 'replace', output: 'replace' } }, config)
  });
};
