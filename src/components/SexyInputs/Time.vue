<template>
  <div class="input-contain" :style="{ backgroundColor: backgroundColor }" :class="placeholder ? 'mt-3' : ''">
    <!-- icon -->
    <div v-if="checkIcon" class="icon">
      <slot name="icon"></slot>
    </div>
    <!-- /icon -->
    <input
      v-bind="$attrs"
      class="form-control shadow-none"
      type="time"
      :value="modelValue"
      @input="updateValue"
      :style="checkIcon ? 'padding-left: 1.5rem;' : 'padding-left: none;'"
      @focus="isInputFocus = true"
      @blur="isInputFocus = false"
      autocomplete="off"
    />
    <!-- placeholder -->
    <label class="text" :class="labelClass" v-if="placeholder">
      {{ placeholder }}
    </label>
    <!-- /placeholder -->
    <!-- error -->
    <Error :error="error" :error-color="errorColor" :name="name" />
    <!-- /error -->
  </div>
</template>
<script lang="ts">
/**
 * ```js
 * const date = ref('')
 * const error = ref<string|{[key:string]:string}>('')
 * ```
 * ```html
 *
 *   <TimeInput v-model="date" ></TimeInput>
 *
 * <!-- error just as a string -->
 *   <TimeInput v-model="date" placeholder="inputTitle" :error="error"></TimeInput>
 *
 * <!-- error as a object -->
 * <!-- the name has to be a key of the error Object -->
 *   <TimeInput v-model="date" placeholder="inputTitle" name="date" :error="error"></TimeInput>
 * ```
 */
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, onMounted, ref, toRefs, useSlots } from 'vue';
import Error from './common/Error.vue';
import { getErrorMessage, InputError } from './Index';
const emit = defineEmits(['update:modelValue']);
const props = withDefaults(
  defineProps<{
    modelValue: string | null;
    name?: string;
    error?: InputError;
    errorColor?: string;
    labelClass?: string;
    placeholder?: string;
    borderColor?: string;
    autoFill?: boolean;
    backgroundColor?: string;
  }>(),
  {
    placeholder: '',
    error: '',
    errorColor: 'red',
    sideWidth: '20%',
    autoFill: false,
    name: '',
    backgroundColor: '#f8fafc',
  }
);
const { modelValue, error, errorColor, labelClass, placeholder, borderColor, autoFill, name } = toRefs(props);
onMounted(() => {
  //set standard value to current time
  if (modelValue.value?.length != 5 && autoFill.value) {
    const date = new Date();
    let time = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    updateValue(time);
  }
  if (modelValue.value?.length == 8) {
    let time = modelValue.value?.slice(0, 5);
    updateValue(time);
  }
  if (modelValue.value && modelValue.value.length > 10) {
    const date = new Date(modelValue.value);
    let time = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
    updateValue(time);
  }
});

const isInputFocus = ref(false);
const slots = useSlots();

const borderColorComputed = computed(() => {
  return getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value;
});
const checkIcon = computed(() => {
  return !!slots.icon;
});
function updateValue(event: any) {
  if (typeof event == 'string') emit('update:modelValue', event);
  else emit('update:modelValue', event.target.value);
}
</script>
<style scoped lang="scss">
@use 'baseStyle';

.input-contain {
  input {
    background-color: v-bind(backgroundColor);
    padding-top: 0.4rem;
    cursor: pointer;
    &::-webkit-calendar-picker-indicator {
      display: flex;
      justify-content: end;
      cursor: pointer;
      height: 1.5rem;
      width: 1.5rem;
    }
  }
  input + .text {
    align-items: center;
    position: absolute;
    top: 0.5rem;
    bottom: 0;
    left: 0;
    display: flex;
    pointer-events: none;
    margin: 0 0.6rem;
    background-color: inherit;
    border-radius: 0.5rem 0.5rem 0rem 0rem;
    font-size: 0.9rem;
    padding: 0 0.3rem;
    color: black;
    transform: translate(0, -1rem);
    height: 0.9rem;
  }
}
</style>
