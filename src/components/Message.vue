<template>
  <div :id="messageId">
    <Alert
      v-for="message of messages"
      :model-value="hasValue(message.content)"
      @update:model-value="emit(`update:${message.name}`, '')"
      :class="`alert alert-${message.class}`"
      :dismissable="dismissable"
      :close-btn="dismissable"
    >
      <template v-if="typeof message.content == 'string'">{{ message.content }}</template>
      <div v-else style="white-space: pre-wrap">{{ Object.values(message.content || {}).join('\n') }}</div>
    </Alert>
  </div>
</template>
<script setup lang="ts">
import { computed, toRefs, watch } from 'vue';
import Alert from './Alert.vue';
const props = withDefaults(
  defineProps<{
    error?: string | Object;
    success?: string | Object;
    warning?: string | Object;
    info?: string | Object;
    dismissable?: boolean;
  }>(),
  { dismissable: true }
);
const { error, success, warning, info } = toRefs(props);

const emit = defineEmits(['update:error', 'update:success', 'update:warning', 'update:info']);

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

watch(messages, (oldValue, newValue) => {
  const el = document.getElementById(messageId);
  if (el) {
    for (const message of oldValue) {
      if (hasValue(message.content) && !hasValue(newValue.find(e => e.name == message.name)?.content)) {
        el.scrollIntoView({ behavior: 'smooth' });
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
