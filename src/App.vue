<template>
  <div class="p-5">
    <MultiSelectInput :options="options" v-model:selected="selected" placeholder="wähle sportvereine"></MultiSelectInput>
    <SelectInput :options="options" v-model:selected="selected" placeholder="wähle sportverein"></SelectInput>
    <TextInput v-model="text" placeholder="test"></TextInput>
  </div>
  <div v-for="i of 50">
    <TextInput v-model="text"></TextInput>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Calendar from './components/Calendar/Calendar.vue';
import ButtonGroup from './components/SexyInputs/ButtonGroup.vue';
import CheckboxInput from './components/SexyInputs/Checkbox.vue';
import CheckboxGroup from './components/SexyInputs/CheckboxGroup.vue';
import DateInput from './components/SexyInputs/Date.vue';
import EmailInput from './components/SexyInputs/Email.vue';
import FileInput from './components/SexyInputs/File.vue';
import MultiFileInput from './components/SexyInputs/MultiFile.vue';
import MultiSelectInput from './components/SexyInputs/MultiSelect.vue';
import NumberInput from './components/SexyInputs/Number.vue';
import PasswordInput from './components/SexyInputs/Password.vue';
import Radiobuttons from './components/SexyInputs/Radiobuttons.vue';
import RadioGroup from './components/SexyInputs/RadioGroup.vue';
import RangeInput from './components/SexyInputs/Range.vue';
import SearchInput from './components/SexyInputs/Search.vue';
import SelectInput from './components/SexyInputs/Select.vue';
import TextInput from './components/SexyInputs/Text.vue';
import TextAreaInput from './components/SexyInputs/Textarea.vue';
import TimeInput from './components/SexyInputs/Time.vue';

import Accordion from './components/Accordion.vue';
import Alert from './components/Alert.vue';
import Button from './components/Button.vue';
import Carousel from './components/Carousel.vue';
import Message from './components/Message.vue';
import Modal from './components/Modal.vue';
import ProgressBar from './components/ProgressBar.vue';
import Spinner from './components/Spinner.vue';
import Tooltip from './components/Tooltip.vue';
import Wizard from './components/Wizard.vue';

const text = ref('alertMessage');
const showAlert = ref(true);

const options = [];
const list = ref<number[]>([1]);
const selected = ref([]);
const date = ref('');
const number = ref(0);
const files = ref<File[]>([]);
const file = ref<File | null>(null);
const checked = ref(false);
const config = ref<{ text: string; action?: () => Promise<void> | void; class?: string; disabled?: boolean }>({ text: 'test' });
const sections = ref(
  [
    { title: 'Section', content: 'abc' },
    { title: 'Section2', content: 'test' },
  ].map((e, i) => ({ ...e, hash: e.title + i }))
);
for (let i = 0; i < 100; i++) {
  options.push(Math.random() + '');
}
const log = console.log;
</script>

<style lang="scss"></style>
