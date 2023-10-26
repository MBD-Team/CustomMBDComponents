<template>
  <div
    v-if="isToday"
    class="position-absolute bg-danger w-100"
    style="height: 2px; z-index: 1"
    :style="{ top: `calc(${timeStringToFraction(DateTime.now().toFormat('HH:mm'))} * 100%)` }"
  >
    <div class="bg-danger" style="height: 10px; width: 10px; border-radius: 50%; position: absolute; margin-top: -4px; margin-left: -5px"></div>
  </div>
  <vue-resizable
    v-for="event in mergedLayoutedEvents"
    :key="JSON.stringify(event)"
    dragSelector="eventCard"
    @mount="eHandler"
    @resize:move="
      resizingEvent!.start = timeStringToFraction(event.start) + pixelToFraction($event.top);
      resizingEvent!.end = timeStringToFraction(event.end) + pixelToFraction($event.height - resizingEvent?.initialHeight! + $event.top);
    "
    @resize:start="
      resizingEvent = { id: event.id, start: timeStringToFraction(event.start), end: timeStringToFraction(event.end), initialHeight: $event.height }
    "
    @resize:end="
      emit('eventResized', { id: event.id, newStart: fractionToDateTime(resizingEvent!.start), newEnd: fractionToDateTime(resizingEvent!.end) });
      resizingEvent = null;
    "
    :active="resizeableEvents ? ['b', 't'] : []"
    style="cursor: pointer"
    class="alert alert-primary p-0 border-0 rounded-0 eventCard overflow-hidden"
    :style="getEventStyle(event)!"
    @click.stop="emit('eventClicked', event)"
  >
    <div class="eventCardContent">
      <div class="ps-2">{{ event.name }}</div>
    </div>
  </vue-resizable>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon';
import { computed, defineProps, toRefs, defineEmits, ref } from 'vue';
import type { Column, Event } from './types';
import { splitConnectedGroups } from './utils';

import VueResizable from 'vue-resizable';

const props = defineProps<{
  events: (Event & { column_id?: number })[];
  start: number;
  end: number;
  isToday?: boolean;
  columns?: Column[];
  heightInPx: number;
  resizeableEvents: boolean;
}>();
const { columns, events, start, end, isToday, heightInPx } = toRefs(props);

const resizingEvent = ref<{
  id: number | number[];
  start: number;
  end: number;
  initialHeight: number;
} | null>(null);

const log = console.log;

const emit = defineEmits<{
  (e: 'eventClicked', value: Omit<Event, 'id'> & { id: number | number[] }): void;
  (e: 'eventResized', value: { id: number | number[]; newStart: DateTime; newEnd: DateTime }): void;
}>();
const layoutedEvents = computed(() => {
  function layoutEvents<T extends Event>(events: T[]) {
    const eventsOverlap = (a: T, b: T) => a.end > b.start && a.start < b.end;

    return (
      splitConnectedGroups(events, eventsOverlap)
        //layout each connected group individually
        .flatMap(events => {
          let columns: T[][] = [];
          for (let event of events) {
            //find first column where event fits
            let firstEmptyColumn = columns.find(column => column.every(e => !eventsOverlap));
            //if we found one push it there, else create new column
            if (firstEmptyColumn) firstEmptyColumn.push(event);
            else columns.push([event]);
          }
          return columns.map((column, index) => column.map((e, i) => ({ ...e, groupIndex: index, groupSize: columns.length })));
        })
        .flat()
    );
  }
  //if we have columns, we want to layout events per column individually
  if (columns?.value)
    return columns.value.flatMap((column, index, { length: numOfColumns }) =>
      layoutEvents(events.value.filter(e => e.column_id == column.id)).map(e => ({
        // also we map the groupIndex and groupSize such that it is positioned within the column and not the whole DayEvents component
        ...e,
        groupIndex: index * e.groupSize + e.groupIndex,
        groupSize: e.groupSize * numOfColumns,
      }))
    );
  //else we layout all events together
  else return layoutEvents(events.value);
});

const mergedLayoutedEvents = computed(() => {
  return splitConnectedGroups(
    layoutedEvents.value,
    (a, b) =>
      // we have the base info equal to one another
      a.name == b.name &&
      a.start == b.start &&
      a.end == b.end &&
      a.group_id == b.group_id &&
      // and their positions defined by groupIndex and groupSite (which are like a fractional position groupIndex/groupSize with width of 1/groupSize) are adjacent
      ((a.groupIndex + 1) * b.groupSize == b.groupIndex * a.groupSize || //
        (b.groupIndex + 1) * a.groupSize == a.groupIndex * b.groupSize)
  ).map(events => {
    let minMax = events.reduce(
      (acc, event) => ({
        min: {
          groupIndex: acc.min.groupIndex / acc.min.groupSize < event.groupIndex / event.groupSize ? acc.min.groupIndex : event.groupIndex,
          groupSize: acc.min.groupIndex / acc.min.groupSize < event.groupIndex / event.groupSize ? acc.min.groupSize : event.groupSize,
        },
        max: {
          groupIndex: acc.max.groupIndex / acc.max.groupSize < event.groupIndex / event.groupSize ? event.groupIndex : acc.max.groupIndex,
          groupSize: acc.max.groupIndex / acc.max.groupSize < event.groupIndex / event.groupSize ? event.groupSize : acc.max.groupSize,
        },
      }),
      { min: { groupIndex: 1, groupSize: 0 }, max: { groupIndex: -1, groupSize: 0 } }
    );
    return {
      ...events[0], //
      id: events.length > 1 ? events.map(e => e.id) : events[0].id,
      column_id: events.length > 1 ? events.map(e => e.column_id) : events[0].column_id,
      groupIndex: minMax.min.groupIndex,
      groupSize: minMax.min.groupSize,
      width: ((minMax.max.groupIndex + 1) / minMax.max.groupSize) * minMax.min.groupSize - minMax.min.groupIndex,
    };
  });
});
function eHandler(data) {
  console.log(data);
}
function fractionToDateTime(fraction: number) {
  return DateTime.fromObject({
    hour: Math.floor(fraction * (end.value - start.value) + start.value),
    minute: Math.floor(((fraction * (end.value - start.value) + start.value) % 1) * 60),
  });
}
function timeStringToFraction(time: string) {
  return (parseInt(time.split(':')[0]) + parseInt(time.split(':')[1]) / 60 - start.value) / (end.value - start.value);
}
function pixelToFraction(pixel: number) {
  return pixel / heightInPx.value;
}

function getEventStyle(
  event: Pick<Event, 'start' | 'end' | 'color' | 'background'> & {
    groupSize: number;
    groupIndex: number;
    width: number;
    id: number | number[];
  }
) {
  let start = timeStringToFraction(event.start);
  let end = timeStringToFraction(event.end);
  let zIndex = 'unset';
  if (JSON.stringify(event.id) == JSON.stringify(resizingEvent.value?.id)) {
    start = resizingEvent.value!.start;
    end = resizingEvent.value!.end;
    zIndex = '1';
  }
  return {
    top: `calc(${start} * 100%)`,
    left: `calc(calc(100% - ${columns ? 0 : 10}px) / ${event.groupSize / event.groupIndex})`,
    width: `calc(calc(calc(100% - ${columns ? 0 : 10}px) / ${event.groupSize}) * ${event.width})`,
    height: `calc(${end - start} * 100%)`,
    position: 'absolute',
    fontSize: '10px',
    zIndex,
    background:
      event.color +
      ' ' +
      (event.background == 'stripes'
        ? `repeating-linear-gradient(
        135deg,
        transparent,
        transparent 4px,
        #FFFFFF80 4px,
        #FFFFFF80 8px
      )`
        : event.background == 'dots'
        ? `radial-gradient(#FFFFFF80 30%, transparent 30%)`
        : ''),
    'background-size': event.background == 'dots' ? '8px 8px' : undefined,
  };
}
</script>

<style scoped lang="scss">
.eventCard {
  [draggable='true'] {
    cursor: move;
  }
  color: rgb(71, 71, 71);
  box-shadow: #1a090940 -2px 1px 3px, #aaaaaa40 0 -1px 3px;
}
.eventCardContent {
  height: 100%;
  margin: 0 0 0 2px;
  background-color: #ffffffe5;
  display: flex;
  flex-direction: column;
  &:hover {
    background-color: #ffffffa1;
  }
  transition: 0.15s;
}
</style>
