/* eslint-disable no-var,object-shorthand */
var path = require('path')
var extend = require('lodash/object/extend')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var PATHS = {
  OUTPUT : './dist',
  SOURCE : './src'
}

var config = {
  output : {
    path : path.resolve(__dirname, PATHS.OUTPUT),
    publicPath : '/static/',
    filename : 'main.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?$/,
        exclude : /node_modules/,
        loader : 'babel'
      },
      {
        test : /\.css$/,
        exclude : /node_modules/,
        loader : ExtractTextPlugin.extract('style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
      }
    ]
  },
  resolve : {
    extensions : ['', '.js', '.jsx'],
    alias : {
      src : path.resolve(__dirname, './src')
    }
  },
  plugins : [
    new ExtractTextPlugin('style.css', { allChunks : true })
  ],
  postcss : [
    require('autoprefixer')
  ]
}

var buildConfig = extend({}, config, {
  entry : [`${PATHS.SOURCE}/app.jsx`]
})

var devConfig = extend({}, buildConfig, {
  entry : ['webpack-hot-middleware/client'].concat(buildConfig.entry),
  plugins : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ].concat(buildConfig.plugins)
})

module.exports = {
  buildConfig : buildConfig,
  devConfig : devConfig
}

/* eslint-enable no-var,object-shorthand */

