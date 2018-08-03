#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: snoise = require('./lib/snoise') 
#pragma glslify: noise = require('./lib/noise') 
#pragma glslify: rotate2d = require('./lib/rotate2d') 

varying highp vec4 position;

uniform float u_time;
// audio inputs
uniform vec4 uDistance;
uniform sampler2D uSmoothSampler;

float rotatedAmount(float x) {
  return x * 3.14;
}

void main() {
  vec4 current = texture2D(uSmoothSampler, vec2(0., 0.5));

  vec3 full = vec3(255.0, 51.0, 204.0) / 255.0;
  vec3 second = vec3(204., 102., 51.) / 255.;


  vec2 pos = position.xy;

  float n = noise(pos.xy * 2. + vec2(uDistance.a / 10., uDistance.a / 100. * 4.));
  float rotateAmount = (n * sin(uDistance.a / 1000.) + cos(uDistance.a / 500.));
  float height = rotatedAmount(rotate2d(pos.xy, rotateAmount).x * 2.);


  vec3 color = mix(full, second, height);

  float strength = 0.;
  
  vec4 dist = abs(sin(uDistance / 1000.));
  strength += step(2./3., height) * current.r;
  strength += step(1./3., height) * (step(-2./3., -height)) * current.g;
  strength += (1.-step(1./3., height)) * current.b;

  strength = clamp(strength, 0., 1.);

  /* float distNormalized = smoothstep(0.0, 50.0, distance(position.xy, vec2(2.5, -2.5))); */
  /* vec4 firstData = texture2D(uSmoothSampler, vec2(1. - distNormalized, 0.5)); */

  /* strength -= firstData.a; */

  gl_FragColor = vec4(color * strength, 1.0);
}
