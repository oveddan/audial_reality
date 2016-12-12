import React from 'react'
import shaders from 'shaders'
import Cube from './components/cube'

const PulsingSphere = props => (
  <Cube key='2'
    {...props}
    position={[0, 0, 0.0]}
    scale={[1.0, 1.0, 1.0]}
    fragmentShader={shaders.pulsingSphere}
  />
)

const SoundWaveVortex = props => (
  <div>
    <Cube key='1'
      {...props}
      position={[0, 0, -5.0]}
      scale={[0.5, 0.5, 0.5]}
      fragmentShader={shaders.soundGlobs}
    />
    <Cube key='2'
      {...props}
      position={[0, 0, 0]}
      scale={[1.5, 1.5, 100.0]}
      fragmentShader={shaders.travelingSound}
    />
  </div>
)

const Avigdor = props => (
  <Cube
    {...props}
    position={[0, 0, -2]}
    scale={[1, 1, 0.00001]}
    fragmentShader={shaders.avigdor}
  />
)

const Ocean = props => (
  <div>
    <Cube key='1'
      {...props}
      position={[2, 0, 0]}
      scale={[0.00001, 2, 100]}
      fragmentShader={shaders.ocean}
    />
    <Cube key='2'
      {...props}
      position={[-2, 0, 0]}
      scale={[0.00001, 2, 100]}
      fragmentShader={shaders.ocean}
    />
    <Cube key='3'
      {...props}
      position={[0, 0, -200]}
      scale={[15, 15, 0.0001]}
      fragmentShader={shaders.white}
    />
  </div>
)

const DepthTest = props => (
  <div>
    <Cube key='1'
      {...props}
      position={[0.25, 0.25, -1]}
      scale={[0.5, 0.5, 0.5]}
      fragmentShader={shaders.ocean}
    />
    <Cube key='2'
      {...props}
      position={[0, 0, -5]}
      scale={[0.5, 0.5, 0.5]}
      fragmentShader={shaders.ocean}
    />
    <Cube key='3'
      {...props}
      position={[0.25, 0.25, -3]}
      scale={[0.5, 0.5, 0.5]}
      fragmentShader={shaders.white}
    />
  </div>
)

const Bands = props => (
  <div>
    <Cube key='1'
      {...props}
      position={[0, 0, -99]}
      scale={[100, 100, 0.0001]}
      fragmentShader={shaders.bands}
    />
  </div>
)

const Scenes = [
  Bands,
  SoundWaveVortex,
  PulsingSphere,
  Avigdor,
  Ocean,
  DepthTest
]

export default Scenes
