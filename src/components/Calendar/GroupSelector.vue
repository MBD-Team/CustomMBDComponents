<template>
  <slot></slot>
  <button
    v-if="!allGroupsChecked"
    style="padding-left: 3.75rem; padding-right: 3.75rem"
    class="btn btn-secondary ms-2 m-2"
    @click="groups.forEach(g => (g.checked = true)), emit('update:modelValue', groups)"
  >
    Alle auswählen
  </button>
  <button
    v-if="!allGroupsUnchecked"
    style="padding-left: 3.75rem; padding-right: 3.75rem"
    class="btn btn-secondary ms-2 m-2"
    @click="groups.forEach(g => (g.checked = false)), emit('update:modelValue', groups)"
  >
    Alle abwählen
  </button>
  <div style="max-height: 100vh; overflow: auto">
    <div
      class="p-1 ps-2"
      v-for="(group, index) of groups"
      :key="group.id + ''"
      @click="(group.checked = !group.checked), emit('update:modelValue', groups)"
      @dblclick="groups.forEach(g => (g.checked = false)), (group.checked = true), emit('update:modelValue', groups)"
      style="user-select: none"
    >
      <input class="form-check-input" type="checkbox" v-model="group.checked" :style="{ backgroundColor: groupColors[index], borderColor: 'grey' }" />
      <label class="form-check-label ms-3" for="flexCheckDefault">{{ group.name }}</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs } from 'vue';
import { Group } from './types';

const emit = defineEmits<{
  (e: 'update:modelValue', value: Group[]): void;
}>();

const props = defineProps<{
  modelValue: Group[];
  groupColors: string[];
}>();
const { modelValue: group, groupColors } = toRefs(props);
let groups = computed({ get: () => group.value, set: groups => emit('update:modelValue', groups) });

let allGroupsChecked = computed(() => groups.value.every(g => g.checked));
let allGroupsUnchecked = computed(() => groups.value.every(g => !g.checked));
</script>
