attribute vec3 aVertexPosition;
attribute vec3 aNormal;

uniform mat4 camera;
uniform mat4 transformation;
varying highp vec4 position;
varying highp vec4 normal;


void main(void) {
  position = camera * transformation * vec4(aVertexPosition, 1.0);
  normal = vec4(aNormal, 1.0);
  
  gl_Position = position;
}
