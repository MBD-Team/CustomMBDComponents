<template>
  <MultiSelect
    v-model="selectNew"
    v-model:selected="selectedNew"
    :options="optionsNew"
    :placeholder="'Verein Hinzufügen'"
    :option-projection="e => e.name"
    :key-extractor="e => e.id"
  ></MultiSelect>
  <Select v-model="selectNew" :options="optionsNew" :placeholder="'Verein Hinzufügen'" :option-projection="e => e.name"></Select>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import MultiSelect from '../src/components/SexyInputs/MultiSelect.vue';
import Select from '../src/components/SexyInputs/Select.vue';
const selectedNew = ref([]);

const selectNew = ref('');
const optionsNew = ref(
  Array(5000)
    .fill(0)
    .map((_, i) => ({
      name: 'SV Test ##' + i,
      id: i,
      federation_id: 1,
      address: ' ,\n ' + Math.random(),
      housenumber: Math.random(),
      latitude: Math.random(),
      longitude: Math.random(),
      zip: Math.random(),
    }))
);
</script>
