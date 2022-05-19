const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the workspace root, this can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(__dirname, '../..');
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];
// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.transformer.babelTransformerPath = require.resolve('./custom-transformer');
config.resolver.sourceExts = [
  'native.ts',
  'native.tsx',
  'native.js',
  'native.jsx',
  'ts',
  'tsx',
  'js',
  'jsx',
  'json',
  'graphql',
  'gql',
];

module.exports = config;
