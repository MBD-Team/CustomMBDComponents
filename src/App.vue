<template>
  <div style="height: 100vh">
    <Calendar
      :displayHours="[8, 18]"
      :events="calendarEvents"
      :groups="groups"
      :columns="columns"
      :viewOptions="{ day: true, week: true, month: true, year: false, agenda: false }"
      @eventClicked="e => log('eventClicked', e)"
      @eventResized="($event)=> {const e = calendarEvents.find(e=>e.id===$event.id)!;log('eventResized', e)
                  e.start=e.start.split(' ')[0]+' '+$event.newStart.startOf('hour').toFormat('HH:mm:ss');
                  e.end=e.end.split(' ')[0]+' '+$event.newEnd.endOf('hour').toFormat('HH:mm:ss');}"
      @timeClicked="e => log('timeClicked', e)"
      @timeClickedWithColumn="e => log('timeClickedWithColumn', e)"
    >
      <template #columnSelectionHeader><div class="px-2">Mitarbeiter</div></template>
      <template #groupSelectionHeader><div class="px-2">Abteilungen</div></template>
    </Calendar>
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
import DropdownButton from './components/DropdownButton.vue';
import Alert from './components/Alert.vue';
import Button from './components/Button.vue';
import Carousel from './components/Carousel.vue';
import Message from './components/Message.vue';
import Modal from './components/Modal.vue';
import ProgressBar from './components/ProgressBar.vue';
import Spinner from './components/Spinner.vue';
import Tooltip from './components/Tooltip.vue';
import Wizard from './components/Wizard.vue';

const text = ref('alert Message');
const showAlert = ref(true);

const test = ref({ id: 1, name: '1' });

const options = Array(10)
  .fill(0)
  .map((_, i) => ({ name: i + '', id: i }));
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
const groups = ref([
  { name: 'test', id: 1, checked: true },
  { name: 'test2', id: 2, checked: true },
  { name: 'test3', id: 3, checked: true },
  { name: 'test4', id: 4, checked: true },
]);
const columns = ref([
  { name: 'test', id: 1, checked: true },
  { name: 'test2', id: 2, checked: true },
  { name: 'test3', id: 3, checked: true },
  { name: 'test4', id: 4, checked: true },
]);
const calendarEvents = ref(
  Array(5)
    .fill(0)
    .flatMap((a, i) => [
      {
        start: `2023-10-${i + 23} 08:00:00`,
        end: `2023-10-${i + 23} 10:00:00`,
        name: 'test',
        id: i * 10,
        group_id: 1,
        column_id: 1,
        isResizable: true,
      },
      {
        start: `2023-10-${i + 23} 12:00:00`,
        end: `2023-10-${i + 23} 17:00:00`,
        name: 'test',
        id: i * 10 + 1,
        group_id: 2,
        column_id: 2,
      },
      {
        start: `2023-10-${i + 23} 10:00:00`,
        end: `2023-10-${i + 23} 13:00:00`,
        name: 'test',
        id: i * 10 + 2,
        group_id: 3,
        column_id: 3,
      },

      {
        start: `2023-10-${i + 23} 12:00:00`,
        end: `2023-10-${i + 23} 15:00:00`,
        name: 'test',
        id: i * 10 + 3,
        group_id: 4,
        column_id: 4,
      },
      {
        start: `2023-10-${i + 23} 09:00:00`,
        end: `2023-10-${i + 23} 10:00:00`,
        name: 'test',
        id: i * 10 + 4,
        group_id: 2,
        column_id: 2,
      },
    ])
);
// for (let i = 0; i < 100; i++) {
//   options.push(Math.random() + '');
// }
const log = console.log;
</script>

<style lang="scss"></style>
