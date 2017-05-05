// Don't use ES6 here to stay compatible with ESLint plugins

const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const PersistGraphQLPlugin = require('persistgraphql-webpack-plugin');
const _ = require('lodash');

const appConfigs = require('./webpack.app_config');
const pkg = require('../package.json');

const IS_TEST = process.argv[1].indexOf('mocha-webpack') >= 0;
global.__DEV__ = process.argv.length >= 3 && (process.argv[2].indexOf('watch') >= 0 || IS_TEST);
const buildNodeEnv = __DEV__ ? (IS_TEST ? 'test' : 'development') : 'production';

const moduleName = path.resolve('node_modules/persisted_queries.json');
let clientPersistPlugin, serverPersistPlugin;
if (pkg.app.persistGraphQL && !IS_TEST) {
  clientPersistPlugin = new PersistGraphQLPlugin({ moduleName,
    filename: 'extracted_queries.json', addTypename: true });
  serverPersistPlugin = new PersistGraphQLPlugin({ moduleName,
    provider: clientPersistPlugin });
} else {
  // Dummy plugin instances just to create persisted_queries.json virtual module
  clientPersistPlugin = new PersistGraphQLPlugin({ moduleName });
  serverPersistPlugin = new PersistGraphQLPlugin({ moduleName });
}

let basePlugins = [];

if (__DEV__) {
  basePlugins.push(new webpack.NamedModulesPlugin());
} else {
  basePlugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
  basePlugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
}

const baseConfig = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: {
            "presets": ["react", ["es2015", { "modules": false }], "stage-0"],
            "plugins": [
              "transform-runtime",
              "transform-decorators-legacy",
              "transform-class-properties",
              ["styled-components", { "ssr": true } ]
            ].concat(__DEV__ && pkg.app.reactHotLoader ? ['react-hot-loader/babel'] : []),
            "only": ["*.js", "*.jsx"],
          }
        }].concat(
          pkg.app.persistGraphQL ?
            ['persistgraphql-webpack-plugin/js-loader'] : []
        )
      },
      {
        test: /\.graphqls/,
        use: 'raw-loader'
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: ['graphql-tag/loader'].concat(
          pkg.app.persistGraphQL ?
            ['persistgraphql-webpack-plugin/graphql-loader'] : []
        )
      },
      {
        test: /\.(png|ico|jpg|xml)$/,
        use: 'url-loader?name=[hash].[ext]&limit=10000'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?name=./assets/[hash].[ext]&limit=10000'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader?name=./assets/[hash].[ext]'
      },
    ]
  },
  resolve: {
    modules: [path.join(__dirname, '../src'), 'node_modules'],
    extensions: ['.js', '.jsx']
  },
  plugins: basePlugins,
  watchOptions: {
    ignored: /build/
  },
  bail: !__DEV__
};

let serverPlugins = [
  new webpack.BannerPlugin({
    banner: 'require("source-map-support").install();',
    raw: true, entryOnly: false
  }),
  new webpack.DefinePlugin(Object.assign({
    __CLIENT__: false, __SERVER__: true, __SSR__: pkg.app.ssr,
    __DEV__: __DEV__, 'process.env.NODE_ENV': `"${buildNodeEnv}"`
  })),
  serverPersistPlugin
];

const serverConfig = merge.smart(_.cloneDeep(baseConfig), {
  name: 'backend',
  devtool: __DEV__ ? '#cheap-module-source-map' : '#source-map',
  target: 'node',
  node: {
    __dirname: true,
    __filename: true
  },
  externals: nodeExternals({
    whitelist: [/^webpack/]
  }),
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: __DEV__ ? [
          { loader: 'isomorphic-style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader', options: { sourceMap: true } }] :
          [{ loader: 'ignore-loader' }]
      }
    ]
  },
  output: {
    devtoolModuleFilenameTemplate: __DEV__ ? '../../[resource-path]' : undefined,
    devtoolFallbackModuleFilenameTemplate: __DEV__ ? '../../[resource-path];[hash]' : undefined,
    filename: '[name].js',
    sourceMapFilename: '[name].[chunkhash].js.map',
    path: path.resolve(pkg.app.backendBuildDir),
    publicPath: '/'
  },
  plugins: serverPlugins
}, appConfigs.serverConfig);

let clientPlugins = [
  new ManifestPlugin({
    fileName: 'assets.json'
  }),
  new webpack.DefinePlugin(Object.assign({
    __CLIENT__: true, __SERVER__: false, __SSR__: pkg.app.ssr,
    __DEV__: __DEV__, 'process.env.NODE_ENV': `"${buildNodeEnv}"`
  })),
  clientPersistPlugin
];

if (!__DEV__) {
  clientPlugins.push(new ExtractTextPlugin({ filename: '[name].[contenthash].css', allChunks: true }));
  clientPlugins.push(new webpack.optimize.CommonsChunkPlugin({
    name: "vendor",
    filename: "[name].[hash].js",
    minChunks: function(module) {
      return module.resource && module.resource.indexOf(path.resolve('./node_modules')) === 0;
    }
  }));
}

const clientConfig = merge.smart(_.cloneDeep(baseConfig), {
  name: 'frontend',
  devtool: __DEV__ ? '#eval' : '#source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: __DEV__ ? [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ] : ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      }
    ]
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(pkg.app.frontendBuildDir),
    publicPath: '/'
  },
  plugins: clientPlugins
}, appConfigs.clientConfig);

const dllConfig = merge.smart(_.cloneDeep(baseConfig), {
  name: 'dll',
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
    path: path.resolve(pkg.app.frontendBuildDir),
    library: '[name]',
  },
});

module.exports =
  IS_TEST ?
    serverConfig :
    [serverConfig, clientConfig, dllConfig];
