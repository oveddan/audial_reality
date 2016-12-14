attribute vec3 aVertexPosition;
//attribute vec3 aNormal;
//attribute vec2 aUv;

uniform mat4 uCamera;
uniform mat4 uCameraTransform;
uniform mat4 uTransformation;
uniform vec3 uLight;
varying highp vec4 position;
varying highp vec4 center;
//varying highp vec3 normal;
varying highp vec2 uv;
varying highp vec4 light;

// objects always start at center and are translated
const vec3 cCenter = vec3(0.);


void main(void) {
  position = uCamera * uCameraTransform * uTransformation * vec4(aVertexPosition, 1.0);
  light = uCamera * uCameraTransform * uTransformation * vec4(uLight, 1.0);
  center = uCamera * uCameraTransform * uTransformation * vec4(cCenter, 1.0);
//  normal = normalize(vec3(uCamera * uTransformation * vec4(aNormal, 1.0)));
//  uv = aUv;

  /* vec4 rayOrigin = vec4(position.x, position.y, -1., 1.); */
  /* vec3 rayDirection = rayOrigin - position; */

  gl_Position = position;
}
