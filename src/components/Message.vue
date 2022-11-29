<template>
  <Alert :model-value="alertValue" @update:model-value="(error = ''), (success = '')" :class="`alert ${error ? 'alert-danger' : 'alert-success'}`">
    <div v-if="success">{{ success }}</div>
    <div v-else-if="typeof error == 'string'">{{ error }}</div>
    <div v-else-if="Object.values(error).length > 0" style="white-space: pre-wrap">{{ Object.values(error).join('\n') }}</div>
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

const alertValue = computed(() => !!error?.value || !!success?.value);
</script>
<style lang="scss" scoped></style>
