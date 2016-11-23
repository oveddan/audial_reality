/* eslint-disable no-var,object-shorthand,prefer-template */

var path = require('path')
var assign = require('lodash.assign')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var PATHS = {
  OUTPUT : path.join(__dirname, 'dist'),
  SOURCE : path.join(__dirname, 'src')
}

var config = {
  output : {
    path : PATHS.OUTPUT,
    publicPath : '/static/',
    filename : 'main.js'
  },
  module : {
    loaders : [
      {
        test : /\.jsx?$/,
        exclude : /node_modules/,
        loader : 'babel',
        include: [
          PATHS.SOURCE
        ]
      },
      {
        test: /\.(png|jpg|eot|woff|otf|ttf|svg)$/,
        exclude : /node_modules/,
        loader: 'file-loader'
      },
      {
        test: /\.glsl$/,
        loader: 'raw'
      }
    ]
  },
  plugins : [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV' : JSON.stringify(process.env.NODE_ENV)
    })
  ]
}

var buildConfig = assign({}, config, {
  entry : [PATHS.SOURCE + '/index.js'],
  resolve: {
    root: path.resolve(__dirname, 'node_modules'),
    extensions: ['', '.js', '.jsx']
  }
})

var devConfig = assign({}, buildConfig, {
  devtool: 'source-map',
  entry : [
    'webpack-hot-middleware/client'
  ].concat(buildConfig.entry),
  resolve: buildConfig.resolve,
  plugins : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ].concat(buildConfig.plugins)
})

module.exports = buildConfig
module.exports.devConfig = devConfig

/* eslint-enable no-var,object-shorthand,prefer-template */
