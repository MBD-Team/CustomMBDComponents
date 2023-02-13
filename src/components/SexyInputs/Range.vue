<template>
  <div class="input-contain mt-3">
    <!-- icon -->
    <div v-if="checkIcon && (isInputFocus || modelValue)" class="icon">
      <slot></slot>
    </div>
    <!-- /icon -->
    <input
      v-bind="$attrs"
      class="form-control shadow-none"
      type="range"
      :value="modelValue"
      @input="updateValue"
      :id="id"
      :style="[`width:${inputWidth}`, checkIcon ? 'padding-left: 1.5rem;' : 'padding-left: none;']"
      @focus="isInputFocus = true"
      @blur="isInputFocus = false"
      autocomplete="off"
    />
    <!-- placeholder -->
    <label class="text" :class="labelClass" v-if="placeholder">
      {{ placeholder }}
    </label>
    <!-- /placeholder -->
    <!-- sideInput for rangeInput -->
    <input
      type="number"
      class="sideInput"
      @input="updateValue"
      @blur="roundOnBlur"
      :value="modelValue"
      :style="sideInputStyle"
      :min="element?.min || 0"
      :max="element?.max || 100"
    />
    <!-- /sideInput for rangeInput -->
    <!-- error -->
    <Error :error="error" :error-color="errorColor" :name="name" />
    <!-- /error -->
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, onMounted, ref, toRefs, useSlots } from 'vue';
import Error from './common/Error.vue';
import { getErrorMessage } from './Index';
const emit = defineEmits(['update:modelValue', 'update:sideInputVModel']);
const props = withDefaults(
  defineProps<{
    modelValue: number;
    controlInput?: boolean;
    name?: string;
    error?: { [key: string]: string | string[] } | string;
    errorColor?: string;
    labelClass?: string;
    btnClass?: string;
    sideWidth?: number;
    sideInputStyle?: string;
    placeholder?: string;
    borderColor?: string;
  }>(),
  {
    placeholder: '',
    error: '',
    controlInput: true,
    errorColor: 'red',
    sideWidth: 20,
    name: '',
  }
);
const { modelValue, controlInput, error, errorColor, labelClass, sideWidth, sideInputStyle, placeholder, borderColor, name } = toRefs(props);
onMounted(() => {
  element.value = document.getElementById(id.value) as HTMLInputElement;
});
const element = ref();
const id = ref(JSON.stringify(Math.random()));
const isInputFocus = ref(false);
const slots = useSlots();

const borderColorComputed = computed(() => {
  return getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value;
});
const checkIcon = computed(() => {
  return !!slots.icon;
});

const inputWidth = computed(() => {
  let width = 100;
  width -= sideWidth?.value || 0;
  return width + '%';
});
const sideWidthComputed = computed(() => {
  let width = sideWidth?.value;
  return width + '%';
});
const rangeTrackSize = computed(() => {
  //determines the marked area of rangeInput
  const min = +element.value?.min || 0;
  const max = +element.value?.max || 100;
  const value = modelValue.value;
  const size = ((value - min) / (max - min)) * 100;
  return size + '%';
});
function updateValue(event: any) {
  //correct the value if necessary and update it
  if (element.value.step && (event.target.value * 1) % element.value.step != 0) return;
  if (controlInput.value) {
    let inputValue = event.target.value * 1;
    if (inputValue > (event.target.max || 100)) inputValue = event.target.max * 1 || 100;
    if (inputValue < (event.target.min || 0)) inputValue = event.target.min * 1 || 0;
    if (isNaN(inputValue)) inputValue = 0;
    event.target.value = inputValue;
  }
  if (event.target.value) emit('update:modelValue', event.target.value * 1);
  else emit('update:modelValue', event.target.value);
}
function roundOnBlur(event: any) {
  if (element.value.step) event.target.value = Math.round(event.target.value / element.value?.step) * element.value?.step;
  updateValue(event);
}
</script>
<style scoped lang="scss">
.input-contain {
  position: relative;
  .icon {
    background-color: transparent;
    position: absolute;
    top: 0.5rem;
    left: 0.3rem;
    z-index: 2;
  }
  input {
    text-align: start;
    padding-left: 1rem;
    padding-top: 0.5rem;
    height: 2.5rem;
    width: 100%;
    border: 1px solid;
    border-color: v-bind(borderColorComputed);
    border-radius: 0.5rem 0 0 0.5rem;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 0.5rem 0 0 0.5rem;
    width: v-bind(inputWidth);
    cursor: pointer;
    &:hover:not(:focus) + .text,
    &:hover:not(:focus) {
      @media (pointer: fine) {
        filter: brightness(95%);
      }
    }
    &:focus {
      border-width: 2px;
    }
    &::-moz-range-track {
      height: 0.2rem;
      background: linear-gradient(to right, #293043, #293043), #d7d7d7;
      background-size: var(--background-size, 0%) 100%;
      background-repeat: no-repeat;
      border-radius: 5px;
    }
    &::-webkit-slider-runnable-track {
      height: 0.2rem;
      background: linear-gradient(to right, #293043, #293043), #d7d7d7;
      background-size: v-bind(rangeTrackSize);
      background-repeat: no-repeat;
      border-radius: 5px;
    }
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 1rem;
      height: 1rem;
      background: #293043;
      border: 1px white solid;
      border-radius: 50%;
      margin-top: -0.4rem;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
    }
    &::-moz-range-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 1rem;
      height: 1rem;
      background: #293043;
      border: 1px white solid;
      border-radius: 50%;
      margin-top: -0.4rem;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
    }
    &:focus {
      border-width: 2px;
    }
  }
  .sideInput {
    align-items: center;
    text-align: center;
    position: absolute;
    padding: 0;
    top: 0;
    bottom: 0;
    left: v-bind(inputWidth);
    right: 0;
    width: v-bind(sideWidthComputed);
    border-radius: 0 0.5rem 0.5rem 0;
    border-width: 1px;
    border-color: v-bind(borderColorComputed);
    border-style: solid;
    border-left: none;
    background-color: white;
    justify-content: center;
    outline: none;
    cursor: text;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    &:focus {
      border: 2px solid;
      border-color: v-bind(borderColorComputed);
    }
  }
  input + .text {
    align-items: center;
    position: absolute;
    top: 0.5rem;
    bottom: 0;
    left: 0;
    height: min-content;
    display: flex;
    color: gray;
    pointer-events: none;
    font-size: 1rem;
    padding: 0 0rem;
    margin: 0 0.6rem;
    border-radius: 0.5rem;
  }
  input + .text {
    background-color: white;
    border-radius: 0.5rem 0.5rem 0rem 0rem;
    font-size: 0.9rem;
    padding: 0 0.3rem;
    color: black;
    transform: translate(0, -1rem);
    height: 0.9rem;
  }
}
</style>
