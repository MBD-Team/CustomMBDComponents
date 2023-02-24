<template>
  <Modal title="test" :affirm="config.affirm" :negative="config.negative" :affirm-alt="config.alt"></Modal>
  <button @click.stop="config.alt = { text: 'test' }">test</button>
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
const selected = ref([]);
const log = console.log;
const config = ref({ affirm: { text: 'yay', action: () => log('f'), class: 'btn btn-success' }, negative: { text: 'a' }, alt: { text: 'b' } });
</script>

<style lang="scss"></style>
