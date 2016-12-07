#ifdef GL_ES
precision mediump float;
#endif

varying highp vec4 position;
varying highp vec4 center;

uniform float u_time;
uniform sampler2D uSampler;

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), 
                 vec4(c.gb, K.xy), 
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), 
                 vec4(c.r, p.yzx), 
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), 
                d / (q.x + e), 
                q.x);
}

//  Function from Iñigo Quiles 
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

float getA(vec3 d) {
  return dot(d, d);
}

float getB(vec3 d, vec3 e, vec3 c) {
  return 2. * dot(d, e - c);
}

float getC(vec3 e, vec3 c, float r) {
  return dot(e - c, e - c) - (r * r);
}

float getNumberOfSolutions(float A, float B, float C) {
  return (B * B) - (4. * A * C);
}

vec3 noRayHit = vec3(-1.,-1.,-1.);

vec3 getRayHit(vec3 _center, float radius, vec3 origin, vec3 direction) {
  float A = getA(direction);
  float B = getB(direction, origin, _center);
  float C = getC(origin, _center, radius);

  float numberOfSolutions = getNumberOfSolutions(A, B, C);

  if (numberOfSolutions < 0.) {
    return noRayHit;
  }

  float dist;
  if (numberOfSolutions == 0.)
    // one solution
    dist = -B / (2. * A);

  else
    // two solutions
    dist = (-B - sqrt(numberOfSolutions)) / (2. * A);

  return origin + dist * direction;
}

vec3 soundOrigin = vec3(0.0, 0.0, -10.0);

float radius = 7.;


void main() {
  vec4 current = texture2D(uSampler, vec2(1., 0.5));

  vec3 full = vec3(252., 0., 255.) / 255.0;
  vec3 second = vec3(255., 166., 52.) / 255.;

  vec3 rayDirection = vec3(0., 0., -1.);

  vec2 vel = vec2(u_time);

  float n = abs(noise((position.xy + vel) * 10.));

  vec3 rayHit = getRayHit(vec3(center), radius, vec3(position.x, position.y, 1.), rayDirection);

  vec3 pixel;
  if (rayHit != noRayHit) {
    vec3 normal = normalize(vec3(center) - rayHit);
    float r = noise(rayHit.xy * 10. + vel);
    float b = noise(rayHit.xz * 10. + vel);   
    float g = noise(rayHit.yz * 10. + vel);

    vec3 noisyNormal = normalize(normal + vec3(r, b, g));

    float diffToPeak = dot(noisyNormal, normal);

    float strength = smoothstep(0., 1., dot(rayDirection, noisyNormal));

    vec3 color = mix(full, second, diffToPeak);

    pixel = strength * color;
  }

  gl_FragColor = vec4(pixel, 1.0);
}
