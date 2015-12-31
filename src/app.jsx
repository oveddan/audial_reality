import React, { Component } from 'react'
import { render } from 'react-dom'
import styles from './app.css'

export default class App extends Component {

  render () {
    return <p className={styles.paragraph}>Hello world</p>
  }

}

if (process.env.NODE_ENV !== 'test')
  render(<App />, document.getElementById('main'))

