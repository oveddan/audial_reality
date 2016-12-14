#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: noise = require('./lib/noise')
#pragma glslify: rgb2hsb = require('./lib/rgb2hsb') 
#pragma glslify: hsb2rgb = require('./lib/hsb2rgb') 

varying highp vec4 position;

uniform float u_time;
// audio inputs
uniform vec4 uDistance;
uniform sampler2D uSampler;

vec2 resolution = vec2(1., 1.);

// palette from:
// http://colorpalettes.net/color-palette-2605/
vec3 background = vec3(71., 14., 178.) / 255.;
vec3 strong = vec3(255., 244., 40.) / 255.;

vec3 deep = vec3(53., 110., 110.) / 255.;
vec3 shallower = vec3(121., 175., 181.) / 255.;
vec3 foam = vec3(199., 217., 231.) / 255.;
vec3 darkFoam = vec3(193., 199., 222.) / 255.;
vec3 chill = vec3(125., 154., 186.) / 255.;

vec3 sunPosition = vec3(100., 10., -500.);

vec3 lightColor = vec3(248.,189.,25.); 

vec3 normal = vec3(0., 1., 0.);

vec3 soundDirection = vec3(1., 0., 0.);

float soundOrigin = -1000.;
float maxDistance = 2000.;

vec3 upDirection = vec3(0., 1., 0.);

vec4 getGradientAt(float time) {
  float interval = 0.01;
  float start = 1.-time;
  vec4 previous = texture2D(uSampler, vec2(start + interval, 0.5));
  vec4 next = texture2D(uSampler, vec2(start - interval, 0.5));

  return (next - previous) / (interval * 2.);
}

vec3 sunColor = vec3(255.,156.,103.) / 255.;
vec3 ambient = vec3(0.2);

vec3 si = vec3(1.);

float p = 2.;

vec3 specularShading(vec3 ks, vec3 viewDirection, vec3 lightDirection, vec3 normal) {
  vec3 h = normalize(viewDirection + lightDirection);

  return si * ks * pow(max(0., dot(normal, h)), p);
}

vec3 diffuseShading(vec3 kd, vec3 lightDirection, vec3 normal) {
  return si * kd * max(0., dot(normal, lightDirection));
}

// taken Seascape on shader toy:
//https://www.shadertoy.com/view/Ms2SD1
const int ITER_GEOMETRY = 3;
const int ITER_FRAGMENT = 5;
const float SEA_HEIGHT = 4.;
const float SEA_CHOPPY = 4.0;
const float SEA_SPEED = 1.;
const float SEA_FREQ = 0.01;
float SEA_TIME = 1.0 + u_time * SEA_SPEED;
mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);

// sea
float sea_octave(vec2 uv, float choppy) {
    uv += noise(uv);        
    vec2 wv = 1.0-abs(sin(uv));
    vec2 swv = abs(cos(uv));    
    wv = mix(wv,swv,wv);
    return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
}

float map(vec3 p) {
  float freq = SEA_FREQ;
  float amp = SEA_HEIGHT;
  float choppy = SEA_CHOPPY;
  vec2 uv = p.xz; uv.x *= 0.75;
  
  float d, h = 0.0;    
  for(int i = 0; i < ITER_GEOMETRY; i++) {        
    d = sea_octave((uv+SEA_TIME)*freq,choppy);
    d += sea_octave((uv-SEA_TIME)*freq,choppy);
      h += d * amp;        
    uv *= octave_m; freq *= 1.9; amp *= 0.22;
      choppy = mix(choppy,1.0,0.2);
  }
  return 0. - h;
}


float getNoisyHeightAt(vec3 p) {
  return map(p);
  /* float peakHeight = noise(vec2((xz.x) / 20., 0.)); */

  /* float xMovement = noise(xz) * 5.; */
  /* vec2 newXz = xz + vec2(xMovement, 0.); */
  /* float turbulence = abs(noise((newXz + sin(u_time / 10.)) * 5.)) / 5.; */

  /* return peakHeight + turbulence; */
}

vec4 getNoisyPositionAt(vec4 pos) {
  return pos + vec4(0., getNoisyHeightAt(pos.xyz), 0., 0.);
}

vec3 getNormalAt(vec4 pos) {
  float change = 0.001;
  float heightC = getNoisyHeightAt(pos.xyz);
  float heightDx = getNoisyHeightAt(pos.xyz + vec3(change, 0., 0.));
  float heightDz = getNoisyHeightAt(pos.xyz + vec3(0., 0., change));

  vec3 current = vec3(0., heightC, 0.);
  vec3 b = vec3(change, heightDx, 0.);
  vec3 c = vec3(0., heightDz, change);

  vec3 dx = b - current;
  vec3 dz = c - current;

  return normalize(cross(dz, dx));
  /* vec3 x = vec3(pos.xyz + vec3(chan */

  /* vec4 current = getNoisyPositionAt(pos); */
  /* vec4 b = getNoisyPositionAt(pos + vec4(change, 0., 0., 0.)); */
  /* vec4 c = pos + vec4(0., 0., change, 0.); */

/* //  b.y = getNoisyHeightAt(b.xyz); */
  /* c.y = getNoisyHeightAt(c.xyz); */

  /* vec4 db = normalize(b - current); */
  /* vec4 dc = normalize(c - current); */

  /* [> vec4 b = getNoisyPositionAt(pos + vec4(change, 0., 0., 0.)); <] */
  /* [> vec4 dz = getNoisyPositionAt(); <] */

  /* [> vec4 xGrad = dx - current; <] */
  /* [> vec4 zGrad = dz - current; <] */

  /* return normalize(db.xyz); */
//  return normalize(cross(db.xyz, dc.xyz));
}

vec3 mixColors(vec3 a, vec3 b, float amt) {
  return mix(a, b, amt);
}


void main() {
  vec4 current = texture2D(uSampler, vec2(1., 0.5));

  vec3 normalizedPosition = position.xyz / position.w;

  vec3 full = vec3(255.0, 51.0, 204.0) / 255.0;
  vec3 second = vec3(204., 102., 51.) / 255.;

  /* vec4 movement = vec4(-uDistance.a / 10., 0., 0., 0.); */
  float traveled = uDistance.a * 2. + u_time / 2.;
  vec4 movement = vec4(0., 0., traveled, 0.);
  vec4 movedPosition = position + movement;

  vec4 noisyPosition = getNoisyPositionAt(movedPosition);
  vec3 noisyNormal = getNormalAt(movedPosition);
  
  float dist = position.x - soundOrigin;
  float distNormalized = smoothstep(0.0, maxDistance, dist);

  vec4 firstData = texture2D(uSampler, vec2(1. - distNormalized, 0.5));

  vec3 lightDirection = normalize(sunPosition - noisyPosition.xyz);

  float height = abs(position.y - noisyPosition.y);

  vec3 baseColor = mixColors(deep, foam, smoothstep(SEA_HEIGHT / 2., SEA_HEIGHT * 4., height));
  vec3 color = baseColor * ambient;

  vec3 viewDirection = normalize(vec3(0.) - noisyPosition.xyz);

  color += diffuseShading(baseColor, lightDirection, noisyNormal) + specularShading(baseColor, viewDirection, lightDirection, noisyNormal);

  gl_FragColor = vec4(color, 1.0);
}
