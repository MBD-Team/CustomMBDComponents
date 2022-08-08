<template>
  <div class="input-contain mt-3">
    <input
      v-bind="$attrs"
      class="form-control shadow-none"
      type="file"
      @input="updateValue"
      :style="checkIcon ? 'padding-left: 1.5rem;' : 'padding-left: none;'"
      autocomplete="off"
    />
    <!-- placeholder -->
    <label class="text" :class="labelClass">
      {{ placeholder }}
    </label>
    <!-- /placeholder -->
    <!-- preview -->
    <div class="mt-1 py-1" :class="fileClass(modelValue)" style="border: 1px solid black; border-radius: 0.5rem" v-if="modelValue && preview">
      <div class="text-center">{{ modelValue.name }}</div>
      <div class="d-flex justify-content-center"><img :src="loadFile(modelValue)" style="max-height: 5rem; max-width: 100%" alt="" /></div>
    </div>
    <!-- /preview -->
    <!-- error -->
    <Error :error="error" :error-color="errorColor" />
    <!-- /error -->
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, toRefs } from 'vue';
import Error from './common/Error.vue';
const emit = defineEmits(['update:modelValue']);
const props = withDefaults(
  defineProps<{
    modelValue: any;
    error?: string;
    errorColor?: string;
    labelClass?: string;
    placeholder: string;
    borderColor?: string;
    preview?: boolean;
    fileClass?: Function;
  }>(),
  {
    error: '',
    errorColor: 'red',
    preview: false,
    fileClass: (item: any) => {
      return '';
    },
  }
);
const { modelValue, error, errorColor, labelClass, placeholder, borderColor, preview } = toRefs(props);


const borderColorComputed = computed(() => {
  return error?.value ? errorColor?.value : borderColor?.value;
});

function updateValue(event: any) {
  emit('update:modelValue', Object.values(event.target.files)[0]);
}
function loadFile(file: any) {
  return URL.createObjectURL(file);
}
</script>
<style scoped lang="scss">
.input-contain {
  position: relative;
  border-radius: 0.5rem;
  background-color: inherit;
  input {
    text-align: start;
    padding-left: 1rem;
    padding-top: 0.5rem;
    height: 2.5rem;
    width: 100%;
    border: 1px solid;
    border-color: v-bind(borderColorComputed);
    border-radius: 0.5rem;
    cursor: pointer;
    &::-webkit-file-upload-button {
      background-color: transparent !important;
      border: none;
    }
    &:hover:not(:focus) + .text,
    &:hover:not(:focus) {
      @media (pointer: fine) {
        filter: brightness(95%);
      }
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
  input:focus + .text,
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
