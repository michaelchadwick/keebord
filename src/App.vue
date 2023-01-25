<script setup>
import { onMounted } from 'vue';
import Synth from './components/Synth.vue'

onMounted(() => {
  if ((typeof NebyooKeys) === 'undefined') var NebyooKeys = {}

  // DOM > main divs/elements
  NebyooKeys.dom = {
    "navOverlay": document.getElementById('nav-overlay'),
    "btnNav": document.getElementById('button-nav'),
    "btnNavClose": document.getElementById('button-nav-close'),
    // "btnHelp": document.getElementById('button-help'),
    // "btnSettings": document.getElementById('button-settings'),
  }

  const NEBKEYS_ENV_PROD_URL = [
    'piano.neb.host'
  ]

  NebyooKeys.env = NEBKEYS_ENV_PROD_URL.includes(document.location.hostname) ? 'prod' : 'local'

  if (NebyooKeys.env == 'local') {
    document.title = '(LH) ' + document.title
  }

  NebyooKeys.dom.btnNav.addEventListener('click', () => {
    NebyooKeys.dom.navOverlay.classList.toggle('show')
  })
  NebyooKeys.dom.btnNavClose.addEventListener('click', () => {
    NebyooKeys.dom.navOverlay.classList.toggle('show')
  })
})
</script>

<template>
  <header>
    <div class="menu-left">

      <div id="nav-links">
        <button id="button-nav" class="icon" aria-label="Click for links to more apps by neb.host" tabindex="-1">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div id="nav-overlay">
          <div id="nav-content">
            <div class="container">

              <div class="nav-header">More Apps By Neb</div>

              <div class="nav-list">
                <a href="https://ah.neb.host">Audio Hash</a>
                <a href="https://bogdle.fun">Bogdle</a>
                <a href="https://gw.neb.host">Gem Warrior</a>
                <a href="https://raffler.neb.host">Raffler</a>
                <a href="https://sketchage.neb.host">Sketchage</a>
              </div>

              <div class="nav-footer">
                <!-- vvv neb.host subsite footer -->
                <footer id="footer-neb-host">site by <a style="color: #ffffff; font-family: 'Consolas', sans-serif; font-size: 12px;" href="https://neb.host">neb.host</a>
                </footer>
                <!-- ^^^ neb.host subsite footer -->
              </div>
            </div>

            <div id="button-nav-close">
              <a href="#">X</a>
            </div>

          </div>
        </div>
      </div>

      <!--
      <button id="button-help" class="icon" aria-label="Help" tabindex="-1">
        <i class="fa-solid fa-question"></i>
      </button>
      -->
    </div>

    <div class="title">
      <h1>
        <span>N</span>
        <span class="flat">e</span>
        <span>b</span>
        <span class="flat">y</span>
        <span>o</span>
        <span>o</span>
        <span class="flat">K</span>
        <span>e</span>
        <span class="flat">y</span>
        <span>s</span>
      </h1>
    </div>

    <div class="menu-right">
      <!--
      <button id="button-settings" class="icon" aria-label="Settings" tabindex="-1">
        <i class="fa-solid fa-gear"></i>
      </button>
      -->
    </div>
  </header>

  <main>
    <Synth />
  </main>
</template>

<style scoped>
header {
  align-items: center;
  background: #0a9361;
  border-bottom: 5px solid rgb(0, 83, 17);
  color: #d1d1d1;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 50px;
  justify-content: space-between;
  padding: 0 16px;
}
  header .menu-left {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    margin: 0;
    padding: 0;
    width: 70px;
  }
    header .menu-left #nav-overlay {
      align-items: unset;
      background-color: transparent;
      display: none;
      height: 100%;
      justify-content: left;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 11;
    }
      header .menu-left #nav-overlay.show {
        display: flex;
      }
        header .menu-left #nav-overlay #nav-content {
          animation: SlideRight 200ms;
          background-color: #098759;
          border-radius: 0;
          box-shadow: 3px 5px 5px rgb(0 0 0 / 15%);
          box-sizing: border-box;
          margin-top: 50px;
          max-height: calc(100% - 41px);
          max-width: 500px;
          overflow-y: auto;
          padding: 0px;
          position: relative;
          width: 100%;
        }
        @media (min-width: 415px) {
          header .menu-left #nav-overlay #nav-content {
            width: 325px;
          }
        }
          header .menu-left #nav-overlay #nav-content a {
            color: rgb(255, 255, 255);
            text-decoration: none;
          }

          header .menu-left #nav-overlay #nav-content .container {
            align-items: normal;
            padding: 0;
          }
            header .menu-left #nav-overlay #nav-content .container .nav-header {
              color: #002c12;
              font-size: 20px;
              font-weight: 700;
              padding-bottom: 18px;
              padding-left: 18px;
              padding-top: 18px;
            }
            header .menu-left #nav-overlay #nav-content .container .nav-list a {
              align-items: center;
              background-color: transparent;
              display: flex;
              font-size: 16px;
              font-weight: bold;
              height: 30px;
              justify-content: left;
              padding: 4px 0 4px 18px;
            }
            header .menu-left #nav-overlay #nav-content .container .nav-list a:hover {
              background-color: #004e30;
            }
          header .menu-left #nav-overlay #nav-content #button-nav-close {
            font-size: 20px;
            height: 24px;
            position: absolute;
            right: 16px;
            top: 16px;
            width: 24px;
          }
          header .menu-left #nav-overlay #nav-content .nav-footer {
            display: flex;
          }
          header .menu-left #nav-overlay #nav-content #footer-neb-host {
            background: #004e30;
            border-top: 2px solid #002115;
            bottom: 0;
            color: #d1d1d1;
            font-family: 'Consolas', sans-serif;
            font-size: 12px;
            font-weight: 500;
            left: 0;
            letter-spacing: initial;
            margin-top: 20px;
            padding: 10px 18px;
            position: absolute;
            right: 0;
            text-align: left;
            z-index: 2
          }
          header .menu-left #nav-overlay #nav-content #footer-neb-host a:hover {
            text-decoration: underline;
          }

  header .title {
    font-weight: 700;
    font-size: 14px;
    line-height: 150%;
    letter-spacing: 0.1em;
    pointer-events: none;
    text-align: center;
    text-transform: uppercase;
  }
    header .title h1 span {
      bottom: -2px;
      color: #ffffff;
      position: relative;
    }
      header .title h1 span.flat {
        bottom: 3px;
        color: #000000;
        position: relative;
      }
  @media (min-width: 768px) {
    header .title {
      font-size: 20px;
      line-height: 100%;
      letter-spacing: 0.01em;
    }
  }
  header .menu-right {
    display: flex;
    justify-content: flex-end;
    width: 70px;
  }
    header .menu-right button#button-settings {
      align-items: center;
      display: flex;
      justify-content: flex-end;
      margin-right: 0;
    }
</style>
