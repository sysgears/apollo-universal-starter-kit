const path = require('path'),
  definePlugin = require('webpack/lib/DefinePlugin'),
  checkerPlugin = require('awesome-typescript-loader').CheckerPlugin,
  aotPlugin = require('@ngtools/webpack').AotPlugin,
  loaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin'),
  noEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin'),
  optimizeJsPlugin = require('optimize-js-plugin'),
  uglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  target: 'node',
  //cache: false,
  // devtool: 'source-map',
  entry: './src/server/server.ts',
  output: {
    filename: 'server.js',
    sourceMapFilename: 'server.bundle.map',
    chunkFilename: 'server.[id].chunk.js',
    path: path.join(process.cwd(), "build/server"),
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
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader'],
        exclude: [path.join(process.cwd(), "src/client/index.html")]
      },
      {
        test: /\.(html)$/,
        use: 'raw-loader'
      },
      {
        test: /\.(png|jpg|jpe?g|gif|ico)$/,
        use: 'raw-loader'
      },
      {
        test: /\/fonts\//,
        use: 'raw-loader'
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
    new definePlugin({
      __CLIENT__: false,
      __SERVER__: true,
      __SSR__: true,
      __DEV__: false,
      __TEST__: false,
      'process.env.NODE_ENV': '"production"',
      __BACKEND_URL__: '"http://192.168.0.122:8080/graphql"'
    }),
    new optimizeJsPlugin({
      sourceMap: false
    }),
    new checkerPlugin(),
    new loaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        tslint: {
          failOnHint: false
        }
      }
    }),
    new uglifyJsPlugin({
      uglifyOptions: {
        ecma: 6,
        mangle: false
      }
    }),
    new aotPlugin({
      tsConfigPath: './tsconfig.json',
      entryModule: path.join(process.cwd(), "src/server/app/app.server.module#AppServerModule"),
      skipCodeGeneration: true
    })
  ],
  node: {
    global: true,
    crypto: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  }
};
