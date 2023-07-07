<template>
  <Teleport to="body">
    <transition name="mbd-modal">
      <div class="mbd-modal-mask" v-if="showModal">
        <div
          class="mbd-modal-wrapper"
          @mousedown.self="
            if (!disableBackdropClose) {
              showModal = false;
              resetError();
            }
          "
        >
          <div class="mbd-modal-dialog" :style="{ maxWidth: modalWidth + 'px' }" role="document">
            <div class="mbd-modal-content">
              <div class="mbd-modal-header" v-if="title">
                <h4>{{ title }}</h4>
                <button
                  type="button"
                  class="btn-close p-3 shadow-none"
                  @click.stop="
                    showModal = false;
                    resetError();
                  "
                ></button>
              </div>
              <div class="mbd-modal-body">
                <Message v-model:error="error" />
                <slot></slot>
              </div>
              <div
                class="mbd-modal-footer gap-2"
                :class="destructive ? 'flex-row-reverse' : 'flex-row'"
                v-if="affirm.prop?.text || negative.prop?.text || slots.footer"
              >
                <slot name="footer"></slot>
                <template
                  v-for="([btn, defaultClass]) in ([[negative,'btn btn-secondary'], [affirmAlt,'btn btn-warning'],[affirm,'btn btn-primary']] as const)"
                >
                  <div v-if="btn.prop?.text">
                    <Button
                      style="height: 2rem; font-size: 1rem"
                      class="border-0"
                      :loading="btn.loading"
                      :class="`${btn.prop.class || defaultClass}`"
                      :disabled="!!btn.prop.disabled"
                      @click.stop="
                        () => {
                          btnFunc(btn);
                        }
                      "
                    >
                      {{ btn.prop.text }}
                    </Button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
  <div @click.stop="showModal = true" class="mbd-modal-button">
    <slot name="button"></slot>
  </div>
</template>

<script lang="ts">
/**
 * how to use:
 * ```js
 * const config = ref<{ text: string; action?: () => Promise<void> | void; class?: string; disabled?: boolean }>({text:'test'})
 * ```
 * ```html
 * <!-- footerButtons: affirm, affirmAlt, negative (all are optional)-->
 * <!-- :model-value="bool"  to open programmatically-->
 *
 * <Modal title="modalTitle" :affirm="config" :negative="config" :affirmAlt="config">
 *  <div>ModalBodyContent</div>
 *
 *  <!-- optional -->
 *  <template #button><Button>openModalButton</Button></template>
 *  <template #footer></template>
 * </Modal>
 *
 * <!-- destructive to swap button order -->
 * <Modal title="perma delete stuff" :affirm="config" :negative="config" destructive>
 *  <div>ModalBodyContent</div>
 *  <template #button><Button>openModalButton</Button></template>
 * </Modal>
 * ```
 */
export default {};

export type ButtonProp = { text: string; action?: () => Promise<void> | void; class?: string; disabled?: boolean };
</script>

<script lang="ts" setup>
import { toRefs, ref, watch, useSlots } from 'vue';
import Button from './Button.vue';
import Message from './Message.vue';

const slots = useSlots();
const error = ref('');
const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    title?: string;
    affirm?: ButtonProp;
    affirmAlt?: ButtonProp;
    negative?: ButtonProp;
    modalWidth?: number;
    destructive?: boolean;
    disableBackdropClose?: boolean;
  }>(),
  {
    modelValue: undefined,
    modalWidth: 800,
    destructive: false,
    disableBackdropClose: false,
  }
);
const { modelValue, title, affirm: affirmProp, negative: negativeProp, affirmAlt: affirmAltProp, modalWidth } = toRefs(props);

const affirm = ref({ prop: affirmProp, loading: false });
const negative = ref({ prop: negativeProp, loading: false });
const affirmAlt = ref({ prop: affirmAltProp, loading: false });
// if v model updates, update showModal, and if showModal changes, emit event that its updated
// this allows for an optional v-model that can be used to open/close the modal
const showModal = ref(!!modelValue?.value);
const emit = defineEmits(['update:modelValue']);
watch([showModal], () => emit('update:modelValue', showModal.value));
watch([modelValue], () => modelValue?.value !== undefined && showModal.value != modelValue.value && (showModal.value = modelValue.value));

async function btnFunc(btn: { prop: ButtonProp | undefined; loading: boolean }) {
  resetError();
  btn.loading = true;
  try {
    await btn.prop?.action?.();
    showModal.value = false;
  } catch (e) {
    error.value = e as string;
  }
  btn.loading = false;
}

function resetError() {
  error.value = '';
}
</script>

<style scoped lang="scss">
:slotted(.mbd-modal-button [disabled]) {
  pointer-events: unset;
}
.mbd-modal-mask {
  position: fixed;
  z-index: 1055;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
}
.mbd-modal-wrapper {
  display: table-cell;
}
.mbd-modal-dialog {
  background-color: white;
  border-radius: 0.5rem;
  margin: 0 auto;
  margin-top: 10vh;
}
.mbd-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 0.5rem 0.5rem 0 1rem;
}
.mbd-modal-body {
  padding: 1rem;
  overflow: auto;
  max-height: calc(90vh - 57px * 2);
}
.mbd-modal-footer {
  display: flex;
  justify-content: end;
  align-items: center;
  border-top: 1px solid #ccc;
  padding: 0.75rem;
}

.mbd-modal-enter-active,
.mbd-modal-leave-active {
  transition: opacity 0.2s ease;
}
.mbd-modal-enter-from,
.mbd-modal-leave-to {
  opacity: 0;
}
.mbd-modal-enter-active .mbd-modal-dialog,
.mbd-modal-leave-active .mbd-modal-dialog {
  transition: margin-top 0.2s ease;
}
.mbd-modal-enter-from .mbd-modal-dialog,
.mbd-modal-leave-to .mbd-modal-dialog {
  margin-top: -50px;
}
</style>
