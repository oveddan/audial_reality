import React from 'react'
import shaders from 'shaders'
import Mesh from './components/mesh'
import { rotate, degreeToRad } from 'lib/matrices'
import geometry from 'src/geometry'

const planeGeometry = geometry.getPlane()
const sphereGeometry = geometry.getSphere()
const tubeGeometry = geometry.getTube()
const cubeGeometry= geometry.getCube()

const quarterTurn = degreeToRad(90)

const PulsingSphere = props => (
  <div>
    <Mesh key='1'
      {...props}
      position={[0, 0, -2]}
      scale={[1.0, 1.0, 1.0]}
      geometry={sphereGeometry}
      fragmentShader={shaders.pulsingSphere}
    />
    <Mesh key='2'
      {...props}
      position={[1, -1, -4]}
      scale={[1.0, 1.0, 1.0]}
      geometry={sphereGeometry}
      fragmentShader={shaders.pulsingSphere}
    />
    <Mesh key='3'
      {...props}
      position={[-1, -1, -4]}
      scale={[1.0, 1.0, 1.0]}
      geometry={sphereGeometry}
      fragmentShader={shaders.pulsingSphere}
    />
    <Mesh key='4'
      {...props}
      position={[-1, 1, -4]}
      scale={[1.0, 1.0, 1.0]}
      geometry={sphereGeometry}
      fragmentShader={shaders.pulsingSphere}
    />
    <Mesh key='5'
      {...props}
      position={[1, 1, -4]}
      scale={[1.0, 1.0, 1.0]}
      geometry={sphereGeometry}
      fragmentShader={shaders.pulsingSphere}
    />
    <Mesh key='6'
      {...props}
      position={[3, 0, -6]}
      scale={[1.0, 1.0, 1.0]}
      geometry={sphereGeometry}
      fragmentShader={shaders.pulsingSphere}
    />
    <Mesh key='7'
      {...props}
      position={[-3, 0, -6]}
      scale={[1.0, 1.0, 1.0]}
      geometry={sphereGeometry}
      fragmentShader={shaders.pulsingSphere}
    />

  </div>
)

const CellularTube = props => (
  <div>
    <Mesh key='2'
      {...props}
      position={[0, 0, 0]}
      scale={[20, 20, 400]}
      geometry={tubeGeometry}
      fragmentShader={shaders.cellularTube}
    />
  </div>
)

const RadiatingSound = props => (
  <Mesh key='2'
    {...props}
    position={[0, 0, -2]}
    scale={[4, 4, 0.0001]}
    rotate={[quarterTurn, 0, 0]}
    fragmentShader={shaders.radiatingSound}
  />
)

const TravelingSound = props => (
  <div>
    <Mesh key='1'
      {...props}
      position={[0, 0, 0]}
      scale={[1.5, 1.5, 100]}
      geometry={cubeGeometry}
      fragmentShader={shaders.travelingSound}
    />
  </div>
)

const Avigdor = props => (
  <Mesh
    {...props}
    position={[0, 0, -2]}
    scale={[4, 4, 0.00001]}
    rotate={[quarterTurn, 0, 0]}
    fragmentShader={shaders.avigdor}
  />
)

const lookDown = rotate(0.05, 'x')

const oceanUniforms = {
  uLight: {
    type: 'uniform3fv',
    value: new Float32Array([0.5, -0.05, -1])
  }
}

const Ocean = props => (
  <div>
    <Mesh key='1'
      {...props}
      geometry={planeGeometry}
      position={[0, -40, 0]}
      scale={[2000, 0.0001, 2000]}
      cameraTransform={lookDown}
      fragmentShader={shaders.ocean}
      uniforms={oceanUniforms}
    />
    <Mesh key='2'
      {...props}
      geometry={sphereGeometry}
      position={[0, 0, 0]}
      scale={[800,800, 1000]}
      cameraTransform={lookDown}
      fragmentShader={shaders.sunset}
      uniforms={oceanUniforms}
    />
  </div>
)

const Bands = props => (
  <div>
    <Mesh key='1'
      {...props}
      position={[0, 0, -99]}
      scale={[100, 100, 0.0001]}
      rotate={[quarterTurn, 0, 0]}
      fragmentShader={shaders.bands}
    />
  </div>
)

const Globs = props => (
  <div>
    <Mesh key='1'
      {...props}
      position={[0, 0, -2]}
      scale={[4, 4, 0.0001]}
      rotate={[quarterTurn, 0, 0]}
      fragmentShader={shaders.soundGlobs}
    />
  </div>
)

const Scenes = [
  Bands,
  RadiatingSound,
  TravelingSound,
  PulsingSphere,
  Globs,
  Avigdor,
  Ocean,
  CellularTube
]

export default Scenes
