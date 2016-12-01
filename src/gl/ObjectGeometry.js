import { each } from 'lodash'

const addTo = (buffer, source, indeces) => {
  each(indeces, index => {
    const start = index -1
    buffer.push(...source[start])
  })
}

export default class ObjectGeometry {
  constructor() {
    this.verteces = []
    this.uvs = []
    this.normals = []

    this.vertexBuffer = []
    this.uvBuffer = []
    this.normalBuffer = []
    this.numVerteces = 0
  }

  addVertex(a, b, c) {
    this.verteces.push([a, b, c])
  }

  addVertexNormal(a, b, c) {
    this.normals.push([a, b, c])
  }

  addUv(a, b) {
    this.uvs.push([a, b])
  }

  addToVertexBuffer(a, b, c) {
    // todo: handle d
    const source = this.verteces

    addTo(this.vertexBuffer, source, [a, b, c])
    this.numVerteces += 3
  }

  addToUvBuffer(a, b, c)  {
    const source = this.uvs
    addTo(this.uvBuffer, source, [a, b, c])
  }

  addToNormalBuffer(a, b, c) {
    const source = this.normals
    addTo(this.normalBuffer, source, [a, b, c])
  }

}
