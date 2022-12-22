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
        <ButtonGroup
          v-model="mode"
          :options="{ day: 'Tag', week: 'Woche', month: 'Monat', year: 'Jahr', agenda: 'Agenda' }"
          name="type"
        ></ButtonGroup>
      </div>
      <div class="d-block d-sm-none mb-2 w-100">
        <ButtonGroup v-model="mode" :options="{ day: 'T.', week: 'W.', month: 'M.', year: 'J.', agenda: 'A.' }" name="type"></ButtonGroup>
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
        <GroupSelector v-model="groups" :groupColors="groupColors" />
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
            :style="{ 'padding-right': weekViewScrollbarSize() + 'px' }"
          >
            <div
              v-for="date of currentWeek"
              :key="date.toISODate()"
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
            </div>
          </div>
          <!-- date content -->
          <div class="overflow-auto d-flex flex-row" id="weekContainer" style="height: 0; flex: 1 1 auto; align-items: stretch">
            <div class="timeaxis-container" :style="{ '--num-of-hours': displayHours[1] - displayHours[0] }">
              <div v-for="num of displayHours[1] - displayHours[0] - 1" class="timeaxis" :key="num">
                {{ ('0' + (num + displayHours[0])).slice(-2) }}:00
              </div>
            </div>

            <div
              v-for="date of currentWeek"
              :style="{ '--num-of-hours': displayHours[1] - displayHours[0] }"
              :key="date.toISODate()"
              class="w-100 day-background position-relative overflow-hidden"
              @click="
                emit(
                  'timeClicked',
                  date.plus({
                    hours:
                      Math.floor(
                        (($event.offsetY / ($event.target as any).offsetHeight) * (displayHours[1] - displayHours[0]) + displayHours[0]) * 4
                      ) / 4,
                  })
                )
              "
            >
              <DayEvents
                @event-clicked="emit('eventClicked', $event)"
                :start="displayHours[0]"
                :end="displayHours[1]"
                :events="getEventsForDay(date)"
                :isToday="DateTime.now().startOf('day').equals(date)"
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

<script lang="ts"></script>

<script lang="ts" setup>
import { DateTime } from 'luxon';
import GroupSelector from './GroupSelector.vue';
import type { Event, Group } from './types';

import { computed, defineEmits, defineProps, ref, toRefs, watchEffect } from 'vue';
import ButtonGroup from './ButtonGroup.vue';
import DayEvents from './DayEvents.vue';
import EventAgenda from './EventAgenda.vue';
import MonthView from './MonthView.vue';

import { isMobile, useGetDayClasses, useGroupColors, weekViewScrollbarSize } from './utils';

function log(a: any) {
  console.log(a);
}
const props = defineProps<{
  displayHours: [number, number];
  groups: Group[];
  events: Event[];
  hash?: string;
}>();
const { hash, events, groups: groupsProp, displayHours } = toRefs(props);

const emit = defineEmits<{
  (e: 'update:groups', value: Group[]): void;
  (e: 'eventClicked', value: Event): void;
  (e: 'timeClicked', value: DateTime): void;
}>();

let groups = computed({ get: () => groupsProp.value, set: (groups: Group[]) => emit('update:groups', groups) });

let toggle = ref(false);
let backdropActive = ref(false);
watchEffect(() => {
  if (toggle.value) setTimeout(() => (backdropActive.value = true), 0);
  else setTimeout(() => (backdropActive.value = false), 300);
});

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
    .filter(e => e.name.includes(filterQuery.value))
    .sort((a, b) => (a.start > b.start ? 1 : -1))
);

const getEventsForDay = (day: DateTime) =>
  filteredEvents.value
    .filter(e => day.toFormat('yyyy-LL-dd') == e.start.split(' ')[0])
    .map(e => ({
      ...e,
      start: e.start.split(' ')[1],
      end: e.end.split(' ')[1],
    }));

const getFutureEvents = (day: DateTime) =>
  filteredEvents.value.filter(e => day.startOf('day') <= DateTime.fromFormat(e.start.split(' ')[0], 'yyyy-LL-dd').startOf('day'));

const getEventsForMonth = (day: DateTime) =>
  filteredEvents.value.filter(e => day.startOf('month').equals(DateTime.fromFormat(e.start.split(' ')[0], 'yyyy-LL-dd').startOf('month')));

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
