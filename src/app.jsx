import React, { Component } from 'react'
import Scene from './components/scene'
import Cube from './components/cube'
import MeshFromFile from './components/MeshFromFile'
import AudioAnalyzer from './components/AudioAnalyzer'

import { perspectiveProjection, translation, multiply, printMatrix, transpose } from 'lib/matrices'

// const source = audioCtx.createMediaStreamSource(stream)
// source.connect(analyser)
// analyser.connect(distortion)
// // etc.

const width = 1080
const height = 800

export default class App extends Component {
  componentWillMount() {
    // this.ortho = mat4.create()
    // mat4.ortho(this.ortho, -10, 10, -10, 10, 5, -5)

    // const viewDistance = getOptimalViewDistance(width, 100)
    // const viewNear = -viewDistance
    const perspective = perspectiveProjection(width, height)

    printMatrix(perspective)

    const position = translation([0, 0, -1])

    this.camera = multiply(perspective, position)
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
          <Cube key='1' camera={this.camera} analyzer={this.analyzer} position={[0, -1, 0]} scale={[1.25, 0.1, 100.0]} />
        )}
        {this.analyzer && (
          <Cube key='2' camera={this.camera} analyzer={this.analyzer} position={[0, 0, -10]} scale={[1.0, 1.0, 1.0]} />
        )}
        <AudioAnalyzer fftSize={32} ref={analyzer => { this.setAnalyzer(analyzer)}} />
      </Scene>
    )
  }
}

