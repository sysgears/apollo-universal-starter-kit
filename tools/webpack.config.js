// Don't use ES6 here to stay compatible with ESLint plugins

const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const settings = require('../package.json').app;

global.__DEV__ = process.argv.length >= 3 && process.argv[2] === 'watch';
const buildNodeEnv = __DEV__ ? 'development' : 'production';

let basePlugins = [];

if (__DEV__) {
  basePlugins.push(new webpack.NamedModulesPlugin());
} else {
  basePlugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
}

const baseConfig = {
  module: {
    noParse: [],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          cacheDirectory: __DEV__,
          presets: ['es2015', 'es2017', 'react'],
          plugins: ['transform-runtime', 'transform-decorators-legacy', 'transform-class-properties'],
        },
      },
      { test: /\.json$/, loader: 'json' },
      { test: /\.(woff2?|svg)$/, loader: 'url?name=./assets/[hash].[ext]&limit=10000' },
      { test: /\.(ttf|eot)$/, loader: 'file?name=./assets/[hash].[ext]' },
      { test: /\.graphqls/, loader: 'raw' }
    ]
  },
  resolve: {
    moduleDirectories: [],
    root: [path.resolve('./node_modules')],
    extensions: ['', '.js', '.jsx']
  },
  plugins: basePlugins,
  bail: !__DEV__
};

let serverPlugins = [
  new webpack.BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false }),
  new webpack.DefinePlugin(Object.assign({__CLIENT__: false, __SERVER__: true, __SSR__: settings.ssr,
    __DEV__: __DEV__, 'process.env.NODE_ENV': `"${buildNodeEnv}"`}))
];

const serverConfig = merge.smart(baseConfig, {
  devtool: __DEV__ ? '#cheap-module-source-map' : '#source-map',
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
    devtoolModuleFilenameTemplate: __DEV__ ? info =>
     { return path.resolve(info.absoluteResourcePath); } : undefined,
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
  new webpack.DefinePlugin(Object.assign({__CLIENT__: true, __SERVER__: false, __SSR__: settings.ssr,
    __DEV__: __DEV__, 'process.env.NODE_ENV': `"${buildNodeEnv}"`})),
  new webpack.optimize.CommonsChunkPlugin(
    "vendor",
    "[name].[hash].js",
    function (module) {
      return module.resource && module.resource.indexOf(path.resolve('./node_modules')) === 0;
    }
  )
];

if (!__DEV__) {
  clientPlugins.push(new ExtractTextPlugin('[name].[contenthash].css', { allChunks: true }));
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
    filename: '[name].[hash].js',
    path: 'build/client',
    publicPath: '/assets/'
  },
  plugins: clientPlugins
});

module.exports = 
  process.env.npm_lifecycle_script.indexOf('mocha-webpack') >= 0 ? 
    serverConfig : 
    [ serverConfig, clientConfig ];
