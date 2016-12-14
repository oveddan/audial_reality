#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: noise = require('./lib/noise')
#pragma glslify: snoise = require('./lib/snoise')
#pragma glslify: rotate3d = require('./lib/rotate3d')

varying highp vec4 position;
varying highp vec4 light;
uniform float uAspect;
uniform vec4 uCurrent;
uniform float u_time;

uniform sampler2D uSampler;
uniform vec4 uDistance;

// palette: http://www.color-hex.com/color-palette/1143
vec3 pink = vec3(248.,189.,255.) / 255.;
vec3 lightOrange = vec3(244.,177.,140.) / 255.;
vec3 red = vec3(240.,110.,110.) / 255.;
vec3 yellow = vec3(242,221,160) / 255.;
vec3 sunColor = vec3(255.,156.,103.) / 255.;

vec3 white = vec3(1., 1., 1.);

vec3 origin = vec3(0., 0., 0.);

float baseSunSize = 0.1;

float maxDistance = 5.;

float getAngle(vec2 a, vec2 b) {
  return acos(dot(a, b));
}

float getAngle(vec2 a) {
  return getAngle(a, vec2(1., 0.));
}

vec3 getSphericalCoordinates(vec3 a, vec3 origin) {
  return normalize(a - origin);
}

float haloDist = 0.07;
float blurSun(float distFromCenter, float sunSize) {
  return 1.-smoothstep(sunSize - haloDist, sunSize + haloDist, distFromCenter);
}

vec3 sunHalo(float distFromCenter, float sunSize, vec3 skyColor) {
  float haloEdge = sunSize + haloDist;
  float haloInner = sunSize - haloDist;

  vec3 sunHalo = mix(skyColor, sunColor, (1.-smoothstep(haloInner, haloEdge, distFromCenter)));

  float shouldHalo = step(haloInner, distFromCenter) * 1.-step(haloEdge, distFromCenter);

  return sunHalo * shouldHalo + (1.-step(haloInner, distFromCenter)) * sunColor;// * shouldShow;
  /* vec3 skyBlend = red * 1.-step(haloEdge, distFromCenter); */

//  return mix(sun, red, smoothstep(haloInner, haloEdge, distFromCenter)) * (1.-step(haloEdge, distFromCenter));
}

float glowSun(float distFromCenter, float sunSize) {
  return 1.-smoothstep(0., sunSize + haloDist, distFromCenter);
}

vec3 sunGlow(float distFromCenter, float sunSize) {
  return glowSun(distFromCenter, sunSize) * vec3(0.3);
}


float cloudHeight(vec3 point, float a) {
  vec3 p = rotate3d(point, -uDistance.r / 1000., 0) * vec3(1./400., 1./100., 1./100.) + a / 4.;// getSphericalCoordinates(point, vec3(0.)) + a;
  float height = snoise(p - vec3(sin(uDistance.g / 1000.), uDistance.r / 1000., -sin(uDistance.b) / 1000.) * 2.) * 200.;// + vec3(uDistance.b / 100., -uDistance.b / 100., 0.) * 20.;

  return height;
}

vec3 cloudPosition(vec3 p, float a) {
  return vec3(p.x, p.y, cloudHeight(p, a));
}

vec3 cloudNormal(vec3 p, float a) {
  float current = cloudHeight(p, a);
  float change = .5;

  float changeX = cloudHeight(p + vec3(change, 0., 0.), a) - current;
  vec3 dx = vec3(change, 0., changeX);
  float changeY = cloudHeight(p + vec3(0., change, 0.), a) - current;
  vec3 dy = vec3(0., change, changeY);

  vec3 normal = normalize(cross(dx, dy));

  return normal;

  //float dx = cloudHeight(xy) - cloudHeight(xy + vec2(.1, 0.));
}

void main() {
  vec3 sun= light.xyz;

  vec3 normPosition = position.xyz * vec3(uAspect, 1., 1.);

  float sunSize = baseSunSize + (uCurrent.b / 20.);

  float distFromSunCenter = distance(light.xyz, normPosition);
  distFromSunCenter = distFromSunCenter / 1000.;
  float distFromSunEdge = distFromSunCenter - sunSize;
  float angle = getAngle(normalize(normPosition.xy - sun.xy));

  float n = noise(vec2(distFromSunCenter, angle));

  float storyLocation = smoothstep(0., maxDistance, distFromSunCenter);
  vec4 story = texture2D(uSampler, vec2(1.-storyLocation, .5));

  float sparkleDist = 0.5;

  float shouldPulse = 0.;//step(0.4, story.a) * (1.-smoothstep(.5, 1.5, distFromSunCenter));

  float distChange = uDistance.a / 5000.;

  float changeR = (sin(distFromSunCenter * 10.) / 10. + sin(uDistance.a / 10000.)) * uCurrent.a / 10.;

  float sunBlur = blurSun(distFromSunCenter, sunSize);

  normPosition = normPosition + story.a * 2.;

  vec3 secondaryColor = mix(pink,lightOrange, sin(uDistance.g / 100.)); 
  vec3 skyColor = mix(red, secondaryColor, smoothstep(0., 1200., abs(position.y)));
  
  float alteration = story.a;

  vec3 normal = cloudNormal(normPosition, alteration);
  vec3 lightDir = normalize(sun - cloudPosition(normPosition, alteration));
  vec3 cloudColor = mix(vec3(0.2), sunColor, uCurrent.r);
  vec3 cloud = mix(skyColor, sunColor, dot(normal, lightDir));


  float dist = smoothstep(sunSize, sunSize + sparkleDist, distFromSunCenter);

  float sparkleN = abs(noise(vec2(0., angle + uDistance.r / 100.) * 100.));

  float shouldSparkle = (1.-smoothstep(0., sparkleDist + sparkleN, dist))
      * (1.-shouldPulse)
      * step(sunSize, sunSize)
      * smoothstep(sunSize, sunSize + haloDist, distFromSunCenter);


  float glowN = noise(vec2(0., angle));

  vec3 haloFromSun = sunHalo(distFromSunCenter, sunSize, skyColor);
  vec3 sunPos = (haloFromSun + sunGlow(distFromSunCenter, sunSize)) * (1.-shouldSparkle); //+ sunGlow * vec3(0.3);// + (1.-sunBlur) * skyColor;/* + (1.-sunGlow-sunBlur) * vec3(1.)*/

  vec3 sky = cloud * (1.-shouldSparkle) * step(sunSize + haloDist, distFromSunCenter);

  vec3 sparkle = yellow * shouldSparkle;

  vec3 pulse = shouldPulse * pink 
    * step(sunSize, distFromSunCenter);

  gl_FragColor = vec4(sunPos + sky + sparkle, 1.);
}
