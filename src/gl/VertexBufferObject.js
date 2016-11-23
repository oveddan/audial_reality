export default class VertexBufferObject {
  constructor(gl) {
    this.gl = gl
    this.id = gl.createBuffer()
  }

  bind() {
    const gl = this.gl
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id)
  }

  update(data) {
    const gl = this.gl
    this.bind()
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
  }

}
