<script setup>
const props = defineProps(['controlGroup', 'controlKey', 'controlData'])

const emit = defineEmits([
  'controlValueChanged',
  'checkEnabledChanged',
  'selectOptionChanged',
  'increaseValue',
  'decreaseValue',
])
</script>

<template>
  <fieldset
    class="node-control control-column"
    :class="{
      'vertical-range': props.controlData.isVertical,
      'horizontal-range': !props.controlData.isVertical,
      visible: props.controlData.visible,
    }"
    :group="props.controlGroup"
    :id="props.controlKey"
  >
    <legend>
      <input
        v-if="props.controlData.controlEnabledCheckId"
        type="checkbox"
        :id="props.controlData.controlEnabledCheckId"
        :checked="props.controlData.enabled"
        @change="
          $emit('checkEnabledChanged', props.controlGroup, props.controlKey, $event.target.checked)
        "
      /><label :for="props.controlData.controlEnabledCheckId">{{ props.controlData.title }}</label>
    </legend>

    <div class="node-values">
      <!-- <SELECT> -->
      <template v-if="props.controlData.type == 'select'">
        <div class="value-container">
          <select
            :id="props.controlData.selectId"
            :value="props.controlData.currentValue"
            :disabled="!props.controlData.enabled"
            @change="
              $emit(
                'selectOptionChanged',
                props.controlGroup,
                props.controlKey,
                $event.target.value
              )
            "
          >
            <option v-for="option in props.controlData.options" :key="option" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </template>

      <!-- <INPUT TYPE="NUMBER"> -->
      <template v-if="props.controlData.type == 'number'">
        <div class="value-container">
          <input
            type="text"
            :id="props.controlData.numberInputId"
            :min="props.controlData.min"
            :max="props.controlData.max"
            :value="props.controlData.currentValue"
            :disabled="!props.controlData.enabled"
            @change="
              $emit(
                'controlValueChanged',
                props.controlGroup,
                props.controlKey,
                $event.target.value
              )
            "
          />

          <div class="increase-decrease-container">
            <button
              class="control-value-increase"
              @click="$emit('increaseValue', props.controlGroup, props.controlKey)"
            >
              <img src="/assets/svg/bi-caret-up-fill.svg" />
            </button>
            <button
              class="control-value-decrease"
              @click="$emit('decreaseValue', props.controlGroup, props.controlKey)"
            >
              <img src="/assets/svg/bi-caret-down-fill.svg" />
            </button>
          </div>
        </div>
      </template>

      <!-- <INPUT TYPE="RANGE"> -->
      <template v-if="props.controlData.type == 'range'">
        <div class="value-container">
          <input
            type="text"
            :id="props.controlData.numberInputId"
            :min="props.controlData.min"
            :max="props.controlData.max"
            :value="props.controlData.currentValue"
            :disabled="!props.controlData.enabled"
            @change="
              $emit(
                'controlValueChanged',
                props.controlGroup,
                props.controlKey,
                $event.target.value
              )
            "
          />

          <div class="increase-decrease-container">
            <button
              class="control-value-increase"
              :disabled="!props.controlData.enabled"
              @click="$emit('increaseValue', props.controlGroup, props.controlKey)"
            >
              <img src="/assets/svg/bi-caret-up-fill.svg" />
            </button>
            <button
              class="control-value-decrease"
              :disabled="!props.controlData.enabled"
              @click="$emit('decreaseValue', props.controlGroup, props.controlKey)"
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
          :orient="props.controlData.isVertical ? 'vertical' : 'horizontal'"
          :value="props.controlData.currentValue"
          :disabled="!props.controlData.enabled"
          @input="
            $emit('controlValueChanged', props.controlGroup, props.controlKey, $event.target.value)
          "
        />
      </template>
    </div>
  </fieldset>
</template>

<style scoped>
.node-control {
  align-items: center;
  background-color: var(--white-mute);
  border: 1px solid var(--color-text);
  border-radius: 0.5rem;
  display: none;
  flex-direction: column;
  margin: 0;
  padding: 5px;
  text-align: center;
}
@media (min-width: 600px) {
  .node-control {
    margin-left: 0;
    margin-right: 8px;
    padding-top: 0;
    width: 100%;
  }
  .node-control#pan .value-container::before {
    content: 'L';
    left: -5px;
    position: relative;
  }
  .node-control#pan .value-container::after {
    content: 'R';
    position: relative;
    right: -10px;
  }
  .node-control:last-child {
    margin-right: 0;
  }
}
body.dark-theme .node-control {
  background-color: var(--black-soft);
}
.node-control[group='adsr'] {
  background-color: var(--group-adsr);
}
.node-control[group='adsr'] .value-container::after {
  content: 's';
  position: relative;
  right: -10px;
}
.node-control[group='adsr']#sustainLevel .value-container::after {
  content: '';
}
.node-control[group='filters'] {
  background-color: var(--group-filters);
}
.node-control[group='output'] {
  background-color: var(--group-output);
}

.node-control.visible {
  display: flex;
}
.node-control.dropdown-control {
  padding-bottom: 8px;
}
.node-control.horizontal-range {
  padding-bottom: 0;
}
.node-control.horizontal-range input[type='range'] {
  height: auto;
  width: 90px;
}
@media (min-width: 600px) {
  .node-control.horizontal-range input[type='range'] {
    height: 32px;
  }
}

.node-control.vertical-range {
  padding-bottom: 8px;
}
.node-control.vertical-range input[type='range'] {
  -webkit-appearance: slider-vertical;
  appearance: slider-vertical;
  height: 60px;
  width: 32px;
  writing-mode: bt-lr;
}

.node-control legend {
  color: var(--black);
  font-weight: bold;
  line-height: 1.5;
  margin: 0 auto;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
}
body.dark-theme .node-control legend {
  color: var(--green-bright-active);
}
.node-control legend input {
  position: relative;
  right: 2px;
  top: 1px;
}
.node-control legend label {
  font-weight: bold;
}

.node-control .node-values {
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 1em;
  margin: 0 0 0.5em;
}
@media (min-width: 600px) {
  .node-control .node-values {
    flex-direction: column;
    gap: 0;
    margin-bottom: 0;
  }
}
.node-control .node-values .value-container {
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.node-control .node-values .value-container select {
  font-size: 1.5rem;
}
.node-control .node-values .value-container input[type='text'] {
  border: 1px solid var(--color-text);
  border-radius: 0.15rem;
  font-size: 1.5rem;
  height: 2.5rem;
  padding: 0.3rem;
  text-align: left;
  width: 5rem;
  z-index: 1;
}
.node-control .node-values .value-container input[type='checkbox'] {
  margin: 0 4px;
}
.node-control .node-values .value-container input[type='number'] {
  margin: 0 auto;
}
.node-control .node-values .value-container input[type='range'] {
  display: block;
  margin: 8px auto;
}
.node-control .node-values .value-container .increase-decrease-container {
  display: flex;
  flex-direction: column;
  margin-left: -1.86rem;
  margin-top: 0rem;
  z-index: 2;
}
.node-control .node-values .value-container .increase-decrease-container .control-value-increase,
.node-control .node-values .value-container .increase-decrease-container .control-value-decrease {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: none;
  border: none;
  border-radius: 0.125rem;
  bottom: 1px;
  height: 1.1rem;
  margin: 0;
  padding: 0;
  position: relative;
  text-align: center;
  width: 12px;
}
.node-control
  .node-values
  .value-container
  .increase-decrease-container
  .control-value-increase:disabled,
.node-control
  .node-values
  .value-container
  .increase-decrease-container
  .control-value-decrease:disabled {
  cursor: default;
  filter: invert(100%) sepia(1%) saturate(1895%) hue-rotate(235deg) brightness(111%) contrast(60%);
}
.node-control
  .node-values
  .value-container
  .increase-decrease-container
  .control-value-increase
  img,
.node-control
  .node-values
  .value-container
  .increase-decrease-container
  .control-value-decrease
  img {
  filter: none;
  height: 16px;
  left: 0.09rem;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0.015rem;
  width: 16px;
}
@media (hover: hover) {
  .node-control .node-values .value-container .control-value-increase:not(:disabled) img:hover,
  .node-control .node-values .value-container .control-value-decrease:not(:disabled) img:hover {
    filter: invert(63%) sepia(38%) saturate(649%) hue-rotate(99deg) brightness(89%) contrast(86%);
  }
}
</style>
