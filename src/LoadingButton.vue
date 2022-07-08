<template>
  <button class="" :class="`btn btn-${buttonColor}`" type="button">
    <Spinner v-if="loading" :color="spinnerColor" class="me-2" :size="spinnerSize"></Spinner>
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';
import Spinner from './Spinner.vue';

const props = withDefaults(
  defineProps<{
    spinnerColor?: 'primary' | 'secondary' | 'light' | 'dark' | 'danger' | 'warning' | 'info' | 'success' | 'muted' | 'white' | 'black' | '';
    buttonColor?: 'primary' | 'secondary' | 'light' | 'dark' | 'danger' | 'warning' | 'info' | 'success' | 'muted' | 'white' | 'black';
    spinnerSize?: string;
    loading: boolean;
  }>(),
  {
    spinnerColor: '',
    buttonColor: 'primary',
    spinnerSize: '1em',
  }
);
const { spinnerColor, spinnerSize } = toRefs(props);
</script>
<style lang="scss" scoped></style>
