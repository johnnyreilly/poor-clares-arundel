/* eslint-disable no-var, strict, prefer-arrow-callback */
'use strict';

var path = require('path');
var webpack = require('webpack');
var packageJson = require('./package.json');

module.exports = {
  cache: true,
  entry: {
    main: './src/main.ts',

    // common dependencies bundled together packaged with CommonsChunkPlugin in gulp/webpack.js
    vendor: [
      'babel-polyfill',
      'angular',
      'angular-animate',
      'angular-ui-bootstrap',
      'angular-ui-router'
    ]
  },
  output: {
    path: path.resolve(__dirname, './wwwroot/scripts'),
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      loader: 'babel-loader?presets[]=es2016&presets[]=es2015!ts-loader'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2016', 'es2015']
      }
    }]
  },
  plugins: [ // Check gulp/webpack.js for build specific plugins
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.ts', '.tsx', '.js']
  },
};
