varying highp vec4 position;

void main() {
  gl_FragColor = vec4(vec3(1., abs(position.z / position.w / 0.5), 0.), 1.);
}
