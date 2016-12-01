#ifdef GL_ES
precision mediump float;
#endif

varying highp vec4 normal;


vec3 lightDirection = normalize(vec3(0.0, 0.25, 0.5));

vec3 full = vec3(1.0, 1.0, 1.0);

void main() {
  vec3 light = full * dot(lightDirection, vec3(normal));
  gl_FragColor = vec4(light, 1.0);
}
