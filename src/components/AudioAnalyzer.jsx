import { Component } from 'react'

const getAnalyzer = fftSize => {
  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia)

  if (navigator.getUserMedia) {
    navigator.getUserMedia (
    { audio: true },
    // Success callback
    stream => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = audioCtx.createAnalyser()
      const source = audioCtx.createMediaStreamSource(stream)
      analyser.fftSize = fftSize
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      source.connect(analyser)
      return analyzer
    },
    // Error callback
    err => {
      console.log('The following gUM error occured: ' + err)
    }
  )
  } else {
     console.log('getUserMedia not supported on your browser!')
  }
}

export default class AudioAnalyzer extends Component {
  componentWillMount() {
    this.analyzer = getAnalyzer(this.props.fftSize)
  }
}
