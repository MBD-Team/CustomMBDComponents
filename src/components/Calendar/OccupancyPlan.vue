<template>
  <div class="flex-grow-1" style="display: flex; flex-direction: column">
    <div
      class="w-100 d-flex border-bottom"
      style="flex: 0 0 auto; padding-left: var(--time-axis-width)"
      :style="{ 'padding-right': weekViewScrollbarSize() + 'px' }"
    >
      <div
        v-for="date of currentWeek"
        :key="date"
        style="width: 0px; cursor: pointer"
        class="d-flex flex-grow-1 flex-column align-items-center"
        @click="(currentDay = date), (mode = 'day')"
      >
        <div class="text-muted mt-2" style="font-size: 14px" :class="getDayClasses(date)">{{ Info.weekdays('short')[date - 1] }}</div>
        <!-- print the column headers-->
        <div v-if="columns" class="d-flex flex-row align-self-stretch">
          <div v-for="column in columns" :key="column.id || 'null'" class="d-flex flex-grow-1 flex-column align-items-center">
            <div class="text-muted mt-2" style="font-size: 14px">{{ column.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- date content -->
    <div class="overflow-auto d-flex flex-row" id="weekContainer" style="height: 0; flex: 1 1 auto; align-items: stretch">
      <div class="timeaxis-container" :style="{ '--num-of-hours': displayHours[1] - displayHours[0] }">
        <div v-for="num of displayHours[1] - displayHours[0] - 1" class="timeaxis" :key="num">{{ ('0' + (num + displayHours[0])).slice(-2) }}:00</div>
      </div>
      <div
        v-for="date of currentWeek"
        :style="{ '--num-of-hours': displayHours[1] - displayHours[0], '--num-of-columns': columns.length }"
        :key="date"
        class="w-100 day-background position-relative overflow-hidden"
        @click="
          emit('timeClicked', {
            weekDay: date,
            time: Duration.fromObject({
              hours:
                Math.floor((($event.offsetY / ($event.target as any).offsetHeight) * (displayHours[1] - displayHours[0]) + displayHours[0]) * 4) / 4,
            }).toFormat('hh:mm'),
            column_id: Math.floor(($event.offsetX / ($event.target as any).offsetWidth) * columns.length),
          })
        "
      >
        <DayEvents
          @event-clicked="emit('eventClicked', $event)"
          :start="displayHours[0]"
          :end="displayHours[1]"
          :events="getEventsForDay(date)"
          :isToday="DateTime.now().weekday == date"
          :columns="columns"
        ></DayEvents>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs } from 'vue';
import { DateTime, Info, Duration, WeekdayNumbers } from 'luxon';

import DayEvents from './DayEvents.vue';
import type { Event, Group, WeekEvent, Column } from './types';

import { isMobile, useGetDayClasses, useGroupColors, weekViewScrollbarSize } from './utils';
const console = window.console;

const props = defineProps<{
  displayHours: [number, number];
  groups: Group[];
  columns: Column[];
  events: WeekEvent[];
  hash?: string;
}>();
const { hash, events, groups: groupsProp, displayHours } = toRefs(props);
let groups = computed({ get: () => groupsProp.value, set: (groups: Group[]) => emit('update:groups', groups) });

const emit = defineEmits<{
  (e: 'update:groups', value: Group[]): void;
  (e: 'eventClicked', value: Event): void;
  (e: 'timeClicked', value: { weekDay: WeekdayNumbers; time: string; column_id: number }): void;
}>();

const mode = ref<'week' | 'day' | 'month' | 'year' | 'agenda'>(isMobile ? 'day' : 'month');

const currentDay = ref(0);
const currentWeek = [1, 2, 3, 4, 5] as const;

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
    .sort((a, b) => (a.week_day + a.start_time > b.week_day + b.start_time ? 1 : -1))
);

const getEventsForDay = (day: number) =>
  filteredEvents.value
    .filter(e => e.week_day == day)
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
