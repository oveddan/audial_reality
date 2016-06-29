import React from 'react'
import App from './app'
import { render } from 'react-dom'

if (process.env.NODE_ENV !== 'test')
  render(<App />, document.getElementById('main'))
