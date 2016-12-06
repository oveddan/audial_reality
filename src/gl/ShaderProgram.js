const getShader = (gl, source, type) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)

  // Compile the shader program
  gl.compileShader(shader)

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`)
    gl.deleteShader(shader)
    return null
  }

  return shader
}

export default class ShaderProgram {
  constructor(gl, vertex, fragment) {
    this.gl = gl
    // Create the shader program

    this.vertexShader = getShader(gl, vertex, gl.VERTEX_SHADER)
    this.fragmentShader = getShader(gl, fragment, gl.FRAGMENT_SHADER)
    const id = this.id = gl.createProgram()
    gl.attachShader(id, this.vertexShader)
    gl.attachShader(id, this.fragmentShader)
    gl.linkProgram(id)

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(id, gl.LINK_STATUS)) {
      alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(id)}`)
    }

    this.bind(gl)
  }

  bind() {
    this.gl.useProgram(this.id)
  }

  free() {
    this.gl.detachShader(this.id, this.vertexShader)
    this.gl.detachShader(this.id, this.fragmentShader)
    this.gl.deleteShader(this.vertexShader)
    this.gl.deleteShader(this.fragmentShader)
  }

  getAttribute(name) {
    return this.gl.getAttribLocation(this.id, name)
  }

  getUniform(name) {
    return this.gl.getUniformLocation(this.id, name)
  }
}
