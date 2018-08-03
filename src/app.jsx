import React, { Component } from 'react'
import { clamp, size, keys } from 'lodash'
import { VOLUME } from 'src/constants'

import Main from './Main'
import Scenes from './scenes'

import './app.scss'

const TAB = 9
const NUMBER_OF_SCENES = size(Scenes) 
const MINUS = 189
const EQUAL = 187

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = { scene: 0, volume: 1 }

    this.keyPress = this.keyPress.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.nextScene = this.nextScene.bind(this)
    this.previousScene = this.previousScene.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keyPress, false)
  }


  touchStart(e) {
    this.nextScene()
  }


  keyPress(e) {
    const { keyCode } = e
    switch(keyCode) {
    case TAB:
      e.preventDefault()
      this.nextScene()
      break
    case MINUS:
      e.preventDefault()
      this.changeVolume(-0.1)
      break
    case EQUAL:
      e.preventDefault()
      this.changeVolume(0.1)
      break
    default:
      break
    }
  }

  changeVolume(change) {
    const newVolume = clamp(this.state.volume + change, VOLUME.min, VOLUME.max)

    this.setState({
      volume: newVolume
    })
  }

  nextScene() {
    let scene = this.state.scene + 1
    if(scene === NUMBER_OF_SCENES)
      scene = 0

    this.setState({
      scene
    })
  }

  previousScene() {
    let scene = this.state.scene - 1
    if(scene < 0)
      scene = NUMBER_OF_SCENES - 1

    this.setState({
      scene
    })
  }

  render() {
    return  (
      <Main 
        {...this.state} 
        onTouch={this.touchStart} 
        nextScene={this.nextScene} 
        previousScene={this.previousScene}
      />
    )
  }
} 
