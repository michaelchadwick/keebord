<script setup>
const emit = defineEmits(['close'])
</script>

<template>
  <div class="modal-mask">
    <div class="modal-wrapper">

      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">
            default header
          </slot>
        </div>

        <div class="modal-body">
          <slot name="body">
            default body
          </slot>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  background-color: #111111;
  background-color: #11111125;
  display: table;
  height: 100%;
  left: 0;
  position: fixed;
  top: 0;
  transition: opacity 0.3s ease;
  width: 100%;
  z-index: 9998;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  font-family: Helvetica, Arial, sans-serif;
  margin: 0px auto;
  padding: 20px;
  transition: all 0.3s ease;
  width: 90%;
}
  @media (min-width: 768px) {
    .modal-container {
      width: 33%;
    }
  }

.modal-header h3 {
  margin-top: 0;
}

.modal-body {
  margin: 20px 0 5px;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

</style>
