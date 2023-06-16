// settings.js
import { ref } from 'vue'

const KB_SETTINGS_KEY = 'keebord-settings'
const lsSettings = localStorage.getItem(KB_SETTINGS_KEY) ? JSON.parse(localStorage.getItem(KB_SETTINGS_KEY)) : null

export const kbSettings = ref({
  filter: {
    rootNote: lsSettings ? (lsSettings.filter ? lsSettings.filter.rootNote : 'C') : 'C',
    scaleType: lsSettings ? (lsSettings.filter ? lsSettings.filter.scaleType : 'chromatic') : 'chromatic',
  },
  input: {
    keyboard: lsSettings ? (lsSettings.input.keyboard ? true : false) : false,
    midi: lsSettings ? (lsSettings.input.midi ? true : false) : false,
    mouse: lsSettings ? (lsSettings.input.mouse ? true : false) : false
  },
  output: {
    visualizer: lsSettings ? (lsSettings.output.visualizer ? true : false) : false
  },
  theme: 'light'
})
