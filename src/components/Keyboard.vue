<script setup>
import { ref, onMounted } from 'vue'

let pianoDiv = null
let mousedown = false
let hasTouch = false

document.body.onmousedown = () => mousedown = true
document.body.onmouseup = () => mousedown = false

const props = defineProps(['musicalNotes', 'rootNote'])
const emit = defineEmits(['notePressed', 'noteReleased'])

onMounted(() => {
  pianoDiv = document.getElementById('keyboard')
  pianoDiv.scrollLeft = (pianoDiv.scrollWidth / 9) * 3
  // pianoDiv.scrollLeft = (props.rootNote[1] * 40 * 7)

  if ('ontouchstart' in window) {
    hasTouch = true
  }

  document.querySelector('#btn-scroll-left').addEventListener('click', () => {
    if (pianoDiv.scrollLeft > 0) {
      pianoDiv.scrollLeft -= 40
    }
  })
  document.querySelector('#btn-scroll-right').addEventListener('click', () => {
    if (pianoDiv.scrollLeft < pianoDiv.scrollWidth) {
      pianoDiv.scrollLeft += 40
    }
  })
})

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
</script>

<template>
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
        <div v-if="note.key && !hasTouch" class="key-label">{{ note.key }}</div>
        <div class="note-name">{{ note.name }}</div>
      </button>
    </div>
  </div>

  <div id="scroll-buttons">
    <button id="btn-scroll-left"><i class="fa fa-arrow-left"></i></button>
    <button id="btn-scroll-right"><i class="fa fa-arrow-right"></i></button>
  </div>
</template>

<style scoped>
#keyboard-container {
  display: flex;
  height: 300px;
  margin: 0 20px;
  white-space: nowrap;
  -moz-box-shadow:    0 2px 4px 2px #333333;
  -webkit-box-shadow: 0 2px 4px 2px #333333;
  box-shadow:         0 2px 4px 2px #333333;
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
          height: 24px;
          padding: 5px;
          width: 24px;
        }
        #keyboard button div.note-name {
          bottom: 0;
          color: var(--color-text);
          text-transform: none;
        }

      #keyboard button.key-white {
        background-color: var(--color-button-white-background);
        border-top: 0;
        height: 100%;
        width: 40px;
        z-index: 1;
      }
        body.dark-theme #keyboard button.key-white {
          border-top: 1px solid var(--color-border);
        }
        #keyboard button.key-white:hover {
          background-color: var(--green-bright);
          color: var(--color-text);
        }
          body.dark-theme #keyboard button.key-white:hover {
            background-color: var(--green-deep-active);
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
              margin: 0 6px;
            }

      #keyboard button.key-black {
        background-color: var(--color-button-black-background);
        color: var(--color-flatnote-text);
        font-size: 1.25rem;
        height: 40%;
        margin-left: -20px;
        margin-right: -20px;
        margin-top: 0;
        position: absolute;
        top: 0;
        width: 36px;
        z-index: 10;
      }
        body.dark-theme #keyboard button.key-black {
          border-top: 1px solid var(--color-border);
        }
        #keyboard button.key-black:hover {
          background-color: var(--green-flat);
          color: #ededed;
        }
        #keyboard button.key-black.active {
          background-color: var(--green-flat-active);
          color: #ffffff;
        }
          #keyboard button.key-black div.key-label {
            border: 1px solid var(--color-flatnote-text);
            height: 24px;
            line-height: 1;
            margin: 0 3px;
          }
          #keyboard button.key-black div.note-name {
            color: var(--color-flatnote-text);
          }

#scroll-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding: 0 20px;
  width: 100%;
}
  #scroll-buttons button {
    border: 1px solid var(--color-border);
    color: var(--color-text);
  }
    #scroll-buttons button:hover {
      background-color: var(--green-deep-active);
      color: var(--green-bright-active);
    }
</style>
