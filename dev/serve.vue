<template>
  <div id="app">
    <!-- <Modal title="ModalTitle" affirmText="test" :affirmAction="() => console.log('test')">
      <template #button><button class="btn btn-primary m-5">this is the open Modal Button</button></template>
    </Modal>
    <LoadingButton @click="loading = !loading" :loading="loading">I am a Loading Button</LoadingButton>
    <Spinner :color="'danger'" :size="'2em'" /> -->
    <Calendar
      hash="calendar"
      :displayHours="[7, 20]"
      :events="[
        {
          start: new Date().toISOString().split('T')[0] + ' 12:00',
          end: new Date().toISOString().split('T')[0] + ' 15:00',
          name: 'Test Event',
          id: 1,
          group_id: 1,
        },
      ]"
      v-model:groups="groups"
    ></Calendar>
  </div>
</template>

<script setup lang="ts">
import Modal from '../src/Modal.vue';
import LoadingButton from '../src/LoadingButton.vue';
import Spinner from '../src/Spinner.vue';
import Calendar from '../src/Calendar/Calendar.vue';
import { ref } from 'vue';

const console = window.console;

const loading = ref(false);
const groups = ref([{ id: 1, name: 'Group1', checked: true }]);
</script>
<style lang="css" scoped></style>
