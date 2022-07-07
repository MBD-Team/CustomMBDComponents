<template>
  <button @click="emit('click')" :style="{ backgroundColor: backgroundColor }"><slot></slot></button>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';

const props =
  defineProps<{
    backgroundColor: string;
  }>();
const emit =
  defineEmits<{
    (type: 'click'): void;
  }>();
const { backgroundColor } = toRefs(props);
</script>
