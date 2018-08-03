#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: noise = require('./lib/noise') 
#pragma glslify: snoise = require('./lib/snoise') 
#pragma glslify: rotate2d = require('./lib/rotate2d') 
#pragma glslify: random2 = require('./lib/random2') 
/* #pragma glslify: rsg2hsb = require('./lib/rgb2hsb')  */
/* #pragma glslify: hsb2rgb = require('./lib/hsb2rgb ')  */

varying highp vec4 position;
varying highp vec4 center;

uniform float u_time;
// audio inputs
uniform sampler2D uSampler;
uniform sampler2D uSmoothSampler;
uniform vec4 uDistance;
uniform vec4 uCurrent;

float getStrength(float z) {
  return sin(z) * sin(z * 4.0 - u_time * 4.0);
}

float getFadeOut(float x) {
  return sin(smoothstep(2.0, 1.7, abs(x)));
}

vec3 full = vec3(255.0, 51.0, 204.0) / 255.0;
vec3 second = vec3(204., 102., 51.) / 255.;

float toZAngle(vec2 position) {
  return (atan(dot(normalize(position.xy), vec2(1., 0.))) + 1.) / 2.;
}

vec2 toSphericalPoint(vec2 p) {
  return vec2(toZAngle(p), p[1]);
}

float cellularNoise(vec3 position) {
  float angle = toZAngle(position.xy);

  vec2 point = vec2(angle, position.z / 9.);//vec2(angle, abs(scaled.z)) * 50.;

  // Tile the space
  // source: https://thebookofshaders.com/12/
  vec2 i_st = floor(point);
  vec2 f_st = fract(point);

  float m_dist = 1.;  // minimun distance

  float radius = length(position.xy);
  
  for (int y= -1; y <= 1; y++) {
      for (int x= -1; x <= 1; x++) {
          // Neighbor place in the grid
        vec2 neighbor = vec2(x, y);
        
        // Random position from current + neighbor place in the grid
        vec2 point = random2(i_st + neighbor);

        // Vector between the pixel and the point
        vec2 diff = neighbor + point - f_st;
        
        // Distance to the point
        float dist = length(diff);

        // Keep the closer distance
        m_dist = min(m_dist, dist);
      }
  }

  return m_dist;
}

float stage = sin(uDistance.a / 250.);

vec4 stages = vec4(-1., -5., 0., .5);

vec3 cellularPoint(vec3 point) {
  vec3 directionToOutside = normalize(vec3(point.x, point.y, 0.));
  float cellularStrength = smoothstep(-.5, 0., stage);

  float height = 0.;

  height += cellularStrength * cellularNoise(point);

  return point + (height * directionToOutside);
}

vec3 getPointAtChange(vec3 point, vec3 change) {
  vec3 changed = point + change;

  return cellularPoint(changed);
}

vec3 getNormal(vec3 point) {
  float change = 1.;

  vec3 changedZ = cellularPoint(point + vec3(0., 0., change));
  vec2 rotated = rotate2d(point.xy, -0.1);
  vec3 changedX = cellularPoint(vec3(rotated.x, rotated.y, point.z));

  vec3 dz = changedZ - point;
  vec3 dx = changedX - point;

  return normalize(cross(dz, dx));
}

vec3 colorA = vec3(178., 11., 145.) / 255.;
vec3 colorB = vec3(255., 213., 17.) / 255.;
vec3 colorC = vec3(255., 41., 213.) / 255.;
vec3 colorD = vec3(71., 204., 199.) / 255.;
vec3 colorE = vec3(56., 178., 174.) / 255.;

vec3 diffuse(vec3 i, vec3 kd, vec3 normal, vec3 lightDir){
  return i * kd * max(0., dot(normal, lightDir));
}

vec3 specular(vec3 i, vec3 ks, vec3 normal, vec3 lightDir, vec3 viewDir){
  vec3 h = normalize(lightDir + viewDir);
  return i * ks * pow(max(0., dot(normal, h)), 2.);
}

void main() {
  vec4 current = texture2D(uSampler, vec2(0.1, 0.5));

  float change = uDistance.a / 2.;
  vec3 movedPosition = position.xyz + vec3(0., 0., change);
  movedPosition += vec3(sin(change / 100.) * 10., cos(change / 100.) * 10., 0.);
  /* float rotation = smoothstep(0.9, 1., abs(sin(position.b / 100.))); */
  /* movedPosition = rotate3d(movedPosition, rotation, 2); */
  vec3 normal = getNormal(movedPosition.xyz);
  vec3 point = cellularPoint(movedPosition.xyz);


  vec2 positionForNoise = vec2(toZAngle(position.xy) + uDistance.a, position.z / 200.);



  vec3 center = vec3(0., 0., position.z);
//  vec3 glowLightPosition = center + snoise(position.xyz) / 10.;

 // float lightVisible = smoothstep(0.8, 1., abs(snoise(position.xyz / 50. + vec3(0., 0., -uDistance.r / 100.))));

//  float soundAtLight = getSoundAt(glowLightPosition.z).a;

  //vec3 lightColor = vec3(0.8);//mix(colorA, colorC, soundAtLight);

  //float strength = lightVisible;

  /* vec3 glowLightDirection = normalize(glowLightPosition - point); */
  /* vec3 shading = strength*dot(normal, glowLightDirection) * lightColor;//+ vec3(0.05); */

  vec3 movement = vec3(0., 0., change);
  vec3 currentPosition = vec3(0.) + movement;
  vec3 light = movement + vec3(0., 0., 0.);// + vec3(0., 0., -10.);

  vec3 lightColor = vec3(1.);

  vec3 color1 = mix(colorA, colorB, abs(sin(uDistance.g / 100.)));
  vec3 color2 = mix(colorC, colorE, abs(sin(uDistance.r / 100.)));


  float dist = distance(currentPosition.z, point.z);
  float soundDistance = 400.;

  float distNormalized = smoothstep(0.0, soundDistance, dist);
  vec4 soundAtDepth = texture2D(uSampler, vec2(1. - distNormalized, 0.5));

  float noisyChange = ((snoise(movedPosition.xyz / 20. + sin(uDistance.r / 10.) / 100.) + 1.) / 2.);

  vec4 currentSound = texture2D(uSmoothSampler, vec2(0., .5));

  vec3 kColor = mix(color1, color2, noisyChange * currentSound.r);



  float di = max(.2, smoothstep(0., .7, currentSound.r));//clamp(0.3 + uCurrent.b * abs(stage), .05, 1.);
  float ds = max(.2, smoothstep(0., .7, currentSound.b));//clamp(0.3 + uCurrent.r * abs(stage), .05, 1.);

  vec3 lightDir = normalize(light - point);
  vec3 viewDir = normalize(currentPosition - point);
  vec3 shading;

  /* vec3 middleLight = currentPosition + vec3(0., 0., -10.); */
  /* vec3 middleDir = normalize(middleLight - point); */
  /* vec3 flashLight = smoothstep(-.5, 1., stage) * dot(middleDir, normal) * vec3(1.) * texture2D(uSmoothSampler, vec2(0., 0.5)).a; */

  shading += diffuse(lightColor * di, kColor, normal, lightDir);
  shading += specular(lightColor * ds, kColor, normal, lightDir, viewDir);

  gl_FragColor = vec4(shading, 1.0);
}

