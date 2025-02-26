// settings.js
import { ref } from 'vue'

const KB_SETTINGS_KEY = 'keebord-settings'
const lsSettings = localStorage.getItem(KB_SETTINGS_KEY)
  ? JSON.parse(localStorage.getItem(KB_SETTINGS_KEY))
  : null

export const kbSettings = ref({
  controls: {
    attackTime: lsSettings ? (lsSettings.controls ? lsSettings.controls.attackTime : 0.1) : 0.1,
    decayTime: lsSettings ? (lsSettings.controls ? lsSettings.controls.decayTime : 0.5) : 0.5,
    delay: lsSettings ? (lsSettings.controls ? lsSettings.controls.delay : 1.0) : 1.0,
    delayCheck: lsSettings ? (lsSettings.controls ? lsSettings.controls.delayCheck : false) : false,
    eqCompressor: lsSettings ? (lsSettings.controls ? lsSettings.controls.eqCompressor : 3.0) : 3.0,
    eqLow: lsSettings ? (lsSettings.controls ? lsSettings.controls.eqLow : 0.5) : 0.5,
    eqMid: lsSettings ? (lsSettings.controls ? lsSettings.controls.eqMid : 0.5) : 0.5,
    eqHigh: lsSettings ? (lsSettings.controls ? lsSettings.controls.eqHigh : 0.5) : 0.5,
    masterGain: lsSettings ? (lsSettings.controls ? lsSettings.controls.masterGain : 0.8) : 0.8,
    outputType: lsSettings ? (lsSettings.controls ? lsSettings.controls.outputType : 'osc') : 'osc',
    oscType: lsSettings ? (lsSettings.controls ? lsSettings.controls.oscType : 'sine') : 'sine',
    pan: lsSettings ? (lsSettings.controls ? lsSettings.controls.pan : 0.0) : 0.0,
    pitchBend: lsSettings ? (lsSettings.controls ? lsSettings.controls.pitchBend : 2) : 2,
    releaseTime: lsSettings ? (lsSettings.controls ? lsSettings.controls.releaseTime : 0.5) : 0.5,
    sf2Source: lsSettings
      ? lsSettings.controls
        ? lsSettings.controls.sf2Source
        : 'super_mario_world'
      : 'super_mario_world',
    sf2Preset: lsSettings
      ? lsSettings.controls
        ? lsSettings.controls.sf2Preset
        : 'SMW Piano'
      : 'SMW Piano',
    sustainLevel: lsSettings ? (lsSettings.controls ? lsSettings.controls.sustainLevel : 0.1) : 0.1,
    wafSource: lsSettings
      ? lsSettings.controls
        ? lsSettings.controls.wafSource
        : 'Aspirin'
      : 'Aspirin',
    wafPreset: lsSettings
      ? lsSettings.controls
        ? lsSettings.controls.wafPreset
        : 'Acoustic Grand Piano: Piano'
      : 'Acoustic Grand Piano: Piano',
  },
  filter: {
    rootNote: lsSettings ? (lsSettings.filter ? lsSettings.filter.rootNote : 'C') : 'C',
    scaleType: lsSettings
      ? lsSettings.filter
        ? lsSettings.filter.scaleType
        : 'chromatic'
      : 'chromatic',
  },
  input: {
    keyboard: lsSettings ? (lsSettings.input.keyboard ? true : false) : false,
    midi: lsSettings ? (lsSettings.input.midi ? true : false) : false,
    mouse: lsSettings ? (lsSettings.input.mouse ? true : false) : true,
  },
  output: {
    visualizer: lsSettings ? (lsSettings.output.visualizer ? true : false) : false,
    visualizerType: lsSettings
      ? lsSettings.output.visualizerType
        ? lsSettings.output.visualizerType
        : 'waves'
      : 'waves',
  },
  global: {
    showSynthControls: lsSettings ? (lsSettings.global.showSynthControls ? true : false) : true,
  },
  theme: 'light',
})
