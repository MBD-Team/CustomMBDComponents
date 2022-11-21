<template>
  <div class="d-flex mb-2">
    <label v-if="textLeft" class="me-3" :for="id" style="cursor: pointer"><slot></slot></label>
    <div class="round">
      <input type="checkbox" :id="id" :value="modelValue" @change="updateValue" :checked="modelValue || value" />
      <label :for="id"></label>
    </div>
    <label v-if="!textLeft" class="ms-3" :for="id" style="cursor: pointer"><slot></slot></label>
  </div>
  <Error :error="error" :error-color="errorColor" :name="name" />
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import Error from './common/Error.vue';
import { getErrorMessage } from './Index';
const emit = defineEmits(['update:modelValue']);
const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    name?: string;
    error?: { [key: string]: string | string[] } | string;
    textLeft?: boolean;
    errorColor?: string;
    borderColor?: string;
    value?: boolean;
  }>(),
  { errorColor: 'red', borderColor: '#ccc', error: '', name: '', textLeft: false, modelValue: false, value: false }
);
const id = ref(JSON.stringify(Math.random()));
const { modelValue, error, errorColor, borderColor, name, value } = toRefs(props);
function updateValue() {
  emit('update:modelValue', !modelValue.value);
}
const borderColorComputed = computed(() => {
  return getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value;
});
</script>
<style scoped lang="scss">
.round {
  position: relative;
  scale: 0.7;
}
.round label {
  background-color: #fff;
  border: 1px solid #ccc;
  border-color: v-bind(borderColorComputed);
  border-radius: 50%;
  cursor: pointer;
  height: 28px;
  left: 0;
  position: absolute;
  top: 0;
  width: 28px;
}
.round label:after {
  border: 2px solid #fff;
  border-top: none;
  border-right: none;
  content: '';
  height: 6px;
  left: 7px;
  opacity: 0;
  position: absolute;
  top: 8px;
  transform: rotate(-45deg);
  width: 12px;
}
.round input[type='checkbox'] {
  visibility: hidden;
}
.round input[type='checkbox']:checked + label {
  background-color: #66bb6a;
  border-color: #66bb6a;
}
.round input[type='checkbox']:checked + label:after {
  opacity: 1;
}
</style>
