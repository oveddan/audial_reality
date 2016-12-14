#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: noise = require('./lib/noise') 
#pragma glslify: snoise = require('./lib/snoise') 
#pragma glslify: rgb2hsb = require('./lib/rgb2hsb') 
#pragma glslify: hsb2rgb = require('./lib/hsb2rgb') 

varying highp vec4 position;
varying highp vec4 center;

uniform float u_time;
uniform float uAspect;
// audio inputs
uniform sampler2D uSmoothSampler;
uniform vec4 uDistance;


float soundDistance = 20.;

vec3 colorA = vec3(255.0, 51.0, 204.0) / 255.0;
vec3 colorB = vec3(74., 255., 40.) / 255.;
vec3 colorC = vec3(11., 204., 202.) / 255.;

void main() {
  vec4 current = texture2D(uSmoothSampler, vec2(0., 0.5));

  vec3 soundOrigin = center.xyz;

  soundOrigin = soundOrigin + vec3(noise(vec2(uDistance.g / 25., 0.)) * 5., noise(vec2(0., uDistance.b / 25.)) * 5., 0.);

  vec3 pos = position.xyz * vec3(uAspect, 1., 1.);

  float dist = distance(soundOrigin, pos);
  float distNormalized = smoothstep(0.0, soundDistance, dist);
  vec4 currentSound = texture2D(uSmoothSampler, vec2(1. - distNormalized, 0.5));

  pos += normalize(pos - soundOrigin) * snoise(pos * 5.) * currentSound.a * 2.;


  vec3 color = mix(colorA, colorB, smoothstep(-1., 0., sin(uDistance.a / 100.)));

  color = mix(colorB, colorC, smoothstep(0., 1., sin(uDistance.a / 100.)));

  color = mix(color, vec3(1.), current.b);

  color *= smoothstep(.2, 1., currentSound.a);
  
  gl_FragColor = vec4(color, 1.0);
}

