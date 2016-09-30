// Don't use ES6 here to stay compatible with ESLint plugins

const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

global.__DEV__ = process.argv.length >= 3 && process.argv[2] === 'watch';
const buildNodeEnv = __DEV__ ? 'development' : 'production';

let basePlugins = [];

if (!__DEV__) {
  basePlugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
}

const baseConfig = {
  module: {
    noParse: [],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          cacheDirectory: __DEV__,
          plugins: []
        },
      },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000' },
      { test: /\.(ttf|eot)$/, loader: 'file' },
      { test: /\.graphqls/, loader: 'raw' }
    ]
  },
  resolve: {
    moduleDirectories: [],
    root: [path.resolve('./node_modules')],
    extensions: ['', '.js', '.jsx']
  },
  plugins: basePlugins,
};

let serverPlugins = [
  new webpack.BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false }),
  new webpack.DefinePlugin(Object.assign({__CLIENT__: false, __SERVER__: true,
    __DEV__: __DEV__, 'process.env.NODE_ENV': `"${buildNodeEnv}"`}))
];

const serverConfig = merge.smart(baseConfig, {
  devtool: __DEV__ ? '#eval' : '#source-map',
  target: 'node',
  entry: {
    bundle: ['babel-polyfill', './src/server/index.js']
  },
  node: {
    __dirname: true,
    __filename: true
  },
  externals: nodeExternals({
    whitelist: [/^webpack/]
  }),
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: __DEV__ ? [
          'isomorphic-style-loader',
          'css',
          'sass'] : ['ignore-loader']
      }
    ]
  },
  output: {
    filename: 'index.js',
    sourceMapFilename: 'index.js.map',
    path: 'build/server',
    publicPath: '/'
  },
  plugins: serverPlugins
});

let clientPlugins = [
  new ManifestPlugin({
    fileName: 'assets.json'
  }),
  new webpack.DefinePlugin(Object.assign({__CLIENT__: true, __SERVER__: false,
    __DEV__: __DEV__, 'process.env.NODE_ENV': `"${buildNodeEnv}"`}))
];

if (!__DEV__) {
  clientPlugins.push(new ExtractTextPlugin('[name].[chunkhash].css'));
}

const clientConfig = merge.smart(baseConfig, {
  devtool: __DEV__ ? '#eval' : '#source-map',
  entry: {
    bundle: ['babel-polyfill', './src/client/index.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: __DEV__ ? 'style!css!sass' : ExtractTextPlugin.extract("style", "css!sass")
      }
    ]
  },
  output: {
    filename: __DEV__ ? '[name].js' : '[name].[chunkhash].js',
    path: 'build/client',
    publicPath: '/assets/'
  },
  plugins: clientPlugins
});

module.exports = [ serverConfig, clientConfig ];