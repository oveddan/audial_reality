import React, { Component } from 'react'
import ShaderProgram from '../gl/ShaderProgram'
import { loadObjectGeometry } from '../lib/objectLoader'
import ObjectGeometryBuffers from '../gl/ObjectGeometryBuffers'
import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/object.glsl'

import { vec3, mat4 } from 'gl-matrix'

export default class MeshFromFile extends Component {
  componentWillMount() {
    const gl = this.context.gl

    this.transformation = mat4.create()
    mat4.translate(this.transformation, this.transformation, vec3.fromValues(0, 0, -5))

    const objectGeometry = loadObjectGeometry(this.props.path)

    this.shaderProgram = new ShaderProgram(gl, vertex, fragment)

    this.positionAttribute = this.shaderProgram.getAttribute('aVertexPosition')
    gl.enableVertexAttribArray(this.positionAttribute)

    this.buffers = new ObjectGeometryBuffers(gl)
    this.buffers.update(objectGeometry)

    this.draw = this.draw.bind(this)
    this.context.registerChildDraw(this.draw)
  }

  draw(gl) {
    this.shaderProgram.bind()
    this.buffers.bind()

    const cameraUniform = this.shaderProgram.getUniform('camera')
    gl.uniformMatrix4fv(cameraUniform, false, this.props.camera)

    const transformUniform = this.shaderProgram.getUniform('transformation')
    gl.uniformMatrix4fv(transformUniform, false, this.transformation)

    gl.vertexAttribPointer(this.positionAttribute, 3, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, this.buffers.numVerteces)
  }

  render() { return null }
}

MeshFromFile.contextTypes = {
  gl: React.PropTypes.object.isRequired,
  registerChildDraw: React.PropTypes.func.isRequired,
  unregisterChildDraw: React.PropTypes.func.isRequired
}
