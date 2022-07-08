<template>
  <button :class="className" :disabled="loading">
    <Spinner v-if="loading" :color="spinnerColor" class="me-2" :size="spinnerSize"></Spinner>
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';
import Spinner from './Spinner.vue';

const props = withDefaults(
  defineProps<{
    spinnerColor?: 'primary' | 'secondary' | 'light' | 'dark' | 'danger' | 'warning' | 'info' | 'success' | '';
    class?: string;
    spinnerSize?: string;
    loading: boolean;
  }>(),
  {
    spinnerColor: '',
    class: 'btn btn-primary',
    spinnerSize: '1em',
  }
);
const { spinnerColor, spinnerSize, class: className } = toRefs(props);
</script>
<style lang="scss" scoped></style>
