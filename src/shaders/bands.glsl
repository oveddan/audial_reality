#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: noise = require('./lib/noise') 

varying highp vec4 position;
varying highp vec4 center;

uniform float u_time;
// audio inputs
uniform sampler2D uSampler;
uniform sampler2D uSmoothSampler;
uniform vec4 uDistance;
uniform vec4 uCurrent;

vec2 dimensions = vec2(100., 100.);

float sections = 3.;
float start = -1.;

vec2 tile(vec2 _st, float _zoom){
  _st *= _zoom;
  return fract(_st);
}

float numBands = 3.;

float numSections = 3.;

float getSection(float x) {
  return floor(x * numSections);
}

float getSubSection(float x) {
  return floor(mod(x * 9., 3.));
}

float getSubSubSection(float x) {
  return floor(mod(x * 18., 2.));
}

int getBand(float x) {
  float result = floor(mod(x*9., 3.0));

  return int(result);
}

float toBandStrength(vec4 bands, float fromLeft) {
  int band = getBand(fromLeft);
  if (band == 0)
    return bands[0];
  else if (band == 1)
    return bands[1];
  else
    return bands[2];
}

vec3 bandColor1 = vec3(105., 235., 208.) / 255.;
vec3 bandColor2 = vec3(45., 225., 252.) / 255.;
vec3 bandColor3 = vec3(42., 252., 152.) / 255.;

vec3 getBandColor(float fromLeft) {
  int band = getBand(fromLeft);

  if (band == 0)
    return bandColor1;
  else if (band == 1)
    return bandColor2;
  else
    return bandColor3;
}

void main() {
  float sectionLength = 2./sections;
  vec2 actualPosition = position.xy / dimensions;

  float fromLeft = 1.0 - (1.0 - actualPosition.x) / 2.;
  float fromBottom = 1.0 - (1.0 - actualPosition.y) / 2.;

  float section = getSection(fromLeft);
  float subSection = getSubSection(fromLeft);

//  float section = step(0.5, fract(actualPosition.x));

  float bandStrength = 0.;

  if (section == 0.)
    bandStrength = toBandStrength(texture2D(uSmoothSampler, vec2(.000001, .5)), fromLeft);
  
  if (section == 1.) {
    float n = noise(actualPosition * 100. + sin(u_time / 100.));
    bandStrength = toBandStrength(fract(uDistance / 1000.), fromLeft);
    float noisyFromBottom = fromBottom + n * toBandStrength(uCurrent, fromLeft) / 100.;
    bandStrength = 1.-step(bandStrength + 0.02, fromBottom) - (1.-step(bandStrength - 0.02, noisyFromBottom));
  }

  if (section == 2.) {
    float subSubSection = getSubSubSection(fromLeft);
    vec4 story;

    if (subSubSection == 0.)
      story = texture2D(uSampler, vec2(1.-fromBottom, .5));
    else
      story = texture2D(uSmoothSampler, vec2(1.-fromBottom, .5));

    bandStrength = toBandStrength(story, fromLeft);
  }  

  vec3 color = getBandColor(fromLeft);

  gl_FragColor = vec4(color * bandStrength, 1.0);
}

