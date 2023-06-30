<template>
  <div class="d-flex">
    <label v-if="textLeft" class="me-3" :for="id" style="cursor: pointer"><slot></slot></label>
    <div class="round">
      <input v-bind="$attrs" type="checkbox" :id="id" :value="modelValue" @change="updateValue" :checked="modelValue || value" />
      <label :for="id"></label>
    </div>
    <label v-if="!textLeft" class="ms-3" :for="id" style="cursor: pointer"><slot></slot></label>
  </div>
  <Error :error="error" :error-color="errorColor" :name="name" />
</template>
<script lang="ts">
/**
 * how to use:
 * ```js
 * const checked = ref(false)
 * const error = ref<string|{[key:string]:string}>('')
 * ```
 * ```html
 *
 * <CheckboxInput :v-model="checked">label</CheckboxInput>
 *
 * <CheckboxInput :v-model="checked" :error="error" >label</CheckboxInput>
 *
 * <!-- the name has to be a key of the error Object -->
 * <CheckboxInput :v-model="checked" name="checked" :error="error" textLeft errorColor="blue">label</CheckboxInput>
 * ```
 */
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import Error from './common/Error.vue';
import { getErrorMessage, InputError } from './Index';
const emit = defineEmits(['update:modelValue']);
const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    name?: string;
    error?: InputError;
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
const borderColorComputed = computed(() => (getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value));
</script>
<style scoped lang="scss">
@use 'checkBoxStyle';
.round label {
  border-color: v-bind(borderColorComputed);
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
