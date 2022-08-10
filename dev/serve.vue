<template>
  <div id="app" style="height: 100vh" class="d-flex justify-content-center align-items-center flex-column">
    <CheckboxGroup :options="items" class="test"></CheckboxGroup>
    <RadioGroup :options="items" class=""></RadioGroup>
    <ButtonGroup :options="items" class="bg-primary text-light"></ButtonGroup>
  </div>
</template>

<script setup lang="ts">
import Modal from '../src/components/Modal.vue';
import Button from '../src/components/Button.vue';
import Spinner from '../src/components/Spinner.vue';
import Calendar from '../src/components/Calendar/Calendar.vue';
import Carousel from '../src/components/Carousel.vue';
import CheckboxGroup from '../src/components/SexyInputs/CheckboxGroup.vue';
import RadioGroup from '../src/components/SexyInputs/RadioGroup.vue';
import ButtonGroup from '../src/components/SexyInputs/ButtonGroup.vue';
import { ref } from 'vue';

const console = window.console;

const items = ref([
  { text: 'testdsvgfhjsbvdhj', value: 1, function: () => console.log('test') },
  { text: 'abc', value: 2, function: () => console.log('abc') },
  { text: 'a', value: 3, function: () => console.log('a') },
  { text: 'b', value: 4, function: () => console.log('b') },
]);

const loading = ref(false);
const groups = ref([{ id: 1, name: 'Group1', checked: true }]);
</script>
<style lang="scss"></style>
