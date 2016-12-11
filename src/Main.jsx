import React, { Component } from 'react'
import Dimensions from 'react-dimensions'
import Scene from './components/scene'
import PerspectiveCamera from './components/PerspectiveCamera'
import Cube from './components/cube'
import AudioAnalyzer from './components/AudioAnalyzer'

import shaders from 'shaders'

const PulsingSphere = props => (
  <Cube key='2'
    {...props}
    position={[0, 0, 0.0]}
    scale={[1.0, 1.0, 1.0]}
    fragmentShader={shaders.pulsingSphere}
  />
)

const SoundWaveVortex = props => (
  <div>
    <Cube key='1'
      {...props}
      position={[0, 0, -5.0]}
      scale={[0.5, 0.5, 0.5]}
      fragmentShader={shaders.soundGlobs}
    />
    <Cube key='2'
      {...props}
      position={[0, 0, 0]}
      scale={[1.5, 1.5, 100.0]}
      fragmentShader={shaders.travelingSound}
    />
  </div>
)

const Avigdor = props => (
  <Cube
    {...props}
    position={[0, 0, -2]}
    scale={[1, 1, 0.00001]}
    fragmentShader={shaders.avigdor}
  />
)

const SceneSelector = props => {
  switch(props.scene) {
  case 2:
    return <SoundWaveVortex {...props} />
  case 1:
    return <PulsingSphere {...props} />
  case 0:
    return <Avigdor {...props} />
  default:
    return <div />
  }
}

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
        <AudioAnalyzer
          fftSize={32}
          ref={this.setAnalyzer}
          volume={this.props.volume}
        />
        <PerspectiveCamera ref={this.setCamera} width={this.props.containerWidth} height={this.props.containerHeight}/>
        {this.analyzer && this.camera && (
          <SceneSelector
            scene={this.props.scene}
            camera={this.camera}
            analyzer={this.analyzer}
          />
        )}
      </Scene>
    )
  }
}

export default Dimensions({
  elementResize:true
})(Main)
