import webpack from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import merge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import path from 'path';
import fs from 'fs';
import ip from 'ip';
import PersistGraphQLPlugin from 'persistgraphql-webpack-plugin';
import _ from 'lodash';
import AssetResolver from 'haul/src/resolvers/AssetResolver';
import HasteResolver from 'haul/src/resolvers/HasteResolver';

const pkg = JSON.parse(fs.readFileSync('package.json').toString());
const settings = JSON.parse(fs.readFileSync('app.json').toString()).app;
const platform = pkg.wiq.platform;

const IS_TEST = process.env.NODE_ENV === 'test';
const IS_SSR = settings.ssr && !settings.backendUrl && !IS_TEST;
const IS_PERSIST_GQL = settings.persistGraphQL && !settings.backendUrl && !IS_TEST;
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
}

const babelRule = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: __DEV__,
    presets: [
      require.resolve("babel-preset-react"),
      [require.resolve("babel-preset-es2015"), { "modules": false }],
      require.resolve("babel-preset-stage-0")],
    plugins: [
      require.resolve("babel-plugin-transform-runtime"),
      require.resolve("babel-plugin-transform-decorators-legacy"),
      require.resolve("babel-plugin-transform-class-properties"),
      [require.resolve("babel-plugin-styled-components"), { "ssr": IS_SSR } ]
    ].concat(__DEV__ && settings.reactHotLoader ? [require.resolve('react-hot-loader/babel')] : []),
    only: ["*.js", "*.jsx"]
  }
};

const reactNativeRule = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: __DEV__,
    presets: [require.resolve("babel-preset-react-native")],
    plugins: [
      require.resolve('haul/src/utils/fixRequireIssues')
    ]
  }
};

const createBaseConfig = platform => {
  const baseConfig = {
    devtool: __DEV__ ? '#cheap-module-source-map' : '#source-map',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: ['ios', 'android'].indexOf(platform) >= 0 ?
            /node_modules\/(?!react-native|@expo|expo|lottie-react-native|haul|pretty-format)$/ :
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
      modules: [path.resolve('node_modules'), 'node_modules'],
      extensions: platform === 'server' ?
        [`.web.js`, `.web.jsx`, '.js', '.jsx'] :
        [`.${platform}.js`, `.${platform}.jsx`, '.js', '.jsx']
    },
    resolveLoader: {
      modules: [path.resolve('node_modules'), path.resolve(path.join(__dirname, 'node_modules')), 'node_modules']
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
  modulesDir: path.resolve('node_modules'),
  whitelist: [/(^webpack|^react-native)/]
});

const createClientPlugins = (platform) => {
  let clientPlugins = [
    new ManifestPlugin({
      fileName: 'assets.json'
    }),
    new webpack.DefinePlugin(Object.assign({
      __CLIENT__: true, __SERVER__: false, __SSR__: IS_SSR,
      __DEV__: __DEV__, 'process.env.NODE_ENV': `"${buildNodeEnv}"`,
      __PERSIST_GQL__: IS_PERSIST_GQL,
      __BACKEND_URL__: settings.backendUrl ?
        `"${settings.backendUrl}"`
        : (platform !== 'web' ? `\"http://${ip.address()}:${settings.apiPort}/graphql\"` : false)
    })),
    clientPersistPlugin
  ];

  if (settings.backendUrl && platform === 'web') {
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

const getModuleDir = name => {
  let dir = process.cwd(), nextDir;
  while (true) {
    const target = path.join(dir, 'node_modules/' + name);
    if (fs.existsSync(target)) {
      return target;
    }
    nextDir = path.join(dir, '..');
    if (nextDir === dir) {
      break;
    } else {
      dir = nextDir;
    }
  }
};

const createMobileConfig = platform => merge.smart(_.cloneDeep(createBaseConfig(platform)), {
  module: {
    rules: [
      {
        test: AssetResolver.test,
        use: {
          loader: require.resolve('haul/src/loaders/assetLoader'),
          query: { platform, root: path.resolve('.'), bundle: false },
        },
      },
    ]
  },
  output: {
    filename: `index.${platform}.bundle`,
    publicPath: '/'
  },
  resolve: {
    plugins: [
      new HasteResolver({
        directories: [getModuleDir('react-native')],
      }),
      new AssetResolver({ platform }),
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
      vendor: Object.keys(pkg.dependencies),
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
    bail: true
  };
};

let config;
if (IS_TEST || platform === 'server') {
  config = merge.smart(_.cloneDeep(createBaseConfig("server")), {
    name: 'backend',
    target: 'node',
    entry: {
      index: [
        require.resolve('babel-polyfill'),
        './src/index.js'
      ]
    },
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
      path: path.resolve(settings.buildDir),
      publicPath: '/'
    },
    plugins: serverPlugins
  });
} else if (platform === 'web') {
  config = merge.smart(_.cloneDeep(createBaseConfig("web")), {
    name: 'web-frontend',
    entry: {
      bundle: [
        require.resolve('babel-polyfill'),
        './src/index.jsx'
      ]
    },
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
      path: path.resolve(settings.buildDir),
      publicPath: '/'
    },
    plugins: createClientPlugins("web"),
    devServer: _.merge({}, baseDevServerConfig, {
      port: settings.webFrontendDevPort,
      proxy: {
        '!/*.hot-update.{json,js}': {
          target: `http://localhost:${settings.apiPort}`,
          logLevel: 'info'
        }
      }
    }),
  });
} else if (platform === 'android') {
  config = merge.smart(_.cloneDeep(createMobileConfig('android')), {
    name: 'android-frontend',
    entry: {
      'index.android.bundle': [
        require.resolve('./react-native-polyfill.js'),
        './src/index.js'
      ]
    },
    output: {
      path: path.resolve(settings.buildDir),
    },
    devServer: _.merge({}, baseDevServerConfig, {
      hot: false,
      port: 3010
    })
  });
} else if (platform === 'ios') {
  config = merge.smart(_.cloneDeep(createMobileConfig('ios')), {
    name: 'ios-frontend',
    entry: {
      'index.ios.bundle': [
        require.resolve('./react-native-polyfill.js'),
        './src/index.js'
      ]
    },
    output: {
      path: path.resolve(settings.buildDir),
    },
    devServer: _.merge({}, baseDevServerConfig, {
      hot: false,
      port: 3020
    })
  });
}

let dll;
if (platform != 'server') {
  dll = createDllConfig(platform);
}

export { platform, config, dll };
