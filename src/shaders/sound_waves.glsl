#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

varying highp vec4 position;

float getStrength(float z) {
  return sin(z) * sin(z * 4.0 - u_time * 4.0);
}

float getFadeOut(float x) {
  return sin(smoothstep(2.0, 1.7, abs(x)));
}

void main() {
  vec3 full = vec3(255.0, 51.0, 204.0) / 255.0;

  vec3 atPoint = full * getFadeOut(position.x) * getStrength(position.z);

  gl_FragColor = vec4(atPoint ,1.0);
}
