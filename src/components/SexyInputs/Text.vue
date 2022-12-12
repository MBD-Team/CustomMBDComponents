<template>
  <div class="input-contain mt-3" :style="{ backgroundColor: backgroundColor }">
    <!-- icon -->
    <div v-if="checkIcon && (isInputFocus || modelValue)" class="icon">
      <slot name="icon"></slot>
    </div>
    <!-- /icon -->
    <input
      v-bind="$attrs"
      class="form-control shadow-none"
      type="text"
      :value="modelValue"
      @input="updateValue"
      :class="{ dirty: modelValue }"
      :style="[
        checkButton || sideInputType ? `border-radius: 0.5rem 0 0 0.5rem; width:${inputWidth}` : '',
        checkIcon ? 'padding-left: 1.5rem;' : 'padding-left: none;',
      ]"
      @focus="isInputFocus = true"
      @blur="isInputFocus = false"
      autocomplete="off"
    />
    <!-- placeholder -->
    <label class="text" :class="labelClass">
      {{ placeholder }}
    </label>
    <!-- /placeholder -->
    <!-- sideButton -->
    <button v-if="checkButton" :style="`width:${sideWidthComputed}`"><slot name="button"></slot></button>
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
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, ref, toRefs, useSlots } from 'vue';
import { getErrorMessage, useCalcSideWidth } from './Index';
import Error from './common/Error.vue';
const emit = defineEmits(['update:modelValue', 'update:sideInputVModel']);
const props = withDefaults(
  defineProps<{
    modelValue: string;
    name?: string;
    error?: { [key: string]: string | string[] } | string;
    errorColor?: string;
    labelClass?: string;
    btnType?: 'button' | 'submit' | 'reset';
    btnClass?: string;
    btnAction?: Function;
    sideWidth?: number;
    sideInputType?: 'number' | 'text';
    sideInputClass?: string;
    sideInputMaxLength?: string;
    sideInputVModel?: number | string;
    placeholder: string;
    borderColor?: string;
    backgroundColor?: string;
  }>(),
  {
    error: '',
    errorColor: 'red',
    sideWidth: 20,
    name: '',
    backgroundColor: '#f8fafc',
  }
);
const {
  modelValue,
  error,
  errorColor,
  labelClass,
  btnType,
  btnClass,
  btnAction,
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

const borderColorComputed = computed(() => {
  return getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value;
});
const checkIcon = computed(() => {
  return !!slots.icon;
});
const checkButton = computed(() => {
  return !!slots.button;
});
const { inputWidth, sideWidthComputed } = useCalcSideWidth(sideWidth);
async function affirm() {
  //executes the btnAction
  if (btnAction?.value) await btnAction.value();
}
function updateValue(event: any) {
  emit('update:modelValue', event.target.value);
}
function updateSideValue(event: any) {
  //update the sideInput value
  emit('update:sideInputVModel', event.target.value);
}
</script>
<style scoped lang="scss">
@use 'baseStyle';
@use 'sideInputStyle';

input {
  background-color: v-bind(backgroundColor);
  border-color: v-bind(borderColorComputed);
}
input.sideInput:focus {
  border-color: v-bind(borderColorComputed);
}
</style>
