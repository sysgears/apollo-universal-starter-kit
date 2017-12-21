/**
 * Webpack helpers & dependencies
 */
const path = require('path'),
  definePlugin = require('webpack/lib/DefinePlugin'),
  checkerPlugin = require('awesome-typescript-loader').CheckerPlugin,
  aotPlugin = require('@ngtools/webpack').AotPlugin,
  loaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin'),
  // assetsPlugin = require('assets-webpack-plugin'),
  htmlWebpackPlugin = require('html-webpack-plugin'),
  extractTextPlugin = require('extract-text-webpack-plugin'),
  scriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin'),
  noEmitOnErrorsPlugin = require('webpack/lib/NoEmitOnErrorsPlugin'),
  optimizeJsPlugin = require('optimize-js-plugin'),
  commonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin'),
  uglifyJsPlugin = require('uglifyjs-webpack-plugin'),
  normalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'production';
const HOST = 'localhost';
const PORT = 3000;

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = {
  target: 'web',
  /**
   * The entry point for the bundle
   * Our Angular app
   *
   * See: http://webpack.github.io/docs/configuration.html#entry
   */
  entry: {
    'polyfills': './src/client/polyfills.ts',
    'app': './src/client/main-browser-aot.ts'
  },
  /**
   * Developer tool to enhance debugging
   *
   * See: http://webpack.github.io/docs/configuration.html#devtool
   * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
   */
  // devtool: settings.webpack.devtool.PROD,
  /**
   * Cache generated modules and chunks to improve performance for multiple incremental builds.
   * This is enabled by default in watch mode.
   * You can pass false to disable it.
   *
   * See: http://webpack.github.io/docs/configuration.html#cache
   */
  //cache: false,
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
    filename: '[name].[chunkhash].bundle.js',

    /**
     * The filename of the SourceMaps for the JavaScript files.
     * They are inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
     */
    sourceMapFilename: '[name].[chunkhash].bundle.map',

    /**
     * The filename of non-entry chunks as relative path
     * inside the output.path directory.
     *
     * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
     */
    chunkFilename: '[id].[chunkhash].chunk.js',
    /**
     * The output directory as absolute path (required).
     *
     * See: http://webpack.github.io/docs/configuration.html#output-path
     */
    path: path.join(process.cwd(), "build/client"),
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
       * @ngtools/webpack, ng-router-loader, awesome-typescript-loader and angular2-template-loader for *.ts
       *
       * See: https://github.com/angular/angular-cli
       * See: https://github.com/shlomiassaf/ng-router-loader
       * See: https://github.com/s-panferov/awesome-typescript-loader
       * See: https://github.com/TheLarkInn/angular2-template-loader
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
       * style-loader, css-loader and sass-loader for *.scss
       * bundles in an external file
       *
       * See: https://github.com/webpack-contrib/style-loader
       * See: https://github.com/webpack-contrib/css-loader
       * See: https://github.com/webpack-contrib/sass-loader
       */
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

      /**
       * to-string-loader, css-loader and sass-loader for *.scss
       *
       * See: https://github.com/gajus/to-string-loader
       * See: https://github.com/webpack-contrib/css-loader
       * See: https://github.com/webpack-contrib/sass-loader
       */
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

      /**
       * html-loader for *.html
       *
       * See: https://github.com/webpack/html-loader
       */
      {
        test: /\.html$/,
        use: 'html-loader',
        exclude: [path.join(process.cwd(), "src/client/index.html")]
      },

      /**
       * file-loader for images
       *
       * See: https://github.com/webpack-contrib/file-loader
       */
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

      /**
       * file-loader for fonts
       *
       * See: https://github.com/webpack-contrib/file-loader
       */
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
     * Webpack plugin to optimize a JavaScript file for faster initial load
     * by wrapping eagerly-invoked functions.
     *
     * See: https://github.com/vigneshshanmugam/optimize-js-plugin
     */
    new optimizeJsPlugin({
      sourceMap: false
    }),
    /**
     * Plugin: AssetsPlugin
     * Description: Emits a json file with assets paths.
     *
     * See: https://github.com/kossnocorp/assets-webpack-plugin
     */
    // new assetsPlugin({
    //     path: root(settings.paths.public.assets.root),
    //     filename: 'webpack-assets.json',
    //     prettyPrint: true
    // }),
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
     * Plugin: CommonsChunkPlugin
     * Description: Shares common code between the pages.
     * It identifies common modules and put them into a commons chunk.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
     * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
     */
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
    /**
     * Plugin: HtmlWebpackPlugin
     * Description: Simplifies creation of HTML files to serve your webpack bundles.
     * This is especially useful for webpack bundles that include a hash in the filename
     * which changes every compilation.
     *
     * See: https://github.com/ampedandwired/html-webpack-plugin
     */
    new htmlWebpackPlugin({
      template: './src/client/index.html',
      chunksSortMode: 'dependency'
    }),
    /**
     * Plugin: ExtractTextPlugin
     * Description: Extracts text from bundle into a file.
     *
     * See: https://github.com/webpack/extract-text-webpack-plugin
     */
    new extractTextPlugin('[name].[chunkhash].style.css'),
    /**
     * Plugin: ScriptExtHtmlWebpackPlugin
     * Description: Enhances html-webpack-plugin functionality
     * with different deployment options for your scripts including:
     *
     * See: https://github.com/numical/script-ext-html-webpack-plugin
     */
    new scriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
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
        },
        /**
         * Html loader advanced options
         *
         * See: https://github.com/webpack/html-loader#advanced-options
         */
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
    /**
     * Plugin: UglifyJsPlugin
     * Description: Minimize all JavaScript output of chunks.
     * Loaders are switched into minimizing mode.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
     */
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
  /**
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
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
