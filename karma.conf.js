/* eslint-disable no-var */

var webpackConfig = require('./webpack.config').testConfig

module.exports = function (config) {
  config.set({
    basePath : '',
    frameworks : ['mocha'],
    files : [
      {
        pattern : 'lib/test-helpers/test-index.js',
        watched : false,
        included : true,
        served : true
      }
    ],
    webpack : webpackConfig,
    webpackMiddleware : {
      stats : {
        colors : true
      },
      noInfo: true
    },
    preprocessors : {
      'lib/test-helpers/test-index.js' : ['webpack', 'sourcemap']
    },
    reporters : ['mocha', 'notify'],
    port : 9876,
    colors : true,
    logLevel : config.LOG_INFO,
    autoWatch : true,
    browsers : ['PhantomJS2'],
    singleRun : true

  })
}

/* eslint-enable no-var */

