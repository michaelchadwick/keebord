import { createApp } from 'vue'
import App from './App.vue'

import './assets/css/main.css'

const KEEBORD_SETTINGS_KEY = 'keebord-settings'
const KEEBORD_ENV_PROD_URL = [
  'keebord.neb.host',
  'piano.neb.host'
]
const SUN_EMOJI = '☀️'
const MOON_EMOJI = '🌙'

const app = createApp(App)

app.config.globalProperties.env = KEEBORD_ENV_PROD_URL.includes(document.location.hostname) ? 'prod' : 'local'
app.config.globalProperties.settings = { theme: 'light' }

app.mount('#app')

const lsSettings = JSON.parse(localStorage.getItem(KEEBORD_SETTINGS_KEY))
const bodyClasses = document.body.classList
const themeToggler = document.querySelector('#theme-toggler')
const imgThemeToggler = document.querySelector('#theme-toggler span.theme-image')
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

// default case
if (!lsSettings) {
  bodyClasses.remove('dark-theme')
  bodyClasses.add('light-theme')

  imgThemeToggler.innerHTML = SUN_EMOJI

  app.config.globalProperties.settings.theme = 'light'
}
// return visit
else {
  if (lsSettings.theme == 'dark') {
    bodyClasses.remove('light-theme')
    bodyClasses.add('dark-theme')

    imgThemeToggler.innerHTML = MOON_EMOJI

    app.config.globalProperties.settings.theme = 'dark'
  } else {
    bodyClasses.remove('dark-theme')
    bodyClasses.add('light-theme')

    imgThemeToggler.innerHTML = SUN_EMOJI

    app.config.globalProperties.settings.theme = 'light'
  }
}

// save state
localStorage.setItem(KEEBORD_SETTINGS_KEY, JSON.stringify(app.config.globalProperties.settings))

// regardless of state, adjust per scheme preference
if (prefersDarkScheme.matches) {
  if (lsSettings) {
    if (lsSettings.theme !== 'light') {
      bodyClasses.remove('light-theme')
      bodyClasses.add('dark-theme')
    }
  }

  if (themeToggler) {
    imgThemeToggler.innerHTML = MOON_EMOJI
  }
}

// if such a DOM element exists, enable it
if (themeToggler) {
  themeToggler.addEventListener('click', function() {
    bodyClasses.toggle('dark-theme')
    bodyClasses.toggle('light-theme')

    const curTheme = bodyClasses.contains('light-theme') ? 'light' : 'dark'

    // update text inside toggler
    imgThemeToggler.innerHTML = curTheme == 'light' ? SUN_EMOJI : MOON_EMOJI

    app.config.globalProperties.settings.theme = curTheme

    localStorage.setItem(KEEBORD_SETTINGS_KEY, JSON.stringify(app.config.globalProperties.settings))
  })
}
