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
    error: string;
    errorColor: string;
  }>(),
  {
    error: '',
    errorColor: 'red',
  }
);
const { error, errorColor } = toRefs(props);
const errorValue = computed(() => error.value.replaceAll(/\\n|<br>/g, '\n'));
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
