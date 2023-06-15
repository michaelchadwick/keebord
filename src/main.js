// initial VueJS imports
import { createApp } from 'vue'
import { kbSettings } from './settings.js'
import App from './App.vue'

// stylesheets
import './assets/css/main.css'

// constants
const SUN_EMOJI = '☀️'
const MOON_EMOJI = '🌙'

// initialize VueJS
const app = createApp(App)

app.mount('#app')

// ******************************************************* //
// additional localStorage setup and themeTogglerElem init //
// ******************************************************* //

const lsSettings = JSON.parse(localStorage.getItem(kbSettings.lsKey))
const bodyClasses = document.body.classList
const themeTogglerElem = document.querySelector('#theme-toggler')
const themeTogglerElemImg = document.querySelector('#theme-toggler span.theme-image')
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

// first visit
if (!lsSettings) {
  bodyClasses.remove('dark-theme')
  bodyClasses.add('light-theme')

  themeTogglerElemImg.innerHTML = SUN_EMOJI

  kbSettings.theme = 'light'
}
// return visit
else {
  if (lsSettings.theme == 'dark') {
    bodyClasses.remove('light-theme')
    bodyClasses.add('dark-theme')

    themeTogglerElemImg.innerHTML = MOON_EMOJI

    kbSettings.theme = 'dark'
  } else {
    bodyClasses.remove('dark-theme')
    bodyClasses.add('light-theme')

    themeTogglerElemImg.innerHTML = SUN_EMOJI

    kbSettings.theme = 'light'
  }
}

// save state
localStorage.setItem(kbSettings.lsKey, JSON.stringify(kbSettings))

// if such a theme toggler DOM element exists, enable it
if (themeTogglerElem) {
  themeTogglerElem.addEventListener('click', function() {
    bodyClasses.toggle('dark-theme')
    bodyClasses.toggle('light-theme')

    const curTheme = bodyClasses.contains('light-theme') ? 'light' : 'dark'

    // update text inside toggler
    themeTogglerElemImg.innerHTML = curTheme == 'light' ? SUN_EMOJI : MOON_EMOJI

    kbSettings.theme = curTheme

    // save state
    localStorage.setItem(kbSettings.lsKey, JSON.stringify(kbSettings))
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
