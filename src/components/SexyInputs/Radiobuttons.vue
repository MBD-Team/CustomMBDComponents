<template>
  <div :class="row ? 'row' : ''">
    <div v-for="option of options" :key="JSON.stringify(option)">
      <Tooltip :tooltip="option.tooltip" :direction="row ? 'bottom' : 'right'">
        <div class="d-flex mb-2">
          <div class="round">
            <input type="radio" :name="id" :id="option.text + id" :value="option.value" @change="updateValue" :checked="modelValue == option.value" />
            <label :for="option.text + id"></label>
          </div>
          <label class="ms-3" :for="option.text + id" style="cursor: pointer">{{ option.text }}</label>
        </div>
      </Tooltip>
    </div>
  </div>
  <Error :error="error" :error-color="errorColor" :name="name" />
</template>
<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import Error from './common/Error.vue';
import Tooltip from '../Tooltip.vue';
import { getErrorMessage, InputError } from './Index';
const emit = defineEmits(['update:modelValue']);
const props = withDefaults(
  defineProps<{
    modelValue: string | number | boolean;
    options: { text: string; value: string | number | boolean; tooltip?: string }[];
    row?: boolean;
    name?: string;
    error?: InputError;
    errorColor?: string;
    borderColor?: string;
  }>(),
  {
    row: false,
    error: '',
    errorColor: 'red',
    borderColor: '#ccc',
    name: '',
  }
);
const { modelValue, options, row, error, errorColor, borderColor, name } = toRefs(props);
const id = ref(JSON.stringify(Math.random()));
function updateValue(event: any) {
  emit('update:modelValue', event?.target.value);
}
const number = computed(() => {
  return options.value.length;
});
const borderColorComputed = computed(() => {
  return getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value;
});
</script>
<style scoped lang="scss">
@use 'checkBoxStyle';
.round label {
  border-color: v-bind(borderColorComputed);
}
.row {
  display: grid;
  grid-template-columns: repeat(v-bind(number), 1fr);
}
.round input[type='radio'] {
  visibility: hidden;
}
.round input[type='radio']:checked + label {
  background-color: #66bb6a;
  border-color: #66bb6a;
}
.round input[type='radio']:checked + label:after {
  opacity: 1;
}
</style>
