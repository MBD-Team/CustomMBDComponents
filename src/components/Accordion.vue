<template>
  <div class="accordion" :id="id">
    <div class="accordion-item" v-for="(item, index) in items">
      <h2 class="accordion-header" :id="`heading-${index}-${item.hash}`">
        <button
          class="accordion-button collapsed shadow-none"
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
        <div class="accordion-body">
          <slot :name="item.hash"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRefs, ref, watch, computed } from 'vue';

const id = 'id' + JSON.stringify(Math.random()).slice(2);
const props = withDefaults(defineProps<{ items: { title: string; hash: string }[]; initialTabHash?: string }>(), { initialTabHash: '' });
const { items, initialTabHash } = toRefs(props);
const { fullHash, hashValues, setHash, setHashValue } = useHash(initialTabHash.value);

function useHash(initialValue?: string, seperator?: string) {
  const fullHash = ref(window.location.hash?.slice(1) || initialValue || '');
  const hashValues = computed(() => fullHash.value.split(seperator || ':'));

  const setHash = (value: string) => {
    fullHash.value = value;
  };
  const setHashValue = (value: string, index: number) => {
    const values = fullHash.value.split(seperator || ':');
    fullHash.value = [...values.slice(0, index), value, ...values.slice(index + 1)].join(':');
  };

  watch(fullHash, () => {
    window.location.hash = `#${fullHash.value}`;
  });
  // this might be useful
  // window.addEventListener('hashchange', () => {
  //     fullHash.value = window.location.hash.slice(1);
  // });

  return { fullHash, hashValues, setHash, setHashValue };
}

defineExpose({ hashValues, setHash });
</script>
<style lang="scss" scoped></style>
