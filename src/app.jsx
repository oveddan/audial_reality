import React, { Component } from 'react'
import Main from './Main'

const TAB = 9
const NUMBER_OF_SCENES = 2

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = { scene: 0 }

    this.keyPress = this.keyPress.bind(this)
  }
  componentDidMount() {
    document.addEventListener('keydown', this.keyPress, false)
  }

  keyPress(e) {
    const { keyCode } = e
    if (keyCode === TAB) {
      e.preventDefault()
      this.nextScene()
    }
  }

  nextScene() {
    let nextScene = this.state.scene + 1
    if(nextScene === NUMBER_OF_SCENES)
      nextScene = 0

    console.log(nextScene)

    this.setState({
      scene: nextScene
    })
  }

  render() {
    return <Main {...this.state} />
  }
} 
