<template>
  <div id="app" style="height: 100vh" class="d-flex align-items-center flex-column">
    <div>
      <Accordion :items="items">
        <template #test>
          <div @click="test('f')" class="p-2">test</div>
          <div @click="test('g')" class="p-2">test2</div>
        </template>
        <template #test2><div class="p-2">gfjkdl</div></template>
        <template #test3><div class="p-3" @click="test('h')">gfjkdl</div></template>
        <template #test4><div class="p-2">gfjkdl</div></template>
      </Accordion>
    </div>
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
import MultiSelect from '../src/components/SexyInputs/MultiSelect.vue';
import { handleClick } from '../src/utils/clickHandler';
import Wizard from '../src/components/Wizard.vue';
import Accordion from '../src/components/Accordion.vue';
import { ref } from 'vue';

const console = window.console;

const items = ref([
  { title: 'test', hash: 'test' },
  { title: 'hfgh', hash: 'test2' },
  { title: 'hfghfg', hash: 'test3', noAccordion: true },
  { title: 'vhjds', hash: 'test4' },
]);
const inhalt = ref('');
const loading = ref(false);
const groups = ref([{ id: 1, name: 'Group1', checked: true }]);
const array = ref([
  { name: 'test', id: 0 },
  { name: 'test', id: 1 },
]);
const selectedArray = ref([{ name: 'test', id: 0 }]);
function test(e: any) {
  console.log(e);
}
</script>
<style lang="scss"></style>
