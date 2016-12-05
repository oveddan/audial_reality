#ifdef GL_ES
precision mediump float;
#endif

varying highp vec4 position;

uniform float u_time;
uniform sampler2D uSampler;

float getStrength(float z) {
  return sin(z) * sin(z * 4.0 - u_time * 4.0);
}

float getFadeOut(float x) {
  return sin(smoothstep(2.0, 1.7, abs(x)));
}

vec3 soundOrigin = vec3(0.0, 0.25, 0.0);

void main() {
  vec3 full = vec3(255.0, 51.0, 204.0) / 255.0;
  vec3 second = vec3(51.0, 255.0, 102.0) / 255.0;

  float dist = distance(soundOrigin, vec3(position));

  vec3 direction = normalize(vec3(position) - soundOrigin);

  vec3 color = mix(full, second, direction);

  float distNormalized = smoothstep(0.0, 10.0, dist);

  vec4 firstData = texture2D(uSampler, vec2(distNormalized, 0.5));

  float res = smoothstep(0.0, 0.1, firstData[0]);

  gl_FragColor = vec4(color * res, 1.0);
}
