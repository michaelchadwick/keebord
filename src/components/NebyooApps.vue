<script setup>
import { ref, onMounted } from 'vue'

const NEBYOOAPPS_SOURCE_URL = 'https://dave.neb.host/?sites'

const apps = ref([])

async function getNebyooApps() {
  const response = await fetch(NEBYOOAPPS_SOURCE_URL)
  const json = await response.json()
  apps.value = json.body
}

onMounted(() => {
  getNebyooApps()
})
</script>

<template>
  <div class="nav-list">
    <a v-for="app in apps" href="app.url" target="_blank">{{ app.title }}</a>
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
