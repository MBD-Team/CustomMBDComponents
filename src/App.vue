<template>
  <Text v-model="test"></Text>
  <div>
    <Select v-model="test" :options="options"></Select>
  </div>
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
      Dropdown button
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
    </ul>
  </div>
  <div class="sticky-top bg-black" style="height: 200px">sticky-top</div>
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
      Dropdown button
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      <li><a class="dropdown-item" href="#">Action</a></li>
      <li><a class="dropdown-item" href="#">Another action</a></li>
      <li><a class="dropdown-item" href="#">Something else here</a></li>
    </ul>
  </div>
  <Select v-model="test" :options="options"></Select>
  <div v-for="i of 100">
    {{ i }}
  </div>
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
