

export const initShaders = (gl, vertex, fragment) => {

  const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition')
  gl.enableVertexAttribArray(vertexPositionAttribute)

  return shaderProgram
}
