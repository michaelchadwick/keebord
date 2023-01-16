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
document.addEventListener('keydown', compKeysController)
document.addEventListener('keyup', compKeysController)

// add mouse support
document.addEventListener('mousedown', mouseController);
document.addEventListener('mouseup', mouseController);

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
    noteMap[noteNumber].noteOff();
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
    'g': 66, 'b': 67, 'h': 68, 'n': 69, 'j': 70, 'm': 71,
    'q': 72, '2': 73, 'w': 74, '3': 75, 'e': 76, 'r': 77,
    '5': 78, 't': 79, '6': 80, 'y': 81, '7': 82, 'u': 83,
    'i': 84
  }

  const note = key2midi[e.key];

  if (e.type == 'keydown') {
    if (note >= 60 && note <= 84) {
      makeNote(note, 64);
    }
  } else if (e.type == 'keyup') {
    stopNote(note);
  }
}

// TODO:
function mouseController(e) {
  // if (e.type == 'mousedown') {
  //   const target = e.target;
  //   let note = null;

  //   if (target.classList) {
  //     if (target.classList.contains('key')) {
  //       note = target.data.noteid;
  //     }
  //     else if (target.parentElement.classList) {
  //       if (target.parentElement.classList.contains('key')) {
  //         note = target.parentElement.data.noteid;
  //       }
  //     }
  //   }

  //   if (note) {
  //     makeNote(note, 64);
  //   }
  // } else if (e.type == 'mouseup') {
  //   let note = null;

  //   if (target.classList) {
  //     if (target.classList.contains('key')) {
  //       note = target.data.noteid;
  //     }
  //     else if (target.parentElement.classList) {
  //       if (target.parentElement.classList.contains('key')) {
  //         note = target.parentElement.data.noteid;
  //       }
  //     }
  //   }

  //   if (note) {
  //     stopNote(note);
  //   }
  // }
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
    <div class="octave">
      <div class="key-row white">
        <button data-noteid="60" class="key c">
          <div class="notename">C3</div>
          <span>z</span>
        </button>
        <button data-noteid="62" class="key d">
          <div class="notename">D3</div>
          <span>x</span>
        </button>
        <button data-noteid="64" class="key e">
          <div class="notename">E3</div>
          <span>c</span>
        </button>
        <button data-noteid="65" class="key f">
          <div class="notename">F3</div>
          <span>v</span>
        </button>
        <button data-noteid="67" class="key g">
          <div class="notename">G3</div>
          <span>b</span>
        </button>
        <button data-noteid="69" class="key a">
          <div class="notename">A3</div>
          <span>n</span>
        </button>
        <button data-noteid="71" class="key b">
          <div class="notename">B3</div>
          <span>m</span>
        </button>
      </div>
      <div class="key-row black">
        <button data-noteid="61" class="key db">
          <div class="notename">C#3</div>
          <span>s</span>
        </button>
        <button data-noteid="63" class="key eb">
          <div class="notename">D#3</div>
          <span>d</span>
        </button>
        <button data-noteid="66" class="key gb">
          <div class="notename">F#3</div>
          <span>g</span>
        </button>
        <button data-noteid="68" class="key ab">
          <div class="notename">G#3</div>
          <span>h</span>
        </button>
        <button data-noteid="70" class="key bb">
          <div class="notename">A#3</div>
          <span>j</span>
        </button>
      </div>
    </div>

    <div class="octave">
      <div class="key-row white">
        <button data-noteid="72" class="key c">C4<br /><span>q</span></button>
        <button data-noteid="74" class="key d">D4<br /><span>w</span></button>
        <button data-noteid="76" class="key e">E4<br /><span>e</span></button>
        <button data-noteid="77" class="key f">F4<br /><span>r</span></button>
        <button data-noteid="79" class="key g">G4<br /><span>t</span></button>
        <button data-noteid="81" class="key a">A4<br /><span>y</span></button>
        <button data-noteid="83" class="key b">B4<br /><span>u</span></button>
      </div>
      <div class="key-row black">
        <button data-noteid="73" class="key db">C#4<br /><span>2</span></button>
        <button data-noteid="75" class="key eb">D#4<br /><span>3</span></button>
        <button data-noteid="78" class="key gb">F#4<br /><span>5</span></button>
        <button data-noteid="80" class="key ab">G#4<br /><span>6</span></button>
        <button data-noteid="82" class="key bb">A#4<br /><span>7</span></button>
      </div>
    </div>

    <div class="octave">
      <div class="key-row white">
        <button data-noteid="84" class="c">C5<br /><span>i</span></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  border: 2px solid #222222;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  font-size: 1.5rem;
  font-weight: 700;
  height: 200px;
  margin: 0;
  max-width: 50px;
  padding: 0;
}
  button div.notename {
    font-weight: bold;
  }
  button span {
    border: 1px solid #000;
    border-radius: 5px;
    padding: 5px;
  }

#keyboard {
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;
}

.octave {
  display: flex;
}
  .octave .key-row {
    display: flex;
  }
    .octave .key-row.white {

    }
      .octave .key-row.white button {
        align-items: stretch;
        background-color: #ffffff;
        display: flex;
        flex-direction: column-reverse;
        min-width: 50px;
      }
        .octave .key-row.white button:hover {
          background-color: #e9e9e9;
          color: #282828;
        }
        .octave .key-row.white button.active {
          background-color: #f6f6f6;
          color: #000000;
        }
        .octave .key-row.white button span {
          padding: 0;
        }
    .octave .key-row.black {
      position: absolute;
      top: 0;
    }
      .octave .key-row.black button {
        align-items: stretch;
        background-color: #111111;
        color: #ffffff;
        display: flex;
        flex-direction: column-reverse;
        font-size: 1.25rem;
        height: 100px;
        margin-top: 0;
        max-width: 30px;
      }
        .octave .key-row.black button.db {
          left: 18%;
        }
        .octave .key-row.black button.eb {
          left: 42%;
        }
        .octave .key-row.black button.gb {
          left: 79%;
        }
        .octave .key-row.black button.ab {
          left: 99%;
        }
        .octave .key-row.black button.bb {
          left: 118%;
        }

        .octave .key-row.black button:hover {
          background-color: #201181;
          color: #ededed;
        }
        .octave .key-row.black button.active {
          background-color: #3546a7;
          color: #ffffff;
        }

        .octave .key-row.black button span {
          border: 1px solid #ffffff;
        }
</style>
