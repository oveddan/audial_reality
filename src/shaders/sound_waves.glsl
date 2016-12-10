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

float getStrength(float z) {
  return sin(z) * sin(z * 4.0 - u_time * 4.0);
}

float getFadeOut(float x) {
  return sin(smoothstep(2.0, 1.7, abs(x)));
}


vec3 soundOrigin = vec3(0.0, 0.25, 0.0);

void main() {
  vec4 current = texture2D(uSampler, vec2(0.1, 0.5));

  vec3 full = vec3(255.0, 51.0, 204.0) / 255.0;
  vec3 second = vec3(204., 102., 51.) / 255.;

  float dist = distance(soundOrigin, position.xyz * snoise(position.xyz));

  vec3 direction = normalize(vec3(position) - soundOrigin);

  float distNormalized = smoothstep(0.0, 10.0, dist);

  vec4 firstData = texture2D(uSampler, vec2(1. - distNormalized, 0.5));

  vec3 color = mix(full, second, dist);


  float res = smoothstep(0.0, 0.1, firstData[0]);

  gl_FragColor = vec4(color * res, 1.0);
}
