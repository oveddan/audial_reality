/* eslint-disable no-console */

import express from 'express'
import { devConfig as config } from '../webpack.config'
import devMiddleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'
import webpack from 'webpack'
import path from 'path'

const app = express()
const compiler = webpack(config)

app.use(devMiddleware(compiler, {
  noInfo : true,
  publicPath : config.output.publicPath
}))

app.use(hotMiddleware(compiler))

app.use('/static', express.static('static'))

app.get('*', (_r, res) => res.sendFile(path.resolve(__dirname, '../src/index.html')))


app.listen(3000, 'localhost', err => {
  if (err)
    console.log(err)

  console.log('App started at localhost:3000')
})


/* eslint-enable no-console */

