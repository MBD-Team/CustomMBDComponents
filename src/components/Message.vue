<template>
  <Alert :model-value="successValue" @update:model-value="emit('update:success', '')" class="alert alert-success">
    {{ success }}
  </Alert>
  <Alert :model-value="errorValue" @update:model-value="emit('update:error', '')" class="alert alert-danger">
    <template v-if="typeof error == 'string'">{{ error }}</template>
    <div v-else style="white-space: pre-wrap">{{ Object.values(error || {}).join('\n') }}</div>
  </Alert>
</template>
<script setup lang="ts">
import { computed, toRefs } from 'vue';
import Alert from './Alert.vue';
const props =
  defineProps<{
    error?: string | Object;
    success?: string;
  }>();
const { error, success } = toRefs(props);

const emit = defineEmits(['update:error', 'update:success']);

const errorValue = computed(() => !!error?.value);
const successValue = computed(() => !!success?.value);
</script>

<script lang="ts">
/**
 * how to use:
 * ```js
 *   <Message v-model:success="success" v-model:error="error" />
 * ```
 */
export default {};
</script>
