import React, { Component } from 'react'

import ShaderProgram from '../gl/ShaderProgram'
import VertexBufferObject from '../gl/VertexBufferObject'

import fragment from 'shaders/audio_smoother/fragment.glsl'
import vertex from 'shaders/audio_smoother/vertex.glsl'

const SMOOTHED_SIZE = Math.pow(2, 10)

const squareVerteces = new Float32Array([
  -1, -1,
  1, -1,
  1, 1,
  1, 1,
  -1, 1,
  -1, -1
])


export default class AudioSmoother {
  constructor(gl) {
    this.shaderProgram = new ShaderProgram(gl, vertex, fragment)
    this.vertexPositionAttribute = this.shaderProgram.getAttribute('aVertexPosition')
    gl.enableVertexAttribArray(this.vertexPositionAttribute)

    this.vertexBuffer = new VertexBufferObject(gl)
    this.vertexBuffer.update(squareVerteces)

    this.initTextureFramebuffer(gl)
  }

  initTextureFramebuffer(gl) {
    this.frameBuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

    this.texColorBuffer = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.texColorBuffer)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SMOOTHED_SIZE, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texColorBuffer, 0)

    this.renderBuffer = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.renderBuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, SMOOTHED_SIZE, 1)
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.renderBuffer)

    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

  }

  draw(gl, analyzerTexture) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer)

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.viewport(0, 0, SMOOTHED_SIZE, 1)

    this.drawTexture(gl, analyzerTexture)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  getTexture() { return this.texColorBuffer }
    
  drawTexture(gl, analyzerTexture) {
    this.shaderProgram.bind()

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, analyzerTexture)
    gl.uniform1i(this.shaderProgram.getUniform('uSampler'), 0)

    this.vertexBuffer.bind()
    gl.vertexAttribPointer(this.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, 6)

    gl.bindTexture(gl.TEXTURE_2D, this.texColorBuffer)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }
}
