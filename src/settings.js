// settings.js
import { reactive } from 'vue'

const KEEBORD_ENV_PROD_URL = [
  'keebord.neb.host',
  'piano.neb.host'
]

export const kbSettings = reactive({
  env: KEEBORD_ENV_PROD_URL.includes(document.location.hostname) ? 'prod' : 'local',
  lsKey: 'keebord-settings',
  input: {
    keyboard: false,
    midi: false,
    mouse: true
  },
  theme: 'light'
})
