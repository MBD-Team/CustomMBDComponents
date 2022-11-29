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
              <div class="modal-header" v-if="title">
                <h5 class="modal-title">{{ title }}</h5>
                <button
                  type="button"
                  class="btn-close p-3 shadow-none"
                  @click.stop="
                    showModal = false;
                    resetError();
                  "
                ></button>
              </div>
              <div class="modal-body m-0" style="max-height: 80vh; overflow: auto">
                <Message :error="error" />
                <slot></slot>
              </div>
              <div class="modal-footer" v-if="affirmText || negativeText">
                <div v-if="negativeText">
                  <Button
                    style="height: 2rem; font-size: 1rem"
                    class="border-0"
                    :loading="negativeLoading"
                    :class="negativeClass"
                    @click.stop="
                      () => {
                        showModal = false;
                        resetError();
                        negative();
                      }
                    "
                  >
                    {{ negativeText }}
                  </Button>
                </div>
                <div v-if="affirmAltText">
                  <Button
                    :loading="affirmAltLoading"
                    :class="affirmAltClass"
                    @click.stop="affirmAlt()"
                    style="height: 2rem; font-size: 1rem"
                    class="border-0"
                  >
                    {{ affirmAltText }}
                  </Button>
                </div>
                <div v-if="affirmText">
                  <Button :loading="affirmLoading" :class="affirmClass" @click.stop="affirm()" style="height: 2rem; font-size: 1rem" class="border-0">
                    {{ affirmText }}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
  <div @click.stop="showModal = true">
    <slot name="button">
      <button class="btn btn-primary my-2 me-4">Open Modal</button>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, ref, watch } from 'vue';
import Button from './Button.vue';
import Message from './Message.vue';
const affirmLoading = ref(false);
const affirmAltLoading = ref(false);
const negativeLoading = ref(false);
const error = ref('');
const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    title?: string;
    affirmText?: string;
    affirmAction?: () => Promise<void> | void;
    affirmClass?: string;
    affirmAltText?: string;
    affirmAltAction?: () => Promise<void> | void;
    affirmAltClass?: string;
    negativeText?: string;
    negativeAction?: () => Promise<void> | void;
    negativeClass?: string;
    modalSize?: string;
  }>(),
  {
    modelValue: undefined,
    affirmClass: 'btn-primary',
    negativeClass: 'btn-secondary',
    affirmAltClass: 'btn-warning',
    modalSize: 'modal-lg',
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

<style scoped lang="scss">
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
.modal-dialog {
  background-color: white;
  border-radius: 0.5rem;
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
