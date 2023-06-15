// initial VueJS imports
import { createApp } from 'vue'
import { kbSettings } from './settings.js'
import App from './App.vue'

// stylesheets
import './assets/css/main.css'

console.log('kbSettings', kbSettings.value)

// constants
const KB_SETTINGS_KEY = 'keebord-settings'
const SUN_EMOJI = '☀️'
const MOON_EMOJI = '🌙'

// initialize VueJS
const app = createApp(App)

app.config.globalProperties.lsKey = KB_SETTINGS_KEY
app.config.globalProperties.params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop)
})

app.mount('#app')

// ******************************************************* //
// additional localStorage setup and themeTogglerElem init //
// ******************************************************* //

const lsSettings = JSON.parse(localStorage.getItem(KB_SETTINGS_KEY))
const bodyClasses = document.body.classList
const themeTogglerElem = document.querySelector('#theme-toggler')
const themeTogglerElemImg = document.querySelector('#theme-toggler span.theme-image')
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

console.log('lsSettings', lsSettings)


// first visit
if (!lsSettings) {
  bodyClasses.remove('dark-theme')
  bodyClasses.add('light-theme')

  themeTogglerElemImg.innerHTML = SUN_EMOJI

  kbSettings.value.theme = 'light'
}
// return visit
else {
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
}

// save state
localStorage.setItem(KB_SETTINGS_KEY, JSON.stringify(kbSettings.value))

// if such a theme toggler DOM element exists, enable it
if (themeTogglerElem) {
  themeTogglerElem.addEventListener('click', function() {
    bodyClasses.toggle('dark-theme')
    bodyClasses.toggle('light-theme')

    const curTheme = bodyClasses.contains('light-theme') ? 'light' : 'dark'

    // update text inside toggler
    themeTogglerElemImg.innerHTML = curTheme == 'light' ? SUN_EMOJI : MOON_EMOJI

    kbSettings.value.theme = curTheme

    // save state
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
