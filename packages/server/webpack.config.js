/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const path = require('path');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

const buildConfig = require('./build.config');

const modulenameExtra = process.env.MODULENAME_EXTRA ? `${process.env.MODULENAME_EXTRA}|` : '';
const modulenameRegex = new RegExp(
  `(${modulenameExtra}@gqlapp|client|webpack/hot/poll)|(\\.(css|less|scss|png|ico|jpg|gif|xml|woff|woff2|otf|ttf|eot|svg)(\\?[0-9a-z]+)?$)`
);

const config = {
  entry: {
    index: (process.env.NODE_ENV !== 'production' ? ['webpack/hot/poll?200'] : []).concat([
      'raf/polyfill',
      './src/index.ts'
    ])
  },
  name: 'server',
  module: {
    rules: [
      {
        test: /\.(png|ico|jpg|gif|xml)$/,
        use: { loader: 'url-loader', options: { name: '[hash].[ext]', limit: 100000 } }
      },
      {
        test: /\.woff(2)?(\?[0-9a-z]+)?$/,
        use: { loader: 'url-loader', options: { name: '[hash].[ext]', limit: 100000 } }
      },
      {
        test: /\.(otf|ttf|eot|svg)(\?[0-9a-z]+)?$/,
        use: { loader: 'file-loader', options: { name: '[hash].[ext]' } }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'isomorphic-style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'isomorphic-style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'isomorphic-style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'less-loader', options: { javascriptEnabled: true, sourceMap: true } }
        ]
      },
      { test: /\.graphqls/, use: { loader: 'raw-loader' } },
      { test: /\.(graphql|gql)$/, use: [{ loader: 'graphql-tag/loader' }] },
      {
        test: /\.[tj]sx?$/,
        use: {
          loader: 'babel-loader',
          options: { babelrc: true, rootMode: 'upward-optional' }
        }
      },
      { test: /locales/, use: { loader: '@alienfast/i18next-loader' } }
    ],
    unsafeCache: false
  },
  resolve: {
    symlinks: false,
    cacheWithContext: false,
    unsafeCache: false,
    extensions: [
      '.web.mjs',
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.mjs',
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
      '.json'
    ]
  },
  watchOptions: { ignored: /build/ },
  output: {
    pathinfo: false,
    filename: '[name].js',
    path: path.join(__dirname, 'build'),
    publicPath: '/',
    sourceMapFilename: '[name].[chunkhash].js.map'
  },
  devtool: process.env.NODE_ENV === 'production' ? '#nosources-source-map' : '#cheap-module-source-map',
  mode: process.env.NODE_ENV || 'development',
  performance: { hints: false },
  plugins: (process.env.NODE_ENV !== 'production'
    ? [
        new webpack.HotModuleReplacementPlugin(),
        new WebpackShellPlugin({
          onBuildEnd: ['nodemon build --watch false']
        })
      ]
    : []
  ).concat([
    new CleanWebpackPlugin('build'),
    new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: true }),
    new webpack.DefinePlugin(
      Object.assign(
        ...Object.entries(buildConfig).map(([k, v]) => ({
          [k]: typeof v !== 'string' ? v : `'${v.replace(/\\/g, '\\\\')}'`
        }))
      )
    ),
    new HardSourceWebpackPlugin({
      cacheDirectory: path.join(__dirname, `../../node_modules/.cache/hard-source-${path.basename(__dirname)}`)
    })
  ]),
  target: 'node',
  externals: [
    nodeExternals(),
    nodeExternals({
      modulesDir: path.resolve(__dirname, '../../node_modules'),
      whitelist: [modulenameRegex]
    })
  ],
  node: { __dirname: true, __filename: true },
  optimization: {
    minimize: false
  }
};

module.exports = config;
