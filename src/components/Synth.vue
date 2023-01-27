<script setup>
import { ref, reactive } from 'vue'
import NodeControl from './NodeControl.vue'
import Keyboard from './Keyboard.vue'
import Note from '../libraries/note.js'
import ADSREnvelope from 'adsr-envelope'

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
  // TODO:
  // rootNote: {
  //   title: 'Root Note',
  //   type: 'select',
  //   selectId: 'root-note',
  //   options: [
  //     { text: 'C0', value: 'C0' },
  //     { text: 'C1', value: 'C1' },
  //     { text: 'C2', value: 'C2' },
  //     { text: 'C3', value: 'C3' },
  //     { text: 'C4', value: 'C4' },
  //     { text: 'C5', value: 'C5' },
  //     { text: 'C6', value: 'C6' },
  //     { text: 'C7', value: 'C7' },
  //   ],
  //   currentValue: 'C4',
  //   parameter: 'root',
  //   enabled: true,
  //   isVertical: true
  // },
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
  // delay: {
  //   title: 'Delay',
  //   type: 'range',
  //   controlEnabledCheckId: 'send-effect-delay-check',
  //   numberInputId: 'delay-value',
  //   rangeInputId: 'delay-range',
  //   currentValue: '2.0',
  //   audioNode: '',
  //   step: '0.1',
  //   min: '0.0',
  //   max: '6.0',
  //   parameter: 'delayTime',
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
  // eqLow: {
  //   title: 'EQ Low',
  //   type: 'range',
  //   numberInputId: 'eq-low-value',
  //   rangeInputId: 'eq-low-range',
  //   currentValue: '0.5',
  //   audioNode: '',
  //   step: '0.1',
  //   min: '0.0',
  //   max: '1.0',
  //   parameter: 'gain',
  //   enabled: false,
  //   isVertical: true
  // },
  // eqMid: {
  //   title: 'EQ Mid',
  //   type: 'range',
  //   numberInputId: 'eq-mid-value',
  //   rangeInputId: 'eq-mid-range',
  //   currentValue: '0.5',
  //   audioNode: '',
  //   step: '0.1',
  //   min: '0.0',
  //   max: '1.0',
  //   parameter: 'gain',
  //   enabled: false,
  //   isVertical: true
  // },
  // eqHigh: {
  //   title: 'EQ High',
  //   type: 'range',
  //   numberInputId: 'eq-high-value',
  //   rangeInputId: 'eq-high-range',
  //   currentValue: '0.5',
  //   audioNode: '',
  //   step: '0.1',
  //   min: '0.0',
  //   max: '1.0',
  //   parameter: 'gain',
  //   enabled: false,
  //   isVertical: true
  // },
  // compressor: {
  //   title: 'Compressor',
  //   type: 'range',
  //   numberInputId: 'eq-compressor-value',
  //   rangeInputId: 'eq-compressor-range',
  //   currentValue: '3.0',
  //   audioNode: '',
  //   step: '1',
  //   min: '1',
  //   max: '20',
  //   parameter: 'ratio',
  //   enabled: false,
  //   isVertical: true
  // },
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

const audioContext = new AudioContext()
const gainMaster = audioContext.createGain()
gainMaster.gain.value = parseFloat(nodeControls.masterGain.currentValue)

nodeControls.masterGain.audioNode = audioContext.createGain()
nodeControls.masterGain.audioNode.gain.value = parseFloat(nodeControls.masterGain.currentValue)

const adsr = new ADSREnvelope({
  attackTime: 0.1,
  decayTime: 0.5,
  sustainLevel: 0.01,
  releaseTime: 1,
  gateTime: 1,
  peakLevel: 0.5,
  attackCurve: 'lin',
  decayCurve: 'lin',
  releaseCurve: 'exp',
})

let Nebyookeys = {}
let noteMap = {}
let noteCurrent = null
let detuneAmount = 64
let options = reactive({
  rootNote: 'C4'
})

let controlValueChanged = function(controlName, newValue) {
  const control = nodeControls[controlName]

  console.log('controlName', controlName)
  console.log('newValue', newValue)
  console.log('control', control)

  if (control.parameter == 'root') {
  }
  else if (control.parameter == 'waveType') {
  }
  // otherwise, it's a gain modifier, most likely
  else if (control && control.audioNode[control.parameter]) {
    console.log('control.parameter', control.parameter)
    console.log('control.audioNode', control.audioNode)
    console.log('control.audioNode[control.parameter]', control.audioNode[control.parameter])

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
    console.log(`Control ${controlName} not found, value could not be updated.`)
  }
}

let selectOptionChanged = function(controlName, newValue) {
  const control = nodeControls[controlName]

  console.log('controlName', controlName)
  console.log('newValue', newValue)
  console.log('control', control)

  console.log('control.parameter', control.parameter)

  options.rootNote = newValue
}

let toggleControls = function() {
  let toggleControl = document.getElementById('controls-container');
  if (toggleControl.style.display === 'none') {
    document.getElementById('toggle-controls').src = '/assets/svg/bi-caret-down-fill.svg';

    toggleControl.style.display = 'flex'
  } else {
    document.getElementById('toggle-controls').src = '/assets/svg/bi-caret-right-fill.svg';

    toggleControl.style.display = 'none';
  }
}

let makeNote = (noteNumber, velocity = 64) => {
  // console.log(`ON - note: ${noteNumber}, vel: ${velocity}`)

  // save current note for further processing by pitch/mod
  noteCurrent = noteNumber

  if (noteMap[noteNumber]) {
    noteMap[noteNumber].noteOff()
  }

  // set note's volume envelope
  const envelope = adsr.clone()
  envelope.peakLevel = (velocity / 127) * parseFloat(nodeControls.masterGain.currentValue)

  // set note's wave type
  const type = document.querySelector('#osc-type').value

  // create new note
  noteMap[noteNumber] = new Note(audioContext, noteNumber, type, envelope)
  noteMap[noteNumber].noteOn()
}
let stopNote = (noteNumber) => {
  // console.log(`OFF - note: ${noteNumber}`)

  noteCurrent = null

  if (noteMap[noteNumber]) {
    noteMap[noteNumber].noteOff()
  }

  noteMap[noteNumber] = null
}

let onMIDISuccess = (midi) => {
  Nebyookeys.midi = midi

  Array.from(Nebyookeys.midi.inputs).forEach((input) => {
    input[1].onmidimessage = midiController
  })

  console.log('MIDI ready and listening', Nebyookeys.midi)
}
let onMIDIFailure = (msg) => {
  console.error(`Failed to get MIDI access - ${msg}`)
}

let midiController = (e) => {
  let str = `MIDI message received at ${e.timeStamp}[${e.data.length} bytes]: `
  for (const character of e.data) {
    str += `0x${character.toString(16)} `
  }

  let data = e.data
  let cmd = data[0] >> 4, channel = data[0] & 0xf,
      type = data[0] & 0xf0, noteNumber = data[1], velocity = data[2]

  switch (type) {
    // noteOn message
    case 144:
      makeNote(noteNumber, velocity);
      break;
    // noteOff message
    case 128:
      stopNote(noteNumber);
      break;
    // TODO: pitch bend
    case 224:
      // 0 (-1 octave) -> 64 (no bend) -> 127 (+1 octave)
      const pitchBend = e.data[2];
      // 0 (-1 octave) -> 1 (no bend) -> 2 (+1 octave)
      // pitchBend = ((pitchBend / 127).toFixed(2)) * 2;

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

      break;
    // TODO: mod change
    case 176:
      break;
    // all others
    default:
      console.log('type', type); break;
  }
}

// add midi support
if ('requestMIDIAccess' in navigator) {
  // console.log('navigator.requestMIDIAccess() supported!')

  navigator.requestMIDIAccess({ sysex: false }).then(onMIDISuccess, onMIDIFailure)
} else {
  console.error('navigator.requestMIDIAccess() not supported')
}

// handle computer keyboard inputs
let keyController = (e) => {
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
      makeNote(note, 64)
    }
  } else if (e.type == 'keyup') {
    stopNote(note)
  }
}

// add computer keyboard support
document.addEventListener('keydown', keyController)
document.addEventListener('keyup', keyController)
</script>

<template>

  <!--
  <template v-if="Nebyookeys.midi">
    <h4>Inputs</h4>
    <ul v-if="Nebyookeys.midi.inputs">
      <li v-for="entry in Nebyookeys.midi.inputs">
        name: {{ entry[1].name }}
      </li>
    </ul>
    <h4>Outputs</h4>
    <ul v-if="Nebyookeys.midi.outputs">
      <li v-for="entry in Nebyookeys.midi.outputs">
        name: {{ entry[1].name }}
      </li>
    </ul>
  </template>
  <template v-else>
    <div>No MIDI devices found.</div>
  </template>
  -->

  <h3 id="controls-header">
    <span @click="toggleControls">Synth Controls</span>
    <img id="toggle-controls" src="/assets/svg/bi-caret-down-fill.svg" @click="toggleControls" />
  </h3>
  <div id="controls-container">
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

  <Keyboard
    :root-note="options.rootNote"
    :musical-notes="musicalNotes"
    @note-pressed="makeNote"
    @note-released="stopNote"
  />

</template>

<style scoped>
#controls-header {
  padding: 5px 10px 5px 15px;
}
  #controls-header:hover {
    cursor: pointer;
  }
  #controls-header img {
    left: 2px;
    position: relative;
    top: 3px;
  }
  body.dark-theme #controls-header img {
    filter: invert(100%) sepia(100%) saturate(13%) hue-rotate(237deg) brightness(104%) contrast(104%);
  }

#controls-container {
  align-items: normal;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 0 10px 0 15px;
}
  #controls-container fieldset.control-column {
    align-items: center;
    border: 1px solid var(--color-text);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    margin: 4px 0;
    text-align: center;
  }
    #controls-container fieldset.control-column.dropdown-control {
      padding-bottom: 8px;
    }
    #controls-container fieldset.control-column legend {
      margin: 0 auto;
      text-align: center;
      white-space: nowrap;
    }
    #controls-container fieldset.control-column input[type=checkbox] {
      margin: 0 4px;
    }
    #controls-container fieldset.control-column input[type=number] {
      margin: 0 auto;
    }
    #controls-container fieldset.control-column input[type=range] {
      display: block;
      margin: 8px auto;
    }

@media (min-width: 1024px) {
  #controls-container {
    display: flex;
    height: 160px;
  }
    #controls-container fieldset.control-column {
      margin-left: 0;
      margin-right: 8px;
    }
}
</style>
