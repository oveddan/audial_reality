/* eslint-disable no-var,object-shorthand,prefer-template */

var path = require('path')
var assign = require('lodash.assign')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var PATHS = {
  OUTPUT : path.join(__dirname, 'dist'),
  SOURCE : path.join(__dirname, 'src'),
  OBJECTS : path.join(__dirname, 'objects'),
  LIB: path.join(__dirname, 'src', 'lib')
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
      // Optionally extract less files
      // or any other compile-to-css language
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
      },
      {
        test: /\.(png|jpg)$/,
        exclude : /node_modules/,
        loader: 'file-loader'
      },
      {
        test: /\.ico$/,
        loader: 'file-loader?name=[name].[ext]'  // <-- retain original file name
      },
      {
        test: /\.obj$/,
        loader: 'raw'
      },
      { test: /\.glsl$/, loader: 'raw', exclude: /node_modules/ },
      { test: /\.glsl$/, loader: 'glslify', exclude: /node_modules/ }
    ]
  },
  plugins : [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV' : JSON.stringify(process.env.NODE_ENV)
    }),
    new ExtractTextPlugin('[name].css')
  ]
}

var buildConfig = assign({}, config, {
  entry : [PATHS.SOURCE + '/index.js'],
  resolve: {
    root: path.resolve(__dirname, 'node_modules'),
    extensions: ['', '.js', '.jsx'],
    alias: {
      objects: PATHS.OBJECTS,
      lib: PATHS.LIB,
      shaders: path.join(__dirname, 'src', 'shaders'),
      src: path.join(__dirname, 'src'),
      static: path.join(__dirname, 'static')
    }
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
