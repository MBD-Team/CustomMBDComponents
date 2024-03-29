<template>
  <div class="input-contain" :class="placeholder ? 'mt-3' : ''">
    <!-- icon -->
    <div v-if="checkIcon" class="icon">
      <slot></slot>
    </div>
    <!-- /icon -->
    <input
      v-bind="$attrs"
      class="form-control shadow-none"
      type="date"
      :value="modelValue"
      @input="updateValue"
      :style="checkIcon ? 'padding-left: 1.5rem;' : 'padding-left: none;'"
      @focus="isInputFocus = true"
      @blur="isInputFocus = false"
      autocomplete="off"
    />
    <!-- placeholder -->
    <label class="text" style="max-width: 70%" :class="labelClass" v-if="placeholder">
      <div class="text-truncate">{{ placeholder }}</div>
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
 *   <DateInput v-model="date" ></DateInput>
 *
 * <!-- error just as a string -->
 *   <DateInput v-model="date" placeholder="inputTitle" :error="error"></DateInput>
 *
 * <!-- error as a object -->
 * <!-- the name has to be a key of the error Object -->
 *   <DateInput v-model="date" placeholder="inputTitle" name="date" :error="error"></DateInput>
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
const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();
const props = withDefaults(
  defineProps<{
    modelValue: string | null;
    placeholder?: string;
    name?: string;
    error?: InputError;
    errorColor?: string;
    borderColor?: string;
    labelClass?: string;
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
const { modelValue, placeholder, error, errorColor, labelClass, borderColor, autoFill, name } = toRefs(props);
onMounted(() => {
  //set standard value to current date
  if (!(modelValue.value?.length == 10) && autoFill.value) {
    updateValue(new Date().toISOString().split('T')[0]);
  }
  if (modelValue.value && modelValue.value.length > 10) {
    updateValue(new Date(modelValue.value).toISOString().substring(0, 10));
  }
});

const isInputFocus = ref(false);
const slots = useSlots();
const borderColorComputed = computed(() => (getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value));
const checkIcon = computed(() => !!slots.icon);
function updateValue(event: any) {
  if (typeof event == 'string') emit('update:modelValue', event);
  else emit('update:modelValue', event.target.value);
}
</script>
<style scoped lang="scss">
@use 'baseStyle';

input {
  background-color: v-bind(backgroundColor);
  border-color: v-bind(borderColorComputed);
}
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
    background-color: v-bind(backgroundColor);
    border-radius: 0.5rem 0.5rem 0rem 0rem;
    font-size: 0.9rem;
    padding: 0 0.3rem;
    color: black;
    transform: translate(0, -1rem);
    height: 0.9rem;
  }
}
</style>
