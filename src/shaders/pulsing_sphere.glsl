#ifdef GL_ES
precision mediump float;
#endif

varying highp vec4 position;
varying highp vec4 center;

uniform float u_time;
uniform float uAspect;
uniform sampler2D uSmoothSampler;
uniform vec4 uDistance;

#pragma glslify: snoise = require('./lib/snoise') 
#pragma glslify: noise = require('./lib/noise') 

vec3 full = vec3(162., 250., 163.) / 255.0;
vec3 second = vec3(226., 239, 112.) / 255.;
vec3 third = vec3(112., 228., 239.) / 255.;

vec3 toSphericalCoordinates(vec3 position) {
  return normalize(position - center.xyz);
}

float getNoisyDepth(vec3 position) {
  vec3 spherical = toSphericalCoordinates(position);

  return -abs(snoise(spherical * 50. + vec3(uDistance.a / 100.))) * .5;
}

vec3 getNoisyPosition(vec3 position) {
  return position + vec3(0., 0., getNoisyDepth(position));
}

vec3 getNoisyNormal(vec3 position) {
  float radius = distance(position, center.xyz);
  float change = .001;

  vec3 spherical = toSphericalCoordinates(position);

  vec3 newX = radius * (spherical + vec3(change, 0., 0.));
  vec3 newY = radius * (spherical + vec3(0., change, 0.));

  vec3 noisyY = getNoisyPosition(newY);
  vec3 noisyX = getNoisyPosition(newX);

  vec3 current = getNoisyPosition(position);
  vec3 dx = noisyX - current;
  vec3 dy = noisyY - current;

  return normalize(cross(dx, dy));
}

vec3 diffuse(vec3 i, vec3 kd, vec3 normal, vec3 lightDir){
  return i * kd * max(0., dot(normal, lightDir));
}

vec3 specular(vec3 i, vec3 ks, vec3 normal, vec3 lightDir, vec3 viewDir){
  vec3 h = normalize(lightDir + viewDir);
  return i * ks * pow(max(0., dot(normal, h)), 5.);
}

vec3 colorA = vec3(255.0, 51.0, 204.0) / 255.0;
vec3 colorB = vec3(74., 255., 40.) / 255.;
vec3 colorC = vec3(11., 204., 202.) / 255.;

vec3 soundOrigin = vec3(-1., 1., 0);

void main() {
  vec4 current = texture2D(uSmoothSampler, vec2(1., 0.5));

  vec3 pos = position.xyz * vec3(uAspect, 1., 1.);

  vec2 vel = vec2(uDistance.g / 10.);

  vec3 normal = getNoisyNormal(pos);
  pos = getNoisyPosition(pos);

  vec3 lightDir = normalize(vec3(0.) - pos);
  vec3 viewDir = normalize(vec3(0.) - pos);

  vec3 pixel = vec3(0.);

  vec3 scaledDist = uDistance.rgb / 50.;

  float lightRadius = 3.;
  vec3 diffusePos = vec3(0., 0., -2.) + lightRadius * normalize(vec3(
    noise(vec2(scaledDist.r, center.z)), 
    noise(vec2(scaledDist.g, center.z)), 
    noise(vec2(scaledDist.b, center.z))
  ));
  vec3 specularPos = vec3(0., 0., -2.) + vec3(0., 0., -2.) + 8. * normalize(vec3(
    noise(vec2(0., scaledDist.r)), 
    noise(vec2(0., scaledDist.g)), 
    noise(vec2(0., scaledDist.b))
  ));

  vec3 origin = soundOrigin + vec3(noise(vec2(scaledDist.rg)), noise(vec2(scaledDist.gb)), 0.);

  float dist = distance(origin, pos);
  float distNormalized = smoothstep(0.0, 20., dist);
  vec4 currentSound = texture2D(uSmoothSampler, vec2(1. - distNormalized, 0.5));

  vec3 accentColor = mix(colorA, colorC, currentSound.r - currentSound.b);

  vec3 lightColor = mix(vec3(1.), accentColor, smoothstep(.5, 1., fract(max(currentSound.r, currentSound.b))));

  vec3 kd = lightColor; 
  vec3 ks = lightColor;

  vec3 sI = vec3(.5) * current.a;
  vec3 dI = vec3(.5) * current.a;

  pixel += diffuse(dI, kd, normal, normalize(diffusePos - pos));
  pixel += specular(sI, ks, normal, normalize(specularPos - pos), viewDir);
  pixel += lightColor * .1;

  gl_FragColor = vec4(pixel, 1.0);
}
