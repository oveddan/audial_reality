export default class TextureBufferObject {
  constructor(gl) {
    this.gl = gl
    this.id = gl.createTexture()
  }

  update(image) {
    const gl = this.gl
    this.bind()
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
    gl.generateMipmap(gl.TEXTURE_2D)
    gl.bindTexture(gl.TEXTURE_2D, null)
  }

  bind() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id)
  }
}
