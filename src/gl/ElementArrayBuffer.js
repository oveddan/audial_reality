export default class ElementArrayBuffer {
  constructor(gl) {
    this.gl = gl

    this.id = gl.createBuffer()
  }
  bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.id)
  }
  update(data) {
    const gl = this.gl
    this.bind()
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW)
  }
}
