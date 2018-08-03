import React, { Component } from 'react'
import ShaderProgram from '../gl/ShaderProgram'
import VertexBufferObject from '../gl/VertexBufferObject'
import ElementArrayBuffer from '../gl/ElementArrayBuffer'
import shaders from 'shaders'
import geometry from 'src/geometry'
import { each, flatten } from 'lodash'

import { translation, scale, multiply, identity, transpose, rotateAll } from 'lib/matrices'

const center = new Float32Array([0, 0, 0])

const now = new Date().getTime()

export default class Mesh extends Component {
  componentWillMount() {
    const gl = this.context.gl

    const scaling = scale(this.props.scale)

    const translate = translation(this.props.position)

    const rotation = this.props.rotate ? rotateAll(this.props.rotate) : identity()

    this.transformation = multiply(multiply(translate, scaling), rotation)

    // console.log('translate:')
    // printMatrix(translate)

    // console.log('transformation:')
    // printMatrix(this.transformation)

    // console.log('camera:')
    // printMatrix(this.props.camera)

    const { geometry } = this.props

    this.shaderProgram = new ShaderProgram(gl, shaders.vertex, this.props.fragmentShader)
    this.vertexPositionAttribute = this.shaderProgram.getAttribute('aVertexPosition')
    gl.enableVertexAttribArray(this.vertexPositionAttribute)

    this.vertexBuffer = new VertexBufferObject(gl)
    this.vertexBuffer.update(flatten(geometry.verteces))

    // this.vertexNormalAttribute = this.shaderProgram.getAttribute('aNormal')
    // gl.enableVertexAttribArray(this.vertexNormalAttribute)

    // this.vertexNormalBuffer = new VertexBufferObject(gl)
    // this.vertexNormalBuffer.update(flatten(geometry.vertexNormals))

    this.elementArrayBuffer = new ElementArrayBuffer(gl)
    this.elementArrayBuffer.update(geometry.faces)

    this.uniforms = {
      cameraTransform: this.shaderProgram.getUniform('uCameraTransform'),
      camera: this.shaderProgram.getUniform('uCamera'),
      transform: this.shaderProgram.getUniform('uTransformation'),
      current: this.shaderProgram.getUniform('uCurrent'),
      distance: this.shaderProgram.getUniform('uDistance'),
      time: this.shaderProgram.getUniform('u_time'),
      sampler: this.shaderProgram.getUniform('uSampler'),
      smoothSampler: this.shaderProgram.getUniform('uSmoothSampler'),
      uAspect: this.shaderProgram.getUniform('uAspect')
    }

    this.draw = this.draw.bind(this)
    this.context.registerChildDraw(this.draw)
  }

  componentWillUnmount() {
    this.vertexBuffer.free()
    this.elementArrayBuffer.free()
    this.shaderProgram.free()
    this.context.unregisterChildDraw(this.draw)
  }

  draw(gl) {
    this.shaderProgram.bind()

    const uniforms = this.uniforms

    gl.uniformMatrix4fv(uniforms.cameraTransform, false, transpose(this.props.cameraTransform))
    gl.uniformMatrix4fv(uniforms.camera, false, transpose(this.props.camera.matrix()))
    gl.uniformMatrix4fv(uniforms.transform, false, transpose(this.transformation))
    gl.uniform1f(uniforms.uAspect, this.props.width / this.props.height)

    const time = Number(new Date().getTime() - now)

    gl.uniform1f(uniforms.time, time / 100)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.props.analyzer.getTexture())
    gl.uniform1i(uniforms.sampler, 0)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.props.analyzer.getSmoothTexture())
    gl.uniform1i(uniforms.smoothSampler, 1)


    // gl.activeTexture(gl.TEXTURE1)
    // gl.bindTexture(gl.TEXTURE_2D, this.props.analyzer.getSmoothTexture())
    // gl.uniform1i(uniforms.smoothSampler, 1)

    each(this.props.uniforms, ({ type, value }, key) => {
      gl[type](this.shaderProgram.getUniform(key), value)
    })

    gl.uniform4fv(uniforms.distance, this.props.analyzer.getDistanceByBand())
    gl.uniform4fv(uniforms.current, this.props.analyzer.getBands())

    this.vertexBuffer.bind()
    gl.vertexAttribPointer(this.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

    // this.vertexNormalBuffer.bind()
    // gl.vertexAttribPointer(this.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0)

    this.elementArrayBuffer.bind()
    gl.drawElements(gl.TRIANGLES, this.props.geometry.faces.length, gl.UNSIGNED_SHORT, 0)
  }

  render() { return null }
}

Mesh.defaultProps = {
  cameraTransform: identity(),
  geometry: geometry.getPlane()
}

Mesh.contextTypes = {
  gl: React.PropTypes.object.isRequired,
  registerChildDraw: React.PropTypes.func.isRequired,
  unregisterChildDraw: React.PropTypes.func.isRequired
}
