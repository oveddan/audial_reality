vec2 rotate2d(in vec2 c, float theta) {
  mat3 rotation = mat3(
    cos(theta), -sin(theta), 0,
    sin(theta), cos(theta), 0,
    0, 0, 1
  );

  return (rotation * vec3(c, 1.)).xy;
}

#pragma glslify: export(rotate2d)
