<script setup>
import Note from '../note.js';
import ADSREnvelope from 'adsr-envelope';

const midiAccessSupportEmit = defineEmits(['midiSupport']);
const audioContext = new AudioContext();
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
});

let NebyooKeys = {
  midiAccessSupport: false,
  midi: null
};
let noteMap = {};
let oscTypes = [
  { text: 'Sine', value: 'sine' },
  { text: 'Sawtooth', value: 'sawtooth' },
  { text: 'Square', value: 'square' },
  { text: 'Triangle', value: 'triangle' }
];

// add midi support
if ('requestMIDIAccess' in navigator) {
  console.log('navigator.requestMIDIAccess() supported!');

  navigator.requestMIDIAccess({ sysex: false }).then(onMIDISuccess, onMIDIFailure);
} else {
  console.error('navigator.requestMIDIAccess() not supported');
}

// add computer keyboard support
// document.addEventListener('keypress', compKeysController)
// document.addEventListener('keyup', compKeysController)

// add mouse support
// for (var i = 0; i < btn.length; i++) {
//   btn[i].addEventListener('mousedown', mouseController);
//   btn[i].addEventListener('mouseup', mouseController);
// }

function onMIDISuccess(midi) {
  console.log("MIDI ready!");

  midiAccessSupportEmit('midiSupport', true);

  NebyooKeys.midiAccessSupport = true;
  NebyooKeys.midi = midi;

  listInputsAndOutputs(NebyooKeys.midi);
  // add MIDI device support
  startLoggingMIDIInput(NebyooKeys.midi);
}

function onMIDIFailure(msg) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

function listInputsAndOutputs(midiAccess) {
  for (const entry of midiAccess.inputs) {
    const input = entry[1];
    let msg = '';

    msg += `Input port [type:'${input.type}, id:'${input.id}', manufacturer:'${input.manufacturer}', name:'${input.name}', version:'${input.version}'`;

    console.log(msg);
  }

  for (const entry of midiAccess.outputs) {
    const output = entry[1];

    console.log(`Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`);
  }
}

function startLoggingMIDIInput(midiAccess, indexOfPort) {
  midiAccess.inputs.forEach((entry) => {
    entry.onmidimessage = onMIDIMessage;
  });
}

function onMIDIMessage(event) {
  let str = `MIDI message received at ${event.timeStamp}[${event.data.length} bytes]: `;
  for (const character of event.data) {
    str += `0x${character.toString(16)} `;
  }
  console.log(str);

  let data = event.data
  let cmd = data[0] >> 4, channel = data[0] & 0xf,
      type = data[0] & 0xf0, noteNumber = data[1], velocity = data[2]

  switch (type) {
    case 224: // TODO: pitch change
      break;
    case 176: // TODO: mod change
      break;
    case 144: // noteOn message
      makeNote(noteNumber, velocity);

      break;
    case 128: // noteOff message
      stopNote(noteNumber)

      break;
    default: // other message
      // console.log('type', type);

      break;
  }
}

function makeNote(noteNumber, velocity) {
  console.log(`ON - note: ${noteNumber}, vel: ${velocity}`);

  if (noteMap[noteNumber]) {
    noteMap[freq].noteOff();
  }

  const envelope = adsr.clone();
  envelope.peakLevel = velocity / 127;
  const type = document.querySelector('#osc-type').value;
  noteMap[noteNumber] = new Note(audioContext, noteNumber, type, envelope);
  noteMap[noteNumber].noteOn();
}

function stopNote(noteNumber) {
  console.log(`OFF - note: ${noteNumber}`);

  if (noteMap[noteNumber]) {
    noteMap[noteNumber].noteOff();
  }

  noteMap[noteNumber] = null;
}

// computer keyboard controls
// [z,     x, c, v, b, n,   m ]
// musical note
// [C4,    D4,E4,F4,G4,A4,  B4]
// frequency
// [261.63,            440,   ]
// midi number
// [60,    62,64,65,67,69,  71]
function compKeysController(e) {
  const key2midi = {
    'z': 60, 's': 61, 'x': 62, 'd': 63, 'c': 64, 'v': 65,
    'g': 66, 'b': 67, 'h': 68, 'n': 69, 'j': 70, 'm': 71
  }

  let note = key2midi[e.key];

  if (e.type == 'keydown') {
    if (note >= 60 && note < 72) {
      noteOn(note, 127);
    }
  } else if (e.type == 'keyup') {
    noteOff(note, 0);
  }
}
</script>

<template>
  <template v-if="NebyooKeys.midi">
    <ul v-if="NebyooKeys.midi">
      <li v-for="entry in NebyooKeys.midi.inputs">
        name: {{ entry[1].name }}
      </li>
    </ul>
  </template>

  <select id="osc-type">
    <option v-for="option in oscTypes" v-bind:value="option.value">
      {{ option.text }}
    </option>
  </select>

  <div id="keyboard">
    <button data-noteid="60" class="white c">C3</button>
      <button data-noteid="61" class="black c#">C#3</button>
    <button data-noteid="62" class="white d">D3</button>
      <button data-noteid="63" class="black d#">D#3</button>
    <button data-noteid="64" class="white e">E3</button>
    <button data-noteid="65" class="white f">F3</button>
      <button data-noteid="66" class="black f#">F#3</button>
    <button data-noteid="67" class="white g">G3</button>
      <button data-noteid="68" class="black g#">G#3</button>
    <button data-noteid="69" class="white a">A3</button>
      <button data-noteid="70" class="black a#">A#3</button>
    <button data-noteid="71" class="white b">B3</button>

    <button data-noteid="72" class="white c">C4</button>
      <button data-noteid="73" class="black c#">C#4</button>
    <button data-noteid="74" class="white d">D4</button>
      <button data-noteid="75" class="black d#">D#4</button>
    <button data-noteid="76" class="white e">E4</button>
    <button data-noteid="77" class="white f">F4</button>
      <button data-noteid="78" class="black f#">F#4</button>
    <button data-noteid="79" class="white g">G4</button>
      <button data-noteid="80" class="black g#">G#4</button>
    <button data-noteid="81" class="white a">A4</button>
      <button data-noteid="82" class="black a#">A#4</button>
    <button data-noteid="83" class="white b">B4</button>
  </div>
</template>

<style scoped>
#keyboard {
  display: flex;
}
button {
  border: 3px solid #222222;
  font-weight: bold;
  height: 200px;
  margin-right: 0;
  margin-top: 20px;
  padding: 0;
  width: 40px;
}
  button.white {
    background-color: #ffffff;
  }
    button.white.e,
    button.white.b {
      margin-right: 0;
    }
  button.black {
    background-color: #111111;
    color: #ffffff;
    margin-top: 0;
  }
  button.active {
    background-color: #e0de70;
    color: rgb(22, 46, 180);
  }
</style>
