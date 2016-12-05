#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uTexture;

varying highp vec3 normal;
varying highp vec4 position;
varying highp vec2 uv;

vec3 lightDirection = normalize(vec3(0.0, -1.0, 0.0));

void main() {
  vec4 color = texture2D(uTexture, vec2(uv.s, uv.t));
  vec4 pixel = color;// * dot(lightDirection, normal);
  gl_FragColor = pixel;
}
