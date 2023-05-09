# Keebord

Play piano using keyboard, mouse, touch or MIDI input. Built using VueJS.

Much thanks to [dabbmedia/web-audio-synth](https://github.com/dabbmedia/web-audio-synth?ref=vuejsexamples.com) for providing a starting point for someone who has never done VueJS before.

## Contributions

```sh
git clone git@github.com:michaelchadwick/keebord.git
cd keebord
npm install
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
cd /path/to/keebord/public
scp . user@host:/var/www/keebord
sudo systemctl restart [httpd|apache2|nginx]
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Credits

* [simulation of onTouchEnter](https://gist.github.com/zerobytes/677410f1e6ed33d133aa016422a8c706)
