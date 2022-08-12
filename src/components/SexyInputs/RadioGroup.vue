<template>
  <div class="buttonGroup">
    <button
      v-for="option of options"
      class="button shadow-none"
      v-bind="$attrs"
      type="button"
      :class="modelValue == option.value ? activeClass : defaultClass"
      @click="modelValue = option.value"
    >
      {{ textWithNewLines(option.text) }}
    </button>
  </div>
  <Error :error="error" :error-color="errorColor" :name="name" />
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import Button from '../../exampleStories/Button.vue';
import Error from './common/Error.vue';
const props = withDefaults(
  defineProps<{
    options: { text: string; value: string | number | boolean }[];
    modelValue: string | number | boolean;
    activeClass?: string;
    defaultClass?: string;
    name?: string;
    error?: { [key: string]: string | string[] } | string;
    errorColor?: string;
    borderColor?: string;
  }>(),
  { defaultClass: 'bg-light text-dark', activeClass: 'bg-dark text-light', error: '', errorColor: 'red' }
);
const { options, error, errorColor, borderColor } = toRefs(props);
const buttonCount = computed(() => options.value.length);
function textWithNewLines(text: string) {
  return text.replaceAll(/\n|<br>/g, '\n');
}
const borderColorComputed = computed(() => {
  return error?.value ? errorColor?.value : borderColor?.value;
});
</script>
<style lang="scss" scoped>
.buttonGroup {
  display: grid;
  grid-template-columns: repeat(v-bind(buttonCount), 1fr);
  white-space: pre-line;
  :first-child {
    border-radius: 0.5rem 0 0 0.5rem;
  }
  :last-child {
    border-radius: 0 0.5rem 0.5rem 0;
  }
}
.button {
  border: 1px solid black;
  border-color: v-bind(borderColorComputed);
  padding-inline: 0.8rem;
  margin: 0;

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
</style>
