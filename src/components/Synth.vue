<script setup>
import { reactive, onMounted } from 'vue'
import NodeControl from './NodeControl.vue'
import Keyboard from './Keyboard.vue'
import ADSREnvelope from 'adsr-envelope'

const oscillators = reactive([])

let Keybord = {}
let oscillatorType = 0
let noteMap = {}
let noteCurrent = null
let startTime = 0
let scaleFilter = null
let detuneAmount = 64
let drawVisual

let useKeyboard
let useMouse
let useMidi

const adsr = new ADSREnvelope({
  attackTime: 0.1,
  decayTime: 0.5,
  sustainLevel: 0.1,
  releaseTime: 0.5,
  gateTime: 1,
  peakLevel: 0.5,
  attackCurve: 'exp',
  decayCurve: 'exp',
  releaseCurve: 'exp',
})

const nodeControls = reactive({
  waveType: {
    title: 'Wave Type',
    type: 'select',
    selectId: 'osc-type',
    options: [
      { text: 'Sine', value: 'sine' },
      { text: 'Sawtooth', value: 'sawtooth' },
      { text: 'Square', value: 'square' },
      { text: 'Triangle', value: 'triangle' }
    ],
    currentValue: 'sine',
    audioNode: '',
    parameter: 'type',
    enabled: true,
    isVertical: true
  },
  pan: {
    title: 'Pan',
    type: 'range',
    numberInputId: 'eq-pan-value',
    rangeInputId: 'eq-pan-range',
    currentValue: '0.0',
    audioNode: '',
    step: '0.1',
    min: '-1.0',
    max: '1.0',
    parameter: 'pan',
    enabled: true,
    isVertical: false
  },
  // distortion: {
  //   title: 'Distortion',
  //   type: 'range',
  //   controlEnabledCheckId: 'send-effect-distortion-check',
  //   numberInputId: 'distortion-value',
  //   rangeInputId: 'distortion-range',
  //   currentValue: '0.8',
  //   audioNode: '',
  //   step: '0.1',
  //   min: '0.0',
  //   max: '1.0',
  //   parameter: 'gain',
  //   enabled: false,
  //   isVertical: true
  // },
  // reverb: {
  //   title: 'Reverb',
  //   type: 'range',
  //   controlEnabledCheckId: 'send-effect-reverb-check',
  //   numberInputId: 'reverb-value',
  //   rangeInputId: 'reverb-range',
  //   currentValue: '0.8',
  //   audioNode: '',
  //   step: '0.1',
  //   min: '0.0',
  //   max: '1.0',
  //   parameter: 'gain',
  //   enabled: false,
  //   isVertical: true
  // },
  delay: {
    title: 'Delay',
    type: 'range',
    controlEnabledCheckId: 'send-effect-delay-check',
    numberInputId: 'delay-value',
    rangeInputId: 'delay-range',
    currentValue: '1.0',
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '6.0',
    parameter: 'delayTime',
    enabled: false,
    isVertical: true
  },
  eqLow: {
    title: 'EQ Low',
    type: 'range',
    numberInputId: 'eq-low-value',
    rangeInputId: 'eq-low-range',
    currentValue: '0.5',
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '1.0',
    parameter: 'gain',
    enabled: true,
    isVertical: true
  },
  eqMid: {
    title: 'EQ Mid',
    type: 'range',
    numberInputId: 'eq-mid-value',
    rangeInputId: 'eq-mid-range',
    currentValue: '0.5',
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '1.0',
    parameter: 'gain',
    enabled: true,
    isVertical: true
  },
  eqHigh: {
    title: 'EQ High',
    type: 'range',
    numberInputId: 'eq-high-value',
    rangeInputId: 'eq-high-range',
    currentValue: '0.5',
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '1.0',
    parameter: 'gain',
    enabled: true,
    isVertical: true
  },
  compressor: {
    title: 'Compressor',
    type: 'range',
    numberInputId: 'eq-compressor-value',
    rangeInputId: 'eq-compressor-range',
    currentValue: '3.0',
    audioNode: '',
    step: '1',
    min: '1',
    max: '20',
    parameter: 'ratio',
    enabled: true,
    isVertical: true
  },
  masterGain: {
    title: 'Volume',
    type: 'range',
    numberInputId: 'master-gain-value',
    rangeInputId: 'master-gain-range',
    currentValue: '0.8',
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '1.0',
    parameter: 'gain',
    enabled: true,
    isVertical: true
  }
})

const musicalNotes = () => {
  if (!scaleFilter) {
    return [
      // index 0
      {name: 'C0',  frequency: 16.350,   midi: 12},
      {name: 'Db0', frequency: 17.320,   midi: 13},
      {name: 'D0',  frequency: 18.350,   midi: 14},
      {name: 'Eb0', frequency: 19.450,   midi: 15},
      {name: 'E0',  frequency: 20.600,   midi: 16},
      {name: 'F0',  frequency: 21.830,   midi: 17},
      {name: 'Gb0', frequency: 23.120,   midi: 18},
      {name: 'G0',  frequency: 24.500,   midi: 19},
      {name: 'Ab0', frequency: 25.960,   midi: 20},
      {name: 'A0',  frequency: 27.500,   midi: 21},
      {name: 'Bb0', frequency: 29.140,   midi: 22},
      {name: 'B0',  frequency: 30.870,   midi: 23},
      // index 12
      {name: 'C1',  frequency: 32.700,   midi: 24},
      {name: 'Db1', frequency: 34.650,   midi: 25},
      {name: 'D1',  frequency: 36.710,   midi: 26},
      {name: 'Eb1', frequency: 38.890,   midi: 27},
      {name: 'E1',  frequency: 41.200,   midi: 28},
      {name: 'F1',  frequency: 43.650,   midi: 29},
      {name: 'Gb1', frequency: 46.250,   midi: 30},
      {name: 'G1',  frequency: 49.000,   midi: 31},
      {name: 'Ab1', frequency: 51.910,   midi: 32},
      {name: 'A1',  frequency: 55.000,   midi: 33},
      {name: 'Bb1', frequency: 58.270,   midi: 34},
      {name: 'B1',  frequency: 61.740,   midi: 35},
      // index 24
      {name: 'C2',  frequency: 65.410,   midi: 36},
      {name: 'Db2', frequency: 69.300,   midi: 37},
      {name: 'D2',  frequency: 73.420,   midi: 38},
      {name: 'Eb2', frequency: 77.780,   midi: 39},
      {name: 'E2',  frequency: 82.410,   midi: 40},
      {name: 'F2',  frequency: 87.310,   midi: 41},
      {name: 'Gb2', frequency: 92.500,   midi: 42},
      {name: 'G2',  frequency: 98.000,   midi: 43},
      {name: 'Ab2', frequency: 103.830,  midi: 44},
      {name: 'A2',  frequency: 110.000,  midi: 45},
      {name: 'Bb2', frequency: 116.540,  midi: 46},
      {name: 'B2',  frequency: 123.470,  midi: 47},
      // index 36
      {name: 'C3',  frequency: 130.810,  midi: 48},
      {name: 'Db3', frequency: 138.590,  midi: 49},
      {name: 'D3',  frequency: 146.830,  midi: 50},
      {name: 'Eb3', frequency: 155.560,  midi: 51},
      {name: 'E3',  frequency: 164.810,  midi: 52},
      {name: 'F3',  frequency: 174.610,  midi: 53},
      {name: 'Gb3', frequency: 185.000,  midi: 54},
      {name: 'G3',  frequency: 196.000,  midi: 55},
      {name: 'Ab3', frequency: 207.650,  midi: 56},
      {name: 'A3',  frequency: 220.000,  midi: 57},
      {name: 'Bb3', frequency: 233.080,  midi: 58},
      {name: 'B3',  frequency: 246.940,  midi: 59},
      // index 48
      {name: 'C4',  frequency: 261.630,  midi: 60, key: 'z'},
      {name: 'Db4', frequency: 277.180,  midi: 61, key: 's'},
      {name: 'D4',  frequency: 293.660,  midi: 62, key: 'x'},
      {name: 'Eb4', frequency: 311.130,  midi: 63, key: 'd'},
      {name: 'E4',  frequency: 329.630,  midi: 64, key: 'c'},
      {name: 'F4',  frequency: 349.230,  midi: 65, key: 'v'},
      {name: 'Gb4', frequency: 369.990,  midi: 66, key: 'g'},
      {name: 'G4',  frequency: 392.000,  midi: 67, key: 'b'},
      {name: 'Ab4', frequency: 415.300,  midi: 68, key: 'h'},
      {name: 'A4',  frequency: 440.000,  midi: 69, key: 'n'},
      {name: 'Bb4', frequency: 466.160,  midi: 70, key: 'j'},
      {name: 'B4',  frequency: 493.880,  midi: 71, key: 'm'},
      // index 60
      {name: 'C5',  frequency: 523.250,  midi: 72, key: 'q'},
      {name: 'Db5', frequency: 554.370,  midi: 73, key: '2'},
      {name: 'D5',  frequency: 587.330,  midi: 74, key: 'w'},
      {name: 'Eb5', frequency: 622.250,  midi: 75, key: '3'},
      {name: 'E5',  frequency: 659.250,  midi: 76, key: 'e'},
      {name: 'F5',  frequency: 698.460,  midi: 77, key: 'r'},
      {name: 'Gb5', frequency: 739.990,  midi: 78, key: '5'},
      {name: 'G5',  frequency: 783.990,  midi: 79, key: 't'},
      {name: 'Ab5', frequency: 830.610,  midi: 80, key: '6'},
      {name: 'A5',  frequency: 880.000,  midi: 81, key: 'y'},
      {name: 'Bb5', frequency: 932.330,  midi: 82, key: 'u',},
      {name: 'B5',  frequency: 987.770,  midi: 83, key: 'i'},
      // index 72
      {name: 'C6',  frequency: 1046.500, midi: 84, key: 'o'},
      {name: 'Db6', frequency: 1108.730, midi: 85},
      {name: 'D6',  frequency: 1174.660, midi: 86},
      {name: 'Eb6', frequency: 1244.510, midi: 87},
      {name: 'E6',  frequency: 1318.510, midi: 88},
      {name: 'F6',  frequency: 1396.910, midi: 89},
      {name: 'Gb6', frequency: 1479.980, midi: 90},
      {name: 'G6',  frequency: 1567.980, midi: 91},
      {name: 'Ab6', frequency: 1661.220, midi: 92},
      {name: 'A6',  frequency: 1760.000, midi: 93},
      {name: 'Bb6', frequency: 1864.660, midi: 94},
      {name: 'B6',  frequency: 1975.530, midi: 95},
      // index 84
      {name: 'C7',  frequency: 2093.000, midi: 96},
      {name: 'Db7', frequency: 2217.460, midi: 97},
      {name: 'D7',  frequency: 2349.320, midi: 98},
      {name: 'Eb7', frequency: 2489.020, midi: 99},
      {name: 'E7',  frequency: 2637.020, midi: 100},
      {name: 'F7',  frequency: 2793.830, midi: 101},
      {name: 'Gb7', frequency: 2959.960, midi: 102},
      {name: 'G7',  frequency: 3135.960, midi: 103},
      {name: 'Ab7', frequency: 3322.440, midi: 104},
      {name: 'A7',  frequency: 3520.000, midi: 105},
      {name: 'Bb7', frequency: 3729.310, midi: 106},
      {name: 'B7',  frequency: 3951.070, midi: 107},
      // index 96
      {name: 'C8',  frequency: 4186.010, midi: 108},
      {name: 'Db8', frequency: 4434.920, midi: 109},
      {name: 'D8',  frequency: 4698.630, midi: 110},
      {name: 'Eb8', frequency: 4978.030, midi: 111},
      {name: 'E8',  frequency: 5274.040, midi: 112},
      {name: 'F8',  frequency: 5587.650, midi: 113},
      {name: 'Gb8', frequency: 5919.910, midi: 114},
      {name: 'G8',  frequency: 6271.930, midi: 115},
      {name: 'Ab8', frequency: 6644.880, midi: 116},
      {name: 'A8',  frequency: 7040.000, midi: 117},
      {name: 'Bb8', frequency: 7458.620, midi: 118},
      {name: 'B8',  frequency: 7902.130, midi: 119},
    ]
  } else {
    console.log('TODO: scaleFilter')
  }
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)()

const gainMaster = audioContext.createGain()
gainMaster.gain.value = parseFloat(nodeControls.masterGain.currentValue)

nodeControls.masterGain.audioNode = audioContext.createGain()
nodeControls.masterGain.audioNode.gain.value = parseFloat(nodeControls.masterGain.currentValue)

const destinationMaster = audioContext.destination

const createSendChain = function() {
  // console.log('creating send chain')

  // TODO: distortion
  // oscSend = audioContext.createWaveShaper()
  // oscSend.curve = makeDistortionCurve(80) //0-100 optimal
  // oscSend.oversample = "4x"

  // TODO: reverb
  // oscSend = audioContext.createConvolver()

  // delay
  // masterGain->delay->eqLow
  if (nodeControls.delay.enabled !== false && !nodeControls.delay.audioNode) {
    nodeControls.delay.audioNode = audioContext.createDelay(nodeControls.delay.max)
    nodeControls.delay.audioNode.delayTime.setValueAtTime(nodeControls.delay.currentValue, audioContext.currentTime)

    const delayGainNode = audioContext.createGain()
    delayGainNode.gain.value = (parseFloat(nodeControls.masterGain.currentValue) * 0.75).toFixed(1)

    nodeControls.masterGain.audioNode.connect(delayGainNode)
    delayGainNode.connect(nodeControls.delay.audioNode)

    nodeControls.delay.audioNode.connect(nodeControls.eqLow.audioNode)
  }
  // masterGain->eqLow
  else if (nodeControls.delay.audioNode && !nodeControls.delay.enabled) {
    nodeControls.delay.audioNode.disconnect()
    nodeControls.masterGain.audioNode.connect(nodeControls.eqLow.audioNode)
  }
  // masterGain->eqLow
  else {
    nodeControls.masterGain.audioNode.connect(nodeControls.eqLow.audioNode)
  }
}
const createMasterChain = function() {
  // console.log('creating master chain')

  // eqLow
  nodeControls.eqLow.audioNode = audioContext.createBiquadFilter()
  nodeControls.eqLow.audioNode.type = 'lowshelf'
  nodeControls.eqLow.audioNode.frequency.value = 35
  nodeControls.eqLow.audioNode.gain.value = 0.5

  // eqMid
  nodeControls.eqMid.audioNode = audioContext.createBiquadFilter()
  nodeControls.eqMid.audioNode.type = 'peaking'
  nodeControls.eqMid.audioNode.frequency.value = 440
  nodeControls.eqMid.audioNode.Q.value = 0 // larger value means smaller band
  nodeControls.eqMid.audioNode.gain.value = 0

  // eqHigh
  nodeControls.eqHigh.audioNode = audioContext.createBiquadFilter()
  nodeControls.eqHigh.audioNode.type = 'highshelf'
  nodeControls.eqHigh.audioNode.frequency.value = 4700
  nodeControls.eqHigh.audioNode.gain.value = 0.5

  // compressor
  nodeControls.compressor.audioNode = audioContext.createDynamicsCompressor()
  nodeControls.compressor.audioNode.threshold.setValueAtTime(-50, audioContext.currentTime)
  nodeControls.compressor.audioNode.knee.setValueAtTime(40, audioContext.currentTime)
  nodeControls.compressor.audioNode.ratio.setValueAtTime(nodeControls.compressor.currentValue, audioContext.currentTime)
  nodeControls.compressor.audioNode.attack.setValueAtTime(0, audioContext.currentTime)
  nodeControls.compressor.audioNode.release.setValueAtTime(0.25, audioContext.currentTime)

  // eqLow->eqMid->eqHigh->compressor
  nodeControls.eqLow.audioNode.connect(nodeControls.eqMid.audioNode)
  nodeControls.eqMid.audioNode.connect(nodeControls.eqHigh.audioNode)
  nodeControls.eqHigh.audioNode.connect(nodeControls.compressor.audioNode)

  // TODO: analyser
  // nodeControls.compressor.audioNode.connect(analyser)
  // analyser.connect(destinationMaster)

  // if panning, then compressor->pan->destination
  if (audioContext.createStereoPanner && nodeControls.pan) {
    nodeControls.pan.audioNode = audioContext.createStereoPanner()
    nodeControls.pan.audioNode.pan.setValueAtTime(0, audioContext.currentTime)

    nodeControls.compressor.audioNode.connect(nodeControls.pan.audioNode)

    nodeControls.pan.audioNode.connect(destinationMaster)
  }
  // if no panning, compressor->destination
  else {
    nodeControls.compressor.audioNode.connect(destinationMaster)
  }
}

const checkEnabledChanged = function(controlName, isChecked) {
  nodeControls[controlName].enabled = isChecked
  createSendChain()
}
const controlValueChanged = function(controlName, newValue) {
  const control = nodeControls[controlName]

  // console.log(`updating nodeControls[${controlName}]`, newValue)

  if (control.parameter == 'root') {

  }
  else if (control.parameter == 'waveType') {

  }
  // otherwise, it's a gain modifier, most likely
  else if (control && control.audioNode[control.parameter]) {
    // console.log('control.parameter', control.parameter)
    // console.log('control.audioNode', control.audioNode)
    // console.log('control.audioNode[control.parameter]', control.audioNode[control.parameter])

    if (control.type == 'range') {
      if (newValue <= parseFloat(control.max) && newValue >= parseFloat(control.min)) {
        control.currentValue = parseFloat(newValue).toFixed(1)
        control.audioNode[control.parameter].setValueAtTime(
          control.currentValue,
          audioContext.currentTime
        )
      }
    } else {
      control.currentValue = parseFloat(newValue).toFixed(1)
      control.audioNode[control.parameter].setValueAtTime(
        control.currentValue,
        audioContext.currentTime
      )
    }
  } else {
    // console.error(`nodeControls['${controlName}'] not found, value could not be updated.`)
  }
}

const selectOptionChanged = function(controlName, newValue) {
  const control = nodeControls[controlName]

  // console.log('controlName', controlName)
  // console.log('newValue', newValue)
  // console.log('control', control)
  // console.log('control.parameter', control.parameter)
}

// expand/collapse synth controls
const toggleSynthControls = function() {
  let toggleSynthControl = document.getElementById('synth-controls-container')

  if (toggleSynthControl.style.display === 'none') {
    document.getElementById('toggle-synth-controls').src = '/assets/svg/bi-caret-down-fill.svg'

    toggleSynthControl.style.display = 'flex'
  } else {
    document.getElementById('toggle-synth-controls').src = '/assets/svg/bi-caret-right-fill.svg'

    toggleSynthControl.style.display = 'none'
  }
}

// midi, keyboard, mouse inputs all come here to create actual sound
const noteStart = function(noteNum, velocity = 64) {
  const domKey = document.querySelectorAll(`button[data-noteid='${noteNum}']`)[0]

  if (domKey) {
    domKey.classList.add('active')
  }

  startTime = audioContext.currentTime

  // set note's volume envelope
  const envelope = adsr.clone()
  envelope.peakLevel = (velocity / 127) * parseFloat(nodeControls.masterGain.currentValue)

  createFrequencyOscillator(noteNum, startTime, envelope)

  oscillators[noteNum][0].start(startTime)

  // TODO: note/chord recognition
  // console.log('noteStart osc values', Object.values(oscillators))
  // console.log('noteStart osc values length', Object.values(oscillators).length)
  // console.log('noteStart oscillators[noteNum]', oscillators[noteNum][0].frequency.value)
  // console.log('noteStart osc values == null?', Object.values(oscillators).every(osc => osc == null))

  // oscillators[noteNum][0].onended = function() {
  //   if (oscillators[noteNum]) {
  //     if (oscillators[noteNum][1]) {
  //       if (oscillators[noteNum][1].gain) {
  //         if ('disconnect' in oscillators[noteNum][1].gain) {
  //           oscillators[noteNum][1].gain.disconnect()
  //         }
  //       }

  //       oscillators[noteNum][1].disconnect()

  //       delete oscillators[noteNum]
  //     }
  //   }
  // }
}
const noteStop = function(noteNum, velocity = 64) {
  noteCurrent = null

  if (oscillators[noteNum]) {
    const domKey = document.querySelectorAll(`button[data-noteid='${noteNum}']`)[0]

    if (domKey) {
      domKey.classList.remove('active')
    }

    const playbackTime = audioContext.currentTime
    // const stopTime = playbackTime + 0.5

    oscillators[noteNum][1].gain.cancelScheduledValues(startTime)

    // set note's volume envelope
    const envelope = adsr.clone()
    envelope.peakLevel = (velocity / 127) * parseFloat(nodeControls.masterGain.currentValue)

    // FIXME: potential popping fix?
    // oscillators[noteNum][1].gain.setValueAtTime(nodeControls.masterGain.currentValue, playbackTime)
    // oscillators[noteNum][1].gain.exponentialRampToValueAtTime(0.0001, stopTime)
    // oscillators[noteNum][0].stop(stopTime + 0.6)

    envelope.gateTime = playbackTime - startTime
    envelope.applyTo(oscillators[noteNum][1].gain, startTime)

    oscillators[noteNum][0].stop(startTime + envelope.duration)

    oscillators[noteNum] = null
    delete oscillators[noteNum]

    // TODO: note/chord recognition
    // console.log('noteStop osc values', Object.values(oscillators))
    // console.log('noteStop osc values length', Object.values(oscillators).length)
    // console.log('noteStop osc values == null', Object.values(oscillators).every(osc => osc == null))
  }
}
const createFrequencyOscillator = function(noteNum, startTime, envelope) {
  // create Web Audio oscillator
  const oscillator = audioContext.createOscillator()
  const note = musicalNotes[noteNum]

  // set oscillator wave type
  oscillatorType = document.getElementById('osc-type')
    .options[document.getElementById('osc-type').selectedIndex]
    .value
  oscillator.type = oscillatorType

  // set oscillator frequency
  oscillator.frequency.value = parseFloat(note.frequency)

  // create oscillator gain
  var gainNode = audioContext.createGain()
  gainNode.gain.value = nodeControls.masterGain.currentValue

  // apply ADSR to gain
  envelope.gateTime = Infinity
  envelope.applyTo(gainNode.gain, audioContext.currentTime)

  // connect oscillator to master gain node
  oscillator.connect(gainNode).connect(nodeControls.masterGain.audioNode)

  // add oscillator to list of oscillators
  oscillators[noteNum] = [oscillator, gainNode]
}

const useKeyboardCheckboxChanged = (isChecked) => {
  useKeyboard = isChecked
  updateKeyboardEventHandler()
}
// update computer keyboard support
const updateKeyboardEventHandler = () => {
  if (useKeyboard) {
    document.addEventListener('keydown', keyController)
    document.addEventListener('keyup', keyController)

    console.log('keyboard support enabled')
  } else {
    document.removeEventListener('keydown', keyController)
    document.removeEventListener('keyup', keyController)

    console.log('keyboard support disabled')
  }
}
// handle computer keyboard inputs
const keyController = (e) => {
  // computer keyboard controls
  // [z,     x, c, v, b, n,   m ]
  // musical note
  // [C4,    D4,E4,F4,G4,A4,  B4]
  // frequency
  // [261.63,            440,   ]
  // midi number
  // [60,    62,64,65,67,69,  71]

  const key2midi = {
    'z': 60, 's': 61, 'x': 62, 'd': 63, 'c': 64, 'v': 65,
    'g': 66, 'b': 67, 'h': 68, 'n': 69, 'j': 70, 'm': 71,
    'q': 72, '2': 73, 'w': 74, '3': 75, 'e': 76, 'r': 77,
    '5': 78, 't': 79, '6': 80, 'y': 81, '7': 82, 'u': 83,
    'i': 84
  }

  const note = key2midi[e.key]

  if (e.type == 'keydown') {
    if (note >= 60 && note <= 84) {
      noteStart(note, 64)
    }
  } else if (e.type == 'keyup') {
    noteStop(note)
  }
}

const useMouseCheckboxChanged = (isChecked) => {
  useMouse = isChecked
  updateMouseEventHandler()
}
// update computer mouse support
const updateMouseEventHandler = () => {
  if (useMouse) {
    // console.log('mouse/touch support enabled')
  } else {
    // console.log('mouse/touch support disabled')
  }
}

const useMidiCheckboxChanged = (isChecked) => {
  useMidi = isChecked
  updateMidiEventHandler()
}
// update midi input support
const updateMidiEventHandler = () => {
  if (useMidi) {
    if ('requestMIDIAccess' in navigator) {
      navigator.requestMIDIAccess({ sysex: false }).then(onMIDISuccess, onMIDIFailure)
    } else {
      console.error('navigator.requestMIDIAccess() not supported')
    }
  } else {
    Array.from(Keybord.midi.inputs).forEach((input) => {
      input[1].onmidimessage = null
    })
    Keybord.midi = null
    console.log('midi support disabled', Keybord.midi)
  }
}
const onMIDISuccess = (midi) => {
  Keybord.midi = midi

  Array.from(Keybord.midi.inputs).forEach((input) => {
    input[1].onmidimessage = midiController
  })

  console.log('midi support enabled', Keybord.midi)
}
const onMIDIFailure = (msg) => {
  console.error(`Failed to get MIDI access - ${msg}`)
}
// handle midi inputs
const midiController = (e) => {
  let str = `MIDI message received at ${e.timeStamp}[${e.data.length} bytes]: `

  for (const character of e.data) {
    str += `0x${character.toString(16)} `
  }

  let data = e.data
  let cmd = data[0] >> 4, channel = data[0] & 0xf,
      type = data[0] & 0xf0, noteNum = data[1], velocity = data[2]

  switch (type) {
    // noteOn message
    case 144:
      noteStart(noteNum, velocity)
      break
    // noteOff message
    case 128:
      noteStop(noteNum, velocity)
      break
    // TODO: pitch bend
    case 224:
      // 0 (-1 octave) -> 64 (no bend) -> 127 (+1 octave)
      const pitchBend = e.data[2]
      // 0 (-1 octave) -> 1 (no bend) -> 2 (+1 octave)
      // pitchBend = ((pitchBend / 127).toFixed(2)) * 2

      if (noteMap[noteCurrent]) {
        console.log('midi', noteMap[noteCurrent].oscillator)

        const curFreq = noteMap[noteCurrent].oscillator.frequency.value

        console.log('curFreq', curFreq)

        if (pitchBend == 64) {
          noteMap[noteCurrent].oscillator.frequency.setTargetAtTime(curFreq, 0, 0.05)
          detuneAmount = 0
        } else {
          const detuneFreq = Math.pow(2, 1 / 12) * (pitchBend - 64)

          noteMap[noteCurrent].oscillator.frequency.setTargetAtTime(curFreq + detuneFreq, 0, 0.05)
          detuneAmount = detuneFreq
        }

        console.log('midi', noteMap[noteCurrent].oscillator)
        // console.log('freq + bend', noteMap[noteCurrent].oscillator.frequency.value)
        // console.log('detune', noteMap[noteCurrent].oscillator)
      }

      break
    // TODO: mod change
    case 176:
      break
    // all others
    default:
      console.log('str', str)
      break
  }
}

const rootNoteChanged = (val) => {
  console.log('Synth rootNoteChanged', val)
}
const scaleTypeChanged = (val) => {
  console.log('Synth scaleTypeChanged', val)
}

createMasterChain()
createSendChain()

// TODO: analyser/oscilloscope
// const bufferLength = analyser.fftSize

let isPlaying, pixelRatio, sizeOnScreen, segmentWidth

// const canvas = ref(null)
// const canvasCtx = ref(null)

const analyser = audioContext.createAnalyser()
analyser.fftSize = 2048
analyser.smoothingTimeConstant = 1
const bufferLength = analyser.frequencyBinCount
const dataArray = new Uint8Array(bufferLength)

// drawToCanvas()

onMounted(() => {
  // TODO: analyser
  const canvas = document.getElementById('visualizer')
  const c = canvas.getContext('2d')

  // make canvas take up entire content
  // canvas.style.position = 'relative'
  // canvas.style.top = '10%'
  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
  // pixelRatio = window.devicePixelRatio;
  // sizeOnScreen = canvas.getBoundingClientRect();
  // canvas.width = sizeOnScreen.width * pixelRatio;
  // canvas.height = sizeOnScreen.height * pixelRatio;
  // canvas.style.width = canvas.width / pixelRatio + "px";
  // canvas.style.height = canvas.height / pixelRatio + "px";

  // make canvas take up limited box size
  canvas.width = 640
  canvas.height = 100

  // make initial line
  c.fillStyle = "#f8f8f8"
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.strokeStyle = "#09714b"
  c.beginPath()
  c.moveTo(0, canvas.height / 2)
  c.lineTo(canvas.width, canvas.height / 2)
  c.stroke()

  // define function to update canvas
  const drawToCanvas = function() {
    // drawVisual = requestAnimationFrame(drawToCanvas)
    analyser.getByteTimeDomainData(dataArray)
    segmentWidth = canvas.width / analyser.frequencyBinCount

    c.fillRect(0, 0, canvas.width, canvas.height)
    c.beginPath()
    c.moveTo(-100, canvas.height / 2)

    if (isPlaying) {
      for (let i = 1; i < analyser.frequencyBinCount; i += 1) {
        let x = i * segmentWidth
        let v = dataArray[i] / 128.0
        let y = (v * canvas.height) / 2
        c.lineTo(x, y)
      }
    }

    c.lineTo(canvas.width + 100, canvas.height / 2)
    c.stroke()
    requestAnimationFrame(draw)
  }
})
</script>

<template>

  <h3 id="synth-controls-header">
    <span @click="toggleSynthControls">Synth Controls</span>
    <img
      id="toggle-synth-controls"
      src="/assets/svg/bi-caret-right-fill.svg"
      @click="toggleSynthControls"
    />
  </h3>
  <div id="synth-controls-container" style="display: none">
    <NodeControl
      v-for="(control, key) in nodeControls"
      :control-key="key"
      :control-data="control"
      @control-value-changed="controlValueChanged"
      @check-enabled-changed="checkEnabledChanged"
      @select-option-changed="selectOptionChanged"
      @increase-value="(controlKey) => controlValueChanged(controlKey, (parseFloat(nodeControls[controlKey].currentValue) + parseFloat(nodeControls[controlKey].step)).toFixed(1))"
      @decrease-value="(controlKey) => controlValueChanged(controlKey, (parseFloat(nodeControls[controlKey].currentValue) - parseFloat(nodeControls[controlKey].step)).toFixed(1))"
    />
  </div>

  <canvas ref="canvas" id="visualizer"></canvas>

  <!-- TODO: note/chord recognition
  <div id="note-recognition">
    <template v-if="Object.values(oscillators).length">
      {{ Object.values(oscillators).map(osc => musicalNotes[noteNum - 12].name).join(',') }}
      {{ Object.entries(oscillators) }}
    </template>
    <template v-else>
      No notes.
    </template>
  </div>
  -->

  <Keyboard
    :musical-notes="musicalNotes"
    :root-note="rootNote"
    :scale-type="scaleType"
    :use-keyboard="useKeyboard"
    :use-mouse="useMouse"
    :use-midi="useMidi"
    @checked-changed-keyboard="useKeyboardCheckboxChanged"
    @checked-changed-mouse="useMouseCheckboxChanged"
    @checked-changed-midi="useMidiCheckboxChanged"
    @note-pressed="noteStart"
    @note-released="noteStop"
    @select-changed-root-note="rootNoteChanged"
    @select-changed-scale-type="scaleTypeChanged"
  />

</template>

<style scoped>
#synth-controls-header {
  padding: 5px 10px 0 15px;
}
  @media (hover: hover) {
    #synth-controls-header:hover {
      cursor: pointer;
    }
  }
  #synth-controls-header img {
    left: 2px;
    position: relative;
    top: 3px;
  }
  body.dark-theme #synth-controls-header img {
    filter: invert(100%) sepia(100%) saturate(13%) hue-rotate(237deg) brightness(104%) contrast(104%);
  }

#synth-controls-container {
  background-color: var(--white-soft);
  border: 2px solid var(--gray-light);
  flex-direction: column;
  height: 150px;
  margin: 0 10px 5px 15px;
  overflow-y: auto;
  padding: 5px;
}
  body.dark-theme #synth-controls-container {
    background-color: var(--black-mute);
  }
  #synth-controls-container fieldset.control-column {
    align-items: center;
    border: 1px solid var(--color-text);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 5px;
    text-align: center;
  }
    #synth-controls-container fieldset.control-column.dropdown-control {
      padding-bottom: 8px;
    }
    #synth-controls-container fieldset.control-column legend {
      margin: 0 auto;
      text-align: center;
      white-space: nowrap;
    }
    #synth-controls-container fieldset.control-column input[type=checkbox] {
      margin: 0 4px;
    }
    #synth-controls-container fieldset.control-column input[type=number] {
      margin: 0 auto;
    }
    #synth-controls-container fieldset.control-column input[type=range] {
      display: block;
      margin: 8px auto;
    }

@media (min-width: 600px) {
  #synth-controls-container {
    align-items: normal;
    flex-wrap: wrap;
  }
    #synth-controls-container fieldset.control-column {
      margin-left: 0;
      margin-right: 8px;
    }
      #synth-controls-container fieldset.control-column:last-child {
        margin-right: 0;
      }
}

#note-recognition {
  background-color: var(--white-soft);
  border: 1px solid var(--black);
  box-shadow: 1px 1px 1px 1px;
  color: var(--black);
  height: 50px;
  margin: 1rem auto;
  padding: 1rem;
  width: 50%;
}

#visualizer {
  border: 1px solid #000000;
  display: none;
  margin: 0 auto 10px;
  position: relative;
}
</style>
