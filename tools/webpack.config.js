import webpack from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import merge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import ip from 'ip';
import PersistGraphQLPlugin from 'persistgraphql-webpack-plugin';
import _ from 'lodash';
import AssetResolver from 'haul/src/resolvers/AssetResolver';
import HasteResolver from 'haul/src/resolvers/HasteResolver';
import * as appConfigs from './webpack.app_config';
import pkg from '../package.json';
import { app as settings } from '../app.json';

const IS_TEST = process.argv[1].indexOf('mocha-webpack') >= 0 || process.argv[1].indexOf('eslint') >= 0;
if (IS_TEST) {
  delete appConfigs.serverConfig.url;
}
const IS_SSR = settings.ssr && !appConfigs.serverConfig.url && !IS_TEST;
const IS_PERSIST_GQL = settings.persistGraphQL && !appConfigs.serverConfig.url && !IS_TEST;
global.__DEV__ = process.argv.length >= 3 && (process.argv[2].indexOf('watch') >= 0 || IS_TEST);
const buildNodeEnv = __DEV__ ? (IS_TEST ? 'test' : 'development') : 'production';

const moduleName = path.resolve('node_modules/persisted_queries.json');
let clientPersistPlugin, serverPersistPlugin;
if (IS_PERSIST_GQL) {
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
  basePlugins.push(new webpack.optimize.ModuleConcatenationPlugin());
}

const babelRule = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: __DEV__,
    presets: ["react", ["es2015", { "modules": false }], "stage-0"],
    plugins: [
      "transform-runtime",
      "transform-decorators-legacy",
      "transform-class-properties",
      ["styled-components", { "ssr": IS_SSR } ]
    ].concat(__DEV__ && settings.reactHotLoader ? ['react-hot-loader/babel'] : []),
    only: ["*.js", "*.jsx"]
  }
};

const reactNativeRule = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: __DEV__,
    presets: ["react-native"],
    plugins: [
      require.resolve('haul/src/utils/fixRequireIssues')
    ]
  }
};

const mobileAssetTest = /\.(bmp|gif|jpg|jpeg|png|psd|svg|webp|m4v|aac|aiff|caf|m4a|mp3|wav|html|pdf|ttf)$/;

const createBaseConfig = platform => {
  const baseConfig = {
    devtool: __DEV__ ? '#cheap-module-source-map' : '#source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: ['ios', 'android'].indexOf(platform) >= 0 ?
            /node_modules\/(?!react-native|@expo|expo|lottie-react-native|haul|pretty-format|react-navigation)$/ :
            /node_modules/,
          use: [
            ['ios', 'android'].indexOf(platform) >= 0 ?
              function (req) {
                let result;
                if (req.resource.indexOf('node_modules') >= 0) {
                  result = reactNativeRule;
                } else {
                  result = babelRule;
                }
                return result;
              } :
              babelRule
          ].concat(
            settings.persistGraphQL ?
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
            IS_PERSIST_GQL ?
              ['persistgraphql-webpack-plugin/graphql-loader'] : []
          )
        },
      ]
    },
    resolve: {
      extensions: platform === 'server' ?
        [`.web.js`, `.web.jsx`, '.js', '.jsx'] :
        [`.${platform}.js`, `.${platform}.jsx`, '.native.js', '.native.jsx', '.js', '.jsx']
    },
    plugins: basePlugins,
    watchOptions: {
      ignored: /build/
    },
    bail: !__DEV__
  };

  if (['web', 'server'].indexOf(platform) >= 0) {
    baseConfig.resolve.alias = {
      'react-native': 'react-native-web'
    };
    baseConfig.module.rules = baseConfig.module.rules.concat([
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
    ]);
  } else if (['android', 'ios'].indexOf(platform) >= 0) {
    baseConfig.module.rules = baseConfig.module.rules.concat([
      {
        test: mobileAssetTest,
        use: {
          loader: require.resolve('./loaders/assetLoader'),
          query: {platform, root: path.resolve('.'), bundle: false},
        }
      }
    ]);
  }
  return baseConfig;
};

let serverPlugins = [
  new webpack.BannerPlugin({
    banner: 'require("source-map-support").install();',
    raw: true, entryOnly: false
  }),
  new webpack.DefinePlugin(Object.assign({
    __CLIENT__: false, __SERVER__: true, __SSR__: IS_SSR,
    __DEV__: __DEV__, 'process.env.NODE_ENV': `"${buildNodeEnv}"`,
    __PERSIST_GQL__: IS_PERSIST_GQL
  })),
  serverPersistPlugin
];

const nodeExternalsFn = nodeExternals({
  whitelist: [/(^webpack|^react-native)/]
});

const serverConfig = merge.smart(_.cloneDeep(createBaseConfig("server")), {
  name: 'backend',
  target: 'node',
  node: {
    __dirname: true,
    __filename: true
  },
  externals(context, request, callback) {
    return nodeExternalsFn(context, request, function() {
      if (request.indexOf('react-native') >= 0) {
        return callback(null, 'commonjs ' + request + '-web');
      } else {
        return callback(...arguments);
      }
    });
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: __DEV__ ? [
          { loader: 'isomorphic-style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'postcss-loader', options: { sourceMap: true } },
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
    path: path.resolve(settings.backendBuildDir),
    publicPath: '/'
  },
  plugins: serverPlugins
}, appConfigs.serverConfig);

const createClientPlugins = (platform) => {
  let clientPlugins = [
    new webpack.DefinePlugin(Object.assign({
      __CLIENT__: true, __SERVER__: false, __SSR__: IS_SSR,
      __DEV__: __DEV__, 'process.env.NODE_ENV': `"${buildNodeEnv}"`,
      __PERSIST_GQL__: IS_PERSIST_GQL,
      __BACKEND_URL__: appConfigs.serverConfig.url ?
        `"${appConfigs.serverConfig.url}"`
        : (platform !== 'web' ? `"http://${ip.address()}:${settings.apiPort}/graphql"` : false)
    })),
    clientPersistPlugin
  ];

  if (platform === 'web') {
    clientPlugins.push(new ManifestPlugin({
      fileName: 'assets.json'
    }));
    if (appConfigs.serverConfig.url) {
      clientPlugins.push(new HtmlWebpackPlugin({
        template: 'tools/html-plugin-template.ejs',
        inject: 'body',
      }));
    }

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
  }

  return clientPlugins;
};

const baseDevServerConfig = {
  hot: true,
  contentBase: '/',
  publicPath: '/',
  headers: { 'Access-Control-Allow-Origin': '*' },
  quiet: false,
  noInfo: true,
  stats: { colors: true, chunkModules: false }
};

const webConfig = merge.smart(_.cloneDeep(createBaseConfig("web")), {
  name: 'web-frontend',
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
    path: path.resolve(path.join(settings.frontendBuildDir, 'web')),
    publicPath: '/'
  },
  plugins: createClientPlugins("web"),
  devServer: _.merge({}, baseDevServerConfig, {
    port: settings.webpackDevPort,
    proxy: {
      '!/*.hot-update.{json,js}': {
        target: `http://localhost:${settings.apiPort}`,
        logLevel: 'info'
      }
    }
  }),
}, appConfigs.webConfig);

const createMobileConfig = platform => merge.smart(_.cloneDeep(createBaseConfig(platform)), {
  output: {
    filename: `index.mobile.bundle`,
    publicPath: '/'
  },
  resolve: {
    plugins: [
      new HasteResolver({
        directories: [path.resolve('node_modules/react-native')],
      }),
      new AssetResolver({ platform, test: mobileAssetTest }),
    ],
    mainFields: ['react-native', 'browser', 'main']
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      test: /\.(js|jsx|css|bundle)($|\?)/i,
      filename: '[file].map',
    }),
    ...createClientPlugins(platform)
  ]
});

const androidConfig = merge.smart(_.cloneDeep(createMobileConfig('android')), {
  name: 'android-frontend',
  output: {
    path: path.resolve(path.join(settings.frontendBuildDir, 'android')),
  },
  devServer: _.merge({}, baseDevServerConfig, {
    hot: false,
    port: 3010
  })
}, appConfigs.androidConfig);

const iOSConfig = merge.smart(_.cloneDeep(createMobileConfig('ios')), {
  name: 'ios-frontend',
  output: {
    path: path.resolve(path.join(settings.frontendBuildDir, 'ios')),
  },
  devServer: _.merge({}, baseDevServerConfig, {
    hot: false,
    port: 3020
  })
}, appConfigs.iOSConfig);

const getDepsForPlatform = platform => {
  let deps = _.filter(_.keys(pkg.dependencies), key => {
    const val = appConfigs.dependencyPlatforms[key];
    return (!val || val === platform || (_.isArray(val) && val.indexOf(platform) >= 0));
  });
  if (['android', 'ios'].indexOf(platform) >= 0) {
    deps = deps.concat(require.resolve('./react-native-polyfill.js'));
  }
  return deps;
};

const createDllConfig = platform => {
  const config = ['android', 'ios'].indexOf(platform) >= 0 ?
    createMobileConfig(platform) :
    createBaseConfig(platform);
  const name = `vendor_${platform}`;
  return {
    ...config,
    devtool: '#cheap-module-source-map',
    name: `${platform}-dll`,
    entry: {
      vendor: getDepsForPlatform(platform),
    },
    plugins: [
      new webpack.DefinePlugin(Object.assign({
        __DEV__: __DEV__, 'process.env.NODE_ENV': `"${buildNodeEnv}"`
      })),
      new webpack.DllPlugin({
        name,
        path: path.join(settings.dllBuildDir, `${name}_dll.json`),
      })
    ],
    output: {
      filename: `${name}.[hash]_dll.js`,
      path: path.resolve(settings.dllBuildDir),
      library: name
    },
  };
};

module.exports =
  IS_TEST ?
    serverConfig :
    {
      backend: {
        platform: 'server',
        config: serverConfig
      },
      web: {
        platform: 'web',
        config: webConfig,
        dll: createDllConfig("web")
      },
      android: {
        platform: 'android',
        config: androidConfig,
        dll: createDllConfig("android")
      },
      ios: {
        platform: 'ios',
        config: iOSConfig,
        dll: createDllConfig("ios")
      }
    };
