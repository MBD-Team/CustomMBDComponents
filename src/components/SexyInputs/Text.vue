<template>
  <div class="input-contain mt-3">
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
    <button v-if="checkButton" :type="btnType" @click="affirm()" :class="btnClass">
      <slot name="button"></slot>
    </button>
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
  }>(),
  {
    error: '',
    errorColor: 'red',
    sideWidth: 20,
    name: '',
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
.input-contain {
  position: relative;
  border-radius: 0.5rem;
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
    border-radius: 0.5rem;
    &:hover:not(:focus) + .text,
    &:hover:not(:focus) {
      @media (pointer: fine) {
        filter: brightness(95%);
      }
    }
    &:focus {
      border-width: 2px;
    }
  }
  button {
    transition: all 0.25s ease-out;
    &:hover {
      @media (pointer: fine) {
        filter: brightness(95%);
      }
    }
    &:active {
      @media (pointer: fine) {
        filter: brightness(85%);
      }
      @media (pointer: coarse) {
        filter: brightness(85%);
      }
    }
  }
  input.sideInput {
    &:focus {
      border: 2px solid;
      border-color: v-bind(borderColorComputed);
    }
  }
  button,
  input.sideInput {
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
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
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
    transform: translate(0);
    color: gray;
    border-radius: 0.5rem;
    transition: transform 0.15s ease-out, font-size 0.15s ease-out, background-color 0.2s ease-out, color 0.15s ease-out, 0.15s padding ease-in-out;
  }
  input:focus + .text,
  input.dirty + .text {
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
