<template>
  <div class="input-contain mt-3">
    <textarea
      v-bind="$attrs"
      class="form-control shadow-none"
      @input="updateValue"
      :value="modelValue"
      :class="{ dirty: modelValue }"
      rows="3"
    ></textarea>
    <!-- placeholder -->
    <label class="text" :class="labelClass">
      {{ placeholder }}
    </label>
    <!-- /placeholder -->
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
    modelValue: string;
    error?: string;
    errorColor?: string;
    labelClass?: string;
    placeholder: string;
    borderColor?: string;
  }>(),
  {
    error: '',
    errorColor: 'red',
    sideWidth: '20%',
  }
);
const { modelValue, error, errorColor, labelClass, placeholder, borderColor } = toRefs(props);

const borderColorComputed = computed(() => {
  return error?.value ? errorColor?.value : borderColor?.value;
});
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
    z-index: 2;
  }
  textarea {
    text-align: start;
    padding-left: 1rem;
    padding-top: 0.5rem;
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
    &:focus {
      border-width: 2px;
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
    color: gray;
    border-radius: 0.5rem;
    transition: transform 0.15s ease-out, font-size 0.15s ease-out, background-color 0.2s ease-out, color 0.15s ease-out, 0.15s padding ease-in-out;
  }
  textarea:focus + .text,
  textarea.dirty + .text {
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
