<script setup>
import { onMounted } from 'vue'

let pianoDiv = null

const props = defineProps({
  musicalNotes: Array,
  rootNote: {
    type: String,
    default: () => 'C'
  },
  useKeyboard: {
    type: Boolean,
    default: () => false
  },
  useMouse: {
    type: Boolean,
    default: () => true
  },
  useMidi: {
    type: Boolean,
    default: () => false
  }
})
const emit = defineEmits([
  'checkedChangedKeyboard',
  'checkedChangedMouse',
  'checkedChangedMidi',
  'notePressed',
  'noteReleased'
])

const emitPressed = (e) => {
  e.preventDefault()

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
const emitReleased = (e) => {
  e.preventDefault()

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

let mousedown = false
let hasTouch = 'ontouchstart' in window

document.body.addEventListener('mousedown', () => mousedown = true)
document.body.addEventListener('mouseup', () => mousedown = false)

//
// Start simulation of onTouchEnter
// https://gist.github.com/zerobytes/677410f1e6ed33d133aa016422a8c706
//

let onTouchLeaveEvents = [];
let onTouchEnterEvents = [];

const onTouchEnter = function (selector, fn) {
	onTouchEnterEvents.push([selector, fn]);

	return function () {
		onTouchEnterEvents.slice().map(function (e, i) {
			if (e[0] === selector && e[1] === fn) {
				onTouchEnterEvents.splice(1, i);
			}
		});
	};
};

const onTouchLeave = function (selector, fn) {
	onTouchLeaveEvents.push([selector, fn]);

	return function () {
		onTouchLeaveEvents.slice().map(function (e, i) {
			if (e[0] === selector && e[1] === fn) {
				onTouchLeaveEvents.splice(1, i);
			}
		});
	};
};

let lastTouchLeave;
let lastTouchEnter;

document.addEventListener('touchmove', (e) => {
	var el = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
	if (!el) return;

	onTouchLeaveEvents.map((event) => {
		if (el != lastTouchEnter && lastTouchEnter && lastTouchEnter.matches(event[0])) {
			if (lastTouchEnter !== lastTouchLeave) {
				event[1](lastTouchEnter, e);
				lastTouchLeave = lastTouchEnter;
				lastTouchEnter = null;
			}
		}
	});

	onTouchEnterEvents.map((event) => {
		if (el.matches(event[0]) && el !== lastTouchEnter) {
			lastTouchEnter = el;
			lastTouchLeave = null;
			event[1](el, e);
		}
	});
});

//
// End simulation of onTouchEnter
//

const keyLabel = function(note) {
  return note.key && !hasTouch && props.useKeyboard
}

onMounted(() => {
  // grab reference to on-screen keyboard
  pianoDiv = document.getElementById('keyboard')
  pianoDiv.scrollLeft = (pianoDiv.scrollWidth / 9) * 3

  const octaveDistance = document.body.scrollWidth > 767 ? 280 : 329
  const noteDistance = document.body.scrollWidth > 767 ? 40 : 47

  // add event listeners to all octave and note scroll buttons
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

  // Simulation of onTouchEnter
  onTouchEnter('#keyboard button', function (el) {
    emit('notePressed', el.dataset.noteid)
    el.classList.add('active')
  });
  // Simulation of onTouchLeave
  onTouchLeave('#keyboard button', function (el) {
    emit('noteReleased', el.dataset.noteid)
    el.classList.remove('active')
  });
})
</script>

<template>
  <div id="control-checkboxes">
    <span>Input Types: </span>

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
      @change="$emit('checkedChangedMouse', $event.target.checked)"
    />
    <label for="use-mouse" title="Enable mouse/touch support?">🐭/🖐️</label>

    <input
      type="checkbox"
      id="use-midi"
      name="use-midi"
      :checked="props.useMidi"
      @change="$emit('checkedChangedMidi', $event.target.checked)"
    />
    <label for="use-midi" title="Enable MIDI keyboard support?">🎹</label>
  </div>

  <div id="keyboard-container">
    <div id="keyboard">
      <button
        v-for="(note, index) in props.musicalNotes"
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

  <div id="scroll-buttons">
    <button id="button-octave-left" title="scroll octave left">
      <i class="fa fa-arrow-left"></i> OCT
    </button>
    <button id="button-note-left" title="scroll note left"><i class="fa fa-arrow-left"></i> NOTE</button>
    <button id="button-note-right" title="scroll note right"><i class="fa fa-arrow-right"></i> NOTE</button>
    <button id="button-octave-right" title="scroll octave right">
      <i class="fa fa-arrow-right"></i> OCT
    </button>
  </div>
</template>

<style scoped>
#control-checkboxes {
  display: flex;
  margin: 0 20px 3px;
}
  #control-checkboxes input {
    margin: 0 0.35em 0 0.5em;
  }
  #control-checkboxes label {
    margin-right: 0.5em;
    min-width: 20px;
  }

#keyboard-container {
  border-top: 1px solid var(--black);
  display: flex;
  height: 200px;
  margin: 0;
  white-space: nowrap;
}
  @media (min-width: 1024px) {
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
          #keyboard button.key-white:hover {
            background-color: var(--green-bright);
            color: var(--color-text);
          }
            body.dark-theme #keyboard button.key-white:hover {
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
          #keyboard button.key-black:hover {
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
