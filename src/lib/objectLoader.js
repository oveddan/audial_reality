// modified version of:
// https://threejs.org/examples/js/loaders/OBJLoader.js
// to suit this programs needs and follow es6 conventions

import ObjectGeometry from '../gl/ObjectGeometry'

const regexp = {
  // v float float float
  vertex_pattern           : /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
  // vn float float float
  normal_pattern           : /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
  // vt float float
  uv_pattern               : /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
  // f vertex vertex vertex
  face_vertex              : /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/,
  // f vertex/uv vertex/uv vertex/uv
  face_vertex_uv           : /^f\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+))?/,
  // f vertex/uv/normal vertex/uv/normal vertex/uv/normal
  face_vertex_uv_normal    : /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/,
  // f vertex//normal vertex//normal vertex//normal
  face_vertex_normal       : /^f\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)(?:\s+(-?\d+)\/\/(-?\d+))?/,
  // o object_name | g group_name
  object_pattern           : /^[og]\s*(.+)?/,
  // s boolean
  smoothing_pattern        : /^s\s+(\d+|on|off)/,
  // mtllib file_reference
  material_library_pattern : /^mtllib /,
  // usemtl material_name
  material_use_pattern     : /^usemtl /
}

export const loadObjectGeometry = objectFile => {
  const objectGeometry = new ObjectGeometry()

  let text = objectFile

  if (text.indexOf( '\r\n') !== - 1 ) {

    // This is faster than String.split with regex that splits on both
    text = text.replace( /\r\n/g, '\n' )
  }

  if (text.indexOf( '\\\n') !== - 1) {

    // join lines separated by a line continuation character (\)
    text = text.replace( /\\\n/g, '' )
  }

  const lines = text.split('\n')
  let line = '', lineFirstChar = '', lineSecondChar = ''
  let lineLength = 0
  let result = []

  // Faster to just trim left side of the line. Use if available.
  let trimLeft = ( typeof ''.trimLeft === 'function' )

  console.log('loading object')

  for (let line of lines) {
    line = trimLeft ? line.trimLeft() : line.trim()
    lineLength = line.length

    if ( lineLength === 0 ) continue

    lineFirstChar = line.charAt(0)

    // @todo invoke passed in handler if any
    if (lineFirstChar === '#') continue

    if (lineFirstChar === 'v') {

      lineSecondChar = line.charAt( 1 )

      if ( lineSecondChar === ' ' && ( result = regexp.vertex_pattern.exec( line ) ) !== null ) {

        // 0                  1      2      3
        // ['v 1.0 2.0 3.0', '1.0', '2.0', '3.0']
        objectGeometry.addVertex(
          parseFloat(result[1]),
          parseFloat(result[2]),
          parseFloat(result[3])
        )
      } else if ( lineSecondChar === 'n' && ( result = regexp.normal_pattern.exec( line ) ) !== null ) {

        // 0                   1      2      3
        // ['vn 1.0 2.0 3.0', '1.0', '2.0', '3.0']

        objectGeometry.addVertexNormal(
          parseFloat( result[1] ),
          parseFloat( result[2] ),
          parseFloat( result[3] )
        )

      } else if ( lineSecondChar === 't' && ( result = regexp.uv_pattern.exec( line ) ) !== null ) {

        // 0               1      2
        // ['vt 0.1 0.2', '0.1', '0.2']

        objectGeometry.addUv(
          parseFloat( result[1] ),
          parseFloat( result[2] )
        )
      } else {
        throw new Error(`Unexpected vertex/normal/uv line: ${line}`)
      }
    } else if ( lineFirstChar === 'f' ) {

      if ( ( result = regexp.face_vertex_uv_normal.exec( line ) ) !== null ) {

        // f vertex/uv/normal vertex/uv/normal vertex/uv/normal
        // 0                        1    2    3    4    5    6    7    8    9   10         11         12
        // ['f 1/1/1 2/2/2 3/3/3', '1', '1', '1', '2', '2', '2', '3', '3', '3', undefined, undefined, undefined]

        objectGeometry.addToVertexBuffer(result[1], result[4], result[7], result[10])
        objectGeometry.addToUvBuffer(    result[2], result[5], result[8], result[11])
        objectGeometry.addToNormalBuffer(result[3], result[6], result[9], result[12])
      } else if ( ( result = regexp.face_vertex_uv.exec( line ) ) !== null ) {

        // f vertex/uv vertex/uv vertex/uv
        // 0                  1    2    3    4    5    6   7          8
        // ['f 1/1 2/2 3/3', '1', '1', '2', '2', '3', '3', undefined, undefined]

        objectGeometry.addToVertexBuffer(result[1], result[3], result[5], result[7])
        objectGeometry.addToUvBuffer    (result[2], result[4], result[6], result[8])

      } else if ( ( result = regexp.face_vertex_normal.exec( line ) ) !== null ) {

        // f vertex//normal vertex//normal vertex//normal
        // 0                     1    2    3    4    5    6   7          8
        // ['f 1//1 2//2 3//3', '1', '1', '2', '2', '3', '3', undefined, undefined]

        objectGeometry.addToVertexBuffer(result[1], result[3], result[5], result[7])
        objectGeometry.addToNormalBuffer(result[2], result[4], result[6], result[8])

      } else if ( ( result = regexp.face_vertex.exec( line ) ) !== null ) {

        // f vertex vertex vertex
        // 0            1    2    3   4
        // ['f 1 2 3', '1', '2', '3', undefined]

        objectGeometry.addToVertexBuffer(result[1], result[2], result[3], result[4])

      } else {
        throw new Error(`Unexpected face line: ${line}`)

      }

    } else if ( lineFirstChar === 'l' ) {

      // const lineParts = line.substring( 1 ).trim().split( ' ' )
      // const lineVertices = [], lineUVs = []

      // if ( line.indexOf( '/' ) === - 1 ) {

        // lineVertices = lineParts

      // } else {

        // for ( var li = 0, llen = lineParts.length; li < llen; li ++ ) {

          // var parts = lineParts[li].split( '/' )

          // if ( parts[0] !== '' ) lineVertices.push( parts[0] )
          // if ( parts[1] !== '' ) lineUVs.push( parts[1] )

        // }

      // }
      // state.addLineGeometry( lineVertices, lineUVs )

    } else if ( ( result = regexp.object_pattern.exec( line ) ) !== null ) {

      // o object_name
      // or
      // g group_name

      // WORKAROUND: https://bugs.chromium.org/p/v8/issues/detail?id=2869
      // var name = result[0].substr( 1 ).trim()
      // var name = ( ' ' + result[0].substr( 1 ).trim() ).substr( 1 )

      // state.startObject( name )

    } else if ( regexp.material_use_pattern.test( line ) ) {

      // material

//      state.object.startMaterial( line.substring( 7 ).trim(), state.materialLibraries )

    } else if ( regexp.material_library_pattern.test( line ) ) {

      // mtl file

      // state.materialLibraries.push( line.substring( 7 ).trim() )

    } else if ( ( result = regexp.smoothing_pattern.exec( line ) ) !== null ) {

      // smooth shading

      // @todo Handle files that have varying smooth values for a set of faces inside one geometry,
      // but does not define a usemtl for each face set.
      // This should be detected and a dummy material created (later MultiMaterial and geometry groups).
      // This requires some care to not create extra material on each smooth value for 'normal' obj files.
      // where explicit usemtl defines geometry groups.
      // Example asset: examples/models/obj/cerberus/Cerberus.obj

      // var value = result[1].trim().toLowerCase()
      // state.object.smooth = ( value === '1' || value === 'on' )

      // var material = state.object.currentMaterial()
      // if ( material ) {

        // material.smooth = state.object.smooth

      // }

    } else {

      // Handle null terminated files without exception
      if ( line === '\0' ) continue

      throw new Error( `Unexpected line: ${line}`)

    }
  }

  console.log('loaded object')

  return objectGeometry
}
