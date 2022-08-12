<template>
  <div class="error" v-if="errorValue.length > 0">
    {{ errorValue }}
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, toRefs } from 'vue';
const props = withDefaults(
  defineProps<{
    error: { [key: string]: string | string[] } | string;
    errorColor: string;
    name?: string;
  }>(),
  {
    error: '',
    errorColor: 'red',
    name: '',
  }
);
const { error, errorColor, name } = toRefs(props);
const errorValue = computed(() => {
  let errorMessage = '';
  if (typeof error.value === 'string') {
    errorMessage = error.value;
  } else if (typeof error.value[name.value] === 'string') {
    errorMessage = error.value[name.value] as string;
  } else {
    errorMessage = (error.value[name.value] as string[])?.join('\n') || '';
  }
  return errorMessage.replaceAll(/\n|<br>/g, '\n');
});
</script>
<style scoped lang="scss">
.error {
  padding-left: 0.1rem;
  padding-right: 0.1rem;
  background-color: transparent;
  color: v-bind(errorColor);
  text-align: start;
  font-size: 0.8rem;
  white-space: pre-line;
}
</style>
