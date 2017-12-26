const path = require('path'),
  definePlugin = require('webpack/lib/DefinePlugin'),
  checkerPlugin = require('awesome-typescript-loader').CheckerPlugin,
  aotPlugin = require('@ngtools/webpack').AotPlugin,
  loaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin'),
  htmlWebpackPlugin = require('html-webpack-plugin'),
  extractTextPlugin = require('extract-text-webpack-plugin'),
  scriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin'),
  noEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin'),
  optimizeJsPlugin = require('optimize-js-plugin'),
  commonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin'),
  uglifyJsPlugin = require('uglifyjs-webpack-plugin'),
  normalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');

module.exports = {
  target: 'web',
  entry: {
    'polyfills': './src/client/polyfills.ts',
    'app': './src/client/main-browser-aot.ts'
  },
  // devtool: 'source-map',
  //cache: false,
  output: {
    filename: '[name].[chunkhash].bundle.js',
    sourceMapFilename: '[name].[chunkhash].bundle.map',
    chunkFilename: '[id].[chunkhash].chunk.js',
    path: path.join(process.cwd(), "build/client"),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [
      './node_modules'
    ]
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        use: 'tslint-loader',
        exclude: [
          path.join(process.cwd(), "node_modules"),
          /\.(ngfactory|ngstyle)\.ts$/
        ]
      },
      {
        test: /\.ts$/,
        use: '@ngtools/webpack',
        exclude: [
          path.join(process.cwd(), "src/client/modules"),
          /\.(spec|e2e)\.ts$/
        ]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.scss$/,
        include: [
          path.join(process.cwd(), "src/client/assets/sass"),
          path.join(process.cwd(), "node_modules")
        ],
        use: extractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader?minimize!postcss-loader!sass-loader'
          })
      },
      {
        test: /\.scss$/,
        include: path.join(process.cwd(), "src/client/app"),
        use: [
            'to-string-loader',
            'css-loader?minimize',
            'postcss-loader',
            'sass-loader?minimize'
          ]
      },
      {
        test: /\.html$/,
        use: 'html-loader',
        exclude: [path.join(process.cwd(), "src/client/index.html")]
      },
      {
        test: /\.(png|jpg|jpe?g|gif|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: path.join(process.cwd(), "build/client/img")
            }
          }
        ]
      },
      {
        test: /\/fonts\//,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: path.join(process.cwd(), "build/client/fonts")
            }
          }
        ]
      },
      {
        test: /\.graphqls/,
        use: 'raw-loader'
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: path.join(process.cwd(), "node_modules"),
        use: 'graphql-tag/loader'
      },
    ]
  },
  plugins: [
    new noEmitOnErrorsPlugin(),
    new optimizeJsPlugin({
      sourceMap: false
    }),
    new definePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __SSR__: true,
      __DEV__: false,
      __TEST__: false,
      'process.env.NODE_ENV': '"production"',
      __BACKEND_URL__: '"http://192.168.0.122:8080/graphql"'
    }),
    new commonsChunkPlugin({
      name: ['app', 'polyfills']
    }),
    // fix Angular
    new normalModuleReplacementPlugin(
      /facade([\\\/])async/,
      './node_modules/@angular/core/src/facade/async.js'
    ),
    new normalModuleReplacementPlugin(
      /facade([\\\/])collection/,
      './node_modules/@angular/core/src/facade/collection.js'
    ),
    new normalModuleReplacementPlugin(
      /facade([\\\/])errors/,
      './node_modules/@angular/core/src/facade/errors.js'
    ),
    new normalModuleReplacementPlugin(
      /facade([\\\/])lang/,
      './node_modules/@angular/core/src/facade/lang.js'
    ),
    new normalModuleReplacementPlugin(
      /facade([\\\/])math/,
      './node_modules/@angular/core/src/facade/math.js'
    ),
    new htmlWebpackPlugin({
      template: './src/client/index.html',
      chunksSortMode: 'dependency'
    }),
    new extractTextPlugin('[name].[chunkhash].style.css'),
    new scriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    new checkerPlugin(),
    new loaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        tslint: {
          failOnHint: false
        },
        // Need to workaround Angular's html syntax => #id [bind] (event) *ngFor
        htmlLoader: {
          minimize: true,
          removeAttributeQuotes: false,
          caseSensitive: true,
          customAttrSurround: [
            [/#/, /(?:)/],
            [/\*/, /(?:)/],
            [/\[?\(?/, /(?:)/]
          ],
          customAttrAssign: [/\)?]?=/]
        }
      }
    }),
    new uglifyJsPlugin({
      uglifyOptions: {
        ecma: 6
      }
    }),
    new aotPlugin({
      tsConfigPath: './tsconfig.json',
      entryModule: path.join(process.cwd(), "src/client/app/app.browser.module#AppBrowserModule")
    })
  ],
  node: {
    fs: 'empty',
    global: true,
    crypto: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  }
};
