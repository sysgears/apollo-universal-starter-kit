export default {
  name: 'Apollo Starter Kit',
  logo: 'logo.svg', // Loaded via webpack and stored in favicon/common/assets
  logging: {
    level: (process.env.npm_config_argv || '').search(/(watch|start)/) >= 0 ? 'debug' : 'info',
    debugSQL: false,
    apolloLogging: (process.env.npm_config_argv || '').search(/(watch|start)/) >= 0
  },
  // Check here for Windows and Mac OS X: https://code.visualstudio.com/docs/editor/command-line#_opening-vs-code-with-urls
  // Use this protocol handler for Linux: https://github.com/sysgears/vscode-handler
  stackFragmentFormat: 'vscode://file/{0}:{1}:{2}'
};
