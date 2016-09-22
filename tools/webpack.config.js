// Don't use ES6 here to stay compatible with ESLint plugins

const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const isBuild = process.argv.length >= 3 && process.argv[2] === 'build';

const isProduction = process.env.NODE_ENV === 'production';

let basePlugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
  }),
];

if (isProduction) {
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
          cacheDirectory: !isProduction,
          plugins: []
        },
      },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000' },
      { test: /\.(ttf|eot)$/, loader: 'file' },
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: basePlugins,
};

let serverPlugins = [
  new webpack.BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false }),
  new webpack.DefinePlugin({__CLIENT__: false, __SERVER__: true, __DEV__: !isBuild}),
];

const serverConfig = merge.smart(baseConfig, {
  devtool: isBuild ? '#source-map' : '#eval',
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
        loaders: !isBuild ? [
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
  new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false, __DEV__: !isBuild}),
];

if (isBuild) {
  clientPlugins.push(new ExtractTextPlugin('[name].[chunkhash].css'));
}

const clientConfig = merge.smart(baseConfig, {
  devtool: isBuild ? '#source-map' : '#eval',
  entry: {
    bundle: ['babel-polyfill', './src/client/index.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: isBuild ? ExtractTextPlugin.extract("style", "css!sass") : 'style!css!sass'
      }
    ]
  },
  output: {
    filename: isBuild ? '[name].[chunkhash].js' : '[name].js',
    path: 'build/client',
    publicPath: '/assets/'
  },
  plugins: clientPlugins
});

module.exports = [ serverConfig, clientConfig ];