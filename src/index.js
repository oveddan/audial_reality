import React from 'react'
import App from './app'
import { render } from 'react-dom'
require('static/favicon.ico')

if (process.env.NODE_ENV !== 'test')
  render(<App />, document.getElementById('main'))
