attribute vec2 aVertexPosition;

varying highp vec4 position;

void main(void) {
  position = vec4(aVertexPosition, 0., 1.);
  gl_Position = position;
}
