import React, { Component } from 'react'
import ShaderProgram from '../gl/ShaderProgram'
import { loadObjectGeometry } from '../lib/objectLoader'
import ObjectGeometryBuffers from '../gl/ObjectGeometryBuffers'
import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/object.glsl'

import { vec3, mat4 } from 'gl-matrix'

const scale = 0.05

export default class MeshFromText extends Component {
  componentDidMount() {
    this.transformation = mat4.create()
    mat4.translate(this.transformation, this.transformation, vec3.fromValues(0, 0, 0))
    mat4.scale(this.transformation, this.transformation, vec3.fromValues(scale, scale, scale))

    this.draw = this.draw.bind(this)
    this.context.registerChildDraw(this.draw)

    const gl = this.context.gl
    const objectGeometry = loadObjectGeometry(this.props.mesh)

    this.shaderProgram = new ShaderProgram(gl, vertex, fragment)

    this.positionAttribute = this.shaderProgram.getAttribute('aVertexPosition')
    gl.enableVertexAttribArray(this.positionAttribute)

    this.normalAttribute = this.shaderProgram.getAttribute('aNormal')
    gl.enableVertexAttribArray(this.normalAttribute)

    this.buffers = new ObjectGeometryBuffers(gl)
    this.buffers.update(objectGeometry)

    this.setState({
      loaded:true
    })
  }

  componentWillUnmount() {
    this.context.unregisterChildDraw(this.draw)
  }

  draw(gl) {
    this.shaderProgram.bind()

    const cameraUniform = this.shaderProgram.getUniform('camera')
    gl.uniformMatrix4fv(cameraUniform, false, this.props.camera)

    const transformUniform = this.shaderProgram.getUniform('transformation')
    gl.uniformMatrix4fv(transformUniform, false, this.transformation)

    this.buffers.vertexBuffer.bind()
    gl.vertexAttribPointer(this.positionAttribute, 3, gl.FLOAT, false, 0, 0)

    this.buffers.normalBuffer.bind()
    gl.vertexAttribPointer(this.normalAttribute, 3, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, this.buffers.numVerteces)
  }

  render() { return null }
}

MeshFromText.contextTypes = {
  gl: React.PropTypes.object.isRequired,
  registerChildDraw: React.PropTypes.func.isRequired,
  unregisterChildDraw: React.PropTypes.func.isRequired
}
