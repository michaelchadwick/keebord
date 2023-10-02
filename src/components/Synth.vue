<script setup>
import { getCurrentInstance, onMounted, reactive, ref } from 'vue'
import { kbSettings } from '../settings'

import { loadSoundfont, startPresetNote } from 'sfumato'

import NodeControl from './NodeControl.vue'
import Keyboard from './Keyboard.vue'
import ADSREnvelope from 'adsr-envelope'

// import webAudioFontLoader from '../assets/js/app/wafLoader.js'
// import webAudioFontTonesLoader from '../assets/js/app/wafTonesLoader.js'

const INTERVALS = {
  'major': [4, 3],
  'aug': [4, 4],
  'minor': [3, 4],
  'dim': [3, 3],
  'sus2': [2, 5],
  'sus4': [5, 2],
  'dom7': [4, 3, 3],
  'min7': [3, 4, 3],
  'maj7': [4, 3, 4],
  '7sus4': [5, 2, 3]
}
const MUSICAL_NOTES = [
  // index 0
  { name: 'C0', frequency: 16.350, midi: 12 },
  { name: 'Db0', frequency: 17.320, midi: 13 },
  { name: 'D0', frequency: 18.350, midi: 14 },
  { name: 'Eb0', frequency: 19.450, midi: 15 },
  { name: 'E0', frequency: 20.600, midi: 16 },
  { name: 'F0', frequency: 21.830, midi: 17 },
  { name: 'Gb0', frequency: 23.120, midi: 18 },
  { name: 'G0', frequency: 24.500, midi: 19 },
  { name: 'Ab0', frequency: 25.960, midi: 20 },
  { name: 'A0', frequency: 27.500, midi: 21 },
  { name: 'Bb0', frequency: 29.140, midi: 22 },
  { name: 'B0', frequency: 30.870, midi: 23 },
  // index 12
  { name: 'C1', frequency: 32.700, midi: 24 },
  { name: 'Db1', frequency: 34.650, midi: 25 },
  { name: 'D1', frequency: 36.710, midi: 26 },
  { name: 'Eb1', frequency: 38.890, midi: 27 },
  { name: 'E1', frequency: 41.200, midi: 28 },
  { name: 'F1', frequency: 43.650, midi: 29 },
  { name: 'Gb1', frequency: 46.250, midi: 30 },
  { name: 'G1', frequency: 49.000, midi: 31 },
  { name: 'Ab1', frequency: 51.910, midi: 32 },
  { name: 'A1', frequency: 55.000, midi: 33 },
  { name: 'Bb1', frequency: 58.270, midi: 34 },
  { name: 'B1', frequency: 61.740, midi: 35 },
  // index 24
  { name: 'C2', frequency: 65.410, midi: 36 },
  { name: 'Db2', frequency: 69.300, midi: 37 },
  { name: 'D2', frequency: 73.420, midi: 38 },
  { name: 'Eb2', frequency: 77.780, midi: 39 },
  { name: 'E2', frequency: 82.410, midi: 40 },
  { name: 'F2', frequency: 87.310, midi: 41 },
  { name: 'Gb2', frequency: 92.500, midi: 42 },
  { name: 'G2', frequency: 98.000, midi: 43 },
  { name: 'Ab2', frequency: 103.830, midi: 44 },
  { name: 'A2', frequency: 110.000, midi: 45 },
  { name: 'Bb2', frequency: 116.540, midi: 46 },
  { name: 'B2', frequency: 123.470, midi: 47 },
  // index 36
  { name: 'C3', frequency: 130.810, midi: 48 },
  { name: 'Db3', frequency: 138.590, midi: 49 },
  { name: 'D3', frequency: 146.830, midi: 50 },
  { name: 'Eb3', frequency: 155.560, midi: 51 },
  { name: 'E3', frequency: 164.810, midi: 52 },
  { name: 'F3', frequency: 174.610, midi: 53 },
  { name: 'Gb3', frequency: 185.000, midi: 54 },
  { name: 'G3', frequency: 196.000, midi: 55 },
  { name: 'Ab3', frequency: 207.650, midi: 56 },
  { name: 'A3', frequency: 220.000, midi: 57 },
  { name: 'Bb3', frequency: 233.080, midi: 58 },
  { name: 'B3', frequency: 246.940, midi: 59 },
  // index 48
  { name: 'C4', frequency: 261.630, midi: 60, key: 'z' },
  { name: 'Db4', frequency: 277.180, midi: 61, key: 's' },
  { name: 'D4', frequency: 293.660, midi: 62, key: 'x' },
  { name: 'Eb4', frequency: 311.130, midi: 63, key: 'd' },
  { name: 'E4', frequency: 329.630, midi: 64, key: 'c' },
  { name: 'F4', frequency: 349.230, midi: 65, key: 'v' },
  { name: 'Gb4', frequency: 369.990, midi: 66, key: 'g' },
  { name: 'G4', frequency: 392.000, midi: 67, key: 'b' },
  { name: 'Ab4', frequency: 415.300, midi: 68, key: 'h' },
  { name: 'A4', frequency: 440.000, midi: 69, key: 'n' },
  { name: 'Bb4', frequency: 466.160, midi: 70, key: 'j' },
  { name: 'B4', frequency: 493.880, midi: 71, key: 'm' },
  // index 60
  { name: 'C5', frequency: 523.250, midi: 72, key: 'q' },
  { name: 'Db5', frequency: 554.370, midi: 73, key: '2' },
  { name: 'D5', frequency: 587.330, midi: 74, key: 'w' },
  { name: 'Eb5', frequency: 622.250, midi: 75, key: '3' },
  { name: 'E5', frequency: 659.250, midi: 76, key: 'e' },
  { name: 'F5', frequency: 698.460, midi: 77, key: 'r' },
  { name: 'Gb5', frequency: 739.990, midi: 78, key: '5' },
  { name: 'G5', frequency: 783.990, midi: 79, key: 't' },
  { name: 'Ab5', frequency: 830.610, midi: 80, key: '6' },
  { name: 'A5', frequency: 880.000, midi: 81, key: 'y' },
  { name: 'Bb5', frequency: 932.330, midi: 82, key: 'u', },
  { name: 'B5', frequency: 987.770, midi: 83, key: 'i' },
  // index 72
  { name: 'C6', frequency: 1046.500, midi: 84, key: 'o' },
  { name: 'Db6', frequency: 1108.730, midi: 85 },
  { name: 'D6', frequency: 1174.660, midi: 86 },
  { name: 'Eb6', frequency: 1244.510, midi: 87 },
  { name: 'E6', frequency: 1318.510, midi: 88 },
  { name: 'F6', frequency: 1396.910, midi: 89 },
  { name: 'Gb6', frequency: 1479.980, midi: 90 },
  { name: 'G6', frequency: 1567.980, midi: 91 },
  { name: 'Ab6', frequency: 1661.220, midi: 92 },
  { name: 'A6', frequency: 1760.000, midi: 93 },
  { name: 'Bb6', frequency: 1864.660, midi: 94 },
  { name: 'B6', frequency: 1975.530, midi: 95 },
  // index 84
  { name: 'C7', frequency: 2093.000, midi: 96 },
  { name: 'Db7', frequency: 2217.460, midi: 97 },
  { name: 'D7', frequency: 2349.320, midi: 98 },
  { name: 'Eb7', frequency: 2489.020, midi: 99 },
  { name: 'E7', frequency: 2637.020, midi: 100 },
  { name: 'F7', frequency: 2793.830, midi: 101 },
  { name: 'Gb7', frequency: 2959.960, midi: 102 },
  { name: 'G7', frequency: 3135.960, midi: 103 },
  { name: 'Ab7', frequency: 3322.440, midi: 104 },
  { name: 'A7', frequency: 3520.000, midi: 105 },
  { name: 'Bb7', frequency: 3729.310, midi: 106 },
  { name: 'B7', frequency: 3951.070, midi: 107 },
  // index 96
  { name: 'C8', frequency: 4186.010, midi: 108 },
  { name: 'Db8', frequency: 4434.920, midi: 109 },
  { name: 'D8', frequency: 4698.630, midi: 110 },
  { name: 'Eb8', frequency: 4978.030, midi: 111 },
  { name: 'E8', frequency: 5274.040, midi: 112 },
  { name: 'F8', frequency: 5587.650, midi: 113 },
  { name: 'Gb8', frequency: 5919.910, midi: 114 },
  { name: 'G8', frequency: 6271.930, midi: 115 },
  { name: 'Ab8', frequency: 6644.880, midi: 116 },
  { name: 'A8', frequency: 7040.000, midi: 117 },
  { name: 'Bb8', frequency: 7458.620, midi: 118 },
  { name: 'B8', frequency: 7902.130, midi: 119 },
]

const oscNotes = reactive([])
const sf2Notes = reactive([])
const sf2Presets = reactive([])
const wafNotes = reactive([])

// holds current notes being played; for chord recognition
const currentNotes = ref([])

const nodeControls = reactive({
  outputType: {
    title: 'Output Type',
    type: 'select',
    selectId: 'output-type',
    options: [
      { text: 'Oscillator', value: 'osc' },
      { text: 'Soundfont', value: 'sf2' },
      { text: 'WebAudioFont', value: 'waf' }
    ],
    currentValue: kbSettings.value.controls.outputType,
    audioNode: '',
    parameter: 'type',
    visible: true,
    enabled: true,
    isVertical: true
  },
  oscType: {
    title: 'Osc Type',
    type: 'select',
    selectId: 'osc-type',
    options: [
      { text: 'Sine', value: 'sine' },
      { text: 'Sawtooth', value: 'sawtooth' },
      { text: 'Square', value: 'square' },
      { text: 'Triangle', value: 'triangle' }
    ],
    currentValue: kbSettings.value.controls.oscType,
    audioNode: '',
    parameter: 'type',
    visible: true,
    enabled: true,
    isVertical: false
  },
  sf2Source: {
    title: 'SF2 Source',
    type: 'select',
    selectId: 'sf2-source',
    options: [
      { text: 'Default', value: '_default' },
      { text: 'Donkey Kong Country', value: 'donkey_kong_country' },
      { text: 'Earthbound', value: 'earthbound' },
      { text: 'Super Mario World', value: 'super_mario_world' },
      { text: 'Vintage Dreams', value: 'vintage_dreams_waves_v2' }
    ],
    currentValue: kbSettings.value.controls.sf2Source,
    audioNode: '',
    parameter: 'type',
    visible: false,
    enabled: false,
    isVertical: false
  },
  sf2Preset: {
    title: 'SF2 Instrument',
    type: 'select',
    selectId: 'sf2-preset',
    options: sf2Presets.value,
    currentValue: kbSettings.value.controls.sf2Preset,
    audioNode: '',
    parameter: 'type',
    visible: false,
    enabled: false,
    isVertical: false
  },
  wafSource: {
    title: 'WAF Source',
    type: 'select',
    selectId: 'waf-source',
    options: [
      { text: 'Aspirin', value: '_tone_0000_Aspirin_sf2' },
      { text: 'SoundBlasterOld', value: '_tone_0250_SoundBlasterOld_sf2' }
    ],
    currentValue: kbSettings.value.controls.wafSource,
    audioNode: '',
    parameter: 'type',
    visible: false,
    enabled: false,
    isVertical: false
  },
  pan: {
    title: 'Pan',
    type: 'range',
    numberInputId: 'eq-pan-value',
    rangeInputId: 'eq-pan-range',
    currentValue: kbSettings.value.controls.pan,
    audioNode: '',
    step: '0.1',
    min: '-1.0',
    max: '1.0',
    parameter: 'pan',
    visible: true,
    enabled: true,
    isVertical: false
  },
  attackTime: {
    title: 'Attack',
    type: 'range',
    numberInputId: 'eq-attack-value',
    rangeInputId: 'eq-attack-range',
    currentValue: kbSettings.value.controls.attackTime,
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '5.0',
    parameter: 'adsr',
    visible: true,
    enabled: true,
    isVertical: true
  },
  decayTime: {
    title: 'Decay',
    type: 'range',
    numberInputId: 'eq-decay-value',
    rangeInputId: 'eq-decay-range',
    currentValue: kbSettings.value.controls.decayTime,
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '5.0',
    parameter: 'adsr',
    visible: true,
    enabled: true,
    isVertical: true
  },
  sustainLevel: {
    title: 'Sustain',
    type: 'range',
    numberInputId: 'eq-sustain-value',
    rangeInputId: 'eq-sustain-range',
    currentValue: kbSettings.value.controls.sustainLevel,
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '5.0',
    parameter: 'adsr',
    visible: true,
    enabled: true,
    isVertical: true
  },
  releaseTime: {
    title: 'Release',
    type: 'range',
    numberInputId: 'eq-release-value',
    rangeInputId: 'eq-release-range',
    currentValue: kbSettings.value.controls.releaseTime,
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '5.0',
    parameter: 'adsr',
    visible: true,
    enabled: true,
    isVertical: true
  },
  pitchBend: {
    title: 'Pitch Bend',
    type: 'range',
    numberInputId: 'pitchbend-value',
    rangeInputId: 'pitchbend-range',
    currentValue: kbSettings.value.controls.pitchBend,
    audioNode: '',
    step: '1',
    min: '1',
    max: '12',
    parameter: 'pitch',
    visible: true,
    enabled: true,
    isVertical: true
  },
  // distortion: {
  //   title: 'Distortion',
  //   type: 'range',
  //   controlEnabledCheckId: 'send-effect-distortion-check',
  //   numberInputId: 'distortion-value',
  //   rangeInputId: 'distortion-range',
  //   currentValue: '0.0',
  //   audioNode: '',
  //   step: '0.1',
  //   min: '0.0',
  //   max: '1.0',
  //   parameter: 'gain',
  //   visible: true,
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
  //   visible: true,
  //   enabled: false,
  //   isVertical: true
  // },
  delay: {
    title: 'Delay',
    type: 'range',
    controlEnabledCheckId: 'send-effect-delay-check',
    numberInputId: 'delay-value',
    rangeInputId: 'delay-range',
    currentValue: kbSettings.value.controls.delay,
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '6.0',
    parameter: 'delayTime',
    visible: true,
    enabled: kbSettings.value.controls.delayCheck,
    isVertical: true
  },
  eqLow: {
    title: 'EQ Low',
    type: 'range',
    numberInputId: 'eq-low-value',
    rangeInputId: 'eq-low-range',
    currentValue: kbSettings.value.controls.eqLow,
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '1.0',
    parameter: 'gain',
    visible: true,
    enabled: true,
    isVertical: true
  },
  eqMid: {
    title: 'EQ Mid',
    type: 'range',
    numberInputId: 'eq-mid-value',
    rangeInputId: 'eq-mid-range',
    currentValue: kbSettings.value.controls.eqMid,
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '1.0',
    parameter: 'gain',
    visible: true,
    enabled: true,
    isVertical: true
  },
  eqHigh: {
    title: 'EQ High',
    type: 'range',
    numberInputId: 'eq-high-value',
    rangeInputId: 'eq-high-range',
    currentValue: kbSettings.value.controls.eqHigh,
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '1.0',
    parameter: 'gain',
    visible: true,
    enabled: true,
    isVertical: true
  },
  compressor: {
    title: 'Compressor',
    type: 'range',
    numberInputId: 'eq-compressor-value',
    rangeInputId: 'eq-compressor-range',
    currentValue: kbSettings.value.controls.eqCompressor,
    audioNode: '',
    step: '1.0',
    min: '1.0',
    max: '20.0',
    parameter: 'ratio',
    visible: true,
    enabled: true,
    isVertical: true
  },
  masterGain: {
    title: 'Volume',
    type: 'range',
    numberInputId: 'master-gain-value',
    rangeInputId: 'master-gain-range',
    currentValue: kbSettings.value.controls.masterGain,
    audioNode: '',
    step: '0.1',
    min: '0.0',
    max: '1.0',
    parameter: 'gain',
    visible: true,
    enabled: true,
    isVertical: true
  }
})

const globalProps = getCurrentInstance().appContext.config.globalProperties

let midiAccess = null

let startTime = 0
let pitchBendRange = 2
let modInterval = null
let segmentWidth

let oscType = kbSettings.value.controls.oscType
let outputType = kbSettings.value.controls.outputType
let rootNote = kbSettings.value.filter.rootNote
let scaleType = kbSettings.value.filter.scaleType
let useKeyboard = kbSettings.value.input.keyboard
let useMidi = kbSettings.value.input.midi
let useMouse = kbSettings.value.input.mouse
let useVisualizer = kbSettings.value.output.visualizer

let wafPlayer = null

const audioContext = new (window.AudioContext || window.webkitAudioContext)()

const adsr = new ADSREnvelope({
  // how long from silence to peakLevel
  attackTime: parseFloat(nodeControls.attackTime.currentValue).toFixed(1) || 0.1,
  // how long from peakLevel to sustainLevel
  decayTime: parseFloat(nodeControls.decayTime.currentValue).toFixed(1) || 0.5,
  // how loud to keep it once sustaining
  sustainLevel: parseFloat(nodeControls.sustainLevel.currentValue).toFixed(1) || 0.1,
  // how long to go from sustainLevel to silence
  releaseTime: parseFloat(nodeControls.releaseTime.currentValue).toFixed(1) || 0.5,
  // how long to keep it at sustainLevel (dynamic due to player)
  gateTime: Infinity,
  // how loud should sound be (dynamic due to player)
  peakLevel: 0.5,
  attackCurve: 'exp',
  decayCurve: 'exp',
  releaseCurve: 'exp',
})
const analyzerNode = new AnalyserNode(audioContext, {
  fftSize: 2048,
  smoothingTimeConstant: 1
})
const dataArray = new Uint8Array(analyzerNode.frequencyBinCount)

const masterGainNode = audioContext.createGain()
masterGainNode.gain.value = parseFloat(nodeControls.masterGain.currentValue)

nodeControls.masterGain.audioNode = audioContext.createGain()
nodeControls.masterGain.audioNode.gain.value = parseFloat(nodeControls.masterGain.currentValue)

const destinationMaster = audioContext.destination

// creates a connection of nodes
// masterGain->distortion->(reverb)->(delay)->eqLow
const createSendChain = function () {
  // console.log('creating send chain')

  // TODO: distortion
  // masterGain->distortion
  // const distortionNode = createDistNode('4x')

  // nodeControls.distortion.audioNode = distortionNode
  // nodeControls.masterGain.audioNode.connect(nodeControls.distortion.audioNode)

  // TODO: distortion->reverb
  // const reverbNode = createReverbNode()

  // delay
  // masterGain->delay->eqLow
  if (nodeControls.delay.enabled !== false && !nodeControls.delay.audioNode) {
    const delayNode = createDelayNode(nodeControls.delay.max)
    nodeControls.delay.audioNode = delayNode

    const delayGainNode = audioContext.createGain()
    delayGainNode.gain.value = (parseFloat(nodeControls.masterGain.currentValue) * 0.75).toFixed(1)

    // TODO: distortion
    // nodeControls.distortion.audioNode.connect(delayGainNode)
    nodeControls.masterGain.audioNode.connect(delayGainNode)
    delayGainNode.connect(nodeControls.delay.audioNode)

    nodeControls.delay.audioNode.connect(nodeControls.eqLow.audioNode)
  }
  // masterGain->eqLow
  else if (nodeControls.delay.audioNode && !nodeControls.delay.enabled) {
    nodeControls.delay.audioNode.disconnect()

    // TODO: distortion
    // nodeControls.distortion.audioNode.connect(nodeControls.eqLow.audioNode)
    nodeControls.masterGain.audioNode.connect(nodeControls.eqLow.audioNode)
  }
  // masterGain->eqLow
  else {
    // TODO: distortion
    // nodeControls.distortion.audioNode.connect(nodeControls.eqLow.audioNode)
    nodeControls.masterGain.audioNode.connect(nodeControls.eqLow.audioNode)
  }
}
// creates a connection of nodes
// eqLow->eqMid->eqHigh->compressor->(pan)->analyzerNode->destinationMaster
const createMasterChain = function () {
  // console.log('creating master chain')

  // 3-band EQ
  nodeControls.eqLow.audioNode = createEQNode('lowshelf', 35, 0, 0.5)
  nodeControls.eqMid.audioNode = createEQNode('peaking', 440, 0, 0)
  nodeControls.eqHigh.audioNode = createEQNode('highshelf', 4700, 0, 0.5)

  // compressor
  nodeControls.compressor.audioNode = createCompNode(-50, 40, nodeControls.compressor.currentValue, 0, 0.25)

  // eqLow->eqMid->eqHigh->compressor
  nodeControls.eqLow.audioNode.connect(nodeControls.eqMid.audioNode)
  nodeControls.eqMid.audioNode.connect(nodeControls.eqHigh.audioNode)
  nodeControls.eqHigh.audioNode.connect(nodeControls.compressor.audioNode)

  // if panning, then compressor->pan->destination
  if (audioContext.createStereoPanner && nodeControls.pan) {
    nodeControls.pan.audioNode = createPanNode(0)

    nodeControls.compressor.audioNode.connect(nodeControls.pan.audioNode)
    nodeControls.pan.audioNode.connect(analyzerNode)
    analyzerNode.connect(destinationMaster)
  }
  // if no panning, compressor->destination
  else {
    nodeControls.compressor.audioNode.connect(analyzerNode)
    analyzerNode.connect(destinationMaster)
  }
}

// FX NODE CREATORS

const createDistNode = (oversample) => {
  const audioNode = audioContext.createWaveShaper()

  // 0-100 optimal
  audioNode.curve = _makeDistortionCurve(nodeControls.distortion.currentValue * 100)
  audioNode.oversample = oversample

  return audioNode
}
const createReverbNode = () => {
  const audioNode = audioContext.createConvolver()

  return audioNode
}
const createDelayNode = (max) => {
  const audioNode = audioContext.createDelay(max)

  audioNode.delayTime.setValueAtTime(nodeControls.delay.currentValue, audioContext.currentTime)

  return audioNode
}
const createEQNode = (type, freq, q, gain) => {
  const audioNode = audioContext.createBiquadFilter()

  audioNode.type = type
  audioNode.frequency.value = freq
  audioNode.Q.value = q // larger value means smaller band
  audioNode.gain.value = gain

  return audioNode
}
const createCompNode = (threshold, knee, ratio, attack, release) => {
  const audioNode = audioContext.createDynamicsCompressor()

  audioNode.threshold.setValueAtTime(threshold, audioContext.currentTime)
  audioNode.knee.setValueAtTime(knee, audioContext.currentTime)
  audioNode.ratio.setValueAtTime(ratio, audioContext.currentTime)
  audioNode.attack.setValueAtTime(attack, audioContext.currentTime)
  audioNode.release.setValueAtTime(release, audioContext.currentTime)

  return audioNode
}
const createPanNode = (value) => {
  const audioNode = audioContext.createStereoPanner()

  audioNode.pan.setValueAtTime(value, audioContext.currentTime)

  return audioNode
}

const checkEnabledChanged = function (controlName, isChecked) {
  // console.log(`checkEnabledChanged for nodeControls['${controlName}']`, nodeControls, isChecked)

  nodeControls[controlName].enabled = isChecked

  kbSettings.value.controls.delayCheck = isChecked

  _saveToLocalStorage()

  // re-created send and master fx chains
  createSendChain()
  createMasterChain()
}
const controlValueChanged = function (controlName, newValue) {
  const nodeControl = nodeControls[controlName]

  // console.log(`nodeControls['${controlName}'] changed:`, nodeControl, newValue)

  if (controlName == 'pitchBend') {
    const semitones = parseInt(newValue)

    if (semitones <= nodeControl.max && semitones >= nodeControl.min) {
      nodeControl.currentValue = semitones
      pitchBendRange = parseInt(semitones)

      kbSettings.value.controls.pitchBend = semitones

      _saveToLocalStorage()
    }
  }
  else if (nodeControl.parameter == 'adsr') {
    const newFloatValue = parseFloat(newValue).toFixed(1)

    if (newFloatValue <= nodeControl.max && newFloatValue >= nodeControl.min) {
      nodeControl.currentValue = newFloatValue

      adsr[controlName] = parseFloat(newValue).toFixed(1)

      kbSettings.value.controls[controlName] = parseFloat(newValue).toFixed(1)

      _saveToLocalStorage()
    }
  }
  // otherwise, it's a gain modifier, most likely
  else if (nodeControl && nodeControl.audioNode[nodeControl.parameter]) {
    // console.log('nodeControl.parameter', nodeControl.parameter)
    // console.log('nodeControl.audioNode', nodeControl.audioNode)
    // console.log('nodeControl.audioNode[nodeControl.parameter]', nodeControl.audioNode[nodeControl.parameter])

    if (nodeControl.type == 'range') {
      if (newValue <= parseFloat(nodeControl.max) && newValue >= parseFloat(nodeControl.min)) {
        nodeControl.currentValue = parseFloat(newValue).toFixed(1)
        nodeControl.audioNode[nodeControl.parameter].setValueAtTime(
          nodeControl.currentValue,
          audioContext.currentTime
        )

        kbSettings.value.controls[controlName] = parseFloat(newValue).toFixed(1)
      }
    } else {
      nodeControl.currentValue = parseFloat(newValue).toFixed(1)
      nodeControl.audioNode[control.parameter].setValueAtTime(
        nodeControl.currentValue,
        audioContext.currentTime
      )

      kbSettings.value.controls[controlName] = parseFloat(newValue).toFixed(1)
    }

    _saveToLocalStorage()
  } else {
    console.error(`nodeControls['${controlName}'] not found, value could not be updated.`)
  }
}
const selectOptionChanged = function (controlName, newValue) {
  // console.log('selectOptionChanged', controlName, newValue)

  const control = nodeControls[controlName]

  if (control) {
    nodeControls[controlName].currentValue = newValue

    switch (controlName) {
      case 'oscType':
        updateOscTypeHandler(newValue)

        break

      case 'outputType':
        updateOutputTypeHandler(newValue)

        break

      case 'sf2Source':
        noteResetAll()

        kbSettings.value.controls.sf2Source = newValue

        _initSF2()

        break

      case 'sf2Preset':
        kbSettings.value.controls.sf2Preset = newValue

        noteResetAll()

        break

      case 'wafSource':
        kbSettings.value.controls.wafSource = newValue

        noteResetAll()

        break
    }

    _saveToLocalStorage()

    console.log('control has been updated', control)
  } else {
    console.error('control could not be found', controlName)
  }
}

const controlIncreaseValue = function(controlKey) {
  // console.log(`controlIncreaseValue(${controlKey})`)

  controlValueChanged(controlKey,
    (parseFloat(
      nodeControls[controlKey].currentValue) + parseFloat(nodeControls[controlKey].step
    )).toFixed(1)
  )
}
const controlDecreaseValue = function(controlKey) {
  // console.log(`controlDecreaseValue(${controlKey})`)

  controlValueChanged(controlKey,
    (parseFloat(
      nodeControls[controlKey].currentValue) - parseFloat(nodeControls[controlKey].step
    )).toFixed(1)
  )
}

// expand/collapse Synth Controls section
const toggleSynthControls = function () {
  let toggleSynthControl = document.getElementById('synth-controls-container')

  if (toggleSynthControl.style.display === 'none') {
    document.getElementById('toggle-synth-controls').src = '/assets/svg/bi-caret-down-fill.svg'

    toggleSynthControl.style.display = 'flex'
  } else {
    document.getElementById('toggle-synth-controls').src = '/assets/svg/bi-caret-right-fill.svg'

    toggleSynthControl.style.display = 'none'
  }
}

// midi, keyboard, mouse, and touch inputs all come here to create actual sound
const noteStart = function (noteNum, velocity = 64) {
  // update UI
  const domKey = document.querySelectorAll(`button[data-noteid='${noteNum}']`)[0]
  if (domKey) {
    domKey.classList.add('active')
  }

  startTime = audioContext.currentTime

  // set note's volume envelope
  const envelope = adsr.clone()
  envelope.peakLevel = (velocity / 127) * parseFloat(nodeControls.masterGain.currentValue)

  // console.log('noteStart env:', envelope)
  // console.log(`A ${envelope.attackTime} / D ${envelope.decayTime} / S ${ envelope.sustainLevel} / R ${envelope.releaseTime}`)

  switch (nodeControls.outputType.currentValue) {
    // use sfumato
    case 'sf2':
      // console.log(`sf2Notes[${noteNum}] noteStart`, sf2Notes[noteNum])

      createSF2Node(noteNum, startTime)

      currentNotes.value = _getChord(Object.keys(sf2Notes))

      break

    // use WebAudioFont
    case 'waf':
      // console.log(`wafNotes[${noteNum}] noteStart`)

      createWafNode(noteNum, startTime)

      currentNotes.value = _getChord(Object.keys(wafNotes))

      break

    // use OscillatorNodes
    default:
      // console.log(`oscNotes[${noteNum}] noteStart`)

      createOscNode(noteNum, startTime, envelope)

      currentNotes.value = _getChord(Object.keys(oscNotes))

      break
  }
}
const noteStop = function (noteNum, velocity = 64) {
  // update UI
  const domKey = document.querySelectorAll(`button[data-noteid='${noteNum}']`)[0]
  if (domKey) {
    domKey.classList.remove('active')
  }

  const playbackTime = audioContext.currentTime

  // if the note being stopped is in the array of notes, kill it
  switch (nodeControls.outputType.currentValue) {
    case 'sf2':
      if (sf2Notes[noteNum]) {
        // console.log(`sf2Notes[${noteNum}] noteStop`, sf2Notes[noteNum])

        // this below looks crazy, but it just runs a function stored at that index
        sf2Notes[noteNum]()

        // need to remove it from the array so currentNotes updates properly
        sf2Notes[noteNum] = null
        delete sf2Notes[noteNum]
      }

      // update chord recognition display
      currentNotes.value = _getChord(Object.keys(sf2Notes))

      break

    case 'waf':

      wafNotes[noteNum] = null
      delete wafNotes[noteNum]

      // update chord recognition display
      currentNotes.value = _getChord(Object.keys(wafNotes))

      break

    default:
      if (oscNotes[noteNum]) {
        // console.log(`oscNotes[${noteNum}] noteStop`)

        oscNotes[noteNum][1].gain.cancelScheduledValues(startTime)

        // FIXME: potential popping fix?
        // const stopTime = playbackTime + 0.08
        // oscNotes[noteNum][1].gain.setValueAtTime(oscNotes[noteNum][1].gain.currentValue, playbackTime)
        // oscNotes[noteNum][1].gain.exponentialRampToValueAtTime(0.0001, stopTime)
        // oscNotes[noteNum][0].stop(stopTime + 0.1)

        // set note's volume envelope
        const envelope = adsr.clone()
        envelope.peakLevel = (velocity / 127) * parseFloat(nodeControls.masterGain.currentValue)
        envelope.gateTime = playbackTime - startTime
        envelope.applyTo(oscNotes[noteNum][1].gain, startTime)

        oscNotes[noteNum][0].stop(startTime + envelope.duration)

        // set array key for note to null
        oscNotes[noteNum] = null
        // delete oscillator key in array
        delete oscNotes[noteNum]

        // console.log('osc stop', oscNotes)
      }

      // update chord recognition display
      currentNotes.value = _getChord(Object.keys(oscNotes))

      break
  }
}
const noteResetAll = () => {
  switch (nodeControls.outputType.currentValue) {
    case 'sf2':
      sf2Notes.map(noteNum => {
        sf2Notes[noteNum] = null
        delete sf2Notes[noteNum]
      })

      console.log('sf2Notes stopped', sf2Notes)

      break

    case 'waf':
      wafNotes.map(noteNum => {
        wafNotes[noteNum] = null
        delete wafNotes[noteNum]
      })

      console.log('wafNotes stopped', wafNotes)

      break

    default:
      oscNotes.map(osc => {
        const playbackTime = audioContext.currentTime
        const stopTime = playbackTime + 0.08

        osc[1].gain.cancelScheduledValues(audioContext.currentTime)

        osc[1].gain.setValueAtTime(osc[1].gain.value, playbackTime)
        osc[1].gain.exponentialRampToValueAtTime(0.0001, stopTime)

        // osc[1].gain.disconnect()
        osc[1].disconnect()

        osc[0].stop(stopTime + 0.1)

        osc = null
      })

      console.log('oscNotes stopped', oscNotes)

      break
  }
}

const createOscNode = function (noteNum, startTime, envelope) {
  if (!oscNotes[noteNum]) {
    // create Web Audio oscillator
    const oscNode = audioContext.createOscillator()
    const noteFreq = parseFloat(MUSICAL_NOTES[noteNum].frequency)

    // set oscillator wave type
    oscType = document.getElementById('osc-type')
      .options[document.getElementById('osc-type').selectedIndex]
      .value
    oscNode.type = oscType

    // set oscillator frequency
    oscNode.frequency.value = parseFloat(noteFreq)

    // create oscillator gain
    const gainNode = audioContext.createGain()
    gainNode.gain.value = nodeControls.masterGain.currentValue

    // apply ADSR to gain
    envelope.gateTime = Infinity
    envelope.applyTo(gainNode.gain, audioContext.currentTime)

    // connect oscillator to master gain node
    oscNode.connect(gainNode)
    gainNode.connect(nodeControls.masterGain.audioNode)

    // add oscillator to list of oscNotes
    oscNotes[noteNum] = [oscNode, gainNode]

    // start playing oscillator
    oscNotes[noteNum][0].start(startTime)

    // console.log('osc start', oscNotes)

    oscNotes[noteNum][0].onended = function () {
      console.log(`oscNotes[${noteNum}] ended`)

      // if (oscNotes[noteNum] &&
      //   oscNotes[noteNum][1] &&
      //   oscNotes[noteNum][1].gain &&
      //   'disconnect' in oscNotes[noteNum][1].gain
      // ) {
      //   oscNotes[noteNum][1].gain.cancelScheduledValues(startTime)
      //   oscNotes[noteNum][1].gain.disconnect()
      //   oscNotes[noteNum][1].disconnect()
      //   delete oscNotes[noteNum]
      // }
    }
  } else {
    // console.error(`oscNotes[${noteNum}] already exists`)
  }
}
const createSF2Node = function (noteNum, startTime) {
  const curPresetValue = nodeControls.sf2Preset.currentValue
  const presetObj = sf2Presets.value.filter(preset => preset.header.name == curPresetValue)[0]

  // console.log('curPresetValue', curPresetValue)
  // console.log('sf2Presets', sf2Presets)
  // console.log('presetObj', presetObj)

  const stopHandle = startPresetNote(
    audioContext,
    presetObj,
    noteNum,
    (startTime || 0)
  )

  sf2Notes[noteNum] = stopHandle

  // console.log('sf2Notes', sf2Notes)
}
const createWafNode = function (noteNum, startTime) {
  const wafTone = nodeControls.wafSource.currentValue
  // get _tone_####_Name_sf2 object from string
  const wafToneObj = eval(wafTone)

  wafPlayer.loader.decodeAfterLoading(audioContext, wafToneObj)

  const wafDuration = adsr.attackTime + adsr.decayTime
  const wafGain = nodeControls.masterGain.currentValue
  const wafDestination = nodeControls.masterGain.audioNode

  const wafEnvelope = wafPlayer.queueWaveTable(
    audioContext,       // AudioContext
    wafDestination,     // destination
    wafToneObj,         // preset
    startTime,          // when
    noteNum,            // midi note number (0..127)
    wafDuration,        // duration (seconds)
    wafGain             // volume (0..1)
  )

  console.log('wafEnvelope', wafEnvelope)

  wafNotes[noteNum] = wafEnvelope

  setTimeout(noteStop, 200)
}

// MIDI FX

const pitchBend = function (velocity) {
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

  oscNotes.forEach(osc => {
    osc[0].detune.setValueAtTime(pbCents, audioContext.currentTime)

    // const curFreq = osc[0].frequency.value
    // const newFreq = curFreq + pbCents
    // console.log(`pitchBend - cur: ${curFreq}, mult: ${pbCents}, new: ${newFreq}`)
  })
}
const pitchMod = function (velocity) {
  // TODO: pitchMod
  //   sort of works, but effect is not quite correct yet
  //   also, setting to 0 does not reset properly
  //   and make pitchBend inoperable
  //

  // 0 (-5) -> 64 (no mod) -> 127 (+1 octave)
  const pmRaw = velocity

  // console.log('pmRaw', pmRaw)

  // MIDI 0 - 127
  const inMin = 0
  const inMax = 127
  // musical cents (100 == half-step)
  const outMin = 0
  const outMax = 100
  const calcScale = Math.pow(10, 2)

  // scale to useful multiplier
  // 0 (0 no mod) -> 1 (+50 cents)
  let pmCents = (pmRaw - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
  pmCents = Math.round(pmCents * calcScale) / calcScale

  console.log('pmCents', pmCents)

  let xspacing = 16
  let height = 16
  let width = 16
  let theta = 0.0
  let theta_dx = 0.02
  let amplitude = 75.0
  let period = 500.0
  let dx = (Math.PI * 2) / period
  let yvalues = new Array(Math.floor(width / xspacing))

  function draw() {
    calcWave()
    return renderWave()
  }

  function calcWave() {
    // Increment theta (try different values for 'angular velocity' here)
    theta += theta_dx;

    // For every x value, calculate a y value with sine function
    let x = theta;
    for (let i = 0; i < yvalues.length; i++) {
      yvalues[i] = Math.sin(x) * amplitude;
      x += dx;
    }
  }

  function renderWave() {
    for (let x = 0; x < yvalues.length; x++) {
      const xCoord = x * xspacing
      const yCoord = ((height / 2) + yvalues[x]) * 0.2

      return yCoord
    }
  }

  if (pmCents > 0) {
    modInterval = setInterval(() => {
      oscNotes.forEach(osc => {
        const newDetune = draw()
        console.log('newDetune', newDetune)
        osc[0].detune.setValueAtTime(newDetune, audioContext.currentTime)
      }, 1)
    })
  } else {
    console.log('no pitchmod applied', velocity)

    if (modInterval) {
      clearInterval(modInterval)
      console.log('cleared modInterval', modInterval)

      // reset all oscNotes' detune value
      oscNotes.forEach(osc => osc[0].detune.setValueAtTime(0, audioContext.currentTime))
    }
  }
}

// INPUT TOGGLES

const useKeyboardCheckboxChanged = (isChecked) => {
  useKeyboard = isChecked
  updateKeyboardEventHandler()
}
const useMidiCheckboxChanged = (isChecked) => {
  useMidi = isChecked
  updateMidiEventHandler()
}
const useMouseCheckboxChanged = (isChecked) => {
  useMouse = isChecked
  updateMouseEventHandler()
}
const useVisualizerCheckboxChanged = (isChecked) => {
  useVisualizer = isChecked
  updateVisualizerEventHandler()
}

// INPUT HANDLERS

const updateKeyboardEventHandler = () => {
  if (useKeyboard) {
    document.addEventListener('keydown', keyController)
    document.addEventListener('keyup', keyController)

    kbSettings.value.input.keyboard = true

    console.log('⌨️ enabled')
  } else {
    document.removeEventListener('keydown', keyController)
    document.removeEventListener('keyup', keyController)

    kbSettings.value.input.keyboard = false

    console.log('⌨️ disabled')
  }

  _saveToLocalStorage()
}
const updateMidiEventHandler = () => {
  if (useMidi) {
    if ('requestMIDIAccess' in navigator) {
      navigator.requestMIDIAccess({ sysex: false })
        .then(
          (midi) => {
            midiAccess = midi

            kbSettings.value.input.midi = true

            _saveToLocalStorage()

            console.log('🎹 enabled', midiAccess)

            Array.from(midiAccess.inputs).forEach((input, index) => {
              input[1].onmidimessage = midiController

              console.log(`midi input #${index} detected: ${input[1].name}`)
            })
          },
          (error) => {
            kbSettings.value.input.midi = false

            _saveToLocalStorage()

            console.error('Failed to get MIDI access:', error)
          }
        )
    } else {
      kbSettings.value.input.midi = false

      _saveToLocalStorage()

      console.error('navigator.requestMIDIAccess() not supported')
    }
  } else {
    if (midiAccess) {
      Array.from(midiAccess.inputs).forEach((input) => {
        input[1].onmidimessage = null
      })
      midiAccess = null

      kbSettings.value.input.midi = false

      console.log('🎹 disabled')
    } else {
      kbSettings.value.input.midi = false

      console.log('🎹 disabled')
    }

    _saveToLocalStorage()
  }
}
const updateMouseEventHandler = () => {
  if (useMouse) {
    kbSettings.value.input.mouse = true
  } else {
    kbSettings.value.input.mouse = false
  }

  _saveToLocalStorage()
}
const updateVisualizerEventHandler = () => {
  if (useVisualizer) {
    kbSettings.value.output.visualizer = true

    console.log('📈 enabled')
  } else {
    kbSettings.value.output.visualizer = false

    console.log('📈 disabled')
  }

  _saveToLocalStorage()
}

// INPUT CONTROLLERS

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
    // pitch mod
    case 176:
      // pitchMod(velocity)
      break
    // all others
    default:
      break
  }
}

// FILTER CHANGES

const rootNoteChanged = (note) => {
  rootNote = note
  updateRootNoteHandler()
}
const scaleTypeChanged = (type) => {
  scaleType = type
  updateScaleTypeHandler()
}

// FILTER HANDLERS

const updateRootNoteHandler = () => {
  kbSettings.value.filter.rootNote = rootNote

  console.log('root note changed:', rootNote)

  _saveToLocalStorage()
}
const updateScaleTypeHandler = () => {
  kbSettings.value.filter.scaleType = scaleType

  // console.log('scale type changed', scaleType)

  _saveToLocalStorage()
}

// CONTROL HANDLERS

const updateOscTypeHandler = (type) => {
  oscType = type

  kbSettings.value.controls.oscType = oscType

  console.log('oscType changed:', oscType)

  _saveToLocalStorage()
}
const updateOutputTypeHandler = (type) => {
  console.log('outputType changed:', type)

  outputType = type

  kbSettings.value.controls.outputType = outputType

  switch (type) {
    case 'sf2':
      _initSF2()

      break

    case 'waf':
      _initWAF()

      break

    default:
      nodeControls.oscType.enabled = true
      nodeControls.oscType.visible = true

      nodeControls.sf2Source.enabled = false
      nodeControls.sf2Source.visible = false
      nodeControls.sf2Preset.enabled = false
      nodeControls.sf2Preset.visible = false

      nodeControls.wafSource.enabled = false
      nodeControls.wafSource.visible = false

      break
  }

  _saveToLocalStorage()
}

const _initVisualizer = () => {
  const canvas = document.getElementById('visualizer')
  const c = canvas.getContext('2d')

  // make canvas take up limited box size
  canvas.width = 640
  canvas.height = 80

  // make initial line
  c.fillStyle = "#f8f8f8"
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.strokeStyle = "#09714b"
  c.beginPath()
  c.moveTo(0, canvas.height / 2)
  c.lineTo(canvas.width, canvas.height / 2)
  c.stroke()

  // define function to update canvas
  const drawToCanvas = function () {
    requestAnimationFrame(drawToCanvas)

    analyzerNode.getByteTimeDomainData(dataArray)
    segmentWidth = canvas.width / analyzerNode.frequencyBinCount

    c.fillRect(0, 0, canvas.width, canvas.height)
    c.beginPath()
    c.moveTo(-100, canvas.height / 2)

    if (currentNotes.value.length) {
      for (let i = 1; i < analyzerNode.frequencyBinCount; i += 1) {
        let m = 128.0
        let x = i * segmentWidth
        let v = dataArray[i] / m
        let y = (v * canvas.height) / 2

        c.lineTo(x, y)
      }
    }

    c.lineTo(canvas.width + 100, canvas.height / 2)
    c.stroke()
  }

  drawToCanvas()
}
const _initSF2 = () => {
  nodeControls.oscType.enabled = false
  nodeControls.oscType.visible = false

  nodeControls.sf2Source.enabled = true
  nodeControls.sf2Source.visible = true
  nodeControls.sf2Preset.enabled = true
  nodeControls.sf2Preset.visible = true

  nodeControls.wafSource.enabled = false
  nodeControls.wafSource.visible = false

  loadSoundfont(`/assets/sf2/${nodeControls.sf2Source.currentValue}.sf2`).then((player) => {
    // console.log('sf2Player', player)

    // load SF2 Preset dropdown
    let options = []

    player.presets.map(preset => options.push({
      text: preset.header.name,
      value: preset.header.name
    }))

    nodeControls.sf2Preset.options = options

    if (Object.values(options).find(preset => preset.text == kbSettings.value.controls.sf2Preset)) {
      nodeControls.sf2Preset.currentValue = kbSettings.value.controls.sf2Preset
    } else {
      nodeControls.sf2Preset.currentValue = options[0].text
    }

    sf2Presets.value = player.presets

    // console.log('nodeControls.sf2Source', nodeControls.sf2Source.currentValue)
    // console.log('nodeControls.sf2Preset', nodeControls.sf2Preset.currentValue)
  })
}
const _initWAF = async () => {
  nodeControls.oscType.enabled = false
  nodeControls.oscType.visible = false

  nodeControls.sf2Source.enabled = false
  nodeControls.sf2Source.visible = false
  nodeControls.sf2Preset.enabled = false
  nodeControls.sf2Preset.visible = false

  nodeControls.wafSource.enabled = true
  nodeControls.wafSource.visible = true

  // load main file, and then tone files
  // webAudioFontLoader.then(() => webAudioFontTonesLoader).then(() => {
  //   wafPlayer = new WebAudioFontPlayer()
  // })

  let script = document.createElement('script')
  script.onload = () => wafPlayer = new WebAudioFontPlayer()
  // script.setAttribute('src', '/assets/js/vendor/WebAudioFontPlayer.js')
  script.setAttribute('src', 'https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js')
  document.head.appendChild(script)

  script = document.createElement('script')
  // script.onload = () => res()
  script.setAttribute('src', '/assets/sf2/0000_Aspirin_sf2.js')
  // script.setAttribute('src', 'https://surikov.github.io/webaudiofontdata/sound/0000_Aspirin_sf2_file.js')
  document.head.appendChild(script)

  script = document.createElement('script')
  // script.onload = () => res()
  script.setAttribute('src', '/assets/sf2/0250_SoundBlasterOld_sf2.js')
  // script.setAttribute('src', 'https://surikov.github.io/webaudiofontdata/sound/0250_SoundBlasterOld_sf2.js')
  document.head.appendChild(script)
}

// convert midi note numbers into chords, if applicable
const _getChord = (midiNums) => {
  // console.log('_getChord notes', midiNums)

  if (midiNums.length > 2) {
    const noteCount = midiNums.length
    let chordName
    let intval1, intval2, intval3

    switch (noteCount) {
      case 3: // triad
        intval1 = midiNums[1] - midiNums[0]
        intval2 = midiNums[2] - midiNums[1]

        if (_arraysAreEqual([intval1, intval2], INTERVALS['major'])) {
          chordName = `${_midi2Name(midiNums[0])}maj`
        }
        else if (_arraysAreEqual([intval1, intval2], INTERVALS['aug'])) {
          chordName = `${_midi2Name(midiNums[0])}aug`
        }
        else if (_arraysAreEqual([intval1, intval2], INTERVALS['minor'])) {
          chordName = `${_midi2Name(midiNums[0])}min`
        }
        else if (_arraysAreEqual([intval1, intval2], INTERVALS['dim'])) {
          chordName = `${_midi2Name(midiNums[0])}dim`
        }
        else if (_arraysAreEqual([intval1, intval2], INTERVALS['sus2'])) {
          chordName = `${_midi2Name(midiNums[0])}sus2`
        }
        else if (_arraysAreEqual([intval1, intval2], INTERVALS['sus4'])) {
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

        if (_arraysAreEqual([intval1, intval2, intval3], INTERVALS['dom7'])) {
          chordName = `${_midi2Name(midiNums[0])}7`
        }
        else if (_arraysAreEqual([intval1, intval2, intval3], INTERVALS['min7'])) {
          chordName = `${_midi2Name(midiNums[0])}min7`
        }
        else if (_arraysAreEqual([intval1, intval2, intval3], INTERVALS['maj7'])) {
          chordName = `${_midi2Name(midiNums[0])}maj7`
        }
        else if (_arraysAreEqual([intval1, intval2, intval3], INTERVALS['7sus4'])) {
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
  const name = MUSICAL_NOTES.filter(mNote => mNote.midi == midiNumber)[0].name

  return name[1] == 'b' ? `${name[0]}${name[1]}` : `${name[0]}`
}
const _makeDistortionCurve = (amount) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createWaveShaper

  const k = typeof amount === "number" ? amount : 50
  const n_samples = 44100
  const curve = new Float32Array(n_samples)
  const deg = Math.PI / 180

  for (let i = 0; i < n_samples; i++) {
    const x = (i * 2) / n_samples - 1
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
  }

  return curve
}
const _saveToLocalStorage = () => {
  localStorage.setItem(globalProps.lsKey, JSON.stringify(kbSettings.value))
}

createMasterChain()
createSendChain()

onMounted(() => {
  // console.log('MOUNTED Synth.vue', nodeControls.outputType)

  _initVisualizer()

  if (nodeControls.outputType.currentValue == 'sf2') {
    _initSF2()
  }

  if (nodeControls.outputType.currentValue == 'waf') {
    _initWAF()
  }
})
</script>

<template>
  <Keyboard
    :musical-notes="MUSICAL_NOTES"
    :root-note="rootNote"
    :scale-type="scaleType"
    :use-keyboard="useKeyboard"
    :use-midi="useMidi"
    :use-mouse="useMouse"
    :use-visualizer="useVisualizer"
    @root-note-changed="rootNoteChanged"
    @scale-type-changed="scaleTypeChanged"
    @use-keyboard-changed="useKeyboardCheckboxChanged"
    @use-midi-changed="useMidiCheckboxChanged"
    @use-mouse-changed="useMouseCheckboxChanged"
    @use-visualizer-changed="useVisualizerCheckboxChanged"
    @note-pressed="noteStart"
    @note-released="noteStop"
    @note-reset-all="noteResetAll"
  />

  <div id="visualizer-container" style="display: none">
    <canvas ref="canvas" id="visualizer"></canvas>
  </div>

  <div id="synth-controls-header">
    <button @click="toggleSynthControls">
      <img id="toggle-synth-controls" src="/assets/svg/bi-caret-down-fill.svg" />
      Synth Controls
    </button>

    <span id="note-recognition" :class="{ 'empty': !currentNotes.length }">
      {{ currentNotes.length ? currentNotes : 'No notes.' }}
    </span>
  </div>
  <div id="synth-controls-container" style="display: flex">
    <NodeControl v-for="(control, key) in nodeControls"
      :control-key="key"
      :control-data="control"
      @check-enabled-changed="checkEnabledChanged"
      @control-value-changed="controlValueChanged"
      @select-option-changed="selectOptionChanged"
      @increase-value="controlIncreaseValue"
      @decrease-value="controlDecreaseValue"
    />
  </div>
</template>

<style scoped>
#synth-controls-header {
  align-items: center;
  display: flex;
  justify-content: flex-start;
  padding: 0 3px;
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
    height: 36px;
    padding: 0.65rem;
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

  #synth-controls-header #note-recognition {
    background-color: var(--green-bright-active);
    border: 1px solid var(--gray-dark);
    border-radius: 4px;
    box-shadow: inset 0 0 5px 1px var(--green);
    color: var(--black);
    font-weight: bold;
    height: 36px;
    margin-left: 1rem;
    padding: 0.4rem 0.75rem;
    width: 100%;
  }
    body.dark-theme #synth-controls-header #note-recognition {
      background-color: var(--green-deep-active);
      border: 1px solid var(--gray-bright-active);
      color: var(--green-bright-active);
    }
    @media (min-width: 768px) {
      #synth-controls-header #note-recognition {
        max-width: 150px;
      }
    }
    #synth-controls-header #note-recognition.empty {
      background-color: var(--gray-light);
      box-shadow: inset 0 0 5px 1px var(--gray);
      color: var(--gray);
      font-weight: normal;
    }
      body.dark-theme #synth-controls-header #note-recognition.empty {
        background-color: var(--color-background-mute);
        box-shadow: inset 0 0 5px 1px var(--color-text);
        color: var(--color-text);
      }

#synth-controls-container {
  background-color: var(--white-soft);
  border: 2px solid var(--gray-light);
  flex-direction: column;
  height: 144px;
  margin: 5px 3px;
  overflow-y: auto;
  padding: 5px;
}
  @media (min-width: 1024px) {
    #synth-controls-container {
      margin: 5px 20px;
    }
  }
  body.dark-theme #synth-controls-container {
    background-color: var(--black-mute);
  }

@media (min-width: 600px) {
  #synth-controls-container {
    align-items: normal;
    flex-wrap: wrap;
    padding: 0 5px;
  }
    #synth-controls-container fieldset.control-column {
      margin-left: 0;
      margin-right: 8px;
      padding-top: 0;
    }
      #synth-controls-container fieldset.control-column#pan {
        min-height: 132px;
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

@media (min-width: 992px) {
  #visualizer-container {
    margin: 5px 20px;
    width: auto;
  }
    #visualizer {
      height: 100px;
    }
}
</style>
