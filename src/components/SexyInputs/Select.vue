<template>
  <Modal :title="placeholder" v-model="isModalOpen">
    <!-- modalBody -->
    <div class="selectInput" :class="placeholder ? 'mt-3' : ''">
      <div class="simple-typeahead input-contain">
        <!-- icon -->
        <div v-if="checkIcon && (modelValue || searchText)" class="icon">
          <slot name="icon"></slot>
        </div>
        <!-- /icon -->
        <!-- actual input -->
        <input
          v-bind="$attrs"
          :required="required"
          :id="id"
          class="simple-typeahead-input form-control shadow-none"
          style="border-radius: 0.5rem 0.5rem 0 0; border-width: 2px"
          :style="[
            (checkButton || sideInputType) && $slots.button ? `border-radius: 0.5rem 0 0 0rem; width:${inputWidth}` : '',
            checkIcon ? 'padding-left: 1.5rem;' : 'padding-left: none;',
          ]"
          :class="{ dirty: modelValue || searchText }"
          type="text"
          :value="modelValue || searchText"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          autocomplete="off"
        />
        <!-- actual input -->
        <!-- options for select -->
        <div class="simple-typeahead-list shadow p-0" :class="listClass" :style="checkButton || sideInputType ? `width:${inputWidth}` : ''">
          <div v-if="loading" class="text-center p-2">
            <Spinner size="1.5rem"></Spinner>
          </div>
          <div v-else class="scroll rounded-2">
            <div
              class="simple-typeahead-list-item"
              :class="listItemClass(item)"
              v-for="(item, index) in filteredItems"
              :key="index"
              @mousedown.prevent
              @click.stop="selectItem(item)"
            >
              <span class="simple-typeahead-list-item-text" :data-text="optionProjection(item)" v-html="boldMatchText(optionProjection(item))"></span>
            </div>

            <div v-if="!filteredItems?.length" class="simple-typeahead-list-item" :class="listItemClass(noElementMessage)">
              <div v-if="!checkNoElementMessage">
                {{ noElementMessage }}
              </div>
              <div v-else>
                <slot name="noElementMessage"></slot>
              </div>
            </div>
          </div>
        </div>
        <!-- /options for select -->
        <!-- sideButton -->
        <div class="sideButtonSelect" v-if="checkButton && $slots.button" :style="`width:${sideWidthComputed}`"><slot name="button"></slot></div>
        <!-- /sideButton -->
        <!-- sideInput -->
        <input
          v-if="sideInputType"
          class="sideInput"
          :type="sideInputType"
          :class="sideInputClass"
          :maxlength="sideInputMaxLength"
          @input="updateSideValue"
          :value="sideInputVModel"
          :style="`width:${sideWidthComputed}`"
        />
        <!-- /sideInput -->
      </div>
    </div>
    <!-- modalBody -->
    <!-- modalButton -->
    <template #button>
      <div v-if="disabled" @click.stop>
        <Text
          :disabled="disabled"
          :placeholder="placeholder"
          v-model="searchText"
          :side-input-type="sideInputType"
          :side-input-v-model="sideInputVModel"
          :required="required"
        ></Text>
      </div>
      <div v-else>
        <Text
          @focus="onOpenModal"
          :disabled="disabled"
          :placeholder="placeholder"
          v-model="searchText"
          :side-input-type="sideInputType"
          :side-input-v-model="sideInputVModel"
          :required="required"
        >
          <template #button v-if="$slots.modalButton">
            <slot name="modalButton"></slot>
          </template>
        </Text>
      </div>
    </template>
    <!-- modalButton -->
  </Modal>
  <!-- error -->
  <Error :error="error" :error-color="errorColor" :name="name" />
  <!-- /error -->
</template>
<script lang="ts">
/**
 * ```js
 * const options = ref<any[]>([])
 * const text = ref('')
 * ```
 * ```html
 * <SelectInput  v-model="text" :options="options" :loading="true"></SelectInput>
 *
 * <SelectInput  v-model="text" :options="options" :optionProjection="(e)=>e"></SelectInput>
 * ```
 */
export default {
  inheritAttrs: false,
  components: { Spinner },
};
</script>
<script setup lang="ts">
import { computed, ref, toRefs, useSlots, onMounted } from 'vue';
import { getErrorMessage, useCalcSideWidth, InputError } from './Index';
import Error from './common/Error.vue';
import Spinner from '../Spinner.vue';
import Modal from '../Modal.vue';
import Text from './Text.vue';

type Any = any;
interface Option extends Any {}
const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string): void;
  (e: 'update:sideInputVModel', modelValue: string): void;
  (
    e: 'onInput',
    selectable: {
      modelValue: string;
      options: Option[];
    }
  ): void;
  (
    e: 'onFocus',
    selectable: {
      modelValue: string;
      options: Option[];
    }
  ): void;
  (e: 'selectItem', option: Option): void;
  (
    e: 'onBlur',
    selectable: {
      modelValue: string;
      options: Option[];
    }
  ): void;
}>();
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    backgroundColor?: string;
    /**
     * Option is inferred from `options` prop
     */
    options: Option[];
    showAll?: boolean;
    controlInput?: boolean;
    selectOnBlur?: boolean;
    noElementMessage?: string;
    listClass?: string;
    name?: string;
    error?: InputError;
    errorColor?: string;
    labelClass?: string;
    sideWidth?: number;
    sideInputType?: 'number' | 'text';
    sideInputClass?: string;
    sideInputMaxLength?: string;
    sideInputVModel?: number | string;
    borderColor?: string;
    optionProjection?: (option: Option) => string;
    listItemClass?: (option: Option) => string;
    matchFromStart?: boolean;
    loading?: boolean;
    disabled?: boolean;
    required?: boolean;
  }>(),
  {
    placeholder: '',
    showAll: false,
    error: '',
    noElementMessage: 'not found',
    controlInput: true,
    selectOnBlur: true,
    errorColor: 'red',
    backgroundColor: '#f8fafc',
    sideWidth: 20,
    matchFromStart: false,
    optionProjection: (e: Option) => (e ?? '') + '',
    listItemClass: () => '',
    name: '',
    loading: false,
    modelValue: '',
    disabled: false,
    required: false,
  }
);
const {
  modelValue,
  backgroundColor,
  showAll,
  selectOnBlur,
  controlInput,
  noElementMessage,
  listClass,
  error,
  errorColor,
  labelClass,
  sideWidth,
  sideInputType,
  sideInputClass,
  sideInputMaxLength,
  sideInputVModel,
  placeholder,
  borderColor,
  optionProjection,
  options,
  matchFromStart,
  name,
} = toRefs(props);
const id = ref(JSON.stringify(Math.random()));
const slots = useSlots();

const searchText = ref(modelValue.value || '');
const document = window.document;
const borderColorComputed = computed(() => (getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value));
const checkIcon = computed(() => !!slots.icon);
const checkButton = computed(() => !!slots.button);
const checkNoElementMessage = computed(() => !!slots.noElementMessage);

const { inputWidth, sideWidthComputed } = useCalcSideWidth(sideWidth);
const filteredItems = computed(() => {
  if (showAll.value) return options.value;
  //options that are still possible
  let regexp: RegExp;
  //escape all characters that have a special meaning in regular expressions
  let escapedQuery = (modelValue.value || searchText.value).replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  if (matchFromStart.value) regexp = new RegExp('^' + escapedQuery, 'i');
  else regexp = new RegExp(escapedQuery, 'i');
  let array: Option[] = [];
  try {
    array = options.value?.filter(item => optionProjection.value?.(item).match(regexp));
    if (!array.length) array = array.concat(options.value?.filter(item => item.match(regexp)));
  } catch {
    array = [];
  }
  if (array.length > 50) return array.slice(0, 50);
  else return array;
});
const isModalOpen = ref(false);
function onOpenModal() {
  isModalOpen.value = true;
  setTimeout(() => document.getElementById(id.value)?.focus(), 0);
}
function onInput(event: Event) {
  //is executed when something is entered in selectInput.
  updateValue(event);
  emit('onInput', {
    modelValue: modelValue.value,
    options: filteredItems.value,
  });
}
function onFocus() {
  //is executed when the selectInput is focussed
  emit('onFocus', {
    modelValue: modelValue.value,
    options: filteredItems.value,
  });
}
function onBlur() {
  //is executed when the selectInput is no longer focused
  if (controlInput.value) {
    if (!filteredItems.value?.some(e => optionProjection.value(e) == (modelValue.value || searchText.value))) {
      updateValue('');
      return;
    }
  }
  if (selectOnBlur.value) {
    if (options?.value.find(e => optionProjection.value(e) == (searchText.value || modelValue.value))) {
      emit(
        'selectItem',
        options?.value.find(e => optionProjection.value(e) == (searchText.value || modelValue.value))
      );
    } else {
      if (options?.value.find(e => e == (modelValue.value || searchText.value)))
        emit(
          'selectItem',
          options?.value.find(e => e == (modelValue.value || searchText.value))
        );
    }
  }
  emit('onBlur', {
    modelValue: modelValue.value,
    options: filteredItems.value,
  });
}
async function selectItem(item: any) {
  //will be executed when an option is selected
  await updateValue(optionProjection.value(item));
  document.getElementById(id.value)?.blur();
  if (!selectOnBlur) emit('selectItem', item);
  if (!sideInputType?.value) isModalOpen.value = false;
}

function boldMatchText(text: string) {
  //makes the text you entered in searchInput bold in options
  const regexp = new RegExp(`(${modelValue.value})`, 'ig');
  return text.replace(regexp, '<strong>$1</strong>');
}
function updateValue(event: any) {
  //correct the value if necessary and update it
  if (typeof event == 'string') {
    emit('update:modelValue', event);
    searchText.value = event;
  } else {
    emit('update:modelValue', event.target.value);
    searchText.value = event.target.value;
  }
}
function updateSideValue(event: any) {
  //update the sideInput value
  emit('update:sideInputVModel', event.target.value);
}
const position = ref('');
const listWidth = ref('');
</script>
<style scoped lang="scss">
@use 'typeAheadStyle';
@use 'baseStyle';
@use 'sideInputStyle';

input {
  background-color: v-bind(backgroundColor);
  border-color: v-bind(borderColorComputed);
}
.sideButton,
.sideInput {
  left: v-bind(inputWidth);
  border-radius: 0 0.5rem 0 0 !important;
}
input.sideInput:focus {
  border-color: v-bind(borderColorComputed);
}

.simple-typeahead {
  .simple-typeahead-list {
    border-color: v-bind(borderColorComputed);
    width: v-bind(listWidth) !important;

    .simple-typeahead-list-item {
      border-color: v-bind(borderColorComputed);
    }
  }
}
</style>
