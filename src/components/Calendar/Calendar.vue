<template>
  <div class="h-100 d-flex flex-column flex-grow-1 overflow-hidden">
    <!-- menu bar -->
    <div class="bg-light d-flex justify-content-between text-center p-2 border-bottom flex-wrap pb-0">
      <div class="d-flex mb-2">
        <a class="btn btn-secondary me-2 shadow-none" data-bs-toggle="collapse" href="#sideControls" @click="toggle = !toggle" v-if="isMobile">☰</a>
        <div class="btn-group me-3">
          <button class="btn btn-outline-secondary shadow-none" @click="currentDay = currentDay.plus({ [timeFrame]: -1 })">⮜</button>
          <button class="btn btn-outline-secondary shadow-none" @click="currentDay = DateTime.now()" style="padding-left: 2rem; padding-right: 2rem">
            Heute
          </button>
          <button class="btn btn-outline-secondary shadow-none" @click="currentDay = currentDay.plus({ [timeFrame]: 1 })">⮞</button>
        </div>
        <div class="d-none d-sm-flex align-items-center" style="font-size: 20px">{{ currentDayReadable }}</div>
      </div>
      <div class="d-none d-sm-block mb-2">
        <ButtonGroup v-model="mode" :options="viewOptionsLong" name="type"></ButtonGroup>
      </div>
      <div class="d-block d-sm-none mb-2 w-100">
        <ButtonGroup v-model="mode" :options="viewOptionsShort" name="type"></ButtonGroup>
      </div>
    </div>
    <div class="d-flex flex-row position-relative" style="height: 0px; flex: 1">
      <div
        :class="(isMobile ? 'bg-light sideControls' : 'bg-light collapse show d-flex flex-column') + (toggle ? ' toggleTrue' : '')"
        id="sideControls"
      >
        <MonthView
          @event-clicked="emit('eventClicked', $event)"
          @day-pressed="(currentDay = $event), (mode = 'day')"
          @week-pressed="(currentDay = $event), (mode = 'week')"
          @month-pressed="(currentDay = currentMonth), (mode = 'month')"
          :month="currentMonth"
          controllable
          @previous="currentDay = currentDay.plus({ month: -1 })"
          @next="currentDay = currentDay.plus({ month: 1 })"
          :events="getEventsForMonth(currentMonth)"
        ></MonthView>
        <div class="m-2">
          <input type="text" class="form-control" placeholder="Termine Suchen..." v-model="filterQuery" />
        </div>
        <template v-if="columnsProp">
          <slot name="columnSelectionHeader"></slot>
          <button
            style="padding-left: 3.75rem; padding-right: 3.75rem"
            class="btn btn-secondary m-2"
            @click="columns.forEach(c => (c.checked = true))"
          >
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
        </template>
        <GroupSelector v-model="groups" :groupColors="groupColors"><slot name="groupSelectionHeader"></slot></GroupSelector>
      </div>
      <div
        v-if="isMobile && (toggle || backdropActive)"
        class="d-flex flex-column flex-grow-1 hiddenBackdrop"
        :class="{ backdrop: backdropActive && toggle }"
        @click="toggle = false"
        id="backdrop"
      ></div>
      <div
        v-touch:swipe.left="
          () => {
            if (isMobile) {
              currentDay = currentDay.plus({ [timeFrame]: 1 });
            }
          }
        "
        v-touch:swipe.right="
          () => {
            if (isMobile) {
              currentDay = currentDay.plus({ [timeFrame]: -1 });
            }
          }
        "
        class="d-flex flex-column flex-grow-1"
        v-if="mode == 'week' || mode == 'day'"
      >
        <!-- date header -->
        <div class="flex-grow-1" style="display: flex; flex-direction: column">
          <div
            class="w-100 d-flex border-bottom"
            style="flex: 0 0 auto; padding-left: var(--time-axis-width)"
            :style="{ 'padding-right': weekViewScrollbarSize + 'px' }"
          >
            <div
              v-for="date of currentWeek"
              :key="date.toISODate() || 'null'"
              style="width: 0px; cursor: pointer"
              class="d-flex flex-grow-1 flex-column align-items-center"
              @click="(currentDay = date), (mode = 'day')"
            >
              <div class="text-muted mt-2" style="font-size: 14px" :class="getDayClasses(date, 'day')">{{ date.weekdayShort }}</div>
              <div class="h5 d-sm-none d-block fw-bold p-1 rounded-circle" :class="getDayClasses(date, 'num')">
                <div class="d-flex justify-content-center">{{ date.day }}</div>
              </div>
              <div class="h2 d-none d-sm-block fw-normal p-2 rounded-circle" :class="getDayClasses(date, 'num')">
                <div class="d-flex justify-content-center">{{ date.day }}</div>
              </div>
              <slot name="subHeaderSlot" :date="date"></slot>
              <!-- print the column headers-->
              <div v-if="columnsProp" class="d-flex flex-row align-self-stretch">
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
              v-for="(date, index) of currentWeek"
              :style="{ '--num-of-hours': displayHours[1] - displayHours[0] }"
              :key="date.toISODate() || 'null'"
              class="w-100 day-background position-relative overflow-hidden"
              ref="dayEventsContainers"
              @click=" ($event)=>{
                  const dateClicked = date.plus({
                      hours:
                        Math.floor(
                          (($event.offsetY / ($event.target as any).offsetHeight) * (displayHours[1] - displayHours[0]) + displayHours[0]) * 4
                        ) / 4,
                    })
                  emit('timeClicked', dateClicked)
                  if (columnsProp)
                    emit(
                      'timeClickedWithColumn',{
                        date:dateClicked,
                        column_id: columns[Math.floor(($event.offsetX / ($event.target as any).offsetWidth) * columns.length)].id!,
                      }
                    )
                }
              "
            >
              <DayEvents
                @event-clicked="emit('eventClicked', $event)"
                @event-resized="emit('eventResized', $event)"
                :start="displayHours[0]"
                :end="displayHours[1]"
                :events="getEventsForDay(date)"
                :isToday="DateTime.now().startOf('day').equals(date)"
                :columns="columnsProp && columns.filter(c => c.checked)"
                :heightInPx="dayEventsContainers[index]?.clientHeight"
              ></DayEvents>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column flex-grow-1" v-else-if="mode == 'month'">
        <MonthView
          @event-clicked="emit('eventClicked', $event)"
          @day-pressed="(currentDay = $event), (mode = 'day')"
          @week-pressed="(currentDay = $event), (mode = 'week')"
          @month-pressed="(currentDay = currentMonth), (mode = 'month')"
          :month="currentMonth"
          :big="true"
          :events="getEventsForMonth(currentMonth)"
        ></MonthView>
      </div>
      <div class="d-flex flex-column flex-grow-1" v-else-if="mode == 'year'">
        <div class="overflow-auto" style="height: 0; flex: 1 1 auto; align-items: stretch">
          <div class="row mx-0" style="margin-top: -1.5rem">
            <MonthView
              @event-clicked="emit('eventClicked', $event)"
              @day-pressed="(currentDay = $event), (mode = 'day')"
              @week-pressed="(currentDay = $event), (mode = 'week')"
              @month-pressed="(currentDay = currentYear.plus({ month: month - 1 })), (mode = 'month')"
              class="col-12 col-md-6 col-lg-4 col-xxl-3 gy-4"
              v-for="month in 12"
              :key="month"
              :month="currentYear.plus({ month: month - 1 })"
              :events="getEventsForMonth(currentYear.plus({ month: month - 1 }))"
            ></MonthView>
          </div>
        </div>
      </div>
      <div class="d-flex flex-column flex-grow-1" v-else-if="mode == 'agenda'">
        <div class="overflow-auto" style="height: 0; flex: 1 1 auto; align-items: stretch">
          <EventAgenda
            @event-clicked="emit('eventClicked', $event)"
            @day-pressed="(currentDay = $event), (mode = 'day')"
            :events="getFutureEvents(currentDay).slice(0, 25)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * TODO: jsdoc
 */
</script>

<script lang="ts" setup>
import { DateTime } from 'luxon';
import GroupSelector from './GroupSelector.vue';
import type { Event, Group, Column, Prettify } from './types';

import { computed, defineEmits, defineProps, ref, toRefs, useSlots, watchEffect } from 'vue';
import ButtonGroup from './ButtonGroup.vue';
import DayEvents from './DayEvents.vue';
import EventAgenda from './EventAgenda.vue';
import MonthView from './MonthView.vue';

import { isMobile, useGetDayClasses, useGroupColors, useElementScrollbarSize } from './utils';

import VueResizable from 'vue-resizable';
VueResizable;

const dayEventsContainers = ref<HTMLElement[]>([]);

const allViewOptions = { day: 'Tag', week: 'Woche', month: 'Monat', year: 'Jahr', agenda: 'Agenda' } as const;

const props = withDefaults(
  defineProps<{
    displayHours: [number, number];
    groups: Group[];
    columns?: Column[];
    events: Prettify<Event & { column_id: number }>[];
    hash?: string;
    viewOptions?: Record<keyof typeof allViewOptions, boolean>;
  }>(),
  {
    viewOptions: () => ({ day: true, week: true, month: true, year: true, agenda: true }),
  }
);
const { hash, events, groups: groupsProp, columns: columnsProp, displayHours, viewOptions } = toRefs(props);

const viewOptionsShort = computed(() =>
  Object.fromEntries(
    Object.entries(allViewOptions)
      .filter(([k, _]) => viewOptions.value[k as keyof typeof allViewOptions])
      .map(([k, v]) => [k, v[0] + '.'])
  )
);
const viewOptionsLong = computed(() =>
  Object.fromEntries(Object.entries(allViewOptions).filter(([k, _]) => viewOptions.value[k as keyof typeof allViewOptions]))
);

const emit = defineEmits<{
  'update:groups': [value: Group[]];
  'update:columns': [value: Column[]];
  eventClicked: [value: Omit<Event, 'id'> & { id: number | number[] }];
  eventResized: [value: { id: number | number[]; newStart: DateTime; newEnd: DateTime }];
  timeClicked: [value: DateTime];
  timeClickedWithColumn: [value: { date: DateTime; column_id: number }];
}>();

let groups = computed({ get: () => groupsProp.value, set: (groups: Group[]) => emit('update:groups', groups) });
let columns = computed({ get: () => columnsProp?.value || [], set: (columns: Column[]) => emit('update:columns', columns) });

let toggle = ref(false);
let backdropActive = ref(false);
watchEffect(() => {
  if (toggle.value) setTimeout(() => (backdropActive.value = true), 0);
  else setTimeout(() => (backdropActive.value = false), 300);
});

const weekContainer = ref<HTMLElement>();
const weekViewScrollbarSize = useElementScrollbarSize(weekContainer);
const mode = ref<'week' | 'day' | 'month' | 'year' | 'agenda'>(isMobile ? 'day' : 'month');
const timeFrame = computed(() => (mode.value == 'agenda' ? 'day' : mode.value));

const currentDay = ref(DateTime.now());

const currentWeek = computed(() =>
  Array({ day: 1, week: 7, month: null, year: null }[timeFrame.value])
    .fill(null)
    .map((_, i) => currentDay.value.startOf(timeFrame.value).plus({ days: i }))
);

const currentMonth = computed(() => currentDay.value.startOf('month'));
const currentYear = computed(() => currentDay.value.startOf('year'));

const currentDayReadable = computed(() =>
  currentDay.value.toFormat({ day: 'dd. LLLL, yyyy', week: 'LLLL, yyyy', month: 'LLLL, yyyy', year: 'yyyy' }[timeFrame.value])
);

const groupColors = useGroupColors(groups);

const eventsWithColor = computed(() =>
  events.value.map(e => ({ ...e, color: e.color || groupColors.value[groups.value.findIndex(g => g.id == e.group_id)] }))
);

const filterQuery = ref('');

const filteredEvents = computed(() =>
  eventsWithColor.value
    .filter(e => groups.value.filter(g => g.checked).some(g => g.id == e.group_id))
    .filter(e => isSubsequence(filterQuery.value, e.name))
    .sort((a, b) => (a.start > b.start ? 1 : -1))
);

function isSubsequence(search: string, str: string) {
  search = search.replace(/\W/g, '').toLowerCase();
  str = str.replace(/\W/g, '').toLowerCase();
  let searchIndex = 0;
  for (let strindex = 0; strindex < str.length && searchIndex < search.length; strindex++) if (search[searchIndex] === str[strindex]) searchIndex++;
  return searchIndex === search.length;
}

const getEventsForDay = (day: DateTime) =>
  filteredEvents.value
    .filter(e => day.toFormat('yyyy-LL-dd') >= e.start.split(' ')[0] && day.toFormat('yyyy-LL-dd') <= e.end.split(' ')[0])
    .map(e => ({
      ...e,
      start: getStartTime(day, e),
      end: getEndTime(day, e),
    }));
function getStartTime(day: DateTime, event: Event) {
  const formatedDay = day.toFormat('yyyy-LL-dd');
  if (event.start.split(' ')[0] < formatedDay) return '00:00:00';
  return event.start.split(' ')[1];
}
function getEndTime(day: DateTime, event: Event) {
  const formatedDay = day.toFormat('yyyy-LL-dd');
  if (event.end.split(' ')[0] > formatedDay) return '24:00:00';
  return event.end.split(' ')[1];
}
const getFutureEvents = (day: DateTime) =>
  filteredEvents.value.filter(e => day.startOf('day') <= DateTime.fromFormat(e.start.split(' ')[0], 'yyyy-LL-dd').startOf('day'));

const getEventsForMonth = (day: DateTime) =>
  filteredEvents.value.filter(
    e => day.toFormat('yyyy-LL') >= e.start.split(' ')[0].slice(0, -3) && day.toFormat('yyyy-LL') <= e.end.split(' ')[0].slice(0, -3)
  );

if (hash?.value) {
  const hashMode = window.location.hash.substring(1).split(':')[1];
  const hashDay = window.location.hash.substring(1).split(':')[2];
  if (['year', 'month', 'day', 'week', 'agenda'].includes(hashMode)) mode.value = hashMode as any;
  if (hashDay) currentDay.value = DateTime.fromFormat(hashDay, 'yyyy-LL-dd');
  watchEffect(() => (window.location.hash = `${window.location.hash.split(':')[0]}:${mode.value}:${currentDay.value.toFormat('yyyy-LL-dd')}`));
}

const getDayClasses = useGetDayClasses(currentDay);
</script>

<style scoped lang="scss">
@use 'common';
</style>
