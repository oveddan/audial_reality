import React, { Component } from 'react'
import Dimensions from 'react-dimensions'
import Scene from './components/scene'
import PerspectiveCamera from './components/PerspectiveCamera'
import AudioAnalyzer from './components/AudioAnalyzer'
import SceneControls from './components/SceneControls'
import Scenes from './scenes'

const SceneSelector = props => (
  React.createElement(Scenes[props.scene], props)
)

class Main extends Component {
  constructor(props) {
    super(props)

    this.setAnalyzer = this.setAnalyzer.bind(this)
    this.setCamera = this.setCamera.bind(this)
    this.setAudioSmoother = this.setAudioSmoother.bind(this)
  }

  setAnalyzer(analyzer) {
    this.analyzer = analyzer
    this.forceUpdate()
  }

  setAudioSmoother(smoother) {
    this.audioSmoother = smoother
    this.forceUpdate()
  }

  setCamera(camera) {
    this.camera = camera
    this.forceUpdate()
  }

  componentDidMount() {
    if (this.props.containerHeight === 0)
      setTimeout(() => this.props.updateDimensions())
  }

  render () {
    if (this.props.containerHeight === 0) return null

    return (
      <SceneControls nextScene={this.props.nextScene} previousScene={this.props.previousScene} >
        <Scene width={this.props.containerWidth} height={this.props.containerHeight} onTouch={this.props.onTouch} >
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
              width={this.props.containerWidth} height={this.props.containerHeight}
              camera={this.camera}
              analyzer={this.analyzer}
            />
          )}
        </Scene>
      </SceneControls>
    )
  }
}

export default Dimensions({
  elementResize:true
})(Main)
