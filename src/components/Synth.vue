<script setup>
import Keyboard from './Keyboard.vue'
import Note from '../libraries/note.js'
import ADSREnvelope from 'adsr-envelope'

const audioContext = new AudioContext()
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
let oscTypes = [
  { text: 'Sine', value: 'sine' },
  { text: 'Sawtooth', value: 'sawtooth' },
  { text: 'Square', value: 'square' },
  { text: 'Triangle', value: 'triangle' }
]
let noteMap = {}

let makeNote = (noteNumber, velocity = 64) => {
  // console.log(`ON - note: ${noteNumber}, vel: ${velocity}`)

  if (noteMap[noteNumber]) {
    noteMap[noteNumber].noteOff()
  }

  const envelope = adsr.clone()
  envelope.peakLevel = velocity / 127
  const type = document.querySelector('#osc-type').value
  noteMap[noteNumber] = new Note(audioContext, noteNumber, type, envelope)
  noteMap[noteNumber].noteOn()
}
let stopNote = (noteNumber) => {
  // console.log(`OFF - note: ${noteNumber}`)

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

// handle MIDI inputs
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
      makeNote(noteNumber, velocity); break;
    // noteOff message
    case 128:
      stopNote(noteNumber); break;
    // TODO: pitch change
    case 224:
      break;
    // TODO: mod change
    case 176:
      break;
    // all others
    default:
      // console.log('type', type); break;
  }
}

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

  <select id="osc-type">
    <option v-for="option in oscTypes" v-bind:value="option.value">
      {{ option.text }}
    </option>
  </select>

  <Keyboard
    @note-pressed="makeNote"
    @note-released="stopNote"
  />
</template>
