vec3 rotate3d(vec3 point, float rad, int axis) {
  mat4 rotation;
  float c = cos(rad);
  float s = sin(rad);

  // x axis
  if (axis == 0) {
    rotation = mat4(
      1, 0, 0, 0,
      0, c, -s, 0,
      0, s, c, 0,
      0, 0, 0, 1
    );
  // y axis
  } else if(axis == 1) {
    rotation = mat4(
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1
    );
  // z axis
  } else {
    rotation = mat4(
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1
    );
  }

  vec4 result = rotation * vec4(point, 1.);
  return vec3(result);
}

#pragma glslify: export(rotate3d)



