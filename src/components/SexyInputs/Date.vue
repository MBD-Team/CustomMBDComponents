<template>
  <div class="input-contain mt-3">
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
      required
    />
    <!-- placeholder -->
    <label class="text" :class="labelClass">
      {{ placeholder }}
    </label>
    <!-- /placeholder -->
    <!-- error -->
    <Error :error="error" :error-color="errorColor" :name="name" />
    <!-- /error -->
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, onMounted, ref, toRefs, useSlots } from 'vue';
import Error from './common/Error.vue';
import { getErrorMessage } from './Index';
const emit = defineEmits(['update:modelValue']);
const props = withDefaults(
  defineProps<{
    modelValue: string;
    placeholder: string;
    name?: string;
    error?: { [key: string]: string | string[] } | string;
    errorColor?: string;
    borderColor?: string;
    labelClass?: string;
    autoFill?: boolean;
  }>(),
  {
    error: '',
    errorColor: 'red',
    sideWidth: '20%',
    autoFill: false,
    name: '',
  }
);
const { modelValue, placeholder, error, errorColor, labelClass, borderColor, autoFill, name } = toRefs(props);
onMounted(() => {
  //set standard value to current date
  if (modelValue.value.length != 10 && autoFill.value) {
    updateValue(new Date().toISOString().split('T')[0]);
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
.input-contain {
  position: relative;
  border-radius: 0.5rem;

  .icon {
    background-color: transparent;
    position: absolute;
    top: 0.5rem;
    left: 0.3rem;
    z-index: 2;
  }
  input {
    text-align: start;
    padding-left: 1rem;
    padding-top: 0.4rem;
    height: 2.5rem;
    width: 100%;
    border: 1px solid;
    border-color: v-bind(borderColorComputed);
    border-radius: 0.5rem;
    cursor: pointer;
    &:hover:not(:focus) + .text,
    &:hover:not(:focus) {
      @media (pointer: fine) {
        filter: brightness(95%);
      }
    }
    &:focus {
      border-width: 2px;
    }
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
    height: min-content;
    display: flex;
    color: gray;
    pointer-events: none;
    font-size: 1rem;
    padding: 0 0rem;
    margin: 0 0.6rem;
    border-radius: 0.5rem;
  }
  input + .text {
    background-color: white;
    border-radius: 0.5rem 0.5rem 0rem 0rem;
    font-size: 0.9rem;
    padding: 0 0.3rem;
    color: black;
    transform: translate(0, -1rem);
    height: 0.9rem;
  }
}
</style>
