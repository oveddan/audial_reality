import React, { Component } from 'react'
import ShaderProgram from '../gl/ShaderProgram'
import VertexBufferObject from '../gl/VertexBufferObject'
import ElementArrayBuffer from '../gl/ElementArrayBuffer'
import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/sound_waves.glsl'

import { vec3, mat4 } from 'gl-matrix'

const verteces = [
  // Front face
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,
  
  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,
  
  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,
  
  // Bottom face
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,
  
  // Right face
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,
  
  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0
]

const vertexIndices = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23    // left
]

const now = new Date().getTime()

export default class Cube extends Component {
  componentWillMount() {
    const gl = this.context.gl

    this.transformation = mat4.create()
    mat4.fromScaling(this.transformation, vec3.fromValues(1.25, 0.01, 10.0))
    mat4.translate(this.transformation, this.transformation, vec3.fromValues(0, -100, 0))

    this.shaderProgram = new ShaderProgram(gl, vertex, fragment)
    this.vertexPositionAttribute = this.shaderProgram.getAttribute('aVertexPosition')
    gl.enableVertexAttribArray(this.vertexPositionAttribute)

    this.vertexBuffer = new VertexBufferObject(gl)
    this.vertexBuffer.update(verteces)

    this.elementArrayBuffer = new ElementArrayBuffer(gl)
    this.elementArrayBuffer.update(vertexIndices)
  
    this.draw = this.draw.bind(this)
    this.context.registerChildDraw(this.draw)
  }

  componentWillUnmount() {
    this.context.unregisterChildDraw(this.draw)
  }

  draw(gl) {
    this.shaderProgram.bind()
    this.vertexBuffer.bind()

    const cameraUniform = this.shaderProgram.getUniform('camera')
    gl.uniformMatrix4fv(cameraUniform, false, this.props.camera)

    const transformUniform = this.shaderProgram.getUniform('transformation')
    gl.uniformMatrix4fv(transformUniform, false, this.transformation)

    const time = Number(new Date().getTime() - now) / 1000

    const timeUniform = this.shaderProgram.getUniform('u_time')
    gl.uniform1f(timeUniform, time)

    gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

    this.elementArrayBuffer.bind()

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0)
  }

  render() { return null }
}

Cube.contextTypes = {
  gl: React.PropTypes.object.isRequired,
  registerChildDraw: React.PropTypes.func.isRequired,
  unregisterChildDraw: React.PropTypes.func.isRequired
}
