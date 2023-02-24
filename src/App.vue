<template></template>

<script lang="ts" setup>
import { ref } from 'vue';
// import Calendar from './components/Calendar/Calendar.vue'; TODO: jsDoc
// import ButtonGroup from './components/SexyInputs/ButtonGroup.vue'; TODO: jsDoc
import CheckboxInput from './components/SexyInputs/Checkbox.vue';
// import CheckboxGroup from './components/SexyInputs/CheckboxGroup.vue'; TODO: jsDoc
import DateInput from './components/SexyInputs/Date.vue';
import EmailInput from './components/SexyInputs/Email.vue';
import FileInput from './components/SexyInputs/File.vue';
import MultiFileInput from './components/SexyInputs/MultiFile.vue';
import MultiSelectInput from './components/SexyInputs/MultiSelect.vue';
import NumberInput from './components/SexyInputs/Number.vue';
import PasswordInput from './components/SexyInputs/Password.vue';
// import Radiobuttons from './components/SexyInputs/Radiobuttons.vue'; TODO: jsDoc
// import RadioGroup from './components/SexyInputs/RadioGroup.vue'; TODO: jsDoc
import RangeInput from './components/SexyInputs/Range.vue';
import SearchInput from './components/SexyInputs/Search.vue';
import SelectInput from './components/SexyInputs/Select.vue';
import TextInput from './components/SexyInputs/Text.vue';
import TextAreaInput from './components/SexyInputs/Textarea.vue';
import TimeInput from './components/SexyInputs/Time.vue';

import Accordion from './components/Accordion.vue';
import Alert from './components/Alert.vue';
import Button from './components/Button.vue';
// import Carousel from './components/Carousel.vue'; TODO: maybe not working, need to check ;  TODO: jsDoc
import Message from './components/Message.vue';
import Modal from './components/Modal.vue';
import ProgressBar from './components/ProgressBar.vue';
import Spinner from './components/Spinner.vue';
import Tooltip from './components/Tooltip.vue';
import Wizard from './components/Wizard.vue';

const text = ref('alertMessage');
const showAlert = ref(true);

const options = [1, 2, 3];
const list = ref<number[]>([]);
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

const log = console.log;
</script>

<style lang="scss"></style>
