#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: snoise = require('./lib/snoise')
#pragma glslify: noise = require('./lib/noise')

varying highp vec4 position;

uniform float u_time;
// audio inputs
uniform vec4 uDistance;
uniform sampler2D uSampler;

float soundOrigin = 0.;

vec2 resolution = vec2(1., 1.);

float maxDistance = 30.;

vec3 background = vec3(71., 14., 178.) / 255.;
vec3 strong = vec3(255., 244., 40.) / 255.;

void main() {
  vec4 current = texture2D(uSampler, vec2(1., 0.5));

  vec3 full = vec3(255.0, 51.0, 204.0) / 255.0;
  vec3 second = vec3(204., 102., 51.) / 255.;

  vec3 move = vec3(0., -uDistance[0] / 2., 0.);
  vec3 adjustedPosition = position.xyz + move;

  adjustedPosition = adjustedPosition + snoise(adjustedPosition / 10.);
  float dist = abs(position.z  - soundOrigin);

  vec3 direction = normalize(vec3(position) - soundOrigin);

  float distNormalized = smoothstep(0.0, maxDistance, dist);

  vec4 firstData = texture2D(uSampler, vec2(1. - distNormalized, 0.5));

  //vec3 color = mix(full, second, dist);

  float strength = 1. - smoothstep(0., 2., position.y + noise(position.xy) * 2.);

  vec3 color = mix(background, strong, firstData[0]);

  gl_FragColor = vec4(color, 1.0);
}
