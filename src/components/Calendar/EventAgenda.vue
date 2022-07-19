<template>
  <div v-for="date of dates" :key="date.toISO()" class="d-flex border-bottom p-2 flex-wrap">
    <div class="d-flex align-items-center mb-3 mb-md-0" style="flex-basis: 170px; flex-shrink: 0; cursor: pointer" @click="emit('dayPressed', date)">
      <div class="display-5">{{ date.day }}</div>
      <div class="ms-2">
        <div>{{ date.weekdayLong }}</div>
        <div>{{ date.monthShort }} {{ date.year }}</div>
      </div>
    </div>
    <div class="flex-grow-1">
      <div v-for="event of events.filter(e => e.start.split(' ')[0] == date.toFormat('yyyy-LL-dd'))" :key="event.id" class="mb-2 d-flex">
        <div style="flex-basis: 135px; flex-shrink: 0">
          {{ DateTime.fromFormat(event.start, 'yyyy-LL-dd HH:mm:ss').toFormat('HH:mm') }}
          -
          {{ DateTime.fromFormat(event.end, 'yyyy-LL-dd HH:mm:ss').toFormat('HH:mm') }}
        </div>
        <div class="flex-grow-1" style="cursor: pointer; flex-basis: 100px" @click="emit('eventClicked', event)">
          <div class="align-items-center">
            <div class="d-inline-block rounded-circle me-1" style="width: 0.6em; height: 0.6em" :style="'background-color:' + event.color"></div>
            <div class="d-inline">{{ event.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="dates.length == 0" class="p-2 h-100 w-100 d-flex align-items-center justify-content-center">nichts bevorstehend</div>
</template>

<script lang="ts" setup>
import { computed, defineProps, defineEmits, toRefs } from 'vue';
import { DateTime } from 'luxon';
import type { Event } from '../../utils/types';

const props =
  defineProps<{
    events: Event[];
  }>();
const { events } = toRefs(props);

const emit =
  defineEmits<{
    (e: 'dayPressed', value: DateTime): void;
    (e: 'eventClicked', value: Event): void;
  }>();

const dates = computed(() =>
  [...new Set(events.value.map(e => e.start.split(' ')[0]))].sort().map(d => DateTime.fromFormat(d, 'yyyy-LL-dd').startOf('day'))
);
</script>

<style scoped lang="scss"></style>
