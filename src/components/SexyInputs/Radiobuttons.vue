<template>
  <div :class="row ? 'row' : ''">
    <div v-for="option of options" :key="JSON.stringify(option)">
      <Tooltip :tooltip="option.tooltip" :direction="row ? 'bottom' : 'right'">
        <div class="d-flex mb-2">
          <div class="round">
            <input
              type="radio"
              :name="id"
              :id="option.text + id"
              :value="option.value"
              @change="updateValue"
              :checked="modelValue == option.value"
              :disabled="disabled"
            />
            <label :for="option.text + id"></label>
          </div>
          <label class="ms-3" :for="option.text + id" style="cursor: pointer">{{ option.text }}</label>
        </div>
      </Tooltip>
    </div>
  </div>
  <Error :error="error" :error-color="errorColor" :name="name" />
</template>
<script lang="ts">
/**
 * TODO: jsdoc
 * FIXME: experimental
 */
</script>
<script setup lang="ts" generic="TVal extends string | number | boolean">
import { computed, ref, toRefs } from 'vue';
import Error from './common/Error.vue';
import Tooltip from '../Tooltip.vue';
import { getErrorMessage, InputError } from './Index';
const emit = defineEmits<{
  'update:modelValue': [value: TVal];
}>();
const props = withDefaults(
  defineProps<{
    modelValue: TVal;
    options: { text: string; value: TVal; tooltip?: string }[];
    row?: boolean;
    name?: string;
    error?: InputError;
    errorColor?: string;
    borderColor?: string;
    disabled?: boolean;
  }>(),
  {
    row: false,
    error: '',
    errorColor: 'red',
    borderColor: '#ccc',
    name: '',
    disabled: false,
  }
);
const { modelValue, options, row, error, errorColor, borderColor, name } = toRefs(props);
const id = ref(JSON.stringify(Math.random()));
function updateValue(event: any) {
  emit('update:modelValue', event?.target.value);
}
const buttonCount = computed(() => {
  return options.value.length;
});
const borderColorComputed = computed(() => (getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value));
</script>
<style scoped lang="scss">
@use 'checkBoxStyle';
.round label {
  border-color: v-bind(borderColorComputed);
}
.row {
  display: grid;
  grid-template-columns: repeat(v-bind(buttonCount), 1fr);
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
