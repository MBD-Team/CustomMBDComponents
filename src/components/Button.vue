<template>
  <a
    v-if="href"
    :href="href"
    v-bind="$attrs"
    :style="sideButton ? 'border-left:none; width:100%; padding:none;border-radius: 0 0.5rem 0.5rem 0;border-width: 1px;' : ''"
    class="d-flex align-items-center justify-content-center"
    :class="class"
  >
    <slot></slot>
  </a>
  <button
    v-else
    v-bind="$attrs"
    :disabled="loading || disabled"
    :style="sideButton ? 'border-left:none; width:100%; padding:none;border-radius: 0 0.5rem 0.5rem 0;border-width: 1px;' : ''"
    :class="class"
  >
    <Spinner v-if="loading" :color="spinnerColor" class="me-2" :size="spinnerSize"></Spinner>
    <slot></slot>
  </button>
</template>
<script lang="ts">
/**
 * ```html
 *      <!-- usable with href as link -->
 *
 *     <Button :disabled="true">buttonText</Button>
 *
 *     <Button :loading="true">buttonText</Button>
 *
 *      <!-- if used as input sidebutton -->
 *     <Button sideButton>buttonText</Button>
 * ```
 */
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { toRefs } from 'vue';
import Spinner from './Spinner.vue';

const props = withDefaults(
  defineProps<{
    spinnerColor?: 'primary' | 'secondary' | 'light' | 'dark' | 'danger' | 'warning' | 'info' | 'success' | '';
    spinnerSize?: string;
    loading?: boolean;
    disabled?: boolean;
    href?: string;
    sideButton?: boolean;
    class?: string;
  }>(),
  {
    spinnerColor: '',
    spinnerSize: '1em',
    loading: false,
    sideButton: false,
    disabled: false,
    class: 'btn btn-primary',
  }
);
const { spinnerColor, spinnerSize } = toRefs(props);
</script>
<style scoped lang="scss">
button,
a {
  width: fit-content;
  box-shadow: none !important;
  min-height: 2.5rem;
  padding-inline: 0.8rem;
  font-size: 1rem;
  line-height: 1rem;
  border-radius: 0.5rem;
  transition: all 0.25s ease-out;
  &:hover {
    @media (pointer: fine) {
      filter: brightness(95%);
    }
  }
  &:active {
    @media (pointer: fine) {
      filter: brightness(85%);
    }
    @media (pointer: coarse) {
      filter: brightness(85%);
    }
  }
  &:disabled,
  &[disabled] {
    filter: grayscale(50%);
  }
}
.default {
  background-color: #f8fafc;
  border: 1px solid black;
}
.sideButtonSelect {
  > button {
    border-radius: 0 0.5rem 0 0 !important;
  }
}
</style>
