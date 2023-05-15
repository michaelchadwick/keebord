<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  musicalNotes: Array,
  useKeyboard: {
    type: Boolean,
    default: () => false
  },
  useMouse: Boolean,
  useMidi: {
    type: Boolean,
    default: () => true
  },
  useVisualizer: {
    type: Boolean,
    default: () => false
  }
})
const emit = defineEmits([
  'checkedChangedKeyboard',
  'checkedChangedMidi',
  'notePressed',
  'noteReleased'
])

let pianoDiv = null
let useMouse = props.useMouse

let rootNoteSelected = 'C'
let scaleTypeSelected = 'chromatic'

let mousedown = false
let hasTouch = 'ontouchstart' in window
let lastTouchLeave
let lastTouchEnter
let onTouchLeaveEvents = []
let onTouchEnterEvents = []

const emitPressed = (e) => {
  e.preventDefault()

  if (useMouse) {
    let noteid = null
    let target = e.target
    let target_parent = e.target.parentElement

    if (target.dataset.noteid) {
      if (e.type == 'mouseenter') {
        if (mousedown) {
          noteid = parseInt(target.dataset.noteid)
          emit('notePressed', noteid)
          target.classList.add('active')
        }
      } else {
        noteid = parseInt(target.dataset.noteid)
        emit('notePressed', noteid)
        target.classList.add('active')
      }
    } else if (target_parent.dataset.noteid) {
      noteid = parseInt(target_parent.dataset.noteid)
      emit('notePressed', noteid)
      target_parent.classList.add('active')
    }
  }
}
const emitReleased = (e) => {
  e.preventDefault()

  if (useMouse) {
    let noteid = null
    let target = e.target
    let target_parent = e.target.parentElement

    if (target.dataset.noteid) {
      noteid = target.dataset.noteid
      emit('noteReleased', noteid)
      target.classList.remove('active')
    } else if (target_parent.dataset.noteid) {
      noteid = target_parent.dataset.noteid
      emit('noteReleased', noteid)
      target_parent.classList.remove('active')
    }
  }
}

// add event listeners to all octave and note scroll buttons
const addScrollHandlers = () => {
  const octaveDistance = document.body.scrollWidth > 767 ? 280 : 329
  const noteDistance = document.body.scrollWidth > 767 ? 40 : 47

  document.querySelector('#button-octave-left').addEventListener('click', () => {
    if (pianoDiv.scrollLeft > 0) {
      pianoDiv.scrollLeft -= octaveDistance
    }
  })
  document.querySelector('#button-note-left').addEventListener('click', () => {
    if (pianoDiv.scrollLeft > 0) {
      pianoDiv.scrollLeft -= noteDistance
    }
  })
  document.querySelector('#button-note-right').addEventListener('click', () => {
    if (pianoDiv.scrollLeft < pianoDiv.scrollWidth) {
      pianoDiv.scrollLeft += noteDistance
    }
  })
  document.querySelector('#button-octave-right').addEventListener('click', () => {
    if (pianoDiv.scrollLeft < pianoDiv.scrollWidth) {
      pianoDiv.scrollLeft += octaveDistance
    }
  })
}

// show/hide computer keyboard key labels depending on checkbox
const updateKeyFlag = (isChecked) => {
  emit('checkedChangedKeyboard', isChecked)

  const keyLabels = document.querySelectorAll('.key-label')

  if (isChecked) {
    keyLabels.forEach(key => {
      if (key.getAttribute('data-key')) key.classList.add('show')
    })
  } else {
    keyLabels.forEach(key => {
      if (key.getAttribute('data-key')) key.classList.remove('show')
    })
  }
}
const updateMouseFlag = (isChecked) => {
  emit('checkedChangedMouse', isChecked)

  useMouse = isChecked

  updateMouseEventHandler()
}
const updateMidiFlag = (isChecked) => {
  emit('checkedChangedMidi', isChecked)
}
const updateRootNoteValue = (note) => {
  rootNoteSelected = note

  displayedNotes.value = scaleFilter(props.musicalNotes)
}
const updateScaleTypeValue = (scale) => {
  scaleTypeSelected = scale

  displayedNotes.value = scaleFilter(props.musicalNotes)
}
const updateVisualizerFlag = (isChecked) => {
  const canvas = document.getElementById('visualizer-container')

  isChecked ? canvas.style.display = 'block' : canvas.style.display = 'none'
}

// update computer mouse support
const updateMouseEventHandler = () => {
  const buttons = document.querySelectorAll('#keyboard button')

  if (useMouse) {
    document.body.addEventListener('mousedown', mouseController)
    document.body.addEventListener('mouseup', mouseController)

    document.addEventListener('touchmove', touchMoveController)

    buttons.forEach(button => button.classList.add('enabled-mouse'))

    console.log('mouse/touch support enabled')
  } else {
    document.body.removeEventListener('mousedown', mouseController)
    document.body.removeEventListener('mouseup', mouseController)

    document.removeEventListener('touchmove', touchMoveController)

    buttons.forEach(button => button.classList.remove('enabled-mouse'))

    console.log('mouse/touch support disabled')
  }
}
const mouseController = (e) => {
  if (e.type == 'mousedown') {
    mousedown = true
  } else if (e.type == 'mouseup') {
    mousedown = false
  }
}
const touchMoveController = (e) => {
  var el = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)

  if (!el) return

  onTouchLeaveEvents.map((event) => {
    if (el != lastTouchEnter && lastTouchEnter && lastTouchEnter.matches(event[0])) {
      if (lastTouchEnter !== lastTouchLeave) {
        event[1](lastTouchEnter, e)
        lastTouchLeave = lastTouchEnter
        lastTouchEnter = null
      }
    }
  });

  onTouchEnterEvents.map((event) => {
    if (el.matches(event[0]) && el !== lastTouchEnter) {
      lastTouchEnter = el
      lastTouchLeave = null
      event[1](el, e)
    }
  })
}

const onTouchEnter = (selector, fn) => {
	onTouchEnterEvents.push([selector, fn]);

	return function () {
		onTouchEnterEvents.slice().map(function (e, i) {
			if (e[0] === selector && e[1] === fn) {
				onTouchEnterEvents.splice(1, i);
			}
		});
	};
}
const onTouchLeave = (selector, fn) => {
	onTouchLeaveEvents.push([selector, fn]);

	return function () {
		onTouchLeaveEvents.slice().map(function (e, i) {
			if (e[0] === selector && e[1] === fn) {
				onTouchLeaveEvents.splice(1, i);
			}
		});
	};
}

const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
const scales = {
  'chromatic':          [1,1,1,1,1,1,1,1,1,1,1,1,1],

  'bebop':              [2,2,1,2,2,1,1,1],  // Bebop dominant scale
  'blues':              [3,2,1,1,3,2,3],
  'dorian':             [2,1,2,2,2,1,2],    // Dorian mode
  'flamenco':           [1,3,1,2,1,3,1],    // Flamenco mode
  'harmonic-major':     [2,2,1,2,1,3,1],
  'harmonic-minor':     [2,1,2,2,1,3,1],
  'hungarian-major':    [3,1,2,1,2,1,2],
  'hungarian-minor':    [2,1,3,1,1,3,1],
  'major':              [2,2,1,2,2,2],      // Ionian mode
  'melodic-minor':      [2,1,2,2,2,2,1],
  'natural-minor':      [2,1,2,2,1,2,2],    // Aeolian mode
  'pentatonic-major':   [2,2,3,2,3],
  'pentatonic-minor':   [3,2,2,3,2],
  'persian':            [1,3,1,1,2,3,1],    // Persian dominant scale
  'phrygian':           [1,2,2,2,1,2,2,2],
  'tritone':            [1,3,2,1,3,2],
  'whole-tone':         [2,2,2,2,2,2,2],
}

const scaleFilter = () => {
  // console.log(`scaleFilter updated: ${rootNoteSelected} ${scaleTypeSelected}`)

  let filteredNotes = []

  // default setting, so just ignore all the logic
  if (rootNoteSelected == 'C' && scaleTypeSelected == 'chromatic') {
    filteredNotes = Object.values(props.musicalNotes)
  } else {
    let notes = Object.values(props.musicalNotes)

    const startIndex = notes.map(
      note => note.name[1] == 'b' ? `${note.name[0]}${note.name[1]}` : note.name[0]
    ).indexOf(rootNoteSelected)
    const octaveCount = Object.keys(props.musicalNotes).length / 12

    // start scale on root note
    notes = notes.slice(startIndex)

    // cycle through other notes in each octave
    for (let oct = 0; oct < octaveCount; oct++) {
      console.log('filtering octave:', oct)

      const scaleSteps = scales[scaleTypeSelected]
      const octIndex = (oct * 12) + 12
      let noteIndex = oct * 12
      let scaleStepIndex = 0

      while (noteIndex < octIndex) {
        console.log('checking noteIndex:', noteIndex)
        console.log('checking scaleStepIndex:', scaleStepIndex)
        console.log('scaleSteps[scaleStepIndex]', scaleSteps[scaleStepIndex])

        if (notes[noteIndex]) {
          filteredNotes.push(notes[noteIndex])
        }

        noteIndex += scaleSteps[scaleStepIndex]
        scaleStepIndex++
      }
    }
  }

  // console.log('filteredNotes', filteredNotes)

  return filteredNotes
}

const displayedNotes = ref(scaleFilter(props.musicalNotes))

onMounted(() => {
  // grab reference to on-screen keyboard
  pianoDiv = document.getElementById('keyboard')
  pianoDiv.scrollLeft = (pianoDiv.scrollWidth / 9) * 3

  addScrollHandlers()
  updateMouseEventHandler()

  // Simulation of onTouchEnter
  onTouchEnter('#keyboard button', (el) => {
    if (useMouse) {
      emit('notePressed', el.dataset.noteid)
      el.classList.add('active')
    }
  })
  // Simulation of onTouchLeave
  onTouchLeave('#keyboard button', (el) => {
    if (useMouse) {
      emit('noteReleased', el.dataset.noteid)
      el.classList.remove('active')
    }
  })

  updateKeyFlag(props.useKeyboard)
  updateMidiFlag(props.useMidi)
})
</script>

<template>

  <div id="scroll-buttons">
    <button id="button-octave-left" title="scroll octave left">
      <i class="fa fa-arrow-left"></i><span> OCT</span>
    </button>
    <button id="button-note-left" title="scroll note left">
      <i class="fa fa-arrow-left"></i><span> NOTE</span>
    </button>
    <button id="button-note-right" title="scroll note right">
      <i class="fa fa-arrow-right"></i><span> NOTE</span>
    </button>
    <button id="button-octave-right" title="scroll octave right">
      <i class="fa fa-arrow-right"></i><span> OCT</span>
    </button>
  </div>

  <div id="keyboard-container">
    <div id="keyboard">
      <button
        v-for="(note, index) in displayedNotes"
        :data-noteid="note.midi"
        :class="{
          'key-white': note.name[1] != 'b' || scaleTypeSelected != 'chromatic',
          'key-black': note.name[1] == 'b' && scaleTypeSelected == 'chromatic',
          'root-note': note.name[1] == 'b' ? `${note.name[0]}${note.name[1]}` == rootNoteSelected : note.name[0] == rootNoteSelected,
          'enabled-mouse': useMouse
        }"
        @mousedown="emitPressed($event, index)"
        @mouseenter="emitPressed($event, index)"
        @mouseup="emitReleased($event, index)"
        @mouseleave="emitReleased($event, index)"
        @touchstart="emitPressed($event, index)"
        @touchend="emitReleased($event, index)"
        @touchcancel="emitReleased($event, index)"
      >
        <div class="key-label" v-bind:data-key="note.key">{{ note.key }}</div>
        <div class="midi-label">{{ note.midi }}</div>
        <div class="note-label">{{ note.name }}</div>
      </button>
    </div>
  </div>

  <div id="other-controls-container">
    <label for="input-types" class="fieldset-label">Input</label>
    <fieldset id="input-types">
      <input
        type="checkbox"
        id="use-keyboard"
        name="use-keyboard"
        :checked="props.useKeyboard"
        @change="updateKeyFlag($event.target.checked)"
      />
      <label for="use-keyboard" title="Enable keyboard support?">⌨️</label>

      <input
        type="checkbox"
        id="use-mouse"
        name="use-mouse"
        :checked="props.useMouse"
        @change="updateMouseFlag($event.target.checked)"
      />
      <label for="use-mouse" title="Enable mouse/touch support?">🐭/🖐️</label>

      <input
        type="checkbox"
        id="use-midi"
        name="use-midi"
        :checked="props.useMidi"
        @change="updateMidiFlag($event.target.checked)"
      />
      <label for="use-midi" title="Enable MIDI keyboard support?">🎹</label>
    </fieldset>

    <label for="root-scale" class="fieldset-label">Scale</label>
    <fieldset id="root-scale">
      <select
        class="small"
        id="root-note"
        name="root-note"
        v-model="rootNoteSelected"
        @change="updateRootNoteValue($event.target.value)"
      >
        <option disabled value="">- Root -</option>
        <option
          v-for="val in notes"
          :value="val"
        >{{ val }}</option>
      </select>

      <select
        class="small"
        id="scale-type"
        name="scale-type"
        v-model="scaleTypeSelected"
        @change="updateScaleTypeValue($event.target.value)"
      >
        <option disabled value="">- Scale -</option>
        <option
          v-for="key in Object.keys(scales)"
          :value="key"
        >{{ key }}</option>
      </select>
    </fieldset>

    <label for="output-types" class="fieldset-label">Output</label>
    <fieldset id="output-types">
      <input
        type="checkbox"
        id="use-visualizer"
        name="use-visualizer"
        :checked="useVisualizer"
        @change="updateVisualizerFlag($event.target.checked)"
      />
      <label for="use-visualizer" title="Enable visualizer?">📈</label>
    </fieldset>
  </div>

</template>

<style scoped>
#scroll-buttons {
  display: flex;
  justify-content: space-between;
  margin: 2px 0;
  padding: 0 3px;
  width: 100%;
}
  @media (min-width: 1024px) {
    #scroll-buttons {
      padding: 5px 20px;
    }
  }
  #scroll-buttons button {
    border: 2px solid var(--color-border);
    color: var(--color-text);
    font-size: 1.5rem;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
  }
    #scroll-buttons button > span {
      display: none;
      font-weight: bold;
    }
      @media (min-width: 375px) {
        #scroll-buttons button > span {
          display: inline;
        }
      }
    @media (hover: hover) {
      #scroll-buttons button:hover {
        background-color: var(--green);
        color: var(--green-bright-active);
      }
    }
    @media (min-width: 768px) {
      #scroll-buttons button {
        font-size: 1.75rem;
      }
    }

#keyboard-container {
  border-top: 1px solid var(--black);
  display: flex;
  height: 200px;
  margin: 0;
  white-space: nowrap;
}
  @media (min-width: 1024px) {
    #other-controls-container {
      margin-top: 10px;
    }

    #keyboard-container {
      height: 300px;
      margin: 0 20px;
      -moz-box-shadow:    0 2px 4px 2px var(--color-shadow);
      -webkit-box-shadow: 0 2px 4px 2px var(--color-shadow);
      box-shadow:         0 2px 4px 2px var(--color-shadow);
    }
  }
  #keyboard {
    background-color: transparent;
    height: 100%;
    overflow-x: scroll;
    position: relative;
    width: 100%;
  }
    #keyboard button {
      border: 2px solid var(--color-key-border);
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      cursor: auto;
      display: inline-block;
      font-size: 1.5rem;
      font-weight: 700;
      height: 300px;
      margin: 0;
      padding: 0;
      position: relative;
    }
      @media (hover: hover) {
        #keyboard button:not(.enabled-mouse):hover {
          cursor: default;
        }
      }
      #keyboard button div {
        font-weight: bold;
        line-height: 2;
        margin: 0 auto;
        position: absolute;
        text-align: center;
        width: 100%;
      }
        #keyboard button div.key-label {
          border: 1px solid var(--color-text);
          border-radius: 5px;
          bottom: 40px;
          display: none;
          height: 24px;
          padding: 5px;
          width: 24px;
        }
          #keyboard button div.key-label.show {
            display: block;
          }
        #keyboard button div.note-label {
          bottom: 0;
          color: var(--color-text);
          text-transform: none;
        }

      #keyboard button.key-white {
        background-color: var(--color-button-white-background);
        border-top: 0;
        height: 100%;
        width: 47px;
        z-index: 1;
      }
        @media (min-width: 768px) {
          #keyboard button.key-white {
            width: 40px;
          }
        }
        #keyboard button.key-white.root-note {
          background-color: var(--color-button-white-root-background);
        }

        body.dark-theme #keyboard button.key-white {
          border-top: 1px solid var(--color-border);
        }
        @media (hover: hover) {
          #keyboard button.key-white.enabled-mouse:hover {
            background-color: var(--green-bright);
            color: var(--color-text);
            cursor: pointer;
          }
            body.dark-theme #keyboard button.key-white.enabled-mouse:hover {
              background-color: var(--green-deep-active);
            }
        }
        #keyboard button.key-white.active {
          background-color: var(--green-bright-active);
          color: var(--color-text);
        }
          body.dark-theme #keyboard button.key-white.active {
            background-color: var(--green-deep);
          }
          #keyboard button.key-white div {
            color: var(--color-text);
            padding: 0;
          }
            #keyboard button.key-white div.key-label {
              height: 30px;
              margin: 0 10px;
            }
            @media (min-width: 768px) {
              #keyboard button.key-white div.key-label {
                margin: 0 6px;
              }
            }
            #keyboard button.key-white div.midi-label {
              color: var(--gray);
            }

      #keyboard button.key-black {
        background-color: var(--color-button-black-background);
        color: var(--color-flatnote-text);
        font-size: 1.25rem;
        height: 45%;
        margin-left: -20px;
        margin-right: -20px;
        margin-top: 0;
        position: absolute;
        top: 0;
        width: 43px;
        z-index: 10;
      }
        @media (min-width: 768px) {
          #keyboard button.key-black {
            width: 36px;
          }
        }
        #keyboard button.key-black.root-note {
          background-color: var(--color-button-black-root-background);
        }

        body.dark-theme #keyboard button.key-black {
          border-top: 1px solid var(--color-border);
        }
        @media (hover: hover) {
          #keyboard button.key-black.enabled-mouse:hover {
            background-color: var(--green-flat);
            color: var(--color-flatnote-text);
          }
        }
        #keyboard button.key-black.active {
          background-color: var(--green-flat-active);
          color: var(--color-flatnote-text);
        }
          #keyboard button.key-black div.key-label {
            border: 1px solid var(--color-flatnote-text);
            height: 24px;
            line-height: 1;
            margin: 0 7px;
          }
            @media (min-width: 768px) {
              #keyboard button.key-black div.key-label {
                margin: 0 4px;
              }
            }
          #keyboard button.key-black div.note-label {
            color: var(--color-flatnote-text);
          }
          #keyboard button div.midi-label {
            color: var(--gray);
          }

#other-controls-container {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 60px;
  margin: 5px 0;
  overflow-y: auto;
}
  @media (min-width: 667px) {
    #other-controls-container {
      flex-direction: row;
      height: 40px;
      margin: 0 5px;
    }
  }
  @media (min-width: 1024px) {
    #other-controls-container {
      margin: 5px 20px;
    }
  }
  #other-controls-container fieldset {
    align-items: center;
    background-color: #fafafa;
    border: 1px solid #aaaaaa;
    border-radius: 4px;
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    display: flex;
    height: 30px;
    margin: 0 10px 0 0;
    padding: 2px;
  }
  #other-controls-container input {
    margin: 0 0.35em;
  }
  #other-controls-container label {
    margin-right: 0.2em;
    min-width: 20px;
  }
    @media (min-width: 667px) {
      #other-controls-container fieldset {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
      }
      #other-controls-container label {
        margin-right: 0.5em;
      }
    }
    #other-controls-container label.fieldset-label {
      background-color: var(--white-mute);
      border: 1px solid #aaaaaa;
      border-radius: 4px;
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      border-right: none;
      display: none;
      font-size: 1.4rem;
      font-weight: bold;
      height: 30px;
      padding: 0 5px;
      text-transform: uppercase;
    }
    body.dark-theme #other-controls-container label.fieldset-label {
      color: #000000;
    }
    @media (min-width: 667px) {
      #other-controls-container label.fieldset-label {
        align-items: center;
        display: flex;
        margin-right: 0;
      }
    }
    #other-controls-container label + select.small {
      margin-right: 5px;
    }
  #other-controls-container select.small {
    height: 24px;
    padding: 0;
  }
</style>
