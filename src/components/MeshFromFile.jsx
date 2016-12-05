import React, { Component } from 'react'
import request from 'superagent'
import MeshFromText from './MeshFromText'

export default class MeshFromFile extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const self = this
    request.get(this.props.objectPath)
      .then(meshResponse => {
        self.setState({
          mesh: meshResponse.text
        })
      })

    if (this.props.texturePath) {
      const textureImage = new Image()
      textureImage.onload = () => {
        self.setState({
          texture: textureImage
        })
      }

      textureImage.src = this.props.texturePath
    }
    
  }

  loaded() {
    if (!this.state.mesh)
      return false

    if (this.props.texturePath && !this.state.texture)
      return false

    return true
  }

  render() { 
    if (!this.loaded())
      return null

    console.log('rendering')

    return (
      <MeshFromText 
        {...this.props} 
        mesh={this.state.mesh} texture={this.state.texture}  
      />
    )
  }
}
