<template>
  <div :id="messageId">
    <Alert
      v-for="message of messages"
      :model-value="hasValue(message.content)"
      @update:model-value="emit(`update:${message.name}` as any, '')"
      :class="`alert alert-${message.class}`"
      :dismissable="dismissable"
      :close-btn="dismissable"
    >
      <template v-if="typeof message.content == 'string'">{{ message.content }}</template>
      <div v-else style="white-space: pre-wrap">{{ Object.values(message.content || {}).join('\n') }}</div>
    </Alert>
  </div>
</template>
<script setup lang="ts" generic="TObj extends Record<string,any>">
import { computed, toRefs, watch, nextTick } from 'vue';
import Alert from './Alert.vue';

const props = withDefaults(
  defineProps<{
    error?: string | TObj;
    success?: string | TObj;
    warning?: string | TObj;
    info?: string | TObj;
    dismissable?: boolean;
  }>(),
  { dismissable: true }
);
const { error, success, warning, info } = toRefs(props);

const emit = defineEmits<{
  'update:error': [value: string | TObj];
  'update:success': [value: string | TObj];
  'update:warning': [value: string | TObj];
  'update:info': [value: string | TObj];
}>();

const messageId = 'message-' + Math.random();

const messages = computed(
  () =>
    [
      { name: 'error', content: error?.value, class: 'danger' },
      { name: 'success', content: success?.value, class: 'success' },
      { name: 'info', content: info?.value, class: 'info' },
      { name: 'warning', content: warning?.value, class: 'warning' },
    ] as const
);

watch(messages, (newValue, oldValue) => {
  const el = document.getElementById(messageId);
  if (el) {
    for (const message of newValue) {
      if (hasValue(message.content) && message.content != oldValue.find(e => e.name == message.name)?.content) {
        if (el.getBoundingClientRect().y > window.innerHeight || el.getBoundingClientRect().y < 56) {
          nextTick(() => el.scrollIntoView({ behavior: 'smooth' }));
        }
      }
    }
  }
});

function hasValue(prop: string | Object | undefined) {
  return typeof prop === 'string' ? !!prop : !!Object.values(prop || {}).length;
}
</script>

<script lang="ts">
/**
 * how to use:
 * ```html
 * <!-- all v-models are optional -->
 *   <Message v-model:success="success" v-model:error="error" v-model:warning="warning" v-model:info="info" :dismissable="false"/>
 * ```
 */
export default {};
</script>
