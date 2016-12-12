#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: snoise = require('./lib/snoise') 
#pragma glslify: rgb2hsb = require('./lib/rgb2hsb') 
#pragma glslify: hsb2rgb = require('./lib/hsb2rgb') 

varying highp vec4 position;
varying highp vec4 center;

uniform float u_time;
// audio inputs
uniform sampler2D uSampler;
uniform vec4 uDistance;

float getStrength(float z) {
  return sin(z) * sin(z * 4.0 - u_time * 4.0);
}

float getFadeOut(float x) {
  return sin(smoothstep(2.0, 1.7, abs(x)));
}

vec4 soundOrigin = vec4(0.0, 0.25, 0.0, 1.0);

float soundDistance = 100.;
float maxDistance = 20.;

vec3 full = vec3(255.0, 51.0, 204.0) / 255.0;
vec3 second = vec3(204., 102., 51.) / 255.;

void main() {
  vec4 current = texture2D(uSampler, vec2(0.1, 0.5));

  vec4 directionToPerimeter = vec4(normalize(position.xy - center.xy), 0., 0.);
  vec4 positionToUse = position + directionToPerimeter * .1 + snoise(position.xyz);

  float dist = distance(soundOrigin, positionToUse);

  vec4 direction = normalize(positionToUse - soundOrigin);

  float distNormalized = smoothstep(0.0, soundDistance, dist);

  vec4 currentSound = texture2D(uSampler, vec2(1. - distNormalized, 0.5));

  vec3 colorA = mix(full, second, abs(sin(u_time)));
  vec3 colorB = mix(second, full, abs(sin(u_time)));

  vec3 color = mix(colorA, colorB, abs(snoise(positionToUse.xyz + uDistance[0] * 10.)));

  float res = smoothstep(0.0, 0.1, currentSound[0]);

  gl_FragColor = vec4(color * res, 1.0);
}

