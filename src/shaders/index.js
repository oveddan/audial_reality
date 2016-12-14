import vertex from './vertex.glsl'
import pulsingSphere from './pulsing_sphere.glsl'
import soundGlobs from './sound_globs.glsl'
import flash from './flash.glsl'
import cellularTube from './cellular_tube.glsl'
import avigdor from './avigdor.glsl'
import ocean from './ocean.glsl'
import white from './white.glsl'
import bands from './bands.glsl'
import sunset from './sunset.glsl'
import travelingSound from './traveling_sound.glsl'
import radiatingSound from './radiating_sound.glsl'

const shaders = {
  vertex,
  cellularTube,
  pulsingSphere,
  flash,
  soundGlobs,
  avigdor,
  ocean,
  white,
  bands,
  sunset,
  travelingSound,
  radiatingSound
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

