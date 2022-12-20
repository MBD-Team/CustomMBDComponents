<template>
  <div>
    <CheckboxGroup :options="optionsNew"></CheckboxGroup>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import MultiSelect from '../src/components/SexyInputs/MultiSelect.vue';
import Select from '../src/components/SexyInputs/Select.vue';
import Modal from '../src/components/Modal.vue';
import CheckboxGroup from '../src/components/SexyInputs/CheckboxGroup.vue';
const selectedNew = ref([]);

const selectNew = ref('');
const optionsNew = ref(
  Array(5)
    .fill(0)
    .map((_, i) => ({
      text: 'test' + i,
      value: i,
      active: false,
    }))
);
</script>
