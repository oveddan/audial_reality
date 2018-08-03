import React, { Component } from 'react'

import { debounce } from 'lodash'
import cx from 'classnames'

import 'styles/scene_controls.scss'

const SceneControls = ({ 
  children,
  showControls,
  handleMouseMove,
  nextScene,
  previousScene
}) => (
  <div className='carousel slide' data-ride='carousel' onMouseMove={handleMouseMove} >
    <div className='carousel-inner' role='listbox'>
      {children}
    </div>
    <div className={cx({ controls:true, hide:!showControls })} >
      <a className='carousel-control-prev' onClick={previousScene} role='button' data-slide='prev'>
        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
        <span className='sr-only'>Previous</span>
      </a>
      <a className='carousel-control-next' onClick={nextScene} role='button' data-slide='next'>
        <span className='carousel-control-next-icon' aria-hidden='true'></span>
        <span className='sr-only'>Next</span>
      </a>
    </div>
  </div>
)

export default class SceneControlsContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {}

    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.hideControls.bind(this)
    this.hideControlsDebounced = debounce(this.hideControls, 1000)
  }

  handleMouseMove() {
    this.setState({
      showControls: true
    })

    this.hideControlsDebounced()
  }

  hideControls() {
    this.setState({
      showControls: false
    })
  }

  render() {
    return <SceneControls {...this.props} showControls={this.state.showControls} handleMouseMove={this.handleMouseMove} />
  }

}
