<template>
  <div class="buttonGroup">
    <button
      v-for="option of options"
      class="button shadow-none border border-dark py-1"
      v-bind="$attrs"
      :class="option.active ? activeClass : defaultClass"
      @click="option.active = !option.active"
      type="button"
    >
      {{ textWithNewLines(option.text) }}
    </button>
  </div>
  <Error :error="error" :error-color="errorColor" :name="name" />
</template>
<script lang="ts">
/**
 * TODO: jsdoc
 * FIXME: experimental
 */
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import Error from './common/Error.vue';
import { getErrorMessage, InputError } from './Index';
const props = withDefaults(
  defineProps<{
    options: { text: string; value: string | number | boolean; active: boolean }[];
    activeClass?: string;
    defaultClass?: string;
    name?: string;
    error?: InputError;
    errorColor?: string;
    borderColor?: string;
  }>(),
  {
    defaultClass: 'bg-light text-dark',
    activeClass: 'bg-success text-light',
    error: '',
    errorColor: 'red',
    name: '',
  }
);
const { options, error, errorColor, borderColor, name } = toRefs(props);

const buttonCount = computed(() => options.value?.length);
function textWithNewLines(text: string) {
  return text.replaceAll(/\n|<br>/g, '\n');
}
const borderColorComputed = computed(() => (getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value));
</script>
<style lang="scss" scoped>
@use 'groupStyle';
.button {
  border-color: v-bind(borderColorComputed);
}
.buttonGroup {
  grid-template-columns: repeat(v-bind(buttonCount), 1fr);
}
</style>
