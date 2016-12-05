attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 camera;
uniform mat4 transformation;
varying highp vec4 position;
varying highp vec3 normal;
varying highp vec2 uv;


void main(void) {
  position = camera * transformation * vec4(aVertexPosition, 1.0);
  normal = normalize(vec3(camera * transformation * vec4(aNormal, 1.0)));
  uv = aUv;
  
  gl_Position = position;
}
