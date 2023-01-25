# NebyooKeys

Play piano using keyboard, mouse, touch or MIDI input. Built using VueJS.

Much thanks to [dabbmedia/web-audio-synth](https://github.com/dabbmedia/web-audio-synth?ref=vuejsexamples.com) for providing a starting point for someone who has never done VueJS before.

## Contributions

```sh
git clone git@github.com:michaelchadwick/nebyookeys.git
cd nebyookeys
npm install
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
cd /path/to/nebyookeys/public
scp . user@host:/var/www/nebyookeys
sudo systemctl restart [httpd|apache2|nginx]
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
