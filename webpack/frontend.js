const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');

const DEBUG = process.env.NODE_ENV !== 'production';

const plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
  })
];
const outputFile = DEBUG ? '[name].js' : '[name].[chunkhash].js';

if (!DEBUG) {
  plugins.push(new ManifestPlugin({
    fileName: 'assets.json'
  }));
  plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true }));
}

const config = {
  entry: {
    bundle: ['babel-polyfill', 'bootstrap-loader', './src/frontend/index.jsx']
  },
  module: {
    noParse: [],
    loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.scss$/, loader: "style!css!sass" },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.(woff2?|svg)$/, loader: 'url?limit=10000' },
      { test: /\.(ttf|eot)$/, loader: 'file' },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          cacheDirectory: DEBUG
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  node: {
    fs: "empty"
  },
  plugins,
  output: {
    filename: outputFile,
    path: DEBUG ? '/' : './build/assets',
    publicPath: '/assets/'
  },
};

if (DEBUG) {
  config.devtool = '#inline-source-map';
} else if (process.env.NODE_ENV === 'production') {
  config.devtool = 'source-map';
}

module.exports = config;
