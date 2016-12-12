#ifdef GL_ES
precision mediump float;
#endif

varying highp vec4 position;
varying highp vec4 center;

uniform float u_time;
uniform sampler2D uSampler;
uniform vec4 uDistance;

#pragma glslify: snoise = require('./lib/snoise') 
#pragma glslify: noise = require('./lib/noise') 
#pragma glslify: rgb2hsb = require('./lib/rgb2hsb') 
#pragma glslify: hsb2rgb = require('./lib/hsb2rgb') 

vec3 rotate(vec3 point, float rad, int axis) {
  mat4 rotation;
  float c = cos(rad);
  float s = sin(rad);

  // x axis
  if (axis == 0) {
    rotation = mat4(
      1, 0, 0, 0,
      0, c, -s, 0,
      0, s, c, 0,
      0, 0, 0, 1
    );
  // y axis
  } else if(axis == 1) {
    rotation = mat4(
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1
    );
  // z axis
  } else {
    rotation = mat4(
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1
    );
  }

  vec4 result = rotation * vec4(point, 1.);
  return vec3(result);
}


float getA(vec3 d) {
  return dot(d, d);
}

float getB(vec3 d, vec3 e, vec3 c) {
  return 2. * dot(d, e - c);
}

float getC(vec3 e, vec3 c, float r) {
  return dot(e - c, e - c) - (r * r);
}

float getNumberOfSolutions(float A, float B, float C) {
  return (B * B) - (4. * A * C);
}

vec3 noRayHit = vec3(-1.,-1.,-1.);

vec3 getRayHit(vec3 _center, float radius, vec3 origin, vec3 direction) {
  float A = getA(direction);
  float B = getB(direction, origin, _center);
  float C = getC(origin, _center, radius);

  float numberOfSolutions = getNumberOfSolutions(A, B, C);

  if (numberOfSolutions < 0.) {
    return noRayHit;
  }

  float dist;
  if (numberOfSolutions == 0.)
    // one solution
    dist = -B / (2. * A);

  else
    // two solutions
    dist = (-B - sqrt(numberOfSolutions)) / (2. * A);

  return origin + dist * direction; }

vec3 soundOrigin = vec3(0.0, 0.0, -10.0);

float radius = 1.;

vec3 full = vec3(162., 250., 163.) / 255.0;
vec3 second = vec3(226., 239, 112.) / 255.;
vec3 third = vec3(112., 228., 239.) / 255.;

void main() {
  vec4 current = texture2D(uSampler, vec2(1., 0.5));

  vec4 noisyPosition = position + snoise(position.xyz * 100.) / 10.;

  float noisyRadius = radius + snoise(position.xyz* 20.) / 10.;

  vec2 vel = vec2(uDistance.g / 10.);

  vec3 rayDirection = vec3(0., 0., -1.);

  float n = abs(noise((position.xy) * 10.));

  vec3 rayHit = getRayHit(vec3(center), radius, vec3(position.x, position.y, 1.), rayDirection);

  vec3 pixel;
  if (rayHit != noRayHit) {
    vec3 normal = normalize(vec3(center) - (rayHit + snoise(rayHit * 5. + uDistance[0] / 100.)));

    float distToCenter = distance(rayHit, vec3(center)) / radius;

    float strength = dot(rayDirection, normal);

    vec3 flashSecond = mix(rgb2hsb(second), rgb2hsb(third), abs(sin(uDistance.b)));

    vec3 color = mix(full, second, strength);

    pixel = full * strength;
  }

  gl_FragColor = vec4(pixel, 1.0);
}
