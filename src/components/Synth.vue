<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
import NodeControl from './NodeControl.vue'
import Keyboard from './Keyboard.vue'
import ADSREnvelope from 'adsr-envelope'

const currentNotes = ref([])
const oscillators = reactive([])
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
  pitchBend: {
    title: 'Pitch Bend',
    type: 'range',
    numberInputId: 'pitchbend-value',
    rangeInputId: 'pitchbend-range',
    currentValue: '2',
    audioNode: '',
    step: '1',
    min: '1',
    max: '12',
    parameter: 'delayTime',
    enabled: true,
    isVertical: true
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

let Keybord = getCurrentInstance().appContext.config.globalProperties
let oscillatorType = 0
let noteCurrent = null
let startTime = 0
let pitchBendRange = 2
let modInterval = null

let useKeyboard
let useMouse
let useMidi

const audioContext = new (window.AudioContext || window.webkitAudioContext)()

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
const visualizer = new AnalyserNode(audioContext, {
  fftSize: 2048,
  smoothingTimeConstant: 1
})
const intervals = {
  'major': [4,3],
  'aug'  : [4,4],
  'minor': [3,4],
  'dim'  : [3,3],
  'sus2' : [2,5],
  'sus4' : [5,2],
  'dom7' : [4,3,3],
  'min7' : [3,4,3],
  'maj7' : [4,3,4],
  '7sus4': [5,2,3]
}
const musicalNotes = [
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

const gainMaster = audioContext.createGain()
gainMaster.gain.value = parseFloat(nodeControls.masterGain.currentValue)

nodeControls.masterGain.audioNode = audioContext.createGain()
nodeControls.masterGain.audioNode.gain.value = parseFloat(nodeControls.masterGain.currentValue)

const destinationMaster = audioContext.destination

// creates a connection of nodes for FX
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
// creates a connection of nodes from FX
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

  // if panning, then compressor->pan->destination
  if (audioContext.createStereoPanner && nodeControls.pan) {
    nodeControls.pan.audioNode = audioContext.createStereoPanner()
    nodeControls.pan.audioNode.pan.setValueAtTime(0, audioContext.currentTime)

    nodeControls.compressor.audioNode.connect(nodeControls.pan.audioNode)

    nodeControls.pan.audioNode.connect(visualizer)
    visualizer.connect(destinationMaster)
  }
  // if no panning, compressor->destination
  else {
    nodeControls.compressor.audioNode.connect(visualizer)
    visualizer.connect(destinationMaster)
  }
}

const checkEnabledChanged = function(controlName, isChecked) {
  nodeControls[controlName].enabled = isChecked
  createSendChain()
}
const controlValueChanged = function(controlName, newValue) {
  const control = nodeControls[controlName]

  // console.log(`updating nodeControls[${controlName}]`, newValue)

  if (controlName == 'pitchBend') {
    const semitones = parseInt(newValue)

    if (semitones <= control.max && semitones >= control.min) {
      control.currentValue = semitones
      pitchBendRange = parseInt(semitones)
    }
  }
  else if (control.parameter == 'waveType') {}
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
    console.error(`nodeControls['${controlName}'] not found, value could not be updated.`)
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

  // update UI
  if (domKey) {
    domKey.classList.add('active')
  }

  startTime = audioContext.currentTime

  // set note's volume envelope
  const envelope = adsr.clone()
  envelope.peakLevel = (velocity / 127) * parseFloat(nodeControls.masterGain.currentValue)

  // create a new Oscillator, and add it to array of Oscillator instances
  createOscillatorNode(noteNum, startTime, envelope)

  // start playing the oscillator
  oscillators[noteNum][0].start(startTime)

  // update chord recognition display
  currentNotes.value = getChord(Object.keys(oscillators))

  // FIXME: potential stuck note fix?
  oscillators[noteNum][0].onended = function() {
    if (oscillators[noteNum] &&
      oscillators[noteNum][1] &&
      oscillators[noteNum][1].gain &&
      'disconnect' in oscillators[noteNum][1].gain
    ) {
      oscillators[noteNum][1].gain.cancelScheduledValues(startTime)
      oscillators[noteNum][1].gain.disconnect()
      oscillators[noteNum][1].disconnect()
      delete oscillators[noteNum]
    }
  }
}
const noteStop = function(noteNum, velocity = 64) {
  // kill current note reference
  noteCurrent = null

  // if the note being stopped is in the array of oscillators, kill it
  if (oscillators[noteNum]) {
    const domKey = document.querySelectorAll(`button[data-noteid='${noteNum}']`)[0]

    // update UI
    if (domKey) {
      domKey.classList.remove('active')
    }

    const playbackTime = audioContext.currentTime

    oscillators[noteNum][1].gain.cancelScheduledValues(startTime)

    // set note's volume envelope
    const envelope = adsr.clone()
    envelope.peakLevel = (velocity / 127) * parseFloat(nodeControls.masterGain.currentValue)

    // FIXME: potential popping fix?
    // const stopTime = playbackTime + 0.5
    // oscillators[noteNum][1].gain.setValueAtTime(nodeControls.masterGain.currentValue, playbackTime)
    // oscillators[noteNum][1].gain.exponentialRampToValueAtTime(0.0001, stopTime)
    // oscillators[noteNum][0].stop(stopTime + 0.6)

    envelope.gateTime = playbackTime - startTime
    envelope.applyTo(oscillators[noteNum][1].gain, startTime)

    oscillators[noteNum][0].stop(startTime + envelope.duration)

    // set array key for note to null
    oscillators[noteNum] = null
    // delete oscillator key in array
    delete oscillators[noteNum]

    // update chord recognition display
    currentNotes.value = getChord(Object.keys(oscillators))
  }
}
const pitchBend = function(velocity) {
  // 0 (-1 octave) -> 64 (no bend) -> 127 (+1 octave)
  const pbRaw = velocity

  // MIDI 0 - 127
  const inMin = 0
  const inMax = 127
  // musical cents (100 == half-step)
  const outMin = pitchBendRange * -100
  const outMax = pitchBendRange * 100
  const calcScale = Math.pow(10, 2)

  // scale to useful multiplier
  // -1 (-1 octave) -> 0 (no bend) -> 1 (+1 octave)
  let pbCents = (pbRaw - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
  pbCents = Math.round(pbCents * calcScale) / calcScale

  if (pbCents > 0 && pbCents <= 0.02) {
    pbCents = 0
  }

  // console.log('pbCents', pbCents)

  oscillators.forEach(osc => {
    osc[0].detune.setValueAtTime(pbCents, audioContext.currentTime)

    // const curFreq = osc[0].frequency.value
    // const newFreq = curFreq + pbCents
    // console.log(`pitchBend - cur: ${curFreq}, mult: ${pbCents}, new: ${newFreq}`)
  })
}
// TODO: pitchMod
//   sort of works, but effect is not quite correct yet
//   also, setting to 0 does not reset properly
//   and make pitchBend inoperable
//
// const pitchMod = function(velocity) {
//   // 0 (-5) -> 64 (no mod) -> 127 (+1 octave)
//   const pmRaw = velocity

//   // console.log('pmRaw', pmRaw)

//   // MIDI 0 - 127
//   const inMin = 0
//   const inMax = 127
//   // musical cents (100 == half-step)
//   const outMin = 0
//   const outMax = 100
//   const calcScale = Math.pow(10, 2)

//   // scale to useful multiplier
//   // 0 (0 no mod) -> 1 (+50 cents)
//   let pmCents = (pmRaw - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
//   pmCents = Math.round(pmCents * calcScale) / calcScale

//   console.log('pmCents', pmCents)

//   let xspacing = 16
//   let height = 16
//   let width = 16
//   let theta = 0.0
//   let theta_dx = 0.02
//   let amplitude = 75.0
//   let period = 500.0
//   let dx = (Math.PI * 2) / period
//   let yvalues = new Array(Math.floor(width / xspacing))

//   function draw() {
//     calcWave()
//     return renderWave()
//   }

//   function calcWave() {
//     // Increment theta (try different values for 'angular velocity' here)
//     theta += theta_dx;

//     // For every x value, calculate a y value with sine function
//     let x = theta;
//     for (let i = 0; i < yvalues.length; i++) {
//       yvalues[i] = Math.sin(x) * amplitude;
//       x += dx;
//     }
//   }

//   function renderWave() {
//     for (let x = 0; x < yvalues.length; x++) {
//       const xCoord = x * xspacing
//       const yCoord = ((height / 2) + yvalues[x]) * 0.2

//       return yCoord
//     }
//   }

//   if (pmCents > 0) {
//     modInterval = setInterval(() => {
//       oscillators.forEach(osc => {
//         const newDetune = draw()
//         console.log('newDetune', newDetune)
//         osc[0].detune.setValueAtTime(newDetune, audioContext.currentTime)
//       }, 1)
//     })
//   } else {
//     console.log('no pitchmod applied', velocity)

//     if (modInterval) {
//       clearInterval(modInterval)
//       console.log('cleared modInterval', modInterval)

//       // reset all oscillators' detune value
//       oscillators.forEach(osc => osc[0].detune.setValueAtTime(0, audioContext.currentTime))
//     }
//   }
// }

// add new OscillatorNode to array of oscillators
const createOscillatorNode = function(noteNum, startTime, envelope) {
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
  oscillator.connect(gainNode)
  gainNode.connect(nodeControls.masterGain.audioNode)

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
    if (Keybord.midi) {
      Array.from(Keybord.midi.inputs).forEach((input) => {
        input[1].onmidimessage = null
      })
      Keybord.midi = null

      console.log('midi support disabled', Keybord.midi)
    }
  }
}
const onMIDISuccess = (midi) => {
  Keybord.midi = midi

  console.log('midi support enabled', midi)

  Array.from(Keybord.midi.inputs).forEach((input, index) => {
    input[1].onmidimessage = midiController

    console.log(`midi input #${index} detected: ${input[1].name}`)
  })
}
const onMIDIFailure = (msg) => {
  console.error(`Failed to get MIDI access - ${msg}`)
}
// handle midi inputs
const midiController = (e) => {
  let timestamp = e.timeStamp
  let data = e.data
  let cmd = data[0] >> 4
  let channel = data[0] & 0xf
  let type = data[0] & 0xf0
  let noteNum = data[1]
  let velocity = data[2]
  // let midiRaw = '   raw[ '

  // console.log(`MIDI message received at ${timestamp}[${data.length} bytes]:`)

  // for (const character of data) {
  //   midiRaw += `0x${character.toString(16)} `
  // }

  // midiRaw += ']'

  // let midiProcessed = `  proc[ cmd: ${cmd}, chan: ${channel}, type: ${type}, note: ${noteNum}, vel: ${velocity} ]`

  // console.log(midiRaw)
  // console.log(midiProcessed)

  switch (type) {
    // noteOn message
    case 144:
      noteStart(noteNum, velocity)
      break
    // noteOff message
    case 128:
      noteStop(noteNum, velocity)
      break
    // pitch bend
    case 224:
      pitchBend(velocity)
      break
    // mod change
    case 176:
      // pitchMod(velocity)
      break
    // all others
    default:
      break
  }
}

createMasterChain()
createSendChain()

// stop all runaway oscillators
const panic = () => {
  oscillators.map(osc => osc[0].stop())

  console.log('oscillators stopped')
}

const getChord = (midiNums) => {
  // console.log('getChord notes', midiNums)

  if (midiNums.length > 2) {
    const noteCount = midiNums.length
    let chordName
    let intval1, intval2, intval3

    switch (noteCount) {
      case 3: // triad
        intval1 = midiNums[1] - midiNums[0]
        intval2 = midiNums[2] - midiNums[1]

        if (_arraysAreEqual([intval1, intval2], intervals['major'])) {
          chordName = `${_midi2Name(midiNums[0])}maj`
        }
        else if (_arraysAreEqual([intval1, intval2], intervals['aug'])) {
          chordName = `${_midi2Name(midiNums[0])}aug`
        }
        else if (_arraysAreEqual([intval1, intval2], intervals['minor'])) {
          chordName = `${_midi2Name(midiNums[0])}min`
        }
        else if (_arraysAreEqual([intval1, intval2], intervals['dim'])) {
          chordName = `${_midi2Name(midiNums[0])}dim`
        }
        else if (_arraysAreEqual([intval1, intval2], intervals['sus2'])) {
          chordName = `${_midi2Name(midiNums[0])}sus2`
        }
        else if (_arraysAreEqual([intval1, intval2], intervals['sus4'])) {
          chordName = `${_midi2Name(midiNums[0])}sus4`
        }
        else {
          chordName = `${_midi2Name(midiNums[0])}(unidentified)`
        }

        break

      case 4:
        intval1 = midiNums[1] - midiNums[0]
        intval2 = midiNums[2] - midiNums[1]
        intval3 = midiNums[3] - midiNums[2]

        if (_arraysAreEqual([intval1, intval2, intval3], intervals['dom7'])) {
          chordName = `${_midi2Name(midiNums[0])}7`
        }
        else if (_arraysAreEqual([intval1, intval2, intval3], intervals['min7'])) {
          chordName = `${_midi2Name(midiNums[0])}min7`
        }
        else if (_arraysAreEqual([intval1, intval2, intval3], intervals['maj7'])) {
          chordName = `${_midi2Name(midiNums[0])}maj7`
        }
        else if (_arraysAreEqual([intval1, intval2, intval3], intervals['7sus4'])) {
          chordName = `${_midi2Name(midiNums[0])}7sus4`
        }
        else {
          chordName = `${_midi2Name(midiNums[0])}(unidentified)`
        }

        break

      default:
        chordName = `${_midi2Name(midiNums[0])}(unidentified)`

        break
    }

    return chordName
  } else {
    const letters = []

    midiNums.forEach(midi => {
      letters.push(_midi2Name(midi))
    })

    return letters.join(',')
  }
}

const _arraysAreEqual = (arr1, arr2) => {
  return arr1.join() == arr2.join()
}
const _midi2Name = (midiNumber) => {
  const name = musicalNotes.filter(mNote => mNote.midi == midiNumber)[0].name

  return name[2] == 'b' ? `${name[0]}${name[1]}` : `${name[0]}`
}

let segmentWidth
const dataArray = new Uint8Array(visualizer.frequencyBinCount)

onMounted(() => {
  const canvas = document.getElementById('visualizer')
  const c = canvas.getContext('2d')

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
    visualizer.getByteTimeDomainData(dataArray)
    segmentWidth = canvas.width / visualizer.frequencyBinCount

    c.fillRect(0, 0, canvas.width, canvas.height)
    c.beginPath()
    c.moveTo(-100, canvas.height / 2)

    if (currentNotes.value.length) {
      for (let i = 1; i < visualizer.frequencyBinCount; i += 1) {
        let x = i * segmentWidth
        let v = dataArray[i] / 128.0
        let y = (v * canvas.height) / 2
        c.lineTo(x, y)
      }
    }

    c.lineTo(canvas.width + 100, canvas.height / 2)
    c.stroke()
    requestAnimationFrame(drawToCanvas)
  }

  drawToCanvas()
})
</script>

<template>

  <Keyboard
    :musical-notes="musicalNotes"
    :use-keyboard="useKeyboard"
    :use-mouse="Keybord.env == 'prod' ? true : false"
    :use-midi="useMidi"
    @checked-changed-keyboard="useKeyboardCheckboxChanged"
    @checked-changed-mouse="useMouseCheckboxChanged"
    @checked-changed-midi="useMidiCheckboxChanged"
    @note-pressed="noteStart"
    @note-released="noteStop"
    @panic="panic"
  />

  <div id="visualizer-container" style="display: none">
    <canvas ref="canvas" id="visualizer"></canvas>
  </div>

  <div id="synth-controls-header">
    <button @click="toggleSynthControls">
      <img
        id="toggle-synth-controls"
        src="/assets/svg/bi-caret-right-fill.svg"
      />
      Synth Controls
    </button>

    <span
      id="note-recognition"
      :class="{ 'empty': !currentNotes.length }"
    >
      {{ currentNotes.length ? currentNotes : 'No notes.' }}
    </span>
  </div>
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

</template>

<style scoped>
#synth-controls-header {
  align-items: center;
  display: flex;
  justify-content: flex-start;
  padding: 0 5px;
}
  @media (min-width: 1024px) {
    #synth-controls-header {
      padding: 0 20px;
    }
  }
  #synth-controls-header button {
    border: 2px solid var(--color-border);
    color: var(--color-text);
    font-size: 1.5rem;
  }
    @media (hover: hover) {
      #synth-controls-header button:hover {
        background-color: var(--green);
        color: var(--green-bright-active);
      }
    }
    #synth-controls-header button img {
      left: 0;
      position: relative;
      top: 2px;
    }
  body.dark-theme #synth-controls-header img {
    filter: invert(100%) sepia(100%) saturate(13%) hue-rotate(237deg) brightness(104%) contrast(104%);
  }
  #note-recognition {
    background-color: var(--green-bright-active);
    border: 1px solid var(--gray-dark);
    border-radius: 4px;
    box-shadow: inset 0 0 5px 1px var(--green);
    color: var(--black);
    font-weight: bold;
    height: 35px;
    margin-left: 1rem;
    padding: 0.4rem 0.75rem;
    width: 100%;
  }
    @media (min-width: 768px) {
      #note-recognition {
        max-width: 150px;
      }
    }
    #note-recognition.empty {
      background-color: var(--gray-light);
      box-shadow: inset 0 0 5px 1px var(--gray);
      color: var(--gray);
      font-weight: normal;
    }

#synth-controls-container {
  background-color: var(--white-soft);
  border: 2px solid var(--gray-light);
  flex-direction: column;
  height: 150px;
  margin: 5px;
  overflow-y: auto;
  padding: 5px;
}
  @media (min-width: 768px) {
    #synth-controls-container {
      margin: 0 10px 5px 15px;
    }
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

#visualizer-container {
  margin: 5px auto 0;
  width: 50%;
}
  #visualizer {
    border: 2px solid var(--black);
    border-radius: 4px;
    height: 50px;
    margin: 0;
    padding: 0;
    position: relative;
    width: 100%;
  }
</style>
