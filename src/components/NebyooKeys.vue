<script setup>
const midiAccessSupportEmit = defineEmits(['midiSupport'])

let NebyooKeys = {
  midiAccessSupport: false,
  midi: null
};
let context = new AudioContext();
let oscillators = {};

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
//   btn[i].addEventListener('mousedown', clickPlayOn);
//   btn[i].addEventListener('mouseup', clickPlayOff);
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
  let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;

  let data = event.data
  let cmd = data[0] >> 4, channel = data[0] & 0xf,
      type = data[0] & 0xf0, note = data[1], vel = data[2]

  switch (type) {
    case 144: // noteOn message
      noteOn(note, vel);
      console.log(`ON - note: ${note}, freq: ${midiToFreq(note)}, vel: ${vel}`);
      break;
    case 128: // noteOff message
      noteOff(note, vel);
      console.log(`OFF - note: ${note}, freq: ${midiToFreq(note)}, vel: ${vel}`);
      break;
    default: // other message
      for (const character of event.data) {
        str += `0x${character.toString(16)} `;
      }
      console.log(str);
  }

  console.log(str);

}

function noteOn(note, vel) {
  const freq = midiToFreq(note);
  const gainNode = context.createGain();

  oscillators[freq] = context.createOscillator();
  oscillators[freq].frequency.value = freq;
  oscillators[freq].type = 'square';
  oscillators[freq].addEventListener('ended', () => {
    // console.log('osc stopped')
  });

  gainNode.gain.value = vel / 127;

  oscillators[freq].connect(gainNode)
  oscillators[freq].connect(context.destination);

  console.log('osc', oscillators);

  oscillators[freq].start(context.currentTime);
}

function noteOff(note) {
  const freq = midiToFreq(note);

  if (oscillators[freq]) {
    oscillators[freq].stop(context.currentTime);
    oscillators[freq].disconnect();
  }
}

function midiToFreq(note) {
  return Math.pow(2, ((note - 69) / 12)) * 440;
}

// keyboard controls
// [z,     x, c, v, b, n,   m ]
// musical note
// [C4,    D4,E4,F4,G4,A4,  B4]
// frequency
// [261.63,            440,   ]
// midi
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
  <h3>NebyooKeys.vue</h3>

  <template v-if="NebyooKeys.midi">
    <ul v-if="NebyooKeys.midi">
      <li v-for="entry in NebyooKeys.midi.inputs">
        name: {{ entry[1].name }}
      </li>
    </ul>
  </template>

  <button data-noteid="c3" class="white c"></button>
  <button data-noteid="d3" class="white d"></button>
  <button data-noteid="e3" class="white e"></button>
  <button data-noteid="f3" class="white f"></button>
  <button data-noteid="g3" class="white g"></button>
  <button data-noteid="a3" class="white a"></button>
  <button data-noteid="b3" class="white b"></button>
</template>

<style scoped>
button {
  border: 3px solid #222222;
  height: 50px;
  margin-right: 10px;
  width: 20px;
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
  }
</style>
