<script setup>
import { onMounted, ref } from 'vue'
import Modal from './components/ModalDialog.vue'
import Synth from './components/AudioSynth.vue'
import NebyooApps from './components/NebyooApps.vue'

const KEEBORD_ENV_PROD_URL = ['neb.host', 'keebord.neb.host', 'piano.neb.host']

const showHelpModal = ref(false)

// handle both clicks and touches outside of modals
const handleClickTouch = function (event) {
  const dialog = document.getElementsByClassName('modal-wrapper')[0]

  if (dialog) {
    const isConfirm = dialog.classList.contains('modal-confirm')
    const isTempApi = dialog.classList.contains('temp-api')

    // only close if not a confirmation (and not a special temp-api)!
    if (event.target == dialog && !isConfirm && !isTempApi) {
      showHelpModal.value = false
    }
  }
}

onMounted(() => {
  // DOM > main divs/elements
  const dom = {
    navOverlay: document.getElementById('nav-overlay'),
    btnNav: document.getElementById('button-nav'),
    btnNavClose: document.getElementById('button-nav-close'),
    btnHelp: document.getElementById('button-help'),
    // "btnSettings": document.getElementById('button-settings'),
  }

  const env = KEEBORD_ENV_PROD_URL.includes(document.location.hostname) ? 'prod' : 'local'

  if (env == 'local') {
    if (!document.title.includes('(LH)')) {
      document.title = '(LH) ' + document.title
    }
  }

  dom.btnNav.addEventListener('click', () => {
    dom.navOverlay.classList.toggle('show')
  })
  dom.btnNavClose.addEventListener('click', () => {
    dom.navOverlay.classList.toggle('show')
  })

  // When the user clicks or touches anywhere outside of the modal, close it
  window.addEventListener('click', handleClickTouch)
  window.addEventListener('touchend', handleClickTouch)

  // TODO: make a more compact mobile interface
})
</script>

<template>
  <header>
    <div class="menu-left">
      <div id="nav-links">
        <button
          id="button-nav"
          class="icon"
          aria-label="Click for links to more apps by neb.host"
          tabindex="-1"
        >
          <i class="fa-solid fa-bars"></i>
        </button>
        <div id="nav-overlay">
          <div id="nav-content">
            <div class="container">
              <div class="nav-header">More Apps By Neb</div>

              <NebyooApps />

              <div class="nav-footer">
                <!-- vvv neb.host subsite footer -->
                <footer id="footer-neb-host">
                  site by
                  <a
                    style="color: #ffffff; font-family: 'Consolas', sans-serif; font-size: 12px"
                    href="https://neb.host"
                    >neb.host</a
                  >
                </footer>
                <!-- ^^^ neb.host subsite footer -->
              </div>
            </div>

            <div id="button-nav-close">
              <a href="#">X</a>
            </div>
          </div>
        </div>
      </div>

      <button
        id="button-help"
        class="icon"
        aria-label="Help"
        tabindex="-1"
        @click="showHelpModal = true"
      >
        <i class="fa-solid fa-question"></i>
      </button>
      <Transition name="modal">
        <modal v-if="showHelpModal" @close="showHelpModal = false">
          <template v-slot:header>
            <h3>How to Use Keebord</h3>
          </template>
          <template v-slot:body>
            <p>
              Welcome to <strong>Keebord</strong>, where you can play the piano. Use your mouse or
              finger (or keyboard, be it computer or MIDI) to play the keys and revel in the sound
              of oscillators spinning for your pleasure. The outer scroll buttons at the top move
              the keyboard left/right by octave; the inner ones by note.
            </p>

            <p>Tweak the synth used in the <strong>Synth Controls</strong> dropdown.</p>

            <p>
              Choose a root note and scale from the dropdown to filter the keys and make it easier
              to jam. The output checkbox toggles an oscillator so you can <em>see</em> your sound.
            </p>

            <hr />

            <strong>Developer</strong>:
            <a href="https://michaelchadwick.info" target="_blank">Michael Chadwick</a><br />
            <strong>Source</strong>:
            <a href="https://github.com/michaelchadwick/keebord" target="_blank">Github</a><br />
            <strong>Sounds used</strong>: <a href="https://felixroos.github.io/sfumato/">SF2</a>,
            <a href="https://surikov.github.io/webaudiofontdata/sound/">WAF</a>
          </template>
        </modal>
      </Transition>
    </div>

    <div class="title">
      <h1>
        <span class="flat">K</span>
        <span>e</span>
        <span class="flat">e</span>
        <span>b</span>
        <span class="flat">o</span>
        <span>r</span>
        <span class="flat">d</span>
      </h1>
    </div>

    <div class="menu-right">
      <button id="theme-toggler"><span class="theme-image">☀️</span></button>
    </div>
  </header>

  <main>
    <Synth />
  </main>
</template>

<style scoped>
header {
  align-items: center;
  background: var(--green);
  border-bottom: 5px solid var(--green-deep);
  color: var(--color-text);
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 50px;
  justify-content: space-between;
  padding: 2px 16px;
}
header .menu-left {
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  width: 70px;
}
header .menu-left #nav-overlay {
  align-items: unset;
  background-color: transparent;
  display: none;
  height: 100%;
  justify-content: left;
  left: 0;
  position: absolute;
  top: 50px;
  width: 100%;
  z-index: 11;
}
header .menu-left #nav-overlay.show {
  display: flex;
}
header .menu-left #nav-overlay #nav-content {
  animation: SlideRight 200ms;
  background-color: var(--green);
  border-radius: 0;
  box-shadow: 3px 5px 5px rgb(0 0 0 / 15%);
  box-sizing: border-box;
  max-height: calc(100% - 41px);
  max-width: 500px;
  overflow-y: auto;
  padding: 0px;
  position: relative;
  top: 0;
  width: 100%;
}
@media (min-width: 415px) {
  header .menu-left #nav-overlay #nav-content {
    width: 325px;
  }
}
header .menu-left #nav-overlay #nav-content a {
  color: var(--color-text);
  text-decoration: none;
}

header .menu-left #nav-overlay #nav-content .container {
  align-items: normal;
  padding: 0;
}
header .menu-left #nav-overlay #nav-content .container .nav-header {
  color: var(--color-flatnote-text);
  font-size: 20px;
  font-weight: 700;
  padding-bottom: 18px;
  padding-left: 18px;
  padding-top: 18px;
}
header .menu-left #nav-overlay #nav-content .container .nav-list a {
  align-items: center;
  background-color: transparent;
  display: flex;
  font-size: 16px;
  font-weight: bold;
  height: 30px;
  justify-content: left;
  padding: 4px 0 4px 18px;
}
@media (hover: hover) {
  header .menu-left #nav-overlay #nav-content .container .nav-list a:hover {
    background-color: var(--color-link-highlight);
  }
}
header .menu-left #nav-overlay #nav-content #button-nav-close {
  color: var(--color-flatnote-text);
  font-size: 20px;
  height: 24px;
  position: absolute;
  right: 16px;
  top: 16px;
  width: 24px;
}
@media (hover: hover) {
  header .menu-left #nav-overlay #nav-content #button-nav-close a:hover {
    color: var(--color-link-highlight);
  }
}
header .menu-left #nav-overlay #nav-content .nav-footer {
  display: flex;
}
header .menu-left #nav-overlay #nav-content #footer-neb-host {
  background: #004e30;
  border-top: 2px solid #002115;
  bottom: 9px;
  color: #d1d1d1;
  font-family: 'Consolas', sans-serif;
  font-size: 12px;
  font-weight: 500;
  left: 0;
  letter-spacing: initial;
  margin-top: 20px;
  padding: 10px 18px;
  position: absolute;
  right: 0;
  text-align: left;
  z-index: 2;
}
@media (hover: hover) {
  header .menu-left #nav-overlay #nav-content #footer-neb-host a:hover {
    text-decoration: underline;
  }
}

header .title {
  font-weight: 700;
  font-size: 14px;
  line-height: 150%;
  letter-spacing: 0.1em;
  pointer-events: none;
  text-align: center;
  text-transform: uppercase;
}
header .title h1 span {
  bottom: -2px;
  color: #ffffff;
  position: relative;
}
header .title h1 span.flat {
  bottom: 3px;
  color: var(--green-bright);
  position: relative;
}
@media (min-width: 768px) {
  header .title {
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0.01em;
  }
}
header .menu-right {
  display: flex;
  justify-content: flex-end;
  width: 70px;
}
header .menu-right button#button-settings {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  margin-right: 0;
}
</style>
