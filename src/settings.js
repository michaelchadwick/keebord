// settings.js
import { ref } from 'vue'

const KB_SETTINGS_KEY = 'keebord-settings'
const lsSettings = localStorage.getItem(KB_SETTINGS_KEY) ? JSON.parse(localStorage.getItem(KB_SETTINGS_KEY)) : null

export const kbSettings = ref({
  controls: {
    outputType: lsSettings ? (lsSettings.filter ? lsSettings.controls.outputType : 'osc') : 'osc',
    oscType: lsSettings ? (lsSettings.filter ? lsSettings.controls.oscType : 'sine') : 'sine',
    sf2Source: lsSettings ? (lsSettings.filter ? lsSettings.controls.sf2Source : 'super_mario_world') : 'super_mario_world',
    sf2Preset: lsSettings ? (lsSettings.filter ? lsSettings.controls.sf2Preset : 'SMW Piano') : 'SMW Piano',
    wafSource: lsSettings ? (lsSettings.filter ? lsSettings.controls.wafSource : '_tone_0000_Aspirin_sf2') : '_tone_0000_Aspirin_sf2'
  },
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
