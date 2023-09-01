<template>
  <div :class="color ? `text-${color}` : ``" class="spinner-border spinner-border-sm" :style="{ width: size, height: size }" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: string;
    size?: string;
  }>(),
  {
    color: 'primary',
  }
);
</script>

<script lang="ts">
/**
 * how to use:
 * ```html
 *   <Spinner></Spinner>
 *
 *   <Spinner color="success" size="3rem"></Spinner>
 * ```
 */
export default {};
</script>
