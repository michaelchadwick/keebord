// initial VueJS imports
import { createApp } from 'vue'
import { kbSettings } from './settings.js'
import App from './App.vue'

// stylesheets
import './assets/css/main.css'

// constants
const KB_SETTINGS_KEY = 'keebord-settings'
const SUN_EMOJI = '☀️'
const MOON_EMOJI = '🌙'

const lsSettings = localStorage.getItem(KB_SETTINGS_KEY)
  ? JSON.parse(localStorage.getItem(KB_SETTINGS_KEY))
  : null

// initialize VueJS
const app = createApp(App)

app.config.globalProperties.lsKey = KB_SETTINGS_KEY
app.config.globalProperties.params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
})

app.mount('#app')

// ******************************************************* //
// additional localStorage setup and themeTogglerElem init //
// ******************************************************* //

const bodyClasses = document.body.classList
const themeTogglerElem = document.querySelector('#theme-toggler')
const themeTogglerElemImg = document.querySelector('#theme-toggler span.theme-image')
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

// first visit
if (!lsSettings) {
  // console.log('NO localStorage settings found')

  bodyClasses.remove('dark-theme')
  bodyClasses.add('light-theme')

  themeTogglerElemImg.innerHTML = SUN_EMOJI

  kbSettings.value.theme = 'light'

  console.log('kbSettings', kbSettings.value)
}
// return visit
else {
  // console.log('localStorage settings found')

  if (lsSettings.controls) {
    kbSettings.value.controls.outputType = lsSettings.controls.outputType
    kbSettings.value.controls.oscType = lsSettings.controls.oscType
    kbSettings.value.controls.sf2Source = lsSettings.controls.sf2Source
    kbSettings.value.controls.sf2Preset = lsSettings.controls.sf2Preset
    kbSettings.value.controls.wafSource = lsSettings.controls.wafSource

    kbSettings.value.controls.pan = lsSettings.controls.pan
    kbSettings.value.controls.pitchBend = lsSettings.controls.pitchBend
    kbSettings.value.controls.delayCheck = lsSettings.controls.delayCheck
    kbSettings.value.controls.delay = lsSettings.controls.delay
    kbSettings.value.controls.eqLow = lsSettings.controls.eqLow
    kbSettings.value.controls.eqMid = lsSettings.controls.eqMid
    kbSettings.value.controls.eqHigh = lsSettings.controls.eqHigh
    kbSettings.value.controls.eqCompressor = lsSettings.controls.eqCompressor
    kbSettings.value.controls.masterGain = lsSettings.controls.masterGain
  }

  if (lsSettings.filter) {
    kbSettings.value.filter.rootNote = lsSettings.filter.rootNote
    kbSettings.value.filter.scaleType = lsSettings.filter.scaleType
  }

  if (lsSettings.input) {
    kbSettings.value.input.keyboard = lsSettings.input.keyboard ? true : false
    kbSettings.value.input.midi = lsSettings.input.midi ? true : false
    kbSettings.value.input.mouse = lsSettings.input.mouse ? true : false
  }

  if (lsSettings.output) {
    kbSettings.value.output.visualizer = lsSettings.output.visualizer ? true : false
    kbSettings.value.output.visualizerType = lsSettings.output.visualizerType
  }

  if (lsSettings.theme == 'dark') {
    bodyClasses.remove('light-theme')
    bodyClasses.add('dark-theme')

    themeTogglerElemImg.innerHTML = MOON_EMOJI

    kbSettings.value.theme = 'dark'
  } else {
    bodyClasses.remove('dark-theme')
    bodyClasses.add('light-theme')

    themeTogglerElemImg.innerHTML = SUN_EMOJI

    kbSettings.value.theme = 'light'
  }

  // console.log('kbSettings', kbSettings.value)
}

// save state
localStorage.setItem(KB_SETTINGS_KEY, JSON.stringify(kbSettings.value))

// if such a theme toggler DOM element exists, enable it
if (themeTogglerElem) {
  themeTogglerElem.addEventListener('click', function () {
    bodyClasses.toggle('dark-theme')
    bodyClasses.toggle('light-theme')

    const curTheme = bodyClasses.contains('light-theme') ? 'light' : 'dark'

    // update text inside toggler
    themeTogglerElemImg.innerHTML = curTheme == 'light' ? SUN_EMOJI : MOON_EMOJI

    kbSettings.value.theme = curTheme

    localStorage.setItem(KB_SETTINGS_KEY, JSON.stringify(kbSettings.value))
  })
}

// regardless of state, adjust per scheme preference
if (prefersDarkScheme.matches) {
  if (lsSettings) {
    if (lsSettings.theme !== 'light') {
      bodyClasses.remove('light-theme')
      bodyClasses.add('dark-theme')
    }
  }

  if (themeTogglerElem) {
    themeTogglerElemImg.innerHTML = MOON_EMOJI
  }
}
