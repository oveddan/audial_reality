export default class ObjectGeometry {
  constructor() {
    this.verteces = []
    this.uvs = []
    this.normals = []
    this.verteces.push(null)
    this.uvs.push(null)
    this.normals.push(null)

    this.vertexBuffer = []
    this.uvBuffer = []
    this.normalBuffer = []
  }

  addVertex(a, b, c) {
    this.verteces.push(a, b, c)
  }

  addVertexNormal(a, b, c) {
    this.normals.push(a, b, c)
  }

  addUv(a, b) {
    this.uvs.push(a, b)
  }

  addToVertexBuffer(a, b, c) {
    // todo: handle d
    const source = this.verteces
    this.vertexBuffer.push(source[a], source[b], source[c])
  }

  addToUvBuffer(a, b, c)  {
    const source = this.uvs
    this.uvBuffer.push(source[a], source[b], source[c])
  }

  addToNormalBuffer(a, b, c) {
    const source = this.normals
    this.normalBuffer.push(source[a], source[b], source[c])
  }

}
