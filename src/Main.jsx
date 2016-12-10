import React, { Component } from 'react'
import Dimensions from 'react-dimensions'
import Scene from './components/scene'
import PerspectiveCamera from './components/PerspectiveCamera'
import Cube from './components/cube'
import AudioAnalyzer from './components/AudioAnalyzer'

import shaders from 'shaders'

class Main extends Component {
  constructor(props) {
    super(props)

    this.setAnalyzer = this.setAnalyzer.bind(this)
    this.setCamera = this.setCamera.bind(this)
  }

  setAnalyzer(analyzer) {
    this.analyzer = analyzer
    this.forceUpdate()
  }

  setCamera(camera) {
    this.camera = camera
    this.forceUpdate()
  }

  render () {
    return (
      <Scene width={this.props.containerWidth} height={this.props.containerHeight} >
        <AudioAnalyzer fftSize={32} ref={this.setAnalyzer} />
        <PerspectiveCamera ref={this.setCamera} width={this.props.containerWidth} height={this.props.containerHeight}/>
        {this.analyzer && this.camera && (
          <Cube key='2' 
            camera={this.camera} 
            analyzer={this.analyzer} 
            position={[0, 0, 0]} 
            scale={[3.0, 3.0, 3.0]} 
            fragmentShader={shaders.soundWaves}
          />
        )}
      </Scene>
    )
  }
}

export default Dimensions({
  elementResize:true
})(Main)
