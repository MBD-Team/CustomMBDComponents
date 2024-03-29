<template>
  <div class="input-contain" :class="placeholder ? 'mt-3' : ''">
    <textarea
      v-bind="$attrs"
      class="form-control shadow-none"
      @input="updateValue"
      :value="modelValue"
      :class="{ dirty: modelValue }"
      rows="3"
    ></textarea>
    <!-- placeholder -->
    <label class="text" style="max-width: 70%" :class="labelClass" v-if="placeholder">
      <div class="text-truncate">{{ placeholder }}</div>
    </label>
    <!-- /placeholder -->
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
 *    <TextAreaInput v-model="text"></TextAreaInput>
 *
 *    <TextAreaInput v-model="text" placeholder="test" :error="error"></TextAreaInput>
 *
 *    <!-- the name has to be a key of the error Object -->
 *    <TextAreaInput v-model="text" placeholder="test" name="TextAreaInput" :error="error"></TextAreaInput>
 *
 * ```
 * */
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, toRefs } from 'vue';
import Error from './common/Error.vue';
import { getErrorMessage, InputError } from './Index';

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
const props = withDefaults(
  defineProps<{
    modelValue: string;
    name?: string;
    error?: InputError;
    errorColor?: string;
    labelClass?: string;
    placeholder?: string;
    borderColor?: string;
    backgroundColor?: string;
  }>(),
  {
    placeholder: '',
    error: '',
    errorColor: 'red',
    sideWidth: '20%',
    name: '',
    backgroundColor: '#f8fafc',
  }
);
const { modelValue, error, errorColor, labelClass, placeholder, borderColor, name, backgroundColor } = toRefs(props);

const borderColorComputed = computed(() => (getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value));
function updateValue(event: any) {
  emit('update:modelValue', event.target.value);
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
  }
  textarea {
    text-align: start;
    padding-left: 1rem;
    padding-top: 0.5rem;
    width: 100%;
    height: 5rem;
    border: 1px solid;
    background-color: v-bind(backgroundColor);
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
    &:disabled,
    &:disabled + .text,
    &:disabled:hover,
    &:disabled:hover + .text {
      filter: brightness(85%);
      cursor: default;
    }
  }
  textarea + .text {
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
    border-radius: 0.5rem;
    transition: transform 0.15s ease-out, font-size 0.15s ease-out, background-color 0.2s ease-out, color 0.15s ease-out, 0.15s padding ease-in-out;
  }
  textarea:focus + .text,
  textarea.dirty + .text {
    background-color: v-bind(backgroundColor);
    border-radius: 0.5rem 0.5rem 0rem 0rem;
    font-size: 0.9rem;
    padding-inline: 0.3rem;
    color: black;
    transform: translate(0, -0.9rem);
    height: 0.9rem;
  }
}
textarea[required] + label {
  padding-right: 0.5rem !important;
  &::after {
    content: '*';
    position: relative;
    left: 0.3rem;
  }
}
</style>
