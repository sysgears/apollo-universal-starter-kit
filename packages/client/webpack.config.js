/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const path = require('path');
const waitOn = require('wait-on');

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');

const webpackPort = 3000;

const buildConfig = require('./build.config');

const modulenameExtra = process.env.MODULENAME_EXTRA ? `${process.env.MODULENAME_EXTRA}|` : '';
const modulenameRegex = new RegExp(`node_modules(?![\\\\/](${modulenameExtra}@gqlapp)).*`);

class WaitOnWebpackPlugin {
  constructor(waitOnUrl) {
    this.waitOnUrl = waitOnUrl;
    this.done = false;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('WaitOnPlugin', (compilation, callback) => {
      if (!this.done) {
        console.log(`Waiting for backend at ${this.waitOnUrl}`);
        waitOn({ resources: [this.waitOnUrl] }, () => {
          console.log(`Backend at ${this.waitOnUrl} has started`);
          this.done = true;
          callback();
        });
      } else {
        callback();
      }
    });
  }
}

const config = {
  entry: {
    index: ['raf/polyfill', 'core-js/stable', 'regenerator-runtime/runtime', './src/index.ts']
  },
  name: 'web',
  module: {
    rules: [
      { test: /\.mjs$/, include: /node_modules/, type: 'javascript/auto' },
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
          process.env.NODE_ENV === 'production' ? { loader: MiniCSSExtractPlugin.loader } : { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV === 'production' ? { loader: MiniCSSExtractPlugin.loader } : { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      },
      {
        test: /\.less$/,
        use: [
          process.env.NODE_ENV === 'production' ? { loader: MiniCSSExtractPlugin.loader } : { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'less-loader', options: { javascriptEnabled: true, sourceMap: true } }
        ]
      },
      { test: /\.graphqls/, use: { loader: 'raw-loader' } },
      { test: /\.(graphql|gql)$/, use: [{ loader: 'graphql-tag/loader' }] },
      {
        test: /\.[jt]sx?$/,
        exclude: modulenameRegex,
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
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    path: path.join(__dirname, 'build'),
    publicPath: '/'
  },
  devtool: process.env.NODE_ENV === 'production' ? '#nosources-source-map' : '#cheap-module-source-map',
  mode: process.env.NODE_ENV || 'development',
  performance: { hints: false },
  plugins: (process.env.NODE_ENV !== 'production'
    ? [new webpack.HotModuleReplacementPlugin()].concat(
        typeof STORYBOOK_MODE === 'undefined' ? [new WaitOnWebpackPlugin('tcp:localhost:8080')] : []
      )
    : [
        new MiniCSSExtractPlugin({
          chunkFilename: '[name].[id].[chunkhash].css',
          filename: `[name].[chunkhash].css`
        })
      ]
  )
    .concat([
      new CleanWebpackPlugin('build'),
      new webpack.DefinePlugin(
        Object.assign(
          ...Object.entries(buildConfig).map(([k, v]) => ({
            [k]: typeof v !== 'string' ? v : `'${v.replace(/\\/g, '\\\\')}'`
          }))
        )
      ),
      new ManifestPlugin({ fileName: 'assets.json' }),
      new HardSourceWebpackPlugin({
        cacheDirectory: path.join(__dirname, `../../node_modules/.cache/hard-source-${path.basename(__dirname)}`)
      }),
      new HardSourceWebpackPlugin.ExcludeModulePlugin([
        {
          test: /mini-css-extract-plugin[\\/]dist[\\/]loader/
        }
      ]),
      new LoadablePlugin()
    ])
    .concat(
      buildConfig.__SSR__ ? [] : [new HtmlWebpackPlugin({ template: './html-plugin-template.ejs', inject: true })]
    ),
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true,
    concatenateModules: false
  },
  node: { __dirname: true, __filename: true, fs: 'empty', net: 'empty', tls: 'empty' },
  devServer: {
    host: '0.0.0.0',
    hot: true,
    public: `localhost:${webpackPort}`,
    publicPath: '/',
    headers: { 'Access-Control-Allow-Origin': '*' },
    open: true,
    quiet: false,
    noInfo: true,
    historyApiFallback: true,
    port: webpackPort,
    writeToDisk: pathname => /(assets.json|loadable-stats.json)$/.test(pathname),
    ...(buildConfig.__SSR__
      ? {
          proxy: {
            '!(/sockjs-node/**/*|/*.hot-update.{json,js})': {
              target: 'http://localhost:8080',
              logLevel: 'info',
              ws: true
            }
          }
        }
      : {}),
    disableHostCheck: true
  }
};

module.exports = config;
