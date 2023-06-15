// settings.js
import { reactive, ref } from 'vue'

export const kbSettings = ref({
  input: {
    keyboard: false,
    midi: false,
    mouse: true
  },
  theme: 'light'
})
