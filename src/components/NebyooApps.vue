<script setup>
import { ref, onMounted } from 'vue'

const apps = ref([])

async function getNebyooApps() {
  console.log('getting apps from dave...')
  const response = await fetch('https://dave.neb.host/?sites')
  const json = await response.json()
  apps.value = json.body
}

onMounted(() => {
  getNebyooApps()
})
</script>

<template>
  <div class="nav-list">
    <a v-for="app in apps" href="app.url">{{ app.title }}</a>
  </div>
</template>

<style scoped>
  .nav-list a {
    align-items: center;
    background-color: transparent;
    display: flex;
    font-size: 16px;
    font-weight: bold;
    height: 30px;
    justify-content: left;
    padding: 4px 0 4px 18px;
    text-decoration: none;
  }
  @media (hover: hover) {
    .nav-list a:hover {
      background-color: var(--color-link-highlight);
    }
  }
</style>
