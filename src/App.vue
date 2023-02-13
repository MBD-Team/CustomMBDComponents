<template>
  <Text v-model="test"></Text>
  <Select v-model="test" :options="options"></Select>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Text from './components/SexyInputs/Text.vue';
import Number from './components/SexyInputs/Number.vue';
import Select from './components/SexyInputs/Select.vue';
import MultiSelect from './components/SexyInputs/MultiSelect.vue';
import Modal from './components/Modal.vue';
const test = ref('');
const options = ref([]);
for (let i = 0; i < 100; i++) options.value.push(Math.random() + '');
const selected = ref([]);
</script>

<style lang="scss"></style>
