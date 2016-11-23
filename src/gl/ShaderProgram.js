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
    // Create the shader program
    const shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, getShader(gl, vertex, gl.VERTEX_SHADER))
    gl.attachShader(shaderProgram, getShader(gl, fragment, gl.FRAGMENT_SHADER))
    gl.linkProgram(shaderProgram)

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`)
    }

    this.shaderProgram = shaderProgram

    this.bind(gl)
  }

  bind(gl) {
    gl.useProgram(this.shaderProgram)
  }
}
