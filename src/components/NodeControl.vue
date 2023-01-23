<script setup>
const props = defineProps(['controlKey', 'controlData'])

const emit = defineEmits([
  'controlValueChanged',
  'checkEnabledChanged',
  'selectOptionChanged',
  'increaseValue',
  'decreaseValue'
])
</script>

<template>
  <fieldset
    :class="(props.controlData.isVertical) ? 'vertical-range control-column node-control': 'horizontal-range control-column node-control'"
    :id="props.controlKey">
    <legend>
      <input
        v-if="props.controlData.controlEnabledCheckId"
        type="checkbox"
        :id="props.controlData.controlEnabledCheckId"
        @change="$emit('checkEnabledChanged', props.controlKey, $event.target.checked)"
      />{{ props.controlData.title }}
    </legend>

    <template v-if="props.controlData.type == 'select'">
      <div class="value-container">
        <select
          :id="props.controlData.selectId"
          :value="props.controlData.currentValue"
          @change="$emit('selectOptionChanged', props.controlKey, $event.target.value)"
        >
          <option v-for="option in props.controlData.options" v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </template>

    <template v-if="props.controlData.type == 'number'">
      <div class="value-container">
        <input
          type="text"
          :id="props.controlData.numberInputId"
          :min="props.controlData.min"
          :max="props.controlData.max"
          :value="props.controlData.currentValue"
          @change="$emit('controlValueChanged', props.controlKey, $event.target.value)"
        />

        <div class="increase-decrease-container">
          <button
            class="control-value-increase"
            @click="$emit('increaseValue', props.controlKey)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16"><path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/></svg>
          </button>
          <button
            class="control-value-decrease"
            @click="$emit('decreaseValue', props.controlKey)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>
          </button>
        </div>
      </div>
    </template>

    <template v-if="props.controlData.type == 'range'">
      <div class="value-container">
        <input
          type="text"
          :id="props.controlData.numberInputId"
          :min="props.controlData.min"
          :max="props.controlData.max"
          :value="props.controlData.currentValue"
          @change="$emit('controlValueChanged', props.controlKey, $event.target.value)"
        />

        <div class="increase-decrease-container">
          <button
            class="control-value-increase"
            @click="$emit('increaseValue', props.controlKey)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16"><path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/></svg>
          </button>
          <button
            class="control-value-decrease"
            @click="$emit('decreaseValue', props.controlKey)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/></svg>
          </button>
        </div>
      </div>

      <input
        type="range"
        :id="props.controlData.rangeInputId"
        :min="props.controlData.min"
        :max="props.controlData.max"
        :step="props.controlData.step"
        :orient="(props.controlData.isVertical) ? 'vertical': 'horizontal'"
        :value="props.controlData.currentValue"
        @input="$emit('controlValueChanged', props.controlKey, $event.target.value)"
      />
    </template>
  </fieldset>
</template>

<style scoped>
.node-control .value-container {
  display:flex;
  flex-direction:row
}
  .node-control .value-container input[type=text] {
    border: 1px solid black;
    border-radius: 0.15rem;
    font-size: 1.5rem;
    height: 2.5rem;
    padding-right: 0.5rem;
    text-align: left;
    width: 5rem;
    z-index: 1;
  }
  .node-control .value-container .increase-decrease-container {
    display: flex;
    flex-direction: column;
    margin-left: -1.86rem;
    margin-top: 0rem;
    z-index: 2;
  }
    .node-control .value-container .increase-decrease-container .control-value-increase,
    .node-control .value-container .increase-decrease-container .control-value-decrease {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background: none;
      border: none;
      border-radius: 0.125rem;
      height: 1.1rem;
      margin: 0;
      padding: 0;
      text-align: center;
      width: 12px;
    }
      .node-control .value-container .increase-decrease-container .control-value-increase svg,
      .node-control .value-container .increase-decrease-container .control-value-decrease svg {
        height: 16px;
        left: 0.09rem;
        margin: 0;
        padding: 0;
        position: absolute;
        top: 0.015rem;
        width: 16px;
      }
    .node-control.horizontal-range {
      padding-bottom: 0;
    }
      .node-control.horizontal-range input[type=range] {
        height: 32px;
        width: 90px;
      }
    .node-control.vertical-range {
      padding-bottom: 8px;
    }
      .node-control.vertical-range input[type=range] {
        -webkit-appearance: slider-vertical;
        appearance: slider-vertical;
        height: 90px;
        width: 32px;
        writing-mode: bt-lr;
      }
</style>