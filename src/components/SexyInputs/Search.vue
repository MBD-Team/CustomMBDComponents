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
      type="search"
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
 * const numVar = ref(0)
 * const error = ref<string|{[key:string]:string}>('')
 * ```
 * ```html
 *
 *    <SearchInput v-model="text"></SearchInput>
 *
 *    <SearchInput v-model="text" placeholder="test"><template #button><Button sideButton>buttonText</Button></template></SearchInput>
 *
 *    <SearchInput v-model="text" placeholder="test" sideInputType="number" :sideWidth="20" :sideInputVModel="numVar"></SearchInput>
 *
 *    <SearchInput v-model="text" placeholder="test" :error="error"></SearchInput>
 *
 *    <!-- the name has to be a key of the error Object -->
 *    <SearchInput v-model="text" placeholder="test" name="SearchInput" :error="error"></SearchInput>
 *
 * ```
 * */
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, ref, toRefs, useSlots } from 'vue';
import Error from './common/Error.vue';
import { getErrorMessage, InputError } from './Index';
const emit = defineEmits<{
  'update:modelValue': [value: string];
  'update:sideInputVModel': [value: string];
}>();
const props = withDefaults(
  defineProps<{
    modelValue: string;
    name?: string;
    error?: InputError;
    errorColor?: string;
    labelClass?: string;
    sideWidth?: number;
    sideInputType?: 'number' | 'text';
    sideInputClass?: string;
    sideInputMaxLength?: string;
    sideInputVModel?: number | string;
    placeholder?: string;
    borderColor?: string;
    backgroundColor?: string;
  }>(),
  {
    placeholder: '',
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
const inputWidth = computed(() => {
  let width = 100;
  if (sideInputType || checkButton) width -= sideWidth.value || 0;
  return width + '%';
});
const sideWidthComputed = computed(() => {
  let width = sideWidth.value;
  return width + '%';
});
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
.sideButton,
.sideInput {
  left: v-bind(inputWidth);
  width: v-bind(sideWidthComputed) !important;
}
input.sideInput:focus {
  border-color: v-bind(borderColorComputed);
}
</style>
