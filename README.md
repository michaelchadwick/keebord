# Keebord

Play piano using keyboard, mouse, touch or MIDI input. Built using [VueJS](https://vuejs.org).

* 96-key piano roll
* Responsive design
* Multiple input support: computer keyboard, MIDI keyboard, mouse/touch
* Use scroll buttons or swipe to move piano roll
* Scale filter for easier jamming
* Optional oscilloscope or frequency bar visualizers
* Note/chord recognition
* Uses WebAudio OscillatorNode for synth output
  * Use Synth Controls dropdown to adjust wave type, panning, ADSR, pitch bend range, delay amount, 3-band EQ, compressor, and master volume
* Experimental support for [Sfumato](https://github.com/felixroos/sfumato)
* Experimental support for [WebAudioFont](https://github.com/surikov/webaudiofont)

## Contributions

```sh
git clone git@github.com:michaelchadwick/keebord.git
cd keebord
pnpm install
pnpm run dev
```

### Compile and Minify for Production

```sh
pnpm run build
cd /path/to/keebord/public
scp . user@host:/path/to/keebord
sudo systemctl restart [httpd|apache2|nginx]
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm run lint
```

## Credits

Much thanks to [dabbmedia/web-audio-synth](https://github.com/dabbmedia/web-audio-synth) for providing a starting point for someone who has never done VueJS before.

### Other Help

* [simulation of onTouchEnter](https://gist.github.com/zerobytes/677410f1e6ed33d133aa016422a8c706)
* [List of musical scales and modes](https://en.wikipedia.org/wiki/List_of_musical_scales_and_modes)
* [Interval_(music)](https://en.wikipedia.org/wiki/Interval_(music))
* [Sinusoidal example](https://p5js.org/examples/math-sine-wave.html)
