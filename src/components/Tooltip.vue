<template>
  <div :data-title="tooltip" v-if="tooltip">
    <slot></slot>
  </div>
  <template v-else>
    <slot></slot>
  </template>
</template>
<script setup lang="ts">
import { computed, toRefs } from 'vue';

const props = withDefaults(
  defineProps<{
    tooltip?: string;
    tooltipColor?: string;
    tooltipBgColor?: string;
    direction?: 'bottom' | 'top' | 'left' | 'right';
  }>(),
  {
    tooltip: '',
    tooltipColor: 'black',
    tooltipBgColor: '#eee',
    direction: 'bottom',
  }
);
const { direction } = toRefs(props);

const top = computed(() => directionStyles.value.top);
const left = computed(() => directionStyles.value.left);
const right = computed(() => directionStyles.value.right);
const bottom = computed(() => directionStyles.value.bottom);
const directionStyles = computed(() => {
  switch (direction.value) {
    default:
    case 'bottom':
      return {
        top: 'calc(100% + 0.2rem)',
        left: '2rem',
        bottom: 'auto',
        right: 'auto',
      };
    case 'top':
      return {
        top: 'auto',
        left: '2rem',
        bottom: 'calc(100% + 0.2rem)',
        right: 'auto',
      };
    case 'left':
      return {
        top: '-2px',
        left: 'auto',
        bottom: 'auto',
        right: 'calc(100% + 0.2rem)',
      };
    case 'right':
      return {
        top: '-2px',
        left: 'calc(100% + 0.2rem)',
        bottom: 'auto',
        right: 'auto',
      };
  }
});

const { tooltip } = toRefs(props);
</script>
<style lang="scss" scoped>
[data-title]:hover:after {
  display: block;
}
[data-title]:after {
  content: '' attr(data-title);
  background-color: v-bind(tooltipBgColor);
  color: v-bind(tooltipColor);
  font-size: 0.8rem;
  position: absolute;
  padding: 1px 5px 1px 5px;
  top: v-bind(top);
  left: v-bind(left);
  bottom: v-bind(bottom);
  right: v-bind(right);
  white-space: pre;
  box-shadow: 1px 1px 1px #222222;
  display: none;
  border: 1px solid #111111;
  border-radius: 0.5rem;
  z-index: 99999;
}
[data-title] {
  position: relative;
}
</style>

<script lang="ts">
/**
 * how to use:
 * ```html
* <div class="d-flex">
    <Tooltip tooltip="infotext" tooltip-color="white" tooltip-bg-color="black" direction="right">
      <div>text that needs extra info</div>
    </Tooltip>
  </div>
 * ```
 */
export default {};
</script>
