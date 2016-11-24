attribute vec3 aVertexPosition;

uniform mat4 camera;
uniform mat4 transformation;
varying highp vec4 position;

void main(void) {
  position = camera * transformation * vec4(aVertexPosition, 1.0);
  gl_Position = position;
}
