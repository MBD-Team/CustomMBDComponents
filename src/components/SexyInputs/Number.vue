<template>
  <div class="input-contain" :class="placeholder ? 'mt-3' : ''">
    <!-- icon -->
    <div v-if="checkIcon && (isInputFocus || modelValue)" class="icon">
      <slot name="icon"></slot>
    </div>
    <!-- /icon -->
    <input
      v-bind="$attrs"
      class="form-control shadow-none"
      type="number"
      :value="modelValue"
      @input="updateValue"
      :class="{ dirty: modelValue || typeof modelValue == 'number' }"
      :style="[
        checkButton || sideInputType ? `border-radius: 0.5rem 0 0 0.5rem; width:${inputWidth}` : '',
        checkIcon ? 'padding-left: 1.5rem;' : 'padding-left: none;',
      ]"
      @focus="isInputFocus = true"
      @blur="onBlur"
      autocomplete="off"
    />
    <!-- placeholder -->
    <label class="text" style="max-width: 70%" :class="labelClass" v-if="placeholder">
      <div class="text-truncate">{{ placeholder }}</div>
    </label>
    <!-- /placeholder -->
    <!-- sideButton -->
    <button class="sideButton" v-if="checkButton" :style="`width:${sideWidthComputed}`"><slot name="button"></slot></button>
    <!-- /sideButton -->
    <!-- sideInput -->
    <input
      v-if="sideInputType"
      class="sideInput"
      :type="sideInputType"
      :class="sideInputClass"
      :maxlength="sideInputMaxLength"
      @input="updateSideValue"
      :value="sideInputVModel"
    />
    <!-- /sideInput -->
    <!-- error -->
    <Error :error="error" :error-color="errorColor" :name="name" />
    <!-- /error -->
  </div>
</template>
<script lang="ts">
/**
 * ```js
 * const text = ref('')
 * ```
 * ```html
 * <NumberInput v-model="text"></NumberInput>
 * ```
 */
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, ref, toRefs, useSlots } from 'vue';
import { getErrorMessage, useCalcSideWidth, InputError } from './Index';
import Error from './common/Error.vue';

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:sideInputVModel': [value: string];
  corrected: [];
}>();
const props = withDefaults(
  defineProps<{
    modelValue: string;
    backgroundColor?: string;
    controlInput?: boolean;
    name?: string;
    error?: InputError;
    errorColor?: string;
    labelClass?: string;
    sideWidth?: number;
    sideInputType?: 'number' | 'text';
    sideInputClass?: string;
    sideInputMaxLength?: string;
    sideInputVModel?: string;
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
    backgroundColor: '#f8fafc',
  }
);
const {
  backgroundColor,
  modelValue,
  controlInput,
  error,
  errorColor,
  labelClass,
  sideWidth,
  sideInputType,
  sideInputClass,
  sideInputMaxLength,
  sideInputVModel,
  placeholder,
  borderColor,
  name,
} = toRefs(props);
const isInputFocus = ref(false);
const slots = useSlots();

const borderColorComputed = computed(() => (getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value));
const checkIcon = computed(() => !!slots.icon);
const checkButton = computed(() => !!slots.button);
const { inputWidth, sideWidthComputed } = useCalcSideWidth(sideWidth);

function updateValue(event: any) {
  emit('update:modelValue', event.target.value);
}
function updateSideValue(event: any) {
  //update the sideInput value
  emit('update:sideInputVModel', event.target.value);
}

function onBlur(event: any) {
  isInputFocus.value = false;
  //correct the value if necessary and update it
  if (controlInput.value && event.target.value * 1 && event.target.value.length == (event.target.value * 1 + '').length) {
    let inputValue = event.target.value;
    if (event.target.step) {
      inputValue = Math.round(event.target.value / event.target.step) * event.target.step + '';
      if (inputValue.split('.')[1]?.length > event.target.step.length - 2) inputValue = (+inputValue).toFixed(event.target.step.length - 2);
    }
    if (event.target.max && inputValue > event.target.max) inputValue = event.target.max;
    if (event.target.min && inputValue < event.target.min) inputValue = event.target.min;
    event.target.value = inputValue;
    emit('corrected');
    emit('update:modelValue', event.target.value);
  }
}
</script>
<style scoped lang="scss">
@use 'baseStyle';
@use 'sideInputStyle';

.sideButton,
.sideInput {
  left: v-bind(inputWidth);
  width: v-bind(sideWidthComputed) !important;
}
input {
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
input {
  background-color: v-bind(backgroundColor);
  border-color: v-bind(borderColorComputed);
}
input.sideInput:focus {
  border-color: v-bind(borderColorComputed);
}
</style>
