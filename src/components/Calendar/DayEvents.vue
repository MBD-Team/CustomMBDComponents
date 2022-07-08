<template>
  <div
    v-if="isToday"
    class="position-absolute bg-danger w-100"
    style="height: 2px"
    :style="{ top: `calc(${getHoursFraction(DateTime.now().toFormat('HH:mm'))} * 100%)` }"
  >
    <div class="bg-danger" style="height: 10px; width: 10px; border-radius: 50%; position: absolute; margin-top: -4px; margin-left: -5px"></div>
  </div>
  <div
    v-for="event in layoutedEvents"
    :key="JSON.stringify(event)"
    style="cursor: pointer"
    class="alert alert-primary p-0 border-0 rounded-0 eventCard overflow-hidden"
    :style="getEventStyle(event)"
    draggable="true"
    @click.stop="emit('eventClicked', event)"
  >
    <div class="eventCardContent">
      <div class="ps-2">{{ event.name }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon';
import { computed, defineProps, toRefs, defineEmits } from 'vue';
import type { Event } from './Calendar.vue';

const props =
  defineProps<{
    events: Event[];
    start: number;
    end: number;
    isToday?: boolean;
  }>();
const { events, start, end, isToday } = toRefs(props);

const emit =
  defineEmits<{
    (e: 'eventClicked', value: Event): void;
  }>();

const layoutedEvents = computed(() => {
  function collidesWith(a: Event, b: Event) {
    return a.end > b.start && a.start < b.end;
  }

  let groups: Event[][] = [];
  for (let event of events.value) {
    //find groups where it overlaps in
    let groupsCollisions = groups.filter(group => group.some(e => collidesWith(e, event)));

    //if we found at least one combine the grups and push it there, else create new group
    if (groupsCollisions.length > 0) {
      let newGroup = [...groupsCollisions.flat(), event];

      for (let group of groupsCollisions) group.splice(0, group.length);

      groupsCollisions[0].splice(0, groupsCollisions.length, ...newGroup);
    } else groups.push([event]);
  }

  return groups.flatMap(events => {
    let columns: Event[][] = [];
    for (let event of events) {
      //find first column where event fits
      let firstEmptyColumn = columns.find(column => column.every(e => !collidesWith(e, event)));
      //if we found one push it there, else create new column
      if (firstEmptyColumn) firstEmptyColumn.push(event);
      else columns.push([event]);
    }
    return columns.map((column, index) => column.map((e, i) => ({ ...e, groupIndex: index, groupSize: columns.length }))).flat();
  });
});

function getHoursFraction(time: string) {
  return (parseInt(time.split(':')[0]) + parseInt(time.split(':')[1]) / 60 - start.value) / (end.value - start.value);
}

function getEventStyle(
  event: Event & {
    groupSize: number;
    groupIndex: number;
  }
) {
  let start = getHoursFraction(event.start);
  let end = getHoursFraction(event.end);

  return {
    top: `calc(${start} * 100%)`,
    left: `calc(calc(100% - 10px) / ${event.groupSize / event.groupIndex})`,
    width: `calc(calc(100% - 10px) / ${event.groupSize})`,
    height: `calc(${end - start} * 100%)`,
    position: 'absolute',
    fontSize: '10px',
    backgroundColor: event.color,
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
  margin: 0 0 0 4px;
  background-color: #ffffffe5;
  display: flex;
  flex-direction: column;
  &:hover {
    background-color: #ffffffa1;
  }
  transition: 0.15s;
}
</style>
