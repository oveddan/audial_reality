import { mat4 } from 'gl-matrix'

const loadIdentity = () => mat4.create()

const mvTranslate = v => {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4())
}

const setMatrixUniforms = (shaderProgram) => {
  const pUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix')
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()))

  const mvUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix')
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()))
}
