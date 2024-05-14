<template>
  <div class="bg-light d-flex justify-content-between text-center p-2 border-bottom flex-wrap pb-0">
    <div class="d-flex mb-2">
      <div class="d-none d-sm-flex align-items-center h4 mb-0">{{ title }}</div>
    </div>
    <div class="mb-2">
      <ButtonGroup v-model="mode" :options="{ day: 'Tag', workweek: 'Werktage', week: 'Woche', weekend: 'Wochenende' }" name="OccType"></ButtonGroup>
    </div>
  </div>
  <div class="d-flex flex-grow-1">
    <div class="d-flex flex-column">
      <div class="bg-light collapse show d-flex flex-column" style="height: 0px; flex-grow: 1">
        <button style="padding-left: 3.75rem; padding-right: 3.75rem" class="btn btn-secondary m-2" @click="columns.forEach(c => (c.checked = true))">
          Alle auswählen
        </button>
        <div style="flex-basis: 200px; flex-grow: 1; overflow: auto">
          <div
            class="p-1 ps-2"
            v-for="(column, index) of columns"
            :key="column.id + ''"
            @click="column.checked = !column.checked"
            @dblclick="columns.forEach(g => (g.checked = false)), (column.checked = true)"
            style="user-select: none"
          >
            <input class="form-check-input" type="checkbox" v-model="column.checked" />
            <label class="form-check-label ms-3" for="flexCheckDefault">{{ column.name }}</label>
          </div>
        </div>
        <hr class="my-2" />
        <GroupSelector v-model="groups" :groupColors="groupColors" />
      </div>
    </div>
    <div class="flex-grow-1" style="display: flex; flex-direction: column">
      <div
        class="w-100 d-flex border-bottom"
        style="flex: 0 0 auto; padding-left: var(--time-axis-width)"
        :style="{ 'padding-right': weekViewScrollbarSize + 'px' }"
      >
        <div
          v-for="date of currentWeek"
          :key="date"
          style="width: 0px; cursor: pointer"
          class="d-flex flex-grow-1 flex-column align-items-center"
          @click="(currentDay = date), (mode = 'day')"
        >
          <div class="fw-bold h5 mt-2" :class="getDayClasses(date)">{{ Info.weekdays('short')[date - 1] }}</div>
          <!-- print the column headers-->
          <div v-if="columns" class="d-flex flex-row align-self-stretch">
            <div
              v-for="column in columns.filter(c => c.checked)"
              :key="column.id || 'null'"
              class="flex-grow-1 flex-column text-muted text-center"
              style="width: 0px; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
            >
              {{ column.name }}
            </div>
          </div>
        </div>
      </div>
      <!-- date content -->
      <div class="overflow-auto d-flex flex-row" ref="weekContainer" style="height: 0; flex: 1 1 auto; align-items: stretch">
        <div class="timeaxis-container" :style="{ '--num-of-hours': displayHours[1] - displayHours[0] }">
          <div v-for="num of displayHours[1] - displayHours[0] - 1" class="timeaxis" :key="num">
            {{ ('0' + (num + displayHours[0])).slice(-2) }}:00
          </div>
        </div>
        <div
          v-for="date of currentWeek"
          :style="{ '--num-of-hours': displayHours[1] - displayHours[0], '--num-of-columns': columns.filter(c => c.checked).length }"
          :key="date"
          class="w-100 day-background position-relative overflow-hidden"
          @click="
            emit('timeClicked', {
              weekday: date as WeekdayNumbers,
              time: Duration.fromObject({
                hours:
                  Math.floor((($event.offsetY / ($event.target as any).offsetHeight) * (displayHours[1] - displayHours[0]) + displayHours[0]) * 4) /
                  4,
              }).toFormat('hh:mm'),
              column_id: columns[Math.floor(($event.offsetX / ($event.target as any).offsetWidth) * columns.length)].id!,
            })
          "
        >
          <DayEvents
            @event-clicked="emit('eventClicked', $event as any)"
            :start="displayHours[0]"
            :end="displayHours[1]"
            :events="getEventsForDay(date)"
            :isToday="DateTime.now().weekday == date"
            :columns="columns.filter(c => c.checked)"
          ></DayEvents>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs } from 'vue';
import { DateTime, Info, Duration, WeekdayNumbers } from 'luxon';

import DayEvents from './DayEvents.vue';
import type { Event, Group, WeekEvent, Column } from './types';

import { isMobile, useGetDayClasses, useGroupColors, useElementScrollbarSize } from './utils';
import GroupSelector from './GroupSelector.vue';
import ButtonGroup from './ButtonGroup.vue';
const console = window.console;

const props = defineProps<{
  displayHours: [number, number];
  groups: Group[];
  columns: Column[];
  events: WeekEvent[];
  title?: string;
}>();
const { title, events, columns: columnsProp, groups: groupsProp, displayHours } = toRefs(props);

let groups = computed({ get: () => groupsProp.value, set: (groups: Group[]) => emit('update:groups', groups) });
let columns = computed({ get: () => columnsProp.value, set: (columns: Column[]) => emit('update:columns', columns) });

const emit = defineEmits<{
  (e: 'update:groups', value: Group[]): void;
  (e: 'update:columns', value: Column[]): void;
  (e: 'eventClicked', value: Omit<WeekEvent, 'id'> & { id: number | number[] }): void;
  (e: 'timeClicked', value: { weekday: WeekdayNumbers; time: string; column_id: number }): void;
}>();

const weekContainer = ref<HTMLElement>();
const weekViewScrollbarSize = useElementScrollbarSize(weekContainer);

const mode = ref<'day' | 'workweek' | 'week' | 'weekend'>('workweek');

const currentDay = ref(DateTime.now().weekday);
const currentWeek = computed(
  () =>
    ({
      day: [currentDay.value],
      workweek: [1, 2, 3, 4, 5],
      week: [1, 2, 3, 4, 5, 6, 7],
      weekend: [6, 7],
    }[mode.value])
);

const getDayClasses = useGetDayClasses();

const groupColors = useGroupColors(groups);

const eventsWithColor = computed(() =>
  events.value.map(e => ({ ...e, color: e.color || groupColors.value[groups.value.findIndex(g => g.id == e.group_id)] }))
);

const filterQuery = ref('');

const filteredEvents = computed(() =>
  eventsWithColor.value
    .filter(e => groups.value.filter(g => g.checked).some(g => g.id == e.group_id))
    .filter(e => e.name.includes(filterQuery.value))
    .sort((a, b) => (a.weekday + a.start_time > b.weekday + b.start_time ? 1 : -1))
);

const getEventsForDay = (day: number) =>
  filteredEvents.value
    .filter(e => e.weekday == day)
    .map(e => ({
      ...e,
      start: e.start_time,
      end: e.end_time,
    }));
</script>

<style lang="scss" scoped>
@use 'common';

div {
  --dayview-half-hour-line-color: #fff;
}
</style>
