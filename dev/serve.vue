<template>
  <div id="app" style="height: 100vh">
    <Carousel :itemArray="items" :itemsPerPage="items.length < 10 ? items.length : 10" v-slot="slotProps">
      <div class="d-flex justify-content-center">{{ slotProps.item.name }}{{ slotProps.item.value }}</div>
    </Carousel>
  </div>
</template>

<script setup lang="ts">
import Modal from '../src/components/Modal.vue';
import Button from '../src/components/Button.vue';
import Spinner from '../src/components/Spinner.vue';
import Calendar from '../src/components/Calendar/Calendar.vue';
import Carousel from '../src/components/Carousel.vue';
import { ref } from 'vue';

const console = window.console;

const items = ref([
  { name: 'test', value: 1 },
  { name: 'abc', value: 2 },
  { name: 'a', value: 1 },
  { name: 'b', value: 2 },
]);

const loading = ref(false);
const groups = ref([{ id: 1, name: 'Group1', checked: true }]);
</script>
<style lang="css" scoped></style>
