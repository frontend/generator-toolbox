/* globals require, module, __dirname */

const webpack = require('webpack');
const path    = require('path');
const config  = require('./gulp_config.json');

module.exports = {
  entry: {
    app: `./${config.assets}js/index.js`,
    vendors: []
  },
  output: {
    path: path.join(__dirname, `./${config.build}js`),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loaders: 'babel',
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-es2015-spread', 'transform-object-rest-spread']
        }
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modules: [
      path.resolve(`./${config.assets}js`),
      'node_modules'
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: 1,
      filename: 'vendors.bundle.js'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
