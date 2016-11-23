import React, { Component } from 'react'
import Scene from './components/scene'
import Cube from './components/cube'

export default class App extends Component {

  render () {
    return (
      <Scene>
        <Cube />
      </Scene>
    )
  }
}

