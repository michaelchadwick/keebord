export default class Note {
  oscTypes = ['sawtooth', 'sine', 'square', 'triangle']

  constructor(audioContext, noteNumber, type, envelope) {
    this.audioContext = audioContext
    this.noteNumber = noteNumber
    this.envelope = envelope
    this.startTime = 0
    this.oscillator = audioContext.createOscillator()
    this.gain = audioContext.createGain()
    this.domKey = document.querySelectorAll(`button[data-noteid='${noteNumber}']`)[0]

    this.oscillator.frequency.value = this.midiToFreq(noteNumber)
    this.oscillator.type = this.oscTypes.includes(type) ? type : 'sine'
    this.oscillator.onended = () => {
      this.oscillator.disconnect()
      this.gain.disconnect()
    }

    // individual key gain (midi vel 0-127)
    this.oscillator.connect(this.gain)
    this.gain.connect(audioContext.destination)
  }

  noteOn(playbackTime = this.audioContext.currentTime) {
    if (this.domKey) this.domKey.classList.add('active')
    this.startTime = playbackTime
    this.envelope.gateTime = Infinity
    this.envelope.applyTo(this.gain.gain, playbackTime)
    this.oscillator.start(playbackTime)
  }

  noteOff(playbackTime = this.audioContext.currentTime) {
    if (this.domKey) this.domKey.classList.remove('active')

    this.gain.gain.cancelScheduledValues(this.startTime)

    this.envelope.gateTime = playbackTime - this.startTime
    this.envelope.applyTo(this.gain.gain, this.startTime)

    this.oscillator.stop(this.startTime + this.envelope.duration)
  }

  midiToFreq(noteNumber) {
    return Math.pow(2, ((noteNumber - 69) / 12)) * 440
  }
}
