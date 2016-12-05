import React, { Component } from 'react'
import Scene from './components/scene'
import Cube from './components/cube'
import MeshFromFile from './components/MeshFromFile'
import AudioAnalyzer from './components/AudioAnalyzer'
import { vec3, mat4 } from 'gl-matrix'

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
    const perspective = mat4.create()
    // mat4.ortho(this.ortho, -10, 10, -10, 10, 5, -5)
    mat4.perspective(perspective, toRadian(45), width / height, 1, 1000 )

    const position = mat4.create()
    mat4.fromTranslation(position, vec3.fromValues(0, 0, -5))

    this.camera = mat4.create()
 
    mat4.multiply(this.camera, perspective, position)
  }

  setAnalyzer(analyzer) {
    if (!this.analyzer) {
      this.analyzer = analyzer
      this.forceUpdate()
    }
  }

  render () {
    return (
      <Scene width={width} height={height} >
        {this.analyzer && (
          <Cube key='1' camera={this.camera} analyzer={this.analyzer} position={[0, -100, 0]} scale={[1.25, 0.01, 10.0]} />
        )}
        {this.analyzer && (
          <Cube key='2' camera={this.camera} analyzer={this.analyzer} position={[0, 0, -10]} scale={[100.0, 100.0, 0.1]} />
        )}
        <AudioAnalyzer fftSize={32} ref={analyzer => { this.setAnalyzer(analyzer)}} />
      </Scene>
    )
  }
}

