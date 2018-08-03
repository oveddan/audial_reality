#ifdef GL_ES
precision mediump float;
#endif

varying highp vec4 position;
uniform sampler2D uSampler;

float resolution = pow(2., 10.);

vec4 gaussianBlur(float position) {
  vec4 sum = vec4(0.0);

  for (int x = -8; x <= 8; x++) {
    float adjust = float(x) / resolution;
    sum += texture2D(uSampler, vec2(position + adjust, 0.5));
  }

  sum = sum / 16.; 

  return sum;
}

vec4 getSampledPoint(float position) {
  return texture2D(uSampler, vec2(position, 0.5));
}

vec4 maxOfPastFew(float position) {
  vec4 maxSoFar;

  for (int x = -4; x <= 1; x++) {
    float adjust = float(x) / 1000.;
    maxSoFar = max(maxSoFar, getSampledPoint(position + adjust));
  }

  return maxSoFar;
}

void main() {
  float dist = (position.x + 1.) / 2.;

  vec4 actualSound = texture2D(uSampler, vec2(dist, 0.5));
  vec4 currentSound = gaussianBlur(dist);

  gl_FragColor = currentSound;
}
