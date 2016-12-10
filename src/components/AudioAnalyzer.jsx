import React, { Component } from 'react'
import { fill, min, max, chunk, map, drop } from 'lodash'

const getRange = frequencySignal => (
  max(frequencySignal)-min(frequencySignal)
)

const getAudioBands = (frequencySignal, fftSize) => {
  const groupedByRange = chunk(frequencySignal, Math.ceil(fftSize / 3))
  return [
    getRange(frequencySignal),
    getRange(groupedByRange[0]),
    getRange(groupedByRange[1]),
    getRange(groupedByRange[2])
  ]
}

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

const TIME_LENGTH = 10*60

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

    this.signalOverTime = new Array(TIME_LENGTH * 4)
    fill(this.signalOverTime, 0)

    this.distanceByBand = new Float32Array([0, 0, 0, 0])
  }

  componentWillUnmount() {
    this.context.unregisterChildDraw(this.draw)
  }

  draw(gl) {
    const analyzer = this.analyzer
    const bufferLength = analyzer.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyzer.getByteTimeDomainData(dataArray)

    const audioBands = getAudioBands(dataArray, bufferLength)

    this.distanceByBand = map(this.distanceByBand, (distance, i) => (
      distance + audioBands[i] / 10.0
    ))
    
    this.signalOverTime = drop(this.signalOverTime, 4)
    this.signalOverTime.push(...audioBands)

    //    console.log(this.signalOverTime[28], this.signalOverTime[29], this.signalOverTime[30], this.signalOverTime[31])

    // const texCoords = new Uint8Array(TIME_LENGTH * 4)

    // for(let i = 0; i < TIME_LENGTH; i++) {
      // const start = i * 4

      // const signalAtTime = this.signalOverTime[i] 
      // if (signalAtTime) {
        // texCoords[start] = signalAtTime[0]
        // texCoords[start + 1] = signalAtTime[1]
        // texCoords[start + 1] = signalAtTime[2]
        // texCoords[start + 1] = signalAtTime[1]
      // }
      // // texCoords[start + 1] = 0
      // // texCoords[start + 2] = 0
    // } 

    // //console.log(this.signalOverTime)
    // console.log(texCoords)

    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TIME_LENGTH, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(this.signalOverTime))
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  }

  getDistanceByBand() { return this.distanceByBand }
  getTexture() { return this.texture }

  render() { return null }
}

AudioAnalyzer.contextTypes = {
  gl: React.PropTypes.object.isRequired,
  registerChildDraw: React.PropTypes.func.isRequired,
  unregisterChildDraw: React.PropTypes.func.isRequired
}
