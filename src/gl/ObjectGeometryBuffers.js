import VertexBufferObject from '../gl/VertexBufferObject'
import { size } from 'lodash'

export default class ObjectGeometryBuffers {
  constructor(gl) {
    this.numVerteces = 0

    this.vertexBuffer = new VertexBufferObject(gl)
    this.uvBuffer = new VertexBufferObject(gl)
    this.normalBuffer = new VertexBufferObject(gl)
  }

  update(objectGeometry) {
    this.vertexBuffer.update(new Float32Array(objectGeometry.vertexBuffer))
    if (size(objectGeometry.uvBuffer) > 0)
      this.uvBuffer.update(new Float32Array(objectGeometry.uvBuffer))

    if (size(objectGeometry.normalBuffer) > 0)
      this.normalBuffer.update(new Float32Array(objectGeometry.uvBuffer))

    this.numVerteces = size(objectGeometry.vertexBuffer) / 3
  }

  bind() {
    this.vertexBuffer.bind()
    this.uvBuffer.bind()
    this.normalBuffer.bind()
  }
}
