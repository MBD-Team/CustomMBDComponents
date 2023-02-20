<template>
  <Checkbox :v-model="true" :error="'abc'" textLeft errorColor="blue">label</Checkbox>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Text from './components/SexyInputs/Text.vue';
import Number from './components/SexyInputs/Number.vue';
import Select from './components/SexyInputs/Select.vue';
import MultiSelect from './components/SexyInputs/MultiSelect.vue';
import Checkbox from './components/SexyInputs/Checkbox.vue';

import Accordion from './components/Accordion.vue';
import Modal from './components/Modal.vue';
import Alert from './components/Alert.vue';
import Button from './components/Button.vue';
import Message from './components/Message.vue';
import ProgressBar from './components/ProgressBar.vue';
import Spinner from './components/Spinner.vue';
import Tooltip from './components/Tooltip.vue';
import Wizard from './components/Wizard.vue';

const text = ref('');
const number = ref(0);
const bool = ref(true);
const list = ref([]);
</script>

<style lang="scss"></style>
