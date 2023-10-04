<template>
  <div class="buttonGroup" :style="`grid-template-columns: repeat(${buttonCount}, 1fr)`">
    <button
      v-for="option of options"
      class="button shadow-none"
      type="button"
      v-bind="$attrs"
      @click="option.function"
      :style="`border-color:${borderColorComputed}`"
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
import { computed, toRefs } from 'vue';
import Error from './common/Error.vue';
import { getErrorMessage, InputError } from './Index';

const props = withDefaults(
  defineProps<{
    options: { text: string; function: () => any }[];
    name?: string;
    error?: InputError;
    errorColor?: string;
    borderColor?: string;
  }>(),
  { error: '', errorColor: 'red', name: '' }
);
const { options, error, errorColor, borderColor, name } = toRefs(props);
const buttonCount = computed(() => options.value.length);
function textWithNewLines(text: string) {
  return text.replaceAll(/\n|<br>/g, '\n');
}
const borderColorComputed = computed(() => (getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value));
</script>
<style lang="scss" scoped>
@use 'groupStyle';
</style>
