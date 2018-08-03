export const toRadian = degrees => degrees * Math.PI / 180

const DEFAULT_NEAR = -1
const DEFAULT_FAR = -1000
const VIEWING_ANGLE = toRadian(45)

const perspectiveMatrix = (r,  l,  t,  b,  n,  f) => {
  const an = Math.abs(n)
  const af = Math.abs(f)
  // const f = 1.0 / Math.tan(fovy / 2)
  // const nf = 1 / (near - far)
  return new Float32Array([
    2*an/(r-l),  0,  (r+l)/(r-l),  0,
    0, 2*an/(t-b), (t+b)/(t-b), 0,
    0, 0, -(af+an)/(af-an), -(2*af*an)/(af-an),
    0, 0, -1, 0
  ])
}

// const orthoMatrix = (r,  l,  t,  b,  n,  f) => {
  // return new Float32Array([
    // 2 / (r - l),  0, 0, -(r+l)/(r-l),
    // 0, 2 / (t-b), 0, -(t+b)/(t-b),
    // 0, 0, 2 / (f-n), -(f+n)/(n-f),
    // 0, 0, 0, 1
  // ])
// }

// const getOrtho = (windowWidth, windowHeight) => {
  // const t = Math.tan(VIEWING_ANGLE / 2) * Math.abs(DEFAULT_NEAR)

  // const r = t * (windowWidth / windowHeight)

  // console.log(r, -r, t, -t)

  // return orthoMatrix(r, -r, t, -t, DEFAULT_NEAR, DEFAULT_FAR)
// }

export const transpose = a => (
  new Float32Array([
    a[0], a[4], a[8], a[12],
    a[1], a[5], a[9], a[13],
    a[2], a[6], a[10], a[14],
    a[3], a[7], a[11], a[15]
  ])
)

const getIndex = (i, j) => i * 4 + j

export const multiply = (a, b) => {
  // console.log('a:')
  // printMatrix(a)
  // console.log('b:')
  //
  // const rotate90X = rotate(
  // printMatrix(b)

  const result = new Float32Array(4 * 4)

  for(let i = 0; i < 4; i++) {
    for(let j = 0; j < 4; j++) {
      let sum = 0
      for (let k = 0; k < 4; k++) {
        sum = sum + a[getIndex(i, k)]*b[getIndex(k, j)]
      }

      result[getIndex(i, j)] = sum
    }
  }

  return result
}

const t = Math.tan(VIEWING_ANGLE / 2) * Math.abs(DEFAULT_NEAR)

export const perspectiveProjection = (w, h) => {
  const n = DEFAULT_NEAR
  const f = DEFAULT_FAR

  const r = t * (w/ h)
  const l = -r
  const b = -t

  // const persp = perspectiveMatrix(n, f)
  // const ortho = orthoMatrix(r, l, t, b, n, f)

  return perspectiveMatrix(r, l, t, b, n, f)
}

export const translation = vec3 => {
  const [x, y, z] = vec3

  return new Float32Array([
    1, 0, 0, x,
    0, 1, 0, y,
    0, 0, 1, z,
    0, 0, 0, 1
  ])
}

export const scale = vec3 => {
  const [x, y, z] = vec3

  return new Float32Array([
    x, 0, 0, 0,
    0, y, 0, 0,
    0, 0, z, 0,
    0, 0, 0, 1
  ])

}

export const identity = () => (
  new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ])
)

export const printMatrix = matrix => {
  let result = ''
  for(let i = 0; i < 4*4; i++) {
    result += matrix[i]
    if (i !== 15)
      result += ', '

    if (i%4 === 3)
      result += '\n'
  }

  console.log(result)
}

export const degreeToRad = degrees => (
  degrees * Math.PI / 180
)

export const rotate = (rad, axis) => {
  const c = Math.cos(rad)
  const s = Math.sin(rad)

  // x axis
  if (axis === 'x') {
    return new Float32Array([
      1, 0, 0, 0,
      0, c, -s, 0,
      0, s, c, 0,
      0, 0, 0, 1
    ])
  // y axis
  } else if(axis === 'y') {
    return new Float32Array([
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1
    ])
  // z axis
  } else {
    return new Float32Array([
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1
    ])
  }
}

export const rotateAll = ([xRotate, yRotate, zRotate]) => {
  let result = identity()

  if (xRotate)
    result = multiply(rotate(xRotate, 'x'), result)
  if (yRotate)
    result = multiply(rotate(yRotate, 'y'), result)
  if (zRotate)
    result = multiply(rotate(zRotate, 'z'), result)

  return result
}

