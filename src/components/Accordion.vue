<template>
  <div class="accordion" :id="id">
    <div class="accordion-item" :class="itemClass" v-for="(item, index) in items">
      <div class="accordion-header" v-if="item.noAccordion">
        <slot :name="item.hash"></slot>
      </div>
      <template v-else>
        <h2 class="accordion-header" :id="`heading-${index}-${item.hash}`">
          <button
            class="accordion-button collapsed shadow-none p-3"
            :class="titleClass"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="`#collapse-${index}-${item.hash}`"
            aria-expanded="false"
            :aria-controls="`collapse-${index}-${item.hash}`"
          >
            {{ item.title }}
          </button>
        </h2>
        <div
          :id="`collapse-${index}-${item.hash}`"
          class="accordion-collapse collapse"
          :aria-labelledby="`heading-${index}-${item.hash}`"
          :data-bs-parent="`#${id}`"
        >
          <div class="accordion-body p-0">
            <slot :name="item.hash"></slot>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from 'vue';

const id = 'id' + JSON.stringify(Math.random()).slice(2);
const props = withDefaults(
  defineProps<{ items: { title: string; hash: string; noAccordion?: boolean }[]; titleClass?: string; itemClass?: string }>(),
  {
    titleClass: '',
    itemClass: '',
  }
);
const { items } = toRefs(props);
</script>
<style lang="scss" scoped>
.accordion-item:first-of-type {
  border-top-right-radius: 0.5rem !important;
  border-top-left-radius: 0.5rem !important;
}
.accordion-item:last-of-type {
  border-bottom-right-radius: 0.5rem !important;
  border-bottom-left-radius: 0.5rem !important;
}
.accordion-header-item:first-of-type {
  border-top-right-radius: 0.5rem !important;
  border-top-left-radius: 0.5rem !important;
}
.accordion-header:last-of-type {
  border-bottom-right-radius: 0.5rem !important;
  border-bottom-left-radius: 0.5rem !important;
}

.accordion-button:first-of-type.collapsed {
  border-top-right-radius: 0.5rem !important;
  border-top-left-radius: 0.5rem !important;
}
.accordion-button:last-of-type.collapsed {
  border-bottom-right-radius: 0.5rem !important;
  border-bottom-left-radius: 0.5rem !important;
}
</style>
