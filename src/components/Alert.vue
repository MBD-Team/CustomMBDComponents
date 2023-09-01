<template>
  <div v-if="modelValue" @click="if (!closeBtn) dismiss();" class="alert" :class="alertClass" role="alert">
    <button
      @click="dismiss"
      v-if="closeBtn && dismissable"
      style="float: right"
      type="button"
      class="btn-close shadow-none"
      aria-label="Close"
    ></button>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { toRefs, watchEffect } from 'vue';

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const props = withDefaults(
  defineProps<{
    class?: string;
    dismissable?: boolean;
    timer?: number;
    closeBtn?: boolean;
    modelValue: boolean;
  }>(),
  {
    class: 'alert-primary',
    timer: 0,
    dismissable: true,
    closeBtn: true,
  }
);
const { class: alertClass, timer, dismissable, closeBtn, modelValue } = toRefs(props);

function updateValue(value: boolean) {
  emit('update:modelValue', value);
}
let timeout: any;

watchEffect(() => {
  if (modelValue.value) {
    if (timer.value == 0) return;
    timeout = setTimeout(() => {
      updateValue(false);
      dismiss();
    }, timer.value);
  }
});

function dismiss() {
  if (dismissable.value) {
    updateValue(false);
    clearTimeout(timeout);
  }
}
</script>
<style lang="scss" scoped>
.alert {
  border-radius: 0.5rem;
}
</style>

<script lang="ts">
/**
 * ```js
 * const showAlert = ref(false)
 * const text = ref('')
 *
 * ```
 * ```html
 *
 *    <Alert v-model="showAlert">alertMessage</Alert>
 *
 *    <Alert :model-value="!!text" @update:model-value="text = ''" class="alert-danger">{{ text }}</Alert>
 * ```
 */
export default {};
</script>
