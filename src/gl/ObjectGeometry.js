import { each, map } from 'lodash'

export default class ObjectGeometry {
  constructor() {
    this.verteces = []
    this.normals = []

    this.faces = []
    this.vertexNormals = []
  }

  addVertex(a, b, c) {
    this.verteces.push([a, b, c])
  }

  addVertexNormal(a, b, c) {
    this.normals.push([a, b, c])
  }

  addFace({ vertexIndeces, normalIndeces }) {
    this.faces.push(
      ...map(vertexIndeces, vertexIndex => Number(vertexIndex) - 1)
    )

    each(vertexIndeces, (vertexIndex, i) => {
      this.vertexNormals[Number(vertexIndex) -1 ] = this.normals[Number(normalIndeces[i])-1]
    })

   // console.log(...map(vertexIndeces, vertexIndex => Number(vertexIndex) - 1))
   // console.log(map(normalIndeces, normalIndex => this.normals[Number(normalIndex) - 1]))

    // each(normalIndeces, normalIndex => {
      // this.vertexNormals.push(this.normals[Number(normalIndex) - 1])
    // })

  }
}
