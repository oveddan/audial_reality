#ifdef GL_ES
precision mediump float;
#endif

varying highp vec4 position;
varying highp vec4 center;
uniform float u_time;
// audio inputs
uniform sampler2D uSampler;
uniform vec4 uDistance;

float soundDistance = 2.;
float maxDistance = 20.;

vec3 full = vec3(255.0, 51.0, 204.0) / 255.0;
vec3 second = vec3(204., 102., 51.) / 255.;

vec4 soundOrigin = vec4(0.0, 0., 0.0, 5.0);


float loudEvent(float sound, float lengthAfter) {

  if (sound > 0.5)
    return lengthAfter*sound;
  else
    return 0.;

}

float bassLength = 5.;
float trebleLength = 10.;


void main() {

  vec4 magnitude_1 = texture2D(uSampler, vec2(0.1, 0.5));
  vec4 magnitude_2 = texture2D(uSampler, vec2(0.2, 0.5));
  vec4 magnitude_3 = texture2D(uSampler, vec2(0.3, 0.5));
  vec4 magnitude_4 = texture2D(uSampler, vec2(0.4, 0.5));
  vec4 magnitude_5 = texture2D(uSampler, vec2(0.5, 0.5));
  vec4 magnitude_6 = texture2D(uSampler, vec2(0.6, 0.5));
  vec4 magnitude_7 = texture2D(uSampler, vec2(0.7, 0.5));
  vec4 magnitude_8 = texture2D(uSampler, vec2(0.8, 0.5));
  vec4 magnitude_9 = texture2D(uSampler, vec2(0.9, 0.5));
  vec4 magnitude_10 = texture2D(uSampler, vec2(1.0, 0.5));

  vec4 delta_sound = magnitude_10 - magnitude_1;

  float bass_trailing_average = (magnitude_10[0]*10. + magnitude_9[0]*9. + magnitude_8[0]*8. + magnitude_7[0]*7. + magnitude_6[0]*6.) / (10.+9.+8.+7.+6.);
  float treble_trailing_average = (magnitude_10[1]*10. + magnitude_9[1]*9. + magnitude_8[1]*8. + magnitude_7[1]*7. + magnitude_6[1]*6.) / (10.+9.+8.+7.+6.);

  vec4 magnitudeOfSound = uDistance/ 200.;

  float bassMagnitude = mod(magnitudeOfSound[0]/4., 6.);
  float trebleMagnitude = mod(magnitudeOfSound[1]/2., 20.);

  float lengthOfBass = sin(bassMagnitude);

  float dist = distance(vec2(0.0, 0.0), sin(position.xy*treble_trailing_average*10.));


  float distNormalized = smoothstep(0.0, soundDistance, dist);


  vec4 currentSound = texture2D(uSampler, vec2(1. - distNormalized, 0.5)) * .5;

  float circleDistance = distance(vec2(0.0, 0.0), position.xy);

  float outsideCircle = step(0.5, circleDistance);

  //float bassCircle = mod(circleDistance/mod(u_time/5., 5.), 0.5);

  //float u_time_adjusted = mod(u_time/5., (1-bass_loud_enough)*100.);

  float bassCircle = mod(circleDistance*(1.+bass_trailing_average/4.), 0.5);

  vec3 finalColor = currentSound.xyz + bassCircle * vec3(1.0, 0.0, 0.0);

  gl_FragColor = vec4(finalColor, 1.0);
}
