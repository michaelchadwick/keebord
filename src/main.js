// initial VueJS imports
import { createApp } from 'vue'
import App from './App.vue'

// stylesheets
import './assets/css/main.css'

// constants
const KEEBORD_SETTINGS_KEY = 'keebord-settings'
const KEEBORD_ENV_PROD_URL = [
  'keebord.neb.host',
  'piano.neb.host'
]
const SUN_EMOJI = '☀️'
const MOON_EMOJI = '🌙'

// initialize VueJS
const app = createApp(App)

app.config.globalProperties.env = KEEBORD_ENV_PROD_URL.includes(document.location.hostname) ? 'prod' : 'local'
app.config.globalProperties.params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop)
})
app.config.globalProperties.settings = {
  theme: 'light'
}

app.mount('#app')

// ******************************************************* //
// additional localStorage setup and themeTogglerElem init //
// ******************************************************* //

const lsSettings = JSON.parse(localStorage.getItem(KEEBORD_SETTINGS_KEY))
const bodyClasses = document.body.classList
const themeTogglerElem = document.querySelector('#theme-toggler')
const themeTogglerElemImg = document.querySelector('#theme-toggler span.theme-image')
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

// first visit
if (!lsSettings) {
  bodyClasses.remove('dark-theme')
  bodyClasses.add('light-theme')

  themeTogglerElemImg.innerHTML = SUN_EMOJI

  app.config.globalProperties.settings.theme = 'light'
}
// return visit
else {
  if (lsSettings.theme == 'dark') {
    bodyClasses.remove('light-theme')
    bodyClasses.add('dark-theme')

    themeTogglerElemImg.innerHTML = MOON_EMOJI

    app.config.globalProperties.settings.theme = 'dark'
  } else {
    bodyClasses.remove('dark-theme')
    bodyClasses.add('light-theme')

    themeTogglerElemImg.innerHTML = SUN_EMOJI

    app.config.globalProperties.settings.theme = 'light'
  }
}

// save state
localStorage.setItem(KEEBORD_SETTINGS_KEY, JSON.stringify(app.config.globalProperties.settings))

// if such a theme toggler DOM element exists, enable it
if (themeTogglerElem) {
  themeTogglerElem.addEventListener('click', function() {
    bodyClasses.toggle('dark-theme')
    bodyClasses.toggle('light-theme')

    const curTheme = bodyClasses.contains('light-theme') ? 'light' : 'dark'

    // update text inside toggler
    themeTogglerElemImg.innerHTML = curTheme == 'light' ? SUN_EMOJI : MOON_EMOJI

    app.config.globalProperties.settings.theme = curTheme

    localStorage.setItem(KEEBORD_SETTINGS_KEY, JSON.stringify(app.config.globalProperties.settings))
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
