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
  }

  render() { 
    if (!this.state.mesh)
      return null

    return <MeshFromText {...this.props} mesh={this.state.mesh}  />
  }
}
