import React, { Component } from 'react'

const getAnalyzer = fftSize => {
  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia)

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const analyzer = audioCtx.createAnalyser()

  if (navigator.getUserMedia) {
    navigator.getUserMedia (
    { audio: true },
    // Success callback
    stream => {
      const source = audioCtx.createMediaStreamSource(stream)
      analyzer.fftSize = fftSize
      // const bufferLength = analyzer.frequencyBinCount
      // const dataArray = new Uint8Array(bufferLength)
      source.connect(analyzer)
    },
    // Error callback
    err => {
      console.log('The following gUM error occured: ' + err)
    }
  )
  } else {
     console.log('getUserMedia not supported on your browser!')
  }

  return analyzer
}

export default class AudioAnalyzer extends Component {
  componentWillMount() {

    this.analyzer = getAnalyzer(this.props.fftSize)

    const gl = this.context.gl

    this.texture = gl.createTexture()

    // gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    // gl.generateMipmap(gl.TEXTURE_2D);
    // gl.bindTexture(gl.TEXTURE_2D, null);

    this.draw = this.draw.bind(this)
    this.context.registerChildDraw(this.draw)
  }

  componentWillUnmount() {
    this.context.unregisterChildDraw(this.draw)
  }

  draw(gl) {
    const analyzer = this.analyzer
    const bufferLength = analyzer.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyzer.getByteTimeDomainData(dataArray)

    const texCoords = new Uint8Array(bufferLength * 4)

    for(let i = 0; i < bufferLength * 4; i++) {
      const start = i*4

      texCoords[start] = dataArray[i]
      // texCoords[start + 1] = 0
      // texCoords[start + 2] = 0
      texCoords[start + 3] = 255
    } 

    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, bufferLength, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, texCoords)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  }

  getTexture() { return this.texture }

  render() { return null }
}

AudioAnalyzer.contextTypes = {
  gl: React.PropTypes.object.isRequired,
  registerChildDraw: React.PropTypes.func.isRequired,
  unregisterChildDraw: React.PropTypes.func.isRequired
}
