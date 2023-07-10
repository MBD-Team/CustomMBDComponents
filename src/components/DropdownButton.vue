<template>
  <div class="d-none" :class="`d-${breakPoint}-block`">
    <slot></slot>
  </div>
  <div class="d-block" :class="`d-${breakPoint}-none`">
    <button :class="dropdownClass" data-bs-toggle="dropdown" data-bs-offset="0,5">
      <i :class="`fas fa-${dropdownIcon}`"></i>
    </button>
    <div class="dropdown-menu p-1 ps-2">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    breakPoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    dropdownClass: string;
    dropdownIcon: string;
  }>(),
  { dropdownClass: 'btn btn-primary', dropdownIcon: 'cogs' }
);
</script>
<style lang="scss" scoped></style>
