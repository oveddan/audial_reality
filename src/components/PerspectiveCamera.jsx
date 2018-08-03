import { Component } from 'react'
import { perspectiveProjection, translation, multiply } from 'lib/matrices'

class PerspectiveCamera extends Component {
  componentWillMount() {
    // this.ortho = mat4.create()
    // mat4.ortho(this.ortho, -10, 10, -10, 10, 5, -5)

    // const viewDistance = getOptimalViewDistance(width, 100)
    // const viewNear = -viewDistance
    this.setDimensions(this.props.width, this.props.height)
  }

  setDimensions(width, height) {
    const perspective = perspectiveProjection(width, height)

    const position = translation([0, 0, -1])

    this.camera = multiply(perspective, position)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.width !== this.props.width || nextProps.height !== this.props.height)
      this.setDimensions(nextProps.width, nextProps.height)
  }

  matrix() {
    return this.camera
  }

  render() { return null }
}

export default PerspectiveCamera
