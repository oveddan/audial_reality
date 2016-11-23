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
    const id = this.id = gl.createProgram()
    gl.attachShader(id, getShader(gl, vertex, gl.VERTEX_SHADER))
    gl.attachShader(id, getShader(gl, fragment, gl.FRAGMENT_SHADER))
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

  getAttribute(name) {
    return this.gl.getAttribLocation(this.id, name)
  }
}
