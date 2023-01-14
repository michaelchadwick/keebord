<script>

</script>

<template>
  <h3>Keyboard.vue</h3>

  <button data-noteid="c3" class="white c"></button>
  <button data-noteid="d3" class="white d"></button>
  <button data-noteid="e3" class="white e"></button>
  <button data-noteid="f3" class="white f"></button>
  <button data-noteid="g3" class="white g"></button>
  <button data-noteid="a3" class="white a"></button>
  <button data-noteid="b3" class="white b"></button>
</template>

<style scoped>
button {
  border: 3px solid #222222;
  height: 50px;
  margin-right: 10px;
  width: 20px;
}
  button.white {
    background-color: #ffffff;
  }
    button.white.e,
    button.white.b {
      margin-right: 0;
    }
  button.black {
    background-color: #111111;
  }
</style>
