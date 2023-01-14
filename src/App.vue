<script>
import NebyooKeys from './components/NebyooKeys.vue'
import Keyboard from './components/Keyboard.vue'

export default {
  components: {
    NebyooKeys
  },
  data() {
    return {
      hasMidiSupport: false
    }
  }
}
</script>

<template>
  <header>
    <h2>App.vue</h2>
  </header>

  <main>
    <NebyooKeys
      @midi-support="(midiSupport) => hasMidiSupport = midiSupport"
    />
    <Keyboard />
    <template v-if="!hasMidiSupport">
      <div>
        <span class="failure">No MIDI Access supported.</span><br />
        <span>Please try <a href="https://www.google.com/chrome/">Chrome</a> or <a href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>, instead.</span>
      </div>
    </template>
  </main>
</template>

<style scoped>
h1 {
  display: block;
}

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
