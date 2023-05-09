<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  musicalNotes: Array,
  rootNote: {
    type: String,
    default: () => 'C'
  },
  scaleType: {
    type: String,
    default: () => 'chromatic'
  },
  useKeyboard: {
    type: Boolean,
    default: () => false
  },
  useMouse: {
    type: Boolean,
    default: () => false
  },
  useMidi: {
    type: Boolean,
    default: () => false
  }
})
const emit = defineEmits([
  'checkedChangedKeyboard',
  'checkedChangedMidi',
  'notePressed',
  'noteReleased',
  'selectChangedRootNote',
  'selectChangedScaleType'
])

let pianoDiv = null
let useMouse = props.useMouse

let rootNoteSelected = props.rootNote
let scaleTypeSelected = props.scaleType

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

  const buttons = document.querySelectorAll('#keyboard button')

  buttons.forEach(button => {
    if (useMouse) {
      button.classList.add('enabled-mouse')
    } else {
      button.classList.remove('enabled-mouse')
    }
  })

  updateMouseEventHandler()
}
const updateMidiFlag = (isChecked) => {
  emit('checkedChangedMidi', isChecked)
}
const updateRootNoteValue = (value) => {
  emit('selectChangedRootNote', value)

  console.log('Keyboard updateRootNoteValue', value)
}
const updateScaleTypeValue = (value) => {
  emit('selectChangedScaleType', value)

  console.log('Keyboard updateScaleTypeValue', value)
}

// update computer mouse support
const updateMouseEventHandler = () => {
  if (useMouse) {
    document.body.addEventListener('mousedown', mouseController)
    document.body.addEventListener('mouseup', mouseController)

    document.addEventListener('touchmove', touchMoveController)

    console.log('mouse/touch support enabled')
  } else {
    document.body.removeEventListener('mousedown', mouseController)
    document.body.removeEventListener('mouseup', mouseController)

    document.removeEventListener('touchmove', touchMoveController)

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

if (useMouse) {
  // document.addEventListener('touchmove', touchMoveController)
  updateMouseEventHandler()
} else {
  // console.log('useMouse false, so did not add touchmove handler')
}

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const scales = {
  'chromatic':          ['1,1,1,1,1,1,1,1,1,1,1,1,1'],
  'whole-tone':         ['2,2,2,2,2,2,2'],
  'major':              ['2,2,2,1,2,2,2,1'],
  'minor-harm':         ['2,1,2,2,1,3,3'],
  'minor-melodic':      ['2,1,2,2,2,2,3'],
  'major-pentatonic':   ['2,2,3,2,3,2'],
  'minor-pentatonic':   ['3,2,2,3,2,3'],
  'blues':              ['3,2,1,1,3,2,3'],
  'phyrgian':           ['1,2,2,2,1,2,2,2'],
  'dorian':             ['2,1,2,2,2,1,2,2']
}

onMounted(() => {
  // grab reference to on-screen keyboard
  pianoDiv = document.getElementById('keyboard')
  pianoDiv.scrollLeft = (pianoDiv.scrollWidth / 9) * 3

  addScrollHandlers()

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

  console.log('props', props)
})
</script>

<template>
  <div id="keyboard-container">
    <div id="keyboard">
      <button
        class="enabled-mouse"
        v-for="(note, index) in props.musicalNotes()"
        :data-noteid="note.midi"
        :class="(note.name[1] != 'b') ? 'key-white' : 'key-black'"
        @mousedown="emitPressed($event, index)"
        @mouseenter="emitPressed($event, index)"
        @mouseup="emitReleased($event, index)"
        @mouseleave="emitReleased($event, index)"
        @touchstart="emitPressed($event, index)"
        @touchend="emitReleased($event, index)"
        @touchcancel="emitReleased($event, index)"
      >
        <div class="key-label" v-bind:data-key="note.key">{{ note.key }}</div>
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

    <label for="root-scale" class="fieldset-label">Root/Scale</label>
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
  </div>

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
</template>

<style scoped>
#other-controls-container {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 60px;
  margin: 5px 0;
  overflow-y: auto;
}
  #other-controls-container fieldset {
    align-items: center;
    background-color: #fafafa;
    border: 1px solid #aaaaaa;
    border-radius: 4px;
    display: flex;
    margin-right: 10px;
    padding: 2px;
  }
  #other-controls-container input {
    margin: 0 0.35em;
  }
  #other-controls-container label {
    margin-right: 0.5em;
    min-width: 20px;
  }
    #other-controls-container label.fieldset-label {
      display: none;
    }
    #other-controls-container label + select.small {
      margin-right: 5px;
    }
  #other-controls-container select.small {
    height: 24px;
    padding: 0;
  }

@media (min-width: 600px) {
  #other-controls-container {
    flex-direction: row;
    height: 40px;
    margin: 0 16px 3px;
  }
    #other-controls-container label.fieldset-label {
      display: block;
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
        body.dark-theme #keyboard button.key-white {
          border-top: 1px solid var(--color-border);
        }
        @media (hover: hover) {
          #keyboard button.key-white.enabled-mouse:hover {
            background-color: var(--green-bright);
            color: var(--color-text);
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

#scroll-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 10px;
  width: 100%;
}
  @media (min-width: 1024px) {
    #scroll-buttons {
      padding: 0 20px;
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
        background-color: var(--green-deep-active);
        color: var(--green-bright-active);
      }
    }
    @media (min-width: 768px) {
      #scroll-buttons button {
        font-size: 1.75rem;
      }
    }
</style>
