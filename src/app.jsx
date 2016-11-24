import React, { Component } from 'react'
import Scene from './components/scene'
import Cube from './components/cube'
import { vec3, mat4 } from 'gl-matrix'

// const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
// const analyser = audioCtx.createAnalyser()
// const source = audioCtx.createMediaStreamSource(stream)
// source.connect(analyser)
// analyser.connect(distortion)
// // etc.

const width = 1080
const height = 800

const toRadian = degrees => degrees * Math.PI / 180

export default class App extends Component {
  componentWillMount() {
    // this.ortho = mat4.create()
    // mat4.ortho(this.ortho, -10, 10, -10, 10, 5, -5)

    // const viewDistance = getOptimalViewDistance(width, 100)
    // const viewNear = -viewDistance
    this.perspective = mat4.create()
    mat4.perspective(this.perspective, toRadian(45), width / height, 1, 1000 )

    this.position = mat4.create()
    mat4.fromTranslation(this.position, vec3.fromValues(0, 0, -5))
  }

  camera() {
    const out = mat4.create()
    mat4.multiply(out, this.perspective, this.position)
    return out
  }

  render () {
    return (
      <Scene width={width} height={height} >
        <Cube key='3' camera={this.camera()} />
      </Scene>
    )
  }
}

