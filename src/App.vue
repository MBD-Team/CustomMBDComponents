<template>
  <Select placeholder="test" v-model="text" :options="list"></Select>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Text from './components/SexyInputs/Text.vue';
import Number from './components/SexyInputs/Number.vue';
import Select from './components/SexyInputs/Select.vue';
import MultiSelect from './components/SexyInputs/MultiSelect.vue';
import Checkbox from './components/SexyInputs/Checkbox.vue';
import Date from './components/SexyInputs/Date.vue';
import Email from './components/SexyInputs/Email.vue';
import File from './components/SexyInputs/File.vue';
import MultiFile from './components/SexyInputs/MultiFile.vue';

import Accordion from './components/Accordion.vue';
import Modal from './components/Modal.vue';
import Alert from './components/Alert.vue';
import Button from './components/Button.vue';
import Message from './components/Message.vue';
import ProgressBar from './components/ProgressBar.vue';
import Spinner from './components/Spinner.vue';
import Tooltip from './components/Tooltip.vue';
import Wizard from './components/Wizard.vue';
import Password from './components/SexyInputs/Password.vue';
import Range from './components/SexyInputs/Range.vue';
import Search from './components/SexyInputs/Search.vue';

const text = ref('');
const number = ref(0);
const bool = ref(true);
const list = ref<any[]>([1, 2, 3]);
</script>

<style lang="scss"></style>
