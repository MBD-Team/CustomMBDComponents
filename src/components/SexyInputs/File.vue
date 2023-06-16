<template>
  <div class="input-contain" :style="{ backgroundColor: backgroundColor }" :class="placeholder ? 'mt-3' : ''">
    <input v-bind="$attrs" class="form-control shadow-none" type="file" @input="updateValue" style="padding-left: none" autocomplete="off" />
    <!-- placeholder -->
    <label class="text" :class="labelClass" v-if="placeholder">
      {{ placeholder }}
    </label>
    <!-- /placeholder -->
    <!-- preview -->
    <div class="mt-1 py-1" :class="fileClass(modelValue)" style="border: 1px solid black; border-radius: 0.5rem" v-if="modelValue && preview">
      <div class="text-center">{{ modelValue.name }}</div>
      <div class="d-flex justify-content-center">
        <img :src="loadFile(modelValue)" :style="{ maxHeight: previewHeight }" style="max-width: 100%" alt="" />
      </div>
    </div>
    <!-- /preview -->
    <!-- error -->
    <Error :error="error" :error-color="errorColor" :name="name" />
    <!-- /error -->
  </div>
</template>
<script lang="ts">
/**
 * ```js
 * const file = ref<File | null>(null);
 * const error = ref<string|{[key:string]:string}>('')
 * ```
 * ```html
 * <FileInput v-model="file" ></FileInput>
 *
 * <FileInput v-model="file" placeholder="Datei" preview></FileInput>
 *
 * <FileInput v-model="file" :error="error"></FileInput>
 *
 * <FileInput v-model="file" name="file" :error="error"></FileInput>
 *
 * ```
 */
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, toRefs, useSlots } from 'vue';
import Error from './common/Error.vue';
import { getErrorMessage, InputError } from './Index';
const emit = defineEmits(['update:modelValue']);
const props = withDefaults(
  defineProps<{
    modelValue: File | null;
    name?: string;
    error?: InputError;
    errorColor?: string;
    labelClass?: string;
    placeholder?: string;
    borderColor?: string;
    preview?: boolean;
    previewHeight?: string;
    fileClass?: Function;
    backgroundColor?: string;
  }>(),
  {
    placeholder: '',
    error: '',
    errorColor: 'red',
    preview: false,
    fileClass: (item: any) => {
      return '';
    },
    name: '',
    backgroundColor: '#f8fafc',
    previewHeight: '5rem',
  }
);
const { modelValue, error, errorColor, labelClass, placeholder, borderColor, preview, name } = toRefs(props);

const borderColorComputed = computed(() => {
  return getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value;
});

function updateValue(event: any) {
  emit('update:modelValue', Object.values(event.target.files)[0]);
}
function loadFile(file: any) {
  return URL.createObjectURL(file);
}
</script>
<style scoped lang="scss">
@use 'baseStyle';
input {
  background-color: v-bind(backgroundColor);
  border-color: v-bind(borderColorComputed);
}
input.sideInput:focus {
  border-color: v-bind(borderColorComputed);
}
.input-contain {
  input {
    cursor: pointer;
    &::-webkit-file-upload-button {
      background-color: transparent !important;
      border: none;
    }
  }
  input:focus + .text,
  input + .text {
    background-color: inherit;
    border-radius: 0.5rem 0.5rem 0rem 0rem;
    font-size: 0.9rem;
    padding: 0 0.3rem;
    color: black;
    transform: translate(0, -1rem);
    height: 0.9rem;
  }
}
</style>
