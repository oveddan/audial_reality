import React, { Component } from 'react'
import ShaderProgram from '../gl/ShaderProgram'
import { loadObjectGeometry } from '../lib/objectLoader'
import ObjectGeometryBuffers from '../gl/ObjectGeometryBuffers'
import TextureBufferObject from '../gl/TextureBufferObject'
import vertex from '../shaders/vertex.glsl'
import fragment from '../shaders/object.glsl'

import { translation, scale, multiply, printMatrix, transpose } from 'lib/matrices'

export default class MeshFromText extends Component {
  componentDidMount() {
    const scaling = scale(this.props.scale)
    const translate = translation(this.props.position)
    this.transformation = multiply(translate, scaling)
    
    const gl = this.context.gl
    const objectGeometry = loadObjectGeometry(this.props.mesh)

    this.shaderProgram = new ShaderProgram(gl, vertex, fragment)

    this.positionAttribute = this.shaderProgram.getAttribute('aVertexPosition')
    gl.enableVertexAttribArray(this.positionAttribute)

    this.normalAttribute = this.shaderProgram.getAttribute('aNormal')
    gl.enableVertexAttribArray(this.normalAttribute)

    this.uvAttribute = this.shaderProgram.getAttribute('aUv')
    gl.enableVertexAttribArray(this.uvAttribute)

    this.buffers = new ObjectGeometryBuffers(gl)
    this.buffers.update(objectGeometry)

    if (this.props.texture) {
      this.textureBuffer = new TextureBufferObject(gl)
      this.textureBuffer.update(this.props.texture)
    }

    this.draw = this.draw.bind(this)
    this.context.registerChildDraw(this.draw)
  }

  componentWillUnmount() {
    this.buffers.free()
    this.shaderProgram.free()
    this.textureBuffer.free()
    this.context.unregisterChildDraw(this.draw)
  }

  // componentWillReceiveProps(nextProps) {
    // const [x, y, z]= nextProps.position

    // if(nextProps.position !== this.props.position)
      // mat4.translate(this.transformation, this.transformation, vec3.fromValues(x, y, z))

    // const { scale } = this.props
    // if(nextProps.scale !== this.props.scale)
      // mat4.scale(this.transformation, this.transformation, vec3.fromValues(scale, scale, scale))
  // }

  draw(gl) {
    this.shaderProgram.bind()

    const cameraUniform = this.shaderProgram.getUniform('camera')
    gl.uniformMatrix4fv(cameraUniform, false, transpose(this.props.camera))

    const transformUniform = this.shaderProgram.getUniform('transformation')
    gl.uniformMatrix4fv(transformUniform, false, transpose(this.transformation))

    this.buffers.vertexBuffer.bind()
    gl.vertexAttribPointer(this.positionAttribute, 3, gl.FLOAT, false, 0, 0)

    this.buffers.normalBuffer.bind()
    gl.vertexAttribPointer(this.normalAttribute, 3, gl.FLOAT, false, 0, 0)

    this.buffers.uvBuffer.bind()
    gl.vertexAttribPointer(this.uvAttribute, 2, gl.FLOAT, false, 0, 0)

    if (this.textureBuffer) {
      gl.activeTexture(gl.TEXTURE0)
      this.textureBuffer.bind()
      gl.uniform1i(this.shaderProgram.getUniform('uTexture'), this.textureBuffer.id)
    }

    gl.drawArrays(gl.TRIANGLES, 0, this.buffers.numVerteces)
  }

  render() { return null }
}

MeshFromText.contextTypes = {
  gl: React.PropTypes.object.isRequired,
  registerChildDraw: React.PropTypes.func.isRequired,
  unregisterChildDraw: React.PropTypes.func.isRequired
}
