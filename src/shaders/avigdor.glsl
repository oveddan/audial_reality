#ifdef GL_ES
precision mediump float;
#endif

varying highp vec4 position;
varying highp vec4 center;
uniform float u_time;
// audio inputs
uniform sampler2D uSampler;
uniform vec4 uDistance;


float soundDistance = 4.;
float maxDistance = 20.;

vec3 full = vec3(255.0, 51.0, 204.0) / 255.0;
vec3 second = vec3(204., 102., 51.) / 255.;

vec4 soundOrigin = vec4(0.0, 0., 0.0, 5.0);

void main() {
  vec4 current = texture2D(uSampler, vec2(0.1, 0.5));

  float dist = distance(vec2(0.0, 0.0), sin(position.xy*max(-5., min(5., tan(u_time/20.)))+5.));


  float distNormalized = smoothstep(0.0, soundDistance, dist);


  vec4 currentSound = texture2D(uSampler, vec2(1. - distNormalized, 0.5));

  gl_FragColor = vec4(currentSound.xyz, 1.0);
}
