<template>
  <div id="app" style="height: 100vh" class="d-flex align-items-center flex-column">
    <Checkbox><div class="user-select-none">rtzgudfj</div></Checkbox>
    <Time placeholder="test"></Time>
    <Date placeholder="test"></Date>
    <Search placeholder="test" v-model="inhalt"></Search>
  </div>
</template>

<script setup lang="ts">
import Modal from '../src/components/Modal.vue';
import Button from '../src/components/Button.vue';
import Spinner from '../src/components/Spinner.vue';
import Calendar from '../src/components/Calendar/Calendar.vue';
import Carousel from '../src/components/Carousel.vue';
import CheckboxGroup from '../src/components/SexyInputs/CheckboxGroup.vue';
import Checkbox from '../src/components/SexyInputs/Checkbox.vue';
import Time from '../src/components/SexyInputs/Time.vue';
import Date from '../src/components/SexyInputs/Date.vue';
import RadioGroup from '../src/components/SexyInputs/RadioGroup.vue';
import ButtonGroup from '../src/components/SexyInputs/ButtonGroup.vue';
import Tooltip from '../src/components/Tooltip.vue';
import Search from '../src/components/SexyInputs/Search.vue';
import Textarea from '../src/components/SexyInputs/Textarea.vue';
import { handleClick } from '../src/utils/clickHandler';
import Wizard from '../src/components/Wizard.vue';
import { ref } from 'vue';

const console = window.console;

const items = ref([
  { text: 'testdsvgfhjsbvdhj', value: 1, function: () => console.log('test') },
  { text: 'abc', value: 2, function: () => console.log('abc') },
  { text: 'a', value: 3, function: () => console.log('a') },
  { text: 'b', value: 4, function: () => console.log('b') },
]);
const inhalt = ref('');
const loading = ref(false);
const groups = ref([{ id: 1, name: 'Group1', checked: true }]);
</script>
<style lang="scss"></style>
