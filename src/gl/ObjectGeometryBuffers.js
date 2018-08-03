import VertexBufferObject from '../gl/VertexBufferObject'
import { size } from 'lodash'

export default class ObjectGeometryBuffers {
  constructor(gl) {
    this.numVerteces = 0
    this.hasUvs = false
    this.hasNormals = false

    this.vertexBuffer = new VertexBufferObject(gl)
    this.uvBuffer = new VertexBufferObject(gl)
    this.normalBuffer = new VertexBufferObject(gl)
  }

  update(objectGeometry) {
    console.log('length: ', objectGeometry.vertexBuffer.length)
    console.log(objectGeometry.vertexBuffer)
    console.log('num verteces:', objectGeometry.numVerteces)
    console.log('uv buffer size: ', objectGeometry.uvBuffer.length)
    this.vertexBuffer.bind()
    this.vertexBuffer.update(new Float32Array(objectGeometry.vertexBuffer))
    this.numVerteces = objectGeometry.numVerteces

    if (objectGeometry.uvBuffer.length > 0) {
      this.uvBuffer.update(new Float32Array(objectGeometry.uvBuffer))
      this.hasUvs = true
    }

    if (objectGeometry.normalBuffer.length > 0) {
      this.normalBuffer.update(new Float32Array(objectGeometry.normalBuffer))
      this.hasNormals = true
    }

  }

  bind() {
    this.vertexBuffer.bind()
    if (this.hasUvs)
      this.uvBuffer.bind()
    if (this.hasNormals)
      this.normalBuffer.bind()
  }
}
