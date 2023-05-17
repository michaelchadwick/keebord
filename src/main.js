import { createApp } from 'vue'
import App from './App.vue'

import './assets/css/main.css'

const KEEBORD_SETTINGS_KEY = 'keebord-settings'
const KEEBORD_ENV_PROD_URL = [
  'keebord.neb.host',
  'piano.neb.host'
]

const app = createApp(App)

app.config.globalProperties.env = KEEBORD_ENV_PROD_URL.includes(document.location.hostname) ? 'prod' : 'local'
app.config.globalProperties.settings = {}

app.mount('#app')

// theme toggling
let theme = 'light'

const bodyClasses = document.body.classList
const themeToggler = document.querySelector('#theme-toggler')
const imgThemeToggler = document.querySelector('#theme-toggler span.theme-image')
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
const lsSettings = localStorage.getItem(KEEBORD_SETTINGS_KEY)

if (themeToggler) {
  if (lsSettings) {
    if (lsSettings.theme == 'dark') {
      bodyClasses.toggle('dark-theme')

      imgThemeToggler.innerHTML = '🌙'
    }
  } else {
    bodyClasses.toggle('light-theme')

    imgThemeToggler.innerHTML = '☀️'
  }

  themeToggler.addEventListener('click', function() {
    console.log('clicked themeToggler')

    bodyClasses.toggle('dark-theme')
    bodyClasses.toggle('light-theme')

    theme = bodyClasses.contains('light-theme') ? 'light' : 'dark'

    // update text inside toggler
    imgThemeToggler.innerHTML = theme == 'light' ? '☀️' : '🌙'

    app.config.globalProperties.settings.theme = theme

    localStorage.setItem(KEEBORD_SETTINGS_KEY, JSON.stringify(app.config.globalProperties.settings))
  })
}

if (prefersDarkScheme.matches) {
  if (lsSettings) {
    if (lsSettings.theme != 'light') {
      bodyClasses.add('dark-theme')
      bodyClasses.remove('light-theme')
    }
  }

  if (themeToggler) {
    imgThemeToggler.innerHTML = '🌙'
  }
}
