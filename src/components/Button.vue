<template>
  <button v-bind="$attrs" :disabled="loading">
    <Spinner v-if="loading" :color="spinnerColor" class="me-2" :size="spinnerSize"></Spinner>
    <slot></slot>
  </button>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { toRefs } from 'vue';
import Spinner from './Spinner.vue';

const props = withDefaults(
  defineProps<{
    spinnerColor?: 'primary' | 'secondary' | 'light' | 'dark' | 'danger' | 'warning' | 'info' | 'success' | '';
    spinnerSize?: string;
    loading?: boolean;
  }>(),
  {
    spinnerColor: '',
    spinnerSize: '1em',
    loading: false,
  }
);
const { spinnerColor, spinnerSize } = toRefs(props);
</script>
<style scoped lang="scss">
button {
  box-shadow: none !important;
  height: 2.5rem;
  width: 100%;
  padding-inline: 0.8rem;
  font-size: 1rem;
  line-height: 1rem;
  border-radius: 0.5rem;
  transition: all 0.25s ease-out;
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
  &:disabled,
  &[disabled] {
    filter: grayscale(50%);
  }
}
</style>
