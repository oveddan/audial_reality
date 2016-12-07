attribute vec3 aVertexPosition;
attribute vec3 aNormal;
attribute vec2 aUv;

uniform mat4 uCamera;
uniform mat4 uTransformation;
uniform vec3 uCenter;
varying highp vec4 position;
varying highp vec4 center;
varying highp vec3 normal;
varying highp vec2 uv;


void main(void) {
  position = uCamera * uTransformation * vec4(aVertexPosition, 1.0);
  center = uCamera * uTransformation * vec4(uCenter, 1.0);
  normal = normalize(vec3(uCamera * uTransformation * vec4(aNormal, 1.0)));
  uv = aUv;

  /* vec4 rayOrigin = vec4(position.x, position.y, -1., 1.); */
  /* vec3 rayDirection = rayOrigin - position; */
  
  gl_Position = position;
}
