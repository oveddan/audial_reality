import React, { Component } from 'react'

import { each, pull } from 'lodash'

const initWebGL = canvas => {
  // Try to grab the standard context. If it fails, fallback to experimental.
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  
  // If we don't have a GL context, give up now
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.') //eslint-disable-line no-alert
  }
  
  return gl
}

export default class Scene extends Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  componentDidMount() {
    const gl = initWebGL(this.canvas)

    this.gl = gl
    this.childPreDraws = []
    this.childDraws = []

    
    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    // Enable depth testing
    gl.enable(gl.DEPTH_TEST)
    
    this.draw()

    this.setState({
      glLoaded: true
    })
  }

  getChildContext() {
    return { 
      gl: this.gl, 
      registerChildDraw: fn => this.registerChildDraw(fn),
      unregisterChildDraw: fn => this.unregisterChildDraw(fn),
      registerChildPreDraw: fn => this.registerChildPreDraw(fn),
      unregisterChildPreDraw: fn => this.unregisterChildPreDraw(fn)
    }
  }

  draw() {
    each(this.childPreDraws, preDraw => preDraw(this.gl))

    const gl = this.gl

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.viewport(0, 0, this.props.width, this.props.height)

    gl.enable(gl.DEPTH_TEST)

    each(this.childDraws, draw => draw(this.gl))

    const error = gl.getError()
    if (error !== 0)
      console.log('error:', error)

    window.requestAnimationFrame(() => this.draw())

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
  }

  registerChildDraw(fn) {
    this.childDraws.push(fn)
  }

  unregisterChildDraw(fn) {
    pull(this.childDraws, fn)
  }

  registerChildPreDraw(fn) {
    this.childPreDraws.push(fn)
  }

  unregisterChildPreDraw(fn) {
    pull(this.childPreDraws, fn)
  }

  render() {
    return (
      <div>
        <canvas onTouchStart={this.props.onTouch} width={this.props.width} height={this.props.height} ref={canvas => { this.canvas = canvas }} />
        {this.state.glLoaded && this.props.children}
      </div>
    )
  }
}

Scene.childContextTypes = {
  gl: React.PropTypes.object,
  registerChildDraw: React.PropTypes.func,
  unregisterChildDraw: React.PropTypes.func.isRequired,
  registerChildPreDraw: React.PropTypes.func.isRequired,
  unregisterChildPreDraw: React.PropTypes.func.isRequired
}


