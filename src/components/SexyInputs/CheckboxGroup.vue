<template>
  <div class="buttonGroup">
    <button
      v-for="option of options"
      class="button shadow-none"
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
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import Button from '../../exampleStories/Button.vue';
import Error from './common/Error.vue';
import { getErrorMessage } from './Index';
const props = withDefaults(
  defineProps<{
    options: { text: string; value: string | number | boolean; active: boolean }[];
    activeClass?: string;
    defaultClass?: string;
    name?: string;
    error?: { [key: string]: string | string[] } | string;
    errorColor?: string;
    borderColor?: string;
  }>(),
  { defaultClass: 'bg-light text-dark', activeClass: 'bg-dark text-light', error: '', errorColor: 'red', name: '' }
);
const { options, error, errorColor, borderColor, name } = toRefs(props);

const buttonCount = computed(() => options.value.length);
function textWithNewLines(text: string) {
  return text.replaceAll(/\n|<br>/g, '\n');
}
const borderColorComputed = computed(() => {
  return getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value;
});
</script>
<style lang="scss" scoped>
@use 'groupStyle';
</style>
