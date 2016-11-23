import React, { Component } from 'react'
import ShaderProgram from '../gl/ShaderProgram'
import VertexBufferObject from '../gl/VertexBufferObject'

import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/fragment.glsl'


export default class Cube extends Component {
  constructor(props) {
    super(props)

    this.draw = this.draw.bind(this)
  }

  componentWillMount() {
    const gl = this.context.gl


    this.shaderProgram = new ShaderProgram(gl, vertex, fragment)
    this.vertexPositionAttribute = this.shaderProgram.getAttribute('aVertexPosition')
    gl.enableVertexAttribArray(this.vertexPositionAttribute)

    const verteces = [
      0.5,  0.5,  0.0,
      -0.5, 0.5,  0.0,
      0.5,  -0.5, 0.0,
      -0.5, -0.5, 0.0
    ]

    this.vertexBuffer = new VertexBufferObject(gl)
    this.vertexBuffer.update(verteces)
  
    this.context.registerChildDraw(this.draw)
  }

  componentWillUnmount() {
    this.context.unregisterChildDraw(this.draw)
  }

  draw(gl) {
    this.shaderProgram.bind()
    this.vertexBuffer.bind()

    gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)
    //setMatrixUniforms()

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  render() { return null }
}

Cube.contextTypes = {
  gl: React.PropTypes.object.isRequired,
  registerChildDraw: React.PropTypes.func.isRequired,
  unregisterChildDraw: React.PropTypes.func.isRequired
}
