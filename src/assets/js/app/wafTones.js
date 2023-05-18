export default new Promise((res) => {
  let script = document.createElement('script')
  script.onload = () => res()
  // script.setAttribute('src', 'src/assets/js/vendor/tones/0000_Aspirin_sf2.js')
  script.setAttribute('src', 'https://surikov.github.io/webaudiofontdata/sound/0000_Aspirin_sf2_file.js')
  document.head.appendChild(script)

  // script = document.createElement('script')
  // script.onload = () => res()
  // // script.setAttribute('src', 'src/assets/js/vendor/tones/0250_SoundBlasterOld_sf2.js')
  // script.setAttribute('src', 'https://surikov.github.io/webaudiofontdata/sound/0250_SoundBlasterOld_sf2.js')
  // document.head.appendChild(script)
});