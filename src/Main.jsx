import React, { Component } from 'react'
import Dimensions from 'react-dimensions'
import Scene from './components/scene'
import PerspectiveCamera from './components/PerspectiveCamera'
import AudioAnalyzer from './components/AudioAnalyzer'
import Scenes from './scenes'


const SceneSelector = props => (
  React.createElement(Scenes[props.scene], props)
)

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
        <PerspectiveCamera ref={this.setCamera} 
          width={this.props.containerWidth} 
          height={this.props.containerHeight}
        />
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
