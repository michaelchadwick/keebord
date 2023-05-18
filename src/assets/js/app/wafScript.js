export default new Promise((res) => {
  const script = document.createElement('script');
  script.onload = () => res();
  // script.setAttribute('src', 'src/assets/js/vendor/WebAudioFontPlayer.js');
  script.setAttribute('src', 'https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js');
  document.head.appendChild(script);
});