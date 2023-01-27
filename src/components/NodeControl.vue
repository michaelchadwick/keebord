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
    class="node-control control-column"
    :class="(props.controlData.isVertical) ? 'vertical-range': 'horizontal-range'"
    :id="props.controlKey"
  >
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
            <img src="/assets/svg/bi-caret-up-fill.svg" />
          </button>
          <button
            class="control-value-decrease"
            @click="$emit('decreaseValue', props.controlKey)"
          >
            <img src="/assets/svg/bi-caret-down-fill.svg" />
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
            <img src="/assets/svg/bi-caret-up-fill.svg" />
          </button>
          <button
            class="control-value-decrease"
            @click="$emit('decreaseValue', props.controlKey)"
          >
            <img src="/assets/svg/bi-caret-down-fill.svg" />
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
  display: flex;
  flex-direction: row;
}
  .node-control .value-container input[type=text] {
    border: 1px solid var(--color-text);
    border-radius: 0.15rem;
    font-size: 1.5rem;
    height: 2.5rem;
    padding-left: 0.3rem;
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
      bottom: 7px;
      height: 1.1rem;
      margin: 0;
      padding: 0;
      position: relative;
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
        height: 70px;
        width: 32px;
        writing-mode: bt-lr;
      }
</style>