// Don't use ES6 here to stay compatible with ESLint plugins

const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const pkg = require('../package.json');
const _ = require('lodash');

global.__DEV__ = process.argv.length >= 3 && (process.argv[2].indexOf('watch') >= 0 || process.argv[1].indexOf('mocha-webpack') >= 0);
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
      { test: /\.graphqls/, loader: 'raw' },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      },
      { test: /\.(png|ico|jpg|xml)$/, loader: 'url?name=[hash].[ext]&limit=10000' },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?name=./assets/[hash].[ext]&limit=10000',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file?name=./assets/[hash].[ext]',
      },
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
  new webpack.DefinePlugin(Object.assign({__CLIENT__: false, __SERVER__: true, __SSR__: pkg.app.ssr,
    __DEV__: __DEV__, 'process.env.NODE_ENV': `"${buildNodeEnv}"`}))
];

const serverConfig = merge.smart(_.cloneDeep(baseConfig), {
  devtool: __DEV__ ? '#cheap-module-source-map' : '#source-map',
  target: 'node',
  entry: {
    index: ['babel-polyfill', './src/server/index.js']
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
          'css?sourceMap',
          'postcss',
          'sass?sourceMap'] : ['ignore-loader']
      }
    ]
  },
  output: {
    devtoolModuleFilenameTemplate: __DEV__ ? '../../[resource-path]' : undefined,
    devtoolFallbackModuleFilenameTemplate: __DEV__ ? '../../[resource-path];[hash]' : undefined,
    filename: '[name].js',
    sourceMapFilename: '[name].[chunkhash].js.map',
    path: pkg.app.backendBuildDir,
    publicPath: '/'
  },
  plugins: serverPlugins
});

let clientPlugins = [
  new ManifestPlugin({
    fileName: 'assets.json'
  }),
  new webpack.DefinePlugin(Object.assign({__CLIENT__: true, __SERVER__: false, __SSR__: pkg.app.ssr,
    __DEV__: __DEV__, 'process.env.NODE_ENV': `"${buildNodeEnv}"`})),
];

if (!__DEV__) {
  clientPlugins.push(new ExtractTextPlugin('[name].[contenthash].css', { allChunks: true }));
  clientPlugins.push(new webpack.optimize.CommonsChunkPlugin(
    "vendor",
    "[name].[hash].js",
    function (module) {
      return module.resource && module.resource.indexOf(path.resolve('./node_modules')) === 0;
    }
  ));
}

const clientConfig = merge.smart(_.cloneDeep(baseConfig), {
  devtool: __DEV__ ? '#eval' : '#source-map',
  entry: {
    bundle: ['babel-polyfill', './src/client/index.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: __DEV__ ? 'style!css?sourceMap&importLoaders=1!postcss?sourceMap=inline!sass?sourceMap' : ExtractTextPlugin.extract("style", "css!postcss!sass")
      }
    ]
  },
  output: {
    filename: '[name].[hash].js',
    path: pkg.app.frontendBuildDir,
    publicPath: '/'
  },
  plugins: clientPlugins
});

const dllConfig = merge.smart(_.cloneDeep(baseConfig), {
  entry: {
    vendor: _.keys(pkg.dependencies),
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(pkg.app.frontendBuildDir, '[name]_dll.json'),
    }),
  ],
  output: {
    filename: '[name].[hash]_dll.js',
    path: pkg.app.frontendBuildDir,
    library: '[name]',
  },
});

module.exports =
  process.argv.length >= 2 && process.argv[1].indexOf('mocha-webpack') >= 0 ?
    serverConfig :
    [ serverConfig, clientConfig, dllConfig ];
