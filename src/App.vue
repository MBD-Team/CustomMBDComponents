<template>
  <Number placeholder="number" step="0.01" v-model="test" min="0" max="5"></Number>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Number from './components/SexyInputs/Number.vue';
const test = ref('');
</script>

<style lang="scss"></style>
