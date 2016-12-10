import vertex from './vertex.glsl'
import soundWaves from './sound_waves.glsl'
import pulsingSphere from './pulsing_sphere.glsl'
import flash from './flash.glsl'

import { mapValues } from 'lodash'

const shaders = {
  vertex,
  soundWaves,
  pulsingSphere,
  flash
}

export default shaders

// let programs = null

// const buildProgram = (shader, gl) => (
  // return new ShaderProgram(
// )

// const buildPrograms = gl => (
  // mapValues(shaders, shader => (
    // buildProgram(shader, gl)
  // ))
// )

// const getPrograms = () => {
  // if (!programs)
    // throw new Error('Programs not loaded')

  // return programs
// }

// export const getProgram = program => (
  // getPrograms()[program]
// )

