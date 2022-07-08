<template>
  <div class="btn-group w-100" role="group">
    <template v-for="key of Object.keys(options)" :key="key">
      <input type="radio" v-model="vModel" :value="key" class="btn-check" :id="name + key" />
      <label class="btn btn-outline-secondary shadow-none" :class="className" :for="name + key">{{ options[key] }}</label>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, defineEmits, computed } from 'vue';

const emit = defineEmits(['update:modelValue']);

// eslint-disable-next-line no-undef
const props = withDefaults(
  defineProps<{
    modelValue: string;
    options: {
      [x: string]: string;
    };
    class?: string;
    name?: string;
  }>(),
  {
    name: 'radio' + Math.random(),
    class: 'btn-outline-secondary',
  }
);
const { modelValue, options, name, class: className } = toRefs(props);

const vModel = computed({
  get() {
    return modelValue.value;
  },
  set(value: string) {
    emit(`update:modelValue`, value);
  },
});
</script>

<style scoped lang="scss">
.btn-sm {
  width: 20%;
}
</style>
