<template>
  <MultiSelect
    placeholder="zugelassene Sportarten"
    v-model="test"
    :options="tests"
    :optionProjection="e => e?.name"
    v-model:selected="selectedTest"
    :keyExtractor="e => e?.id"
  ></MultiSelect>

  <MultiSelect
    placeholder="zugelassene Sportarten"
    v-model="test"
    :options="tests"
    :optionProjection="e => e?.name"
    v-model:selected="selectedTest"
    :keyExtractor="e => e?.id"
  ></MultiSelect>

  <MultiSelect
    placeholder="zugelassene Sportarten"
    v-model="test"
    :options="tests"
    :optionProjection="e => e?.name"
    v-model:selected="selectedTest"
    :keyExtractor="e => e?.id"
  ></MultiSelect>

  <div class="container pt-5">
    <div class="card">
      <h5 class="card-header">calendar</h5>
      <div class="card-body">
        <div style="height: 80vh" class="d-flex flex-column">
          <Calendar
            msg="Calendar"
            :displayHours="[7, 18]"
            :events="events"
            v-model:groups="groups"
            @eventClicked="events = events.filter(e => e.id != $event.id)"
            @timeClicked="
              events.push({
                start: $event.toISO().replace('T', ' '),
                end: $event.plus({ hours: 1 }).toISO().replace('T', ' '),
                name: $event.toISO(),
                id: Math.random(),
                group_id: 1,
              })
            "
          />
        </div>
      </div>
    </div>
    <div class="card mt-3">
      <h5 class="card-header">occupancy plan</h5>
      <div class="card-body">
        <div style="height: 80vh" class="d-flex flex-column">
          <OccupancyPlan
            title="Belegungsplan für Test"
            :displayHours="[8, 20]"
            :events="weekEvents"
            v-model:columns="columns"
            v-model:groups="groups"
            @eventClicked="
              weekEvents = weekEvents.filter(e => (typeof $event.id == 'number' ? e.id != $event.id : !($event.id as any[]).includes(e.id)))
            "
            @timeClicked="
              console.log($event),
                weekEvents.push({
                  weekday: $event.weekday,
                  start_time: $event.time,
                  end_time: DateTime.fromISO($event.time).plus({ hours: 1 }).toFormat('HH:mm'),
                  name: $event.weekday + ' ' + $event.time,
                  id: Math.random(),
                  group_id: 1,
                  column_id: $event.column_id,
                })
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { DateTime } from 'luxon';
import Calendar from './components/Calendar/Calendar.vue';
import OccupancyPlan from './components/Calendar/OccupancyPlan.vue';
import { Event, Group, WeekEvent } from './components/Calendar/types';
import MultiSelect from './components/SexyInputs/MultiSelect.vue';
const console = window.console;
const events = ref<Event[]>([
  { start: '2022-12-16 17:00', end: '2022-12-16 19:00', name: '16.03 17 uhr', id: 1, group_id: 7 },
  { start: '2022-12-16 17:00', end: '2022-12-16 18:00', name: 'fsdkjhfs', id: 2, group_id: 8 },
  { start: '2022-12-16 08:30', end: '2022-12-16 10:30', name: 'udkauhd', id: 3, group_id: 9 },
  { start: '2022-12-16 10:30', end: '2022-12-16 11:30', name: 'jfd', id: 4, group_id: 1 },
  { start: '2022-12-16 09:45', end: '2022-12-16 10:30', name: 'jfd', id: 5, group_id: 1 },
  { start: '2022-12-15 10:30', end: '2022-12-15 11:30', name: '15.03 10 uhr', id: 6, group_id: 2 },
  { start: '2022-12-15 09:45', end: '2022-12-15 10:30', name: 'jfd', id: 7, group_id: 3 },
  { start: '2022-12-17 17:00', end: '2022-12-17 19:00', name: 'fsdkjhfs', id: 8, group_id: 2 },
  { start: '2022-12-17 17:00', end: '2022-12-17 18:00', name: 'fsdkjhfs', id: 9, group_id: 3 },
  { start: '2022-12-17 08:30', end: '2022-12-17 10:30', name: 'udkauhd', id: 10, group_id: 4 },
  { start: '2022-12-17 08:30', end: '2022-12-17 10:30', name: 'udkauhd', id: 11, group_id: 4 },
  { start: '2022-12-17 08:30', end: '2022-12-17 10:30', name: 'udkauhd', id: 12, group_id: 4 },
  { start: '2022-12-17 08:30', end: '2022-12-17 10:30', name: 'udkauhd', id: 13, group_id: 4 },
  { start: '2022-12-17 08:30', end: '2022-12-17 10:30', name: 'udkauhd', id: 14, group_id: 4 },
  { start: '2022-12-17 08:30', end: '2022-12-17 10:30', name: 'udkauhd', id: 15, group_id: 4 },
  { start: '2022-12-17 08:30', end: '2022-12-17 10:30', name: 'udkauhd', id: 16, group_id: 4 },
  { start: '2022-12-17 08:30', end: '2022-12-17 10:30', name: 'udkauhd', id: 17, group_id: 4 },
  { start: '2022-12-17 08:30', end: '2022-12-17 10:30', name: 'udkauhd', id: 18, group_id: 4 },
  { start: '2022-12-17 08:30', end: '2022-12-17 10:30', name: 'udkauhd', id: 19, group_id: 4 },
  { start: '2022-12-17 08:30', end: '2022-12-17 10:30', name: 'udkauhd', id: 20, group_id: 4 },
  { start: '2022-12-17 10:30', end: '2022-12-17 11:30', name: 'jfd', id: 21, group_id: 5 },
  { start: '2022-12-17 09:45', end: '2022-12-17 10:30', name: 'jfd', id: 22, group_id: 6 },
  { start: '2022-12-17 17:00', end: '2022-12-17 19:00', name: 'fsdkjhfs', id: 23, group_id: 1 },
  { start: '2022-12-18 07:00', end: '2022-12-18 08:00', name: 'fsdkjhfs', id: 24, group_id: 2, color: 'black' },
  { start: '2022-12-18 08:30', end: '2022-12-18 10:30', name: 'udkauhd', id: 25, group_id: 3 },
  { start: '2022-12-18 10:30', end: '2022-12-18 11:30', name: 'jfd', id: 26, group_id: 4 },
  { start: '2022-12-18 09:45', end: '2022-12-18 10:30', name: 'jfd', id: 27, group_id: 5 },
  { start: '2022-12-19 09:45', end: '2022-12-19 11:30', name: 'jfd', id: 28, group_id: 6 },
  { start: '2022-12-19 05:45', end: '2022-12-19 18:30', name: 'jfd', id: 29, group_id: 7 },
  { start: '2022-12-19 13:00', end: '2022-12-19 14:00', name: 'jfd', id: 33, group_id: 8 },
  { start: '2022-12-19 13:00', end: '2022-12-19 14:00', name: 'jfd', id: 34, group_id: 9 },
  { start: '2022-12-20 13:00', end: '2022-12-20 14:00', name: 'jfd', id: 35, group_id: 0 },
  { start: '2022-12-20 13:00', end: '2022-12-20 14:00', name: 'jfd', id: 36, group_id: 1 },
]);
const groups = ref<Group[]>([
  { id: 1, name: 'Group1', checked: true },
  { id: 2, name: 'Group2', checked: true, color: 'black' },
  { id: 3, name: 'Group3', checked: true },
  { id: 4, name: 'Group4', checked: true },
  { id: 5, name: 'Group5', checked: true },
  { id: 6, name: 'Group6', checked: true },
  { id: 7, name: 'Group3', checked: true },
  { id: 8, name: 'Group4', checked: true },
  { id: 9, name: 'Group5', checked: true },
  { id: 10, name: 'Group6', checked: true },
  { id: 11, name: 'Group6', checked: true },
  { id: 12, name: 'Group3', checked: true },
]);

const columns = ref(
  Array(6)
    .fill(0)
    .map((_, id) => ({ name: String.fromCharCode(65 + id) + (id % 2 && 'Feld'), id, checked: true }))
);

const weekEvents = ref([
  { id: 7, column_id: 0, group_id: 1, name: 'Different', weekday: 4, start_time: '14:30', end_time: '16:30', background: 'stripes' },
  { id: 7, column_id: 0, group_id: 1, name: 'Different', weekday: 1, start_time: '09:30', end_time: '16:30', background: 'stripes' },
  { id: 7, column_id: 3, group_id: 1, name: 'col Test', weekday: 4, start_time: '14:45', end_time: '16:45', background: 'dots' },
  { id: 7, column_id: 2, group_id: 1, name: 'col Test', weekday: 4, start_time: '14:45', end_time: '16:45', background: 'dots' },
  { id: 7, column_id: 1, group_id: 1, name: 'col Test', weekday: 4, start_time: '14:45', end_time: '16:45', background: 'dots' },
  { id: 7, column_id: 1, group_id: 2, name: 'col Test', weekday: 4, start_time: '14:45', end_time: '16:45' },
] as WeekEvent[]);

const test = ref('');
const tests = ref([
  { id: 1, name: 'test' },
  { id: 2, name: 'test2' },
  { id: 3, name: 'test3' },
  { id: 4, name: 'test4' },
  { id: 5, name: 'test5' },
]);
const selectedTest = ref([]);
</script>
<style lang="scss"></style>
