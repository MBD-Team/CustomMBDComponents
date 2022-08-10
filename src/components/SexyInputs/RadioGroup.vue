<template>
  <div class="buttonGroup">
    <button
      v-for="option of options"
      class="button shadow-none"
      v-bind="$attrs"
      :class="modelValue == option.value ? activeClass : defaultClass"
      @click="modelValue = option.value"
    >
      {{ option.text }}
    </button>
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import Button from '../../exampleStories/Button.vue';

const props = withDefaults(
  defineProps<{
    options: { text: string; value: string | number | boolean }[];
    modelValue: string | number | boolean;
    activeClass?: string;
    defaultClass?: string;
  }>(),
  { defaultClass: 'bg-light text-dark', activeClass: 'bg-dark text-light' }
);
const { options } = toRefs(props);
const buttonCount = computed(() => options.value.length);
</script>
<style lang="scss" scoped>
.buttonGroup {
  display: grid;
  grid-template-columns: repeat(v-bind(buttonCount), 1fr);
  :first-child {
    border-radius: 0.5rem 0 0 0.5rem;
  }
  :last-child {
    border-radius: 0 0.5rem 0.5rem 0;
  }
}
.button {
  border: 1px solid black;
  padding-inline: 0.8rem;

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
}
</style>
