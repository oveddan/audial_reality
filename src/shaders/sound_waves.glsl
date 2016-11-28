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

void main() {
  vec3 full = vec3(255.0, 51.0, 204.0) / 255.0;

  float dist = distance(vec2(0.0, 0.0), vec2(position.x, position.z));

  float distNormalized = smoothstep(0.0, 5.0, dist);

  vec4 firstData = texture2D(uSampler, vec2(distNormalized, 0.5));

  gl_FragColor = vec4(full * firstData[0], 1.0);
}
