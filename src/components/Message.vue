<template>
  <Alert :model-value="hasSuccess" @update:model-value="emit('update:success', '')" class="alert alert-success">
    {{ success }}
  </Alert>
  <Alert :model-value="hasWarning" @update:model-value="emit('update:warning', '')" class="alert alert-warning">
    {{ warning }}
  </Alert>
  <Alert :model-value="hasInfo" @update:model-value="emit('update:info', '')" class="alert alert-info">
    {{ info }}
  </Alert>
  <Alert :model-value="hasError" @update:model-value="emit('update:error', '')" class="alert alert-danger">
    <template v-if="typeof error == 'string'">{{ error }}</template>
    <div v-else style="white-space: pre-wrap">{{ Object.values(error || {}).join('\n') }}</div>
  </Alert>
</template>
<script setup lang="ts">
import { computed, toRefs } from 'vue';
import Alert from './Alert.vue';
const props = defineProps<{
  error?: string | Object;
  success?: string;
  warning?: string;
  info?: string;
}>();
const { error, success, warning, info } = toRefs(props);

const emit = defineEmits(['update:error', 'update:success', 'update:warning', 'update:info']);

const hasError = computed(() => (typeof error?.value === 'string' ? !!error?.value : !!Object.values(error?.value || {}).length));
const hasSuccess = computed(() => !!success?.value);
const hasWarning = computed(() => !!warning?.value);
const hasInfo = computed(() => !!info?.value);
</script>

<script lang="ts">
/**
 * how to use:
 * ```js
 *   <Message v-model:success="success" v-model:error="error" v-model:warning="warning" v-model:info="info"/>
 * ```
 */
export default {};
</script>
