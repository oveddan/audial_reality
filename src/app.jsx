import React, { Component } from 'react'
import Main from './Main'
import { clamp } from 'lodash'

const TAB = 9
const NUMBER_OF_SCENES = 2
const MINUS = 189
const EQUAL = 187

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = { scene: 0, volume: 0.5 }

    this.keyPress = this.keyPress.bind(this)
  }
  componentDidMount() {
    document.addEventListener('keydown', this.keyPress, false)
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
    const newVolume = clamp(this.state.volume + change, 0.0, 1.0)

    this.setState({
      volume: newVolume
    })
  }

  nextScene() {
    let nextScene = this.state.scene + 1
    if(nextScene === NUMBER_OF_SCENES)
      nextScene = 0

    this.setState({
      scene: nextScene
    })
  }

  render() {
    return <Main {...this.state} />
  }
} 
