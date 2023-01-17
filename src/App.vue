<script setup>
import Synth from './components/Synth.vue'
</script>

<template>
  <header>
    <h1>NebyooKeys on <img src="./assets/logo.svg" class="logo" width="24" height="24"></h1>
  </header>

  <main>
    <Synth />
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
  height: 24px;
  width: 24px;
}
</style>
