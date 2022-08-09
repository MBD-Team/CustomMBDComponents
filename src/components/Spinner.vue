<template>
  <div :class="color ? `text-${color}` : ``" class="spinner-border spinner-border-sm" :style="{ width: size, height: size }" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';

const props = withDefaults(
  defineProps<{
    color?: string;
    size?: string;
  }>(),
  {
    color: 'primary',
  }
);

const { color, size } = toRefs(props);
</script>
<style lang="scss" scoped></style>
