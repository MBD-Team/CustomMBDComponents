<template>
  <div class="accordion" :id="id">
    <div class="accordion-item" :class="itemClass" v-for="(item, index) in items">
      <div class="accordion-header" v-if="item.noAccordion">
        <slot :name="item.hash"></slot>
      </div>
      <template v-else>
        <h2 class="accordion-header" :id="`heading-${index}-${item.hash}`">
          <button
            class="accordion-button shadow-none p-3"
            :class="[titleClass, item.hash == startHash ? 'startItem' : 'collapsed']"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="`#collapse-${index}-${item.hash}`"
            aria-expanded="false"
            :aria-controls="`collapse-${index}-${item.hash}`"
          >
            <i class="me-2" v-if="item.titleIcon" :class="item.titleIcon"></i>
            <span class="pe-2">{{ item.title }}</span>
          </button>
        </h2>
        <div
          :id="`collapse-${index}-${item.hash}`"
          class="accordion-collapse collapse"
          :class="item.hash == startHash ? 'show' : ''"
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

const props = withDefaults(
  defineProps<{
    items: { title: string; titleIcon?: string; hash: string; noAccordion?: boolean }[];
    titleClass?: string;
    itemClass?: string;
    startHash?: string;
    id?: string;
  }>(),
  {
    titleClass: '',
    itemClass: '',
    startHash: '',
    id: 'id' + JSON.stringify(Math.random()).slice(2),
  }
);
const { items, id } = toRefs(props);
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

#navBarAccordion {
  .accordion-button::after {
    filter: brightness(100);
  }
  .accordion-button.startItem {
    background-color: var(--bs-primary) !important;
  }
  h2,
  .accordion-button {
    border-bottom-right-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border-top-left-radius: 0 !important;
  }
  .accordion-button:not(.collapsed) {
    background-color: rgba(var(--bs-primary-rgb), 0.4) !important;
  }
}
</style>
