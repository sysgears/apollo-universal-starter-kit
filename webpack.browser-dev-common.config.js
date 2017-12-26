/**
 * Webpack helpers & dependencies
 */
const path = require('path'),
  definePlugin = require('webpack/lib/DefinePlugin'),
  checkerPlugin = require('awesome-typescript-loader').CheckerPlugin,
  loaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin'),
  htmlWebpackPlugin = require('html-webpack-plugin'),
  extractTextPlugin = require('extract-text-webpack-plugin'),
  scriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
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
        use: [
            'ng-router-loader',
            'awesome-typescript-loader?declaration=false',
            'angular2-template-loader'
          ],
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
        use: ['style-loader', 'css-loader', 'sass-loader']
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
        use: ['to-string-loader', 'css-loader', 'sass-loader']
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
    new extractTextPlugin('[name].style.css'),

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
      options: {
        tslint: {
          failOnHint: false
        }
      }
    })
  ],
  /**
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    fs: 'empty'
  }
};


