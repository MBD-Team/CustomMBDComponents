<template>
  <Teleport to="body">
    <transition name="modal">
      <div class="modal-mask" v-if="showModal">
        <div
          class="modal-wrapper"
          @mousedown.self="
            showModal = false;
            resetError();
          "
        >
          <div class="modal-dialog" :class="modalSize" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ title }}</h5>
                <button
                  type="button"
                  class="btn-close p-3"
                  @click="
                    showModal = false;
                    resetError();
                  "
                ></button>
              </div>
              <div class="modal-body m-0" style="max-height: 80vh; overflow: auto">
                <div v-if="error" class="alert alert-danger">
                  <div v-for="exception in (typeof error == 'string' ? error : JSON.stringify(error)).trim().split('\n')">
                    {{ exception }}
                    <hr class="my-1" />
                  </div>
                </div>
                <slot></slot>
              </div>
              <div class="modal-footer" v-if="affirmText || negativeText">
                <template v-if="negativeText">
                  <button
                    v-if="!negativeLoading"
                    type="submit"
                    :class="negativeClass"
                    @click="
                      () => {
                        showModal = false;
                        resetError();
                        negative();
                      }
                    "
                  >
                    {{ negativeText }}
                  </button>
                  <span v-else class="me-3 spinner-border spinner-border-sm text-primary"></span>
                </template>
                <template v-if="affirmAltText">
                  <button @click="affirmAlt()" v-if="!affirmAltLoading" type="submit" :class="affirmAltClass">
                    {{ affirmAltText }}
                  </button>
                  <span v-else class="me-3 spinner-border spinner-border-sm text-warning"></span>
                </template>
                <template v-if="affirmText">
                  <button @click="affirm()" v-if="!affirmLoading" type="submit" :class="affirmClass">
                    {{ affirmText }}
                  </button>
                  <span v-else class="me-3 spinner-border spinner-border-sm text-primary"></span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
  <div @click="showModal = true">
    <slot name="button">
      <button class="btn btn-primary my-2 me-4">Open Modal</button>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, ref, watch } from 'vue';
const affirmLoading = ref(false);
const affirmAltLoading = ref(false);
const negativeLoading = ref(false);
const error = ref('');
const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    title?: string;
    affirmText?: string;
    affirmAction?: () => Promise<void> | (() => void);
    affirmClass?: string;
    affirmAltText?: string;
    affirmAltAction?: () => Promise<void> | (() => void);
    affirmAltClass?: string;
    negativeText?: string;
    negativeAction?: () => Promise<void> | (() => void);
    negativeClass?: string;
    modalSize?: string;
  }>(),
  {
    modelValue: undefined,
    affirmClass: 'btn btn-primary',
    negativeClass: 'btn btn-secondary',
    affirmAltClass: 'btn btn-warning',
  }
);
const {
  modelValue,
  title,
  affirmText,
  affirmAction,
  affirmClass,
  negativeText,
  negativeAction,
  negativeClass,
  affirmAltText,
  affirmAltAction,
  affirmAltClass,
  modalSize,
} = toRefs(props);
// if v model updates, update showModal, and if showModal changes, emit event that its updated
// this allows for an optional v-model that can be used to open/close the modal
const showModal = ref(!!modelValue?.value);
const emit = defineEmits(['update:modelValue']);
watch([showModal], () => emit('update:modelValue', showModal.value));
watch([modelValue], () => modelValue?.value !== undefined && showModal.value != modelValue.value && (showModal.value = modelValue.value));
async function affirm() {
  if (!affirmAction?.value) return;
  resetError();
  affirmLoading.value = true;
  try {
    await affirmAction.value();
    showModal.value = false;
  } catch (e) {
    error.value = e as string;
  }
  affirmLoading.value = false;
}
async function affirmAlt() {
  resetError();
  if (!affirmAltAction || !affirmAltAction.value) return;
  affirmAltLoading.value = true;
  try {
    await affirmAltAction.value();
    showModal.value = false;
  } catch (e) {
    error.value = e as string;
  }
  affirmAltLoading.value = false;
}
async function negative() {
  if (!negativeAction || !negativeAction.value) return;
  negativeLoading.value = true;
  try {
    await negativeAction.value();
    showModal.value = false;
  } catch (e) {
    error.value = e as string;
  }
  negativeLoading.value = false;
}
function resetError() {
  error.value = '';
}
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
}
.modal-wrapper {
  display: table-cell;
}
.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}
.modal-body {
  margin: 20px 0;
}
.modal-default-button {
  display: block;
  margin-top: 1rem;
}
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal-dialog,
.modal-leave-active .modal-dialog {
  transition: margin-top 0.2s ease;
}
.modal-enter-from .modal-dialog,
.modal-leave-to .modal-dialog {
  margin-top: -50px;
}
</style>
