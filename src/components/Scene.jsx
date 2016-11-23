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

const horizAspect = 480.0/640.0

const initBuffers = gl => {
  const squareVerticesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer)
  
  const vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ]
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
}

export default class Scene extends Component {
  constructor(props) {
    super(props)

    this.childDraws = []
  }

  componentDidMount() {
    const gl = initWebGL(this.canvas)

    this.gl = gl

    // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST)
    // Near things obscure far things
    gl.depthFunc(gl.LEQUAL)
    // Clear the color as well as the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    initBuffers(gl)

    this.draw()
  }

  getChildContext() {
    return { 
      gl: this.gl, 
      registerChildDraw: fn => this.registerChildDraw(fn),
      unregisterChildDraw: fn => this.unregisterChildDraw(fn),
    }
  }

  draw() {
    const gl = this.gl

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  
    // perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0)
    
    // loadIdentity()
    // mvTranslate([-0.0, 0.0, -6.0])
    
    // gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer)
    // gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    //    React.Children.forEach(this.props.children, child => child.draw && child.draw())
    each(this.childDraws, draw => draw(this.gl))

    window.requestAnimationFrame(() => this.draw())
  }

  registerChildDraw(fn) {
    this.childDraws.push(fn)
  }

  unregisterChildDraw(fn) {
    pull(this.childDraws, fn)
  }

  render() {
    return (
      <div>
        <canvas width={640} height={480} ref={canvas => { this.canvas = canvas }} />
        {this.gl && this.props.children}
      </div>
    )
  }
}

Scene.childContextTypes = {
  gl: React.PropTypes.object,
  registerChildDraw: React.PropTypes.func,
  unregisterChildDraw: React.PropTypes.func.isRequired
}
