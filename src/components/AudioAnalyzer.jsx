import React, { Component } from 'react'
import { fill, min, max, chunk, map, drop } from 'lodash'
import AudioSmoother from './AudioSmoother'

const getRange = frequencySignal => (
  max(frequencySignal)-min(frequencySignal)
)

const getAudioBands = (frequencySignal, fftSize) => {
  const groupedByRange = chunk(frequencySignal, Math.ceil(fftSize / 3))
  return [
    getRange(groupedByRange[0]),
    getRange(groupedByRange[1]),
    getRange(groupedByRange[2]),
    getRange(frequencySignal)
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

const AUDIO_MAGNIFICATION = 10

const amplify = (audioBands, volume) => (
  map(audioBands, audioBand => (audioBand * volume) * AUDIO_MAGNIFICATION)
)

const TIME_LENGTH = 10*60

export default class AudioAnalyzer extends Component {
  componentWillMount() {

    this.analyzer = getAnalyzer(this.props.fftSize)

    const gl = this.context.gl

    this.texture = gl.createTexture()

      this.preDraw= this.preDraw.bind(this)
      this.context.registerChildPreDraw(this.preDraw)

      this.signalOverTime = new Array(TIME_LENGTH * 4)
      fill(this.signalOverTime, 0)

      this.distanceByBand = new Float32Array([0, 0, 0, 0])

      this.audioSmoother = new AudioSmoother(gl)
    }

    componentWillUnmount() {
      this.context.unregisterChildPreDraw(this.preDraw)
    }

    preDraw(gl) {
      const analyzer = this.analyzer
      const bufferLength = analyzer.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyzer.getByteTimeDomainData(dataArray)

      const audioBands = getAudioBands(dataArray, bufferLength)

      const amplifiedBands = amplify(audioBands, this.props.volume)

      this.distanceByBand = map(this.distanceByBand, (distance, i) => (
        distance + amplifiedBands[i] / 10.0
      ))

      this.signalOverTime = drop(this.signalOverTime, 4)
      this.signalOverTime.push(...amplifiedBands)

      gl.bindTexture(gl.TEXTURE_2D, this.texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TIME_LENGTH, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(this.signalOverTime))
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

      this.audioSmoother.draw(gl, this.texture)
  }

  getDistanceByBand() { return this.distanceByBand }
  getTexture() { return this.texture }
  getSmoothTexture() { return this.audioSmoother.getTexture() }

  render() { return null }
}

AudioAnalyzer.contextTypes = {
  gl: React.PropTypes.object.isRequired,
  registerChildPreDraw: React.PropTypes.func.isRequired,
  unregisterChildPreDraw: React.PropTypes.func.isRequired
}
