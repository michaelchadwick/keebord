import { createApp } from 'vue'
import App from './App.vue'

import './assets/css/main.css'

const app = createApp(App)

app.mount('#app')

// theme toggling
let theme = 'light'

const bodyClasses = document.body.classList
const themeToggler = document.querySelector('#theme-toggler')
const imgThemeToggler = document.querySelector('#theme-toggler span.theme-image')
const lblThemeToggler = document.querySelector('#theme-toggler span.theme-label')
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
const currentTheme = localStorage.getItem('mcinfo-theme')

if (themeToggler) {
  if (currentTheme == 'dark') {
    bodyClasses.toggle('dark-theme')

    imgThemeToggler.innerHTML = '🌙'
  } else {
    bodyClasses.toggle('light-theme')

    imgThemeToggler.innerHTML = '☀️'
  }

  themeToggler.addEventListener('click', function() {
    bodyClasses.toggle('dark-theme')
    bodyClasses.toggle('light-theme')

    theme = bodyClasses.contains('light-theme') ? 'light' : 'dark'

    // update text inside toggler
    imgThemeToggler.innerHTML = theme == 'light' ? '☀️' : '🌙'

    localStorage.setItem('keebord-theme', theme)
  })
}

if (prefersDarkScheme.matches) {
  bodyClasses.add('dark-theme')
  bodyClasses.remove('light-theme')

  if (themeToggler) {
    imgThemeToggler.innerHTML = '🌙'
  }
}
