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

// 3d Random
float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners porcentages
    return mix(a, b, u.x) + 
            (c - a)* u.y * (1.0 - u.x) + 
            (d - b) * u.x * u.y;
}

vec3 soundOrigin = vec3(0.0, 0.25, 0.0);

float getSound(vec4 soundData, int band) {
  if (band == 0)
      return soundData[1];
  if (band == 1) 
      return soundData[2];
  if (band == 2)
      return soundData[3];

  return 0.;
}

void main() {
  vec4 current = texture2D(uSampler, vec2(0.1, 0.5));

  vec4 firstData = texture2D(uSampler, vec2(1., 0.5));

  float xScaled = smoothstep(-1.0, 2.0, position.x) * 3.0; // Scale the coordinate system by 4

  int band = int(floor(xScaled));

  /* switch(band) { */
    /* case 0: */
  /* } */
  /* if (band == 0) */

  //float res = smoothstep(0.0, 0.1, firstData[0]);

  float noiseR = abs(noise(position.xy * 20.));
  float noiseB = abs(noise(position.xz * 20.));

  float sound = getSound(firstData, band);


  gl_FragColor = vec4(vec3(sound * noiseR, 0.0, sound * noiseB), 1.0);
}
