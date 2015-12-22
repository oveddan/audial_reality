/* eslint-disable no-var */

var webpackConfig = require('./webpack.config').buildConfig

module.exports = function (config) {
  config.set({
    basePath : '',
    frameworks : ['mocha', 'sinon-chai'],
    files : [
      'node_modules/es5-shim/es5-shim.min.js',
      'node_modules/react/dist/react.min.js',
      'src/**/*_test.js'
    ],
    webpack : webpackConfig,
    webpackMiddleware : {
      stats : {
        colors : true
      }
    },
    preprocessors : {
      'src/**/*_test.js' : ['webpack']
    },
    reporters : ['progress', 'notify'],
    port : 9876,
    colors : true,
    logLevel : config.LOG_INFO,
    autoWatch : true,
    browsers : ['PhantomJS2'],
    singleRun : true

  })
}

/* eslint-enable no-var */

