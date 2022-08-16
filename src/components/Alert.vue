<template>
  <div v-if="show.show" @click="dismiss()" class="alert" :class="alertClass" role="alert">
    <button v-if="closeBtn && dissmissable" style="float: right" type="button" class="btn-close shadow-none" aria-label="Close"></button>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { toRefs, watchEffect } from 'vue';

const props = withDefaults(
  defineProps<{
    alertClass?: string;
    show: { show: boolean };
    dissmissable?: boolean;
    timer?: number;
    closeBtn?: boolean;
  }>(),
  {
    alertClass: 'alert-primary',
    timer: 5000,
    dissmissable: true,
    closeBtn: true,
  }
);
const { alertClass, show, timer, dissmissable, closeBtn } = toRefs(props);

let timeout: any;

watchEffect(() => {
  if (show.value.show) {
    if (timer.value == 0) return;
    timeout = setTimeout(() => {
      show.value.show = false;
      dismiss();
    }, timer.value);
  }
});

function dismiss() {
  if (dissmissable.value) {
    show.value.show = false;
    clearTimeout(timeout);
  }
}
</script>
<style lang="scss" scoped>
.alert {
  border-radius: 0.5rem;
}
</style>
