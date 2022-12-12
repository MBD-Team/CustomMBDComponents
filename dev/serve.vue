<template>
  <div id="app" style="height: 100vh" class="m-5">
    <div class="col-6">
      <Time v-model="time" placeholder="time"></Time>
    </div>
    <div class="col-6"><Date v-model="date" placeholder="date"></Date></div>
    <div class="col-6">
      <Number v-model="number" placeholder="number">
        <template #button><Button :sideButton="true" @click="">tets</Button></template>
      </Number>
    </div>
    <div class="col-6"><Text v-model="text" placeholder="text"></Text></div>
    <div class="col-6"><Email v-model="text" placeholder="email"></Email></div>
    <div class="col-6"><File v-model="text" placeholder="File"></File></div>
    <div class="col-6">
      <Select :options="array" :optionProjection="e => e?.name" v-model="text" placeholder="Select">
        <template #button><Button href="test" class="btn btn-primary" :sideButton="true">tets</Button></template>
      </Select>
    </div>
    <Button class="btn default" @click="test('e')">testts</Button>
    <Button href="test" class="btn default"><div class="d-flex align-items-center h-100">test</div></Button>
    <div><Textarea placeholder="dguzfhi" v-model="text" disabled></Textarea></div>
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
import Number from '../src/components/SexyInputs/Number.vue';
import Text from '../src/components/SexyInputs/Text.vue';
import Range from '../src/components/SexyInputs/Range.vue';
import Select from '../src/components/SexyInputs/Select.vue';

import File from '../src/components/SexyInputs/File.vue';
import Email from '../src/components/SexyInputs/Email.vue';
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
const range = ref(0);
const text = ref('');
const checkbox = ref(false);
const date = ref('');
const time = ref('');
const number = ref('');

const items = ref([
  { title: 'Dashboard', hash: 'dashboard', noAccordion: true },
  { title: 'Mein Club', hash: 'myClub', noAccordion: true },
  { title: 'KSV', titleIcon: 'fas fa-hotel fa-lg', hash: 'ksv' },
  { title: 'Clubadministration', titleIcon: 'fas fa-info-circle fa-lg', hash: 'clubAdministration' },
  { title: 'Clubabrechnungen', titleIcon: 'fas fa-file-alt fa-lg', hash: 'clubAbrechnungen' },
  { title: 'Mitgliederverwaltung', titleIcon: 'fas fa-users fa-lg', hash: 'mitgliederVerwaltung' },
  { title: 'Benachrichtigungen', hash: 'benachrichtigungen', noAccordion: true },
  { title: 'Veranstaltungen', titleIcon: 'fas fa-calendar-alt fa-lg', hash: 'veranstaltungen' },
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
