<template>
  <div class="buttonGroup" :style="`grid-template-columns: repeat(${buttonCount}, 1fr)`">
    <button
      v-for="option of options"
      class="button shadow-none"
      v-bind="$attrs"
      type="button"
      :class="modelValue == option.value ? activeClass : defaultClass"
      :style="`border-color:${borderColorComputed}`"
      @click="updateValue(option.value)"
      :key="option.value + ''"
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
<script setup lang="ts" generic="TVal extends string | number | boolean">
import { computed, toRefs } from 'vue';
import Error from './common/Error.vue';
import { getErrorMessage, InputError } from './Index';
const emit = defineEmits<{
  'update:modelValue': [value: TVal];
}>();
const props = withDefaults(
  defineProps<{
    options: { text: string; value: TVal }[];
    modelValue: TVal;
    activeClass?: string;
    defaultClass?: string;
    name?: string;
    error?: InputError;
    errorColor?: string;
    borderColor?: string;
    disabled?: boolean;
  }>(),
  { defaultClass: 'bg-light text-dark', activeClass: 'bg-dark text-light', error: '', errorColor: 'red', name: '', disabled: false }
);
const { options, error, errorColor, borderColor, name, disabled } = toRefs(props);
const buttonCount = computed(() => options.value.length);
function textWithNewLines(text: string) {
  return text.replaceAll(/\n|<br>/g, '\n');
}
const borderColorComputed = computed(() => (getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value));
function updateValue(value: any) {
  if (disabled.value) return;
  emit('update:modelValue', value);
}
</script>
<style lang="scss" scoped>
@use 'groupStyle';
</style>
