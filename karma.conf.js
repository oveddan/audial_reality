/* eslint-disable no-var */

var webpackConfig = require('./webpack.config').testConfig

module.exports = function (config) {
  config.set({
    basePath : '',
    frameworks : ['mocha'],
    files : [
      'node_modules/es5-shim/es5-shim.min.js',
      'node_modules/react/dist/react.min.js',
      {
        pattern : 'src/test-helpers/test-index.js',
        watched : false,
        included : true,
        served : true
      }
    ],
    webpack : webpackConfig,
    webpackMiddleware : {
      stats : {
        colors : true
      }
    },
    preprocessors : {
      'src/test-helpers/test-index.js' : ['webpack', 'sourcemap']
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

