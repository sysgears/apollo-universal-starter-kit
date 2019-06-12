/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const path = require('path');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');

let ssr = true;

if (process.env.DISABLE_SSR && process.env.DISABLE_SSR !== 'false') {
  ssr = false;
}

const config = {
  entry: {
    index: (process.env.NODE_ENV !== 'production' ? ['webpack/hot/poll?200'] : []).concat([
      'raf/polyfill',
      '@babel/polyfill',
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
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: { loader: 'url-loader', options: { name: '[hash].[ext]', limit: 100000 } }
      },
      {
        test: /\.(otf|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
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
          loader: 'heroku-babel-loader',
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
    : [new webpack.DefinePlugin({})]
  ).concat([
    new CleanWebpackPlugin('build'),
    new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: true }),
    new webpack.DefinePlugin({
      __CLIENT__: false,
      __SERVER__: true,
      __SSR__: ssr,
      __DEV__: process.env.NODE_ENV !== 'production',
      __TEST__: false,
      'process.env.NODE_ENV': `"${process.env.NODE_ENV || 'development'}"`,
      __SERVER_PORT__: 8080,
      __API_URL__: '"/graphql"',
      __WEBSITE_URL__:
        process.env.NODE_ENV !== 'production'
          ? '"http://localhost:3000"'
          : '"https://apollo-universal-starter-kit.herokuapp.com"',
      __CDN_URL__: process.env.NODE_ENV !== 'production' ? '""' : '""', // If you use CDN, enter CDN endpoint URL between quotes
      __FRONTEND_BUILD_DIR__: `"${path.resolve('../client/build')}"`
    }),
    new HardSourceWebpackPlugin({ cacheDirectory: path.join(__dirname, '../../node_modules/.cache/hard-source') })
  ]),
  target: 'node',
  externals: [
    nodeExternals(),
    nodeExternals({
      modulesDir: path.resolve(__dirname, '../../node_modules'),
      whitelist: [/(@gqlapp|client|webpack\/hot\/poll)/]
    })
  ],
  node: { __dirname: true, __filename: true },
  optimization: {
    minimize: false
  }
};

module.exports = config;
