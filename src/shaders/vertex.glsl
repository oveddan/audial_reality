attribute vec3 aVertexPosition;

uniform mat4 camera;
uniform mat4 transformation;
//uniform mat4 uMVMatrix;
//uniform mat4 uPMatrix;

void main(void) {
  gl_Position = camera * transformation * vec4(aVertexPosition, 1.0);
}
