import React, { Component } from 'react'
import ShaderProgram from '../gl/ShaderProgram'

import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/fragment.glsl'


export default class Cube extends Component {
  constructor(props) {
    super(props)

    this.draw = this.draw.bind(this)
  }

  componentWillMount() {
    const gl = this.context.gl

    this.squareVerticesBuffer = gl.createBuffer()

    this.shaderProgram = new ShaderProgram(gl, vertex, fragment)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer)
  
    const vertices = [
      1.0,  1.0,  0.0,
      -1.0, 1.0,  0.0,
      1.0,  -1.0, 0.0,
      -1.0, -1.0, 0.0
    ]
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    this.context.registerChildDraw(this.draw)
  }

  componentWillUnmount() {
    this.context.unregisterChildDraw(this.draw)
  }

  draw(gl) {
    console.log('drawing')
  }

  render() { return null }
}

Cube.contextTypes = {
  gl: React.PropTypes.object.isRequired,
  registerChildDraw: React.PropTypes.func.isRequired,
  unregisterChildDraw: React.PropTypes.func.isRequired
}
