import React, { Component } from 'react'
import ShaderProgram from '../gl/ShaderProgram'

class MeshFromFile extends Component {
  componentWillMount() {
  }

  render() { return null; }
}

MeshFromFile.contextTypes = {
  gl: React.PropTypes.object.isRequired,
  registerChildDraw: React.PropTypes.func.isRequired,
  unregisterChildDraw: React.PropTypes.func.isRequired
}
