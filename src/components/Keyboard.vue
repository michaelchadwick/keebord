<script setup>
import { onMounted } from 'vue'

let piano = null

const emit = defineEmits(['notePressed', 'noteReleased'])

onMounted(() => {
  piano = document.getElementById('keyboard')
})

const emitPressed = (e) => {
  e.preventDefault()

  let noteid = null
  let target = e.target
  let target_parent = e.target.parentElement

  if (target.dataset.noteid) {
    noteid = parseInt(target.dataset.noteid)
    emit('notePressed', noteid)
    target.classList.add('active')
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
  <div id="keyboard">
    <div class="octave">
      <div class="key-row white">
        <button data-noteid="60" class="key c"
          @mousedown="emitPressed($event)"
          @mouseup="emitReleased($event)"
          @touchstart="emitPressed($event)"
          @touchend="emitReleased($event)"
          @touchcancel="emitReleased($event)"
        >
          <div class="notename">C3</div>
          <span>z</span>
        </button>
        <button data-noteid="62" class="key d"
          @mousedown="emitPressed($event)"
          @mouseup="emitReleased($event)"
          @touchstart="emitPressed($event)"
          @touchend="emitReleased($event)"
          @touchcancel="emitReleased($event)"
        >
          <div class="notename">D3</div>
          <span>x</span>
        </button>
        <button data-noteid="64" class="key e"
          @mousedown="emitPressed($event)"
          @mouseup="emitReleased($event)"
          @touchstart="emitPressed($event)"
          @touchend="emitReleased($event)"
          @touchcancel="emitReleased($event)"
        >
          <div class="notename">E3</div>
          <span>c</span>
        </button>
        <button data-noteid="65" class="key f"
          @mousedown="emitPressed($event)"
          @mouseup="emitReleased($event)"
          @touchstart="emitPressed($event)"
          @touchend="emitReleased($event)"
          @touchcancel="emitReleased($event)"
        >
          <div class="notename">F3</div>
          <span>v</span>
        </button>
        <button data-noteid="67" class="key g"
          @mousedown="emitPressed($event)"
          @mouseup="emitReleased($event)"
          @touchstart="emitPressed($event)"
          @touchend="emitReleased($event)"
          @touchcancel="emitReleased($event)"
        >
          <div class="notename">G3</div>
          <span>b</span>
        </button>
        <button data-noteid="69" class="key a"
          @mousedown="emitPressed($event)"
          @mouseup="emitReleased($event)"
          @touchstart="emitPressed($event)"
          @touchend="emitReleased($event)"
          @touchcancel="emitReleased($event)"
        >
          <div class="notename">A3</div>
          <span>n</span>
        </button>
        <button data-noteid="71" class="key b"
          @mousedown="emitPressed($event)"
          @mouseup="emitReleased($event)"
          @touchstart="emitPressed($event)"
          @touchend="emitReleased($event)"
          @touchcancel="emitReleased($event)"
        >
          <div class="notename">B3</div>
          <span>m</span>
        </button>
      </div>
      <div class="key-row black">
        <button data-noteid="61" class="key db"
          @mousedown="emitPressed($event)"
          @mouseup="emitReleased($event)"
          @touchstart="emitPressed($event)"
          @touchend="emitReleased($event)"
          @touchcancel="emitReleased($event)"
        >
          <div class="notename">C#3</div>
          <span>s</span>
        </button>
        <button data-noteid="63" class="key eb"
          @mousedown="emitPressed($event)"
          @mouseup="emitReleased($event)"
          @touchstart="emitPressed($event)"
          @touchend="emitReleased($event)"
          @touchcancel="emitReleased($event)"
        >
          <div class="notename">D#3</div>
          <span>d</span>
        </button>
        <button data-noteid="66" class="key gb"
          @mousedown="emitPressed($event)"
          @mouseup="emitReleased($event)"
          @touchstart="emitPressed($event)"
          @touchend="emitReleased($event)"
          @touchcancel="emitReleased($event)"
        >
          <div class="notename">F#3</div>
          <span>g</span>
        </button>
        <button data-noteid="68" class="key ab"
          @mousedown="emitPressed($event)"
          @mouseup="emitReleased($event)"
          @touchstart="emitPressed($event)"
          @touchend="emitReleased($event)"
          @touchcancel="emitReleased($event)"
        >
          <div class="notename">G#3</div>
          <span>h</span>
        </button>
        <button data-noteid="70" class="key bb"
          @mousedown="emitPressed($event)"
          @mouseup="emitReleased($event)"
          @touchstart="emitPressed($event)"
          @touchend="emitReleased($event)"
          @touchcancel="emitReleased($event)"
        >
          <div class="notename">A#3</div>
          <span>j</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
#keyboard {
  align-items: flex-start;
  display: flex;
  justify-content: flex-start;
}
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
