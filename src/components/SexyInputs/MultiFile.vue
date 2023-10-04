<template>
  <div class="input-contain" :draggable="true" @drop.prevent="previewFiles" @dragenter.prevent @dragover.prevent>
    <input hidden v-bind="$attrs" style="width: 100%" type="file" autocomplete="off" @change="previewFiles" multiple :id="id" />
    <button v-bind="$attrs" @click="clickFileInput" type="button" :id="id + 'button'"><slot></slot></button>
    <!-- error -->
  </div>
  <!-- multiFile list -->
  <div :class="buttonWidth >= 400 && fileArray.length > 1 ? 'multiFile' : ''">
    <div
      v-for="(file, index) of fileArray"
      :key="JSON.stringify(file.name + index)"
      class="mt-1 multiFileGrid py-1"
      :class="[multiFileClass(file), index % 2 == 0 ? 'me-1' : '']"
      style="border: 1px solid black; border-radius: 0.5rem"
    >
      <div style="grid-area: name" class="text-center ms-1">{{ file.name }}</div>
      <div v-if="preview" style="grid-area: pic" class="d-flex justify-content-center">
        <img :src="loadFile(file)" style="max-height: 5rem; max-width: 100%" alt="" />
      </div>
      <span @click="deleteFile(index)" style="grid-area: trash; cursor: pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path
            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
          />
          <path
            fill-rule="evenodd"
            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
          />
        </svg>
      </span>
    </div>
  </div>
  <!-- /multiFile list -->
  <!-- error -->
  <Error :error="error" :error-color="errorColor" :name="name" />
  <!-- /error -->
</template>
<script lang="ts">
/**
 * ```js
 * const files = ref<File[]>([]);
 * const error = ref<string|{[key:string]:string}>('')
 * ```
 * ```html
 * <MultiFileInput :fileArray="files" @addFile="(e)=>files.push(e)"></MultiFileInput>
 *
 * <MultiFileInput :fileArray="files" preview></MultiFileInput>
 *
 * <MultiFileInput :fileArray="files" preview :error="error"></MultiFileInput>
 *
 * <!-- the name has to be a key of the error Object -->
 * <MultiFileInput :fileArray="files" preview name="file" :error="error"></MultiFileInput>
 *
 * <MultiFileInput
 *    :fileArray="files" @addFile="e => files.push(...e)" @deleteFile="e => (files = files.filter((_, i) => i != e))"
 * ></MultiFileInput>
 *
 * ```
 */
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRefs } from 'vue';
import Error from './common/Error.vue';
import { getErrorMessage, InputError } from './Index';
const emit = defineEmits<{
  'update:fileArray': [fileArray: File[]];
  addFile: [files: File[]];
  deleteFile: [index: number];
}>();
const props = withDefaults(
  defineProps<{
    fileArray: File[];
    name?: string;
    error?: InputError;
    errorColor?: string;
    borderColor?: string;
    multiFileClass?: (file: File) => string;
    preview?: boolean;
  }>(),
  {
    error: '',
    borderColor: 'black',
    errorColor: 'red',
    preview: false,
    multiFileClass: () => '',
    name: '',
  }
);
const { fileArray, error, errorColor, borderColor, preview, multiFileClass, name } = toRefs(props);

const borderColorComputed = computed(() => (getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value));

onMounted(() => {
  buttonWidth.value = document.getElementById(id.value + 'button')?.clientWidth;
  window.addEventListener('resize', onResize);
});
onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});
const id = ref(JSON.stringify(Math.random()));
const buttonWidth = ref();
function onResize() {
  buttonWidth.value = document.getElementById(id.value + 'button')?.clientWidth;
}
function previewFiles(event: any) {
  if (event.dataTransfer) {
    emit('update:fileArray', [...fileArray.value, ...(Object.values(event.dataTransfer.files) as File[])]);
    emit('addFile', Object.values(event.dataTransfer.files) as File[]);
  } else {
    emit('update:fileArray', [...fileArray.value, ...(Object.values(event.target.files) as File[])]);
    emit('addFile', Object.values(event.target.files) as File[]);
  }
}
function deleteFile(index: number) {
  emit(
    'update:fileArray',
    fileArray.value.filter((_, i) => i != index)
  );
  emit('deleteFile', index);
}
function clickFileInput() {
  document.getElementById(id.value)?.click();
}
function loadFile(file: any) {
  return URL.createObjectURL(file);
}
</script>
<style scoped lang="scss">
.multiFileGrid {
  display: grid;
  grid-template-columns: 1fr 9fr 1fr;
  grid-template-areas:
    '. name trash '
    '. pic . ';
}
.multiFile {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

button {
  min-height: 2.5rem;
  width: 100%;
  background: white;
  text-decoration: none;
  color: black;
  border-color: v-bind(borderColorComputed);
  font-size: 1.5rem;
  border-width: 1px;
  border-radius: 0.5rem;
  transition: all 250ms linear;
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
