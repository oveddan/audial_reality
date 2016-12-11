import vertex from './vertex.glsl'
import pulsingSphere from './pulsing_sphere.glsl'
import soundGlobs from './sound_globs.glsl'
import flash from './flash.glsl'
import travelingSound from './traveling_sound.glsl'
import avigdor from './avigdor.glsl'

const shaders = {
  vertex,
  travelingSound,
  pulsingSphere,
  flash,
  soundGlobs,
  avigdor
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

