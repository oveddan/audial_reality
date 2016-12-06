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

void main() {
  vec4 current = texture2D(uSampler, vec2(0.1, 0.5));

  vec3 full = vec3(255.0, 51.0, 204.0) / 255.0;
  vec3 second = vec3(204., 102., 51.) / 255.;

  float dist = distance(soundOrigin, vec3(position.x, position.y, position.z));

  vec3 direction = normalize(vec3(position) - soundOrigin);

  vec3 color = mix(full, second * noise(position.xz * 10.), direction);

  float distNormalized = smoothstep(0.0, 10.0, dist);

  vec4 firstData = texture2D(uSampler, vec2(distNormalized, 0.5));

  float res = smoothstep(0.0, 0.1, firstData[0]);

  gl_FragColor = vec4(color * res, 1.0);
}
