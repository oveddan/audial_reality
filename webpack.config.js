/* eslint-disable no-var,object-shorthand */
var path = require('path')
var extend = require('lodash/object/extend')
var webpack = require('webpack')
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
        loader : 'style!css'
      }
    ]
  },
  resolve : {
    extensions : ['', '.js', '.jsx'],
    alias : {
      src : path.resolve(__dirname, './src')
    }
  }
}

var buildConfig = extend({}, config, {
  entry : [`${PATHS.SOURCE}/app.jsx`]
})

var devConfig = extend({}, buildConfig, {
  entry : ['webpack-hot-middleware/client'].concat(buildConfig.entry),
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
})

module.exports = {
  buildConfig : buildConfig,
  devConfig : devConfig
}

/* eslint-enable no-var,object-shorthand */

