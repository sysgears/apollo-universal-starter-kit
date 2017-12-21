/**
 * Webpack helpers & dependencies
 */
const path = require('path'),
  definePlugin = require('webpack/lib/DefinePlugin'),
  checkerPlugin = require('awesome-typescript-loader').CheckerPlugin,
  aotPlugin = require('@ngtools/webpack').AotPlugin,
  loaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin'),
  // assetsPlugin = require('assets-webpack-plugin'),
  noEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin'),
  optimizeJsPlugin = require('optimize-js-plugin'),
  uglifyJsPlugin = require('uglifyjs-webpack-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'production';
const HOST = 'localhost';
const PORT = 8080;

module.exports = {
  target: 'node',
  /**
   * Cache generated modules and chunks to improve performance for multiple incremental builds.
   * This is enabled by default in watch mode.
   * You can pass false to disable it.
   *
   * See: http://webpack.github.io/docs/configuration.html#cache
   */
  //cache: false,
  /**
   * Developer tool to enhance debugging
   *
   * See: http://webpack.github.io/docs/configuration.html#devtool
   * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
   */
  // devtool: settings.webpack.devtool.PROD,
  /**
   * The entry point for the bundle
   * Our Angular app
   *
   * See: http://webpack.github.io/docs/configuration.html#entry
   */
  entry: "./src/server/server.ts",
  /**
   * Options affecting the output of the compilation.
   *
   * See: http://webpack.github.io/docs/configuration.html#output
   */
  output: {
    /**
     * Specifies the name of each output file on disk.
     * IMPORTANT: You must not specify an absolute path here!
     *
     * See: http://webpack.github.io/docs/configuration.html#output-filename
     */
    filename: 'server.js',
    /**
     * The filename of the SourceMaps for the JavaScript files.
     * They are inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
     */
    sourceMapFilename: 'server.bundle.map',
    /**
     * The filename of non-entry chunks as relative path
     * inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
     */
    chunkFilename: 'server.[id].chunk.js',
    /**
     * The output directory as absolute path (required).
     *
     * See: http://webpack.github.io/docs/configuration.html#output-path
     */
    path: path.join(process.cwd(), "build/server"),
    publicPath: '/'
  },
  /**
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {
    /**
     * An array of extensions that should be used to resolve modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
     */
    extensions: ['.ts', '.js', '.json'],

    // An array of directory names to be resolved to the current directory
    modules: [
      './node_modules'
    ]
  },
  /**
   * Options affecting the normal modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {
    rules: [
      /**
       * tslint-loader
       *
       * See: https://github.com/wbuchwalter/tslint-loader
       */
      {
        enforce: 'pre',
        test: /\.ts$/,
        use: 'tslint-loader',
        exclude: [
          path.join(process.cwd(), "node_modules"),
          /\.(ngfactory|ngstyle)\.ts$/
        ]
      },
      /**
       * @ngtools/webpack for *.ts
       *
       * See: https://github.com/angular/angular-cli
       */
      {
        test: /\.ts$/,
        use: '@ngtools/webpack',
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      /**
       * json-loader for *.json
       *
       * See: https://github.com/webpack/json-loader
       */
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      /**
       * to-string-loader, css-loader and sass-loader for *.scss
       *
       * See: https://github.com/gajus/to-string-loader
       * See: https://github.com/webpack-contrib/css-loader
       * See: https://github.com/webpack-contrib/sass-loader
       */
      {
        test: /\.scss$/,
        use: ['to-string-loader', 'css-loader', 'sass-loader'],
        exclude: [path.join(process.cwd(), "src/client/index.html")]
      },
      /**
       * raw-loader for all other files
       *
       * See: https://github.com/webpack/html-loader
       */
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
      }
    ]
  },
  /**
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [
    /**
     * Plugin: NoEmitOnErrorsPlugin
     * Description: Skips the emitting phase (and recording phase) when
     * there are errors while compiling.
     *
     * See: https://github.com/webpack/docs/wiki/list-of-plugins#noerrorsplugin
     */
    new noEmitOnErrorsPlugin(),
    /**
     * Plugin: DefinePlugin
     * Description: Define free variables.
     * Useful for having development builds with debug logging or adding global constants.
     *
     * Environment helpers
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
     */
    // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
    new definePlugin({
      'ENV': JSON.stringify(ENV),
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'NODE_ENV': JSON.stringify(ENV),
        'HOST': JSON.stringify(HOST),
        'PORT': JSON.stringify(PORT)
      }
    }),
    /**
     * Webpack plugin to optimize a JavaScript file for faster initial load
     * by wrapping eagerly-invoked functions.
     *
     * See: https://github.com/vigneshshanmugam/optimize-js-plugin
     */
    new optimizeJsPlugin({
      sourceMap: false
    }),
    /**
     * Plugin: CheckerPlugin
     * Description: Do type checking in a separate process, so webpack don't need to wait.
     *
     * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
     */
    new checkerPlugin(),
    /**
     * Plugin LoaderOptionsPlugin (experimental)
     *
     * See: https://gist.github.com/sokra/27b24881210b56bbaff7
     */
    new loaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        tslint: {
          failOnHint: false
        }
      }
    }),
    /**
     * Plugin: UglifyJsPlugin
     * Description: Minimize all JavaScript output of chunks.
     * Loaders are switched into minimizing mode.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
     */
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
  /**
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    global: true,
    crypto: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: true
  }
};
