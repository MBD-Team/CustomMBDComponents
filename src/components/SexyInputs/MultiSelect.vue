<template>
  <Modal :title="placeholder" v-model="isModalOpen">
    <div class="selectInput" :class="placeholder ? 'mt-3' : ''">
      <div class="simple-typeahead input-contain">
        <!-- icon -->
        <div v-if="checkIcon && (modelValue || searchText)" class="icon">
          <slot name="icon"></slot>
        </div>
        <!-- /icon -->
        <input
          v-bind="$attrs"
          :id="id"
          class="simple-typeahead-input form-control shadow-none"
          style="border-radius: 0.5rem 0.5rem 0 0; border-width: 2px"
          :style="[
            checkButton || sideInputType ? `border-radius: 0.5rem 0 0 0rem; width:${inputWidth}` : '',
            checkIcon ? 'padding-left: 1.5rem;' : 'padding-left: none;',
          ]"
          :class="{ dirty: modelValue || searchText }"
          type="text"
          :value="modelValue || searchText"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          autocomplete="off"
          :disabled="disabled"
        />
        <!-- options for select -->
        <div class="simple-typeahead-list shadow" :class="listClass" :style="[checkButton || sideInputType ? `width:${inputWidth}` : '']">
          <div v-if="loading" class="text-center p-2">
            <Spinner size="1.5rem"></Spinner>
          </div>
          <div v-else>
            <!-- chips -->
            <div class="py-1 d-flex flex-wrap" style="border-bottom: 1px solid black; cursor: default" @mousedown.prevent>
              <div
                v-for="item of selected"
                class="chip rounded px-2 border border-dark m-1"
                style="cursor: pointer"
                @click.stop="selectItem(item)"
                @mousedown.prevent
              >
                {{ optionProjection(item) }}
                <i class="fa fa-trash"></i>
              </div>
            </div>

            <div class="scroll">
              <div
                class="simple-typeahead-list-item"
                :class="listItemClass(item)"
                v-for="item in filteredItems"
                :key="Math.random()"
                @mousedown.prevent
                @click.stop="selectItem(item)"
              >
                <Checkbox :value="selected.some(e => keyExtractor(e) == keyExtractor(item))" @click="selectItem(item)">
                  <span
                    class="simple-typeahead-list-item-text"
                    :data-text="optionProjection(item)"
                    v-html="boldMatchText(optionProjection(item))"
                  ></span>
                </Checkbox>
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
        </div>
        <!-- /options for select -->
        <!-- sideButton -->
        <div class="sideButtonSelect" v-if="checkButton" :style="`width:${sideWidthComputed}`"><slot name="button"></slot></div>
        <!-- /sideButton -->
        <!-- sideInput -->
        <input
          v-if="sideInputType"
          class="sideInput"
          :style="`width:${sideWidthComputed}`"
          :type="sideInputType"
          :class="sideInputClass"
          :maxlength="sideInputMaxLength"
          @input="updateSideValue"
          :value="sideInputVModel"
        />
        <!-- /sideInput -->
      </div>
    </div>
    <template #button>
      <Button :disabled="disabled" @focus="onOpenModal" class="default" type="button">{{ placeholder }}</Button>
    </template>
  </Modal>
  <!-- error -->
  <Error :error="error" :error-color="errorColor" :name="name" />
  <!-- /error -->
  <!-- multiSelect list -->
  <div v-if="showSelected" class="py-1 d-flex flex-wrap" style="cursor: default" @mousedown.prevent>
    <div v-for="item of selected" class="chip rounded px-2 border border-dark m-1" style="cursor: pointer">
      {{ optionProjection(item) }}
    </div>
  </div>
  <!-- /multiSelect list -->
</template>
<script lang="ts">
/**
 * ```js
 * const options = [1, 2, 3]
 * const list = ref<number[]>([]);
 * ```
 * ```html
 * <MultiSelectInput
        v-model="text"
        v-model:selected="list"
        :options="options"
        :loading="true"
      ></MultiSelectInput>
 *
 * ```
 */
export default {
  inheritAttrs: false,
  components: { Spinner },
};
</script>
<script setup lang="ts" generic="TOpt">
import { computed, ref, toRefs, useSlots } from 'vue';
import { getErrorMessage, useCalcSideWidth, InputError } from './Index';
import Error from './common/Error.vue';
import Checkbox from './Checkbox.vue';
import Spinner from '../Spinner.vue';
import Modal from '../Modal.vue';
import Button from '../Button.vue';

const emit = defineEmits<{
  'update:selected': [selected: TOpt[]];
  'update:modelValue': [modelValue: string];
  'update:sideInputVModel': [modelValue: string];
  selectItem: [option: TOpt];
  deleteItem: [option: TOpt];
  onInput: [
    selectable: {
      modelValue: string;
      options: TOpt[];
    }
  ];
  onFocus: [
    selectable: {
      modelValue: string;
      options: TOpt[];
    }
  ];
  onBlur: [
    selectable: {
      modelValue: string;
      options: TOpt[];
    }
  ];
}>();
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    modelValue?: string;
    options: TOpt[];
    selected: TOpt[];
    showAll?: boolean;
    placeholder?: string;
    noElementMessage?: string;
    listClass?: string;
    name?: string;
    error?: InputError;
    errorColor?: string;
    sideWidth?: number;
    sideInputType?: 'number' | 'text';
    sideInputClass?: string;
    sideInputMaxLength?: string;
    sideInputVModel?: string;
    borderColor?: string;
    optionProjection?: (option: TOpt) => string;
    listItemClass?: (e: any) => string;
    multiSelectClass?: (option: TOpt) => string;
    matchFromStart?: boolean;
    showSelected?: boolean;
    keyExtractor?: (option: TOpt) => string;
    backgroundColor?: string;
    autoClearOff?: boolean;
    selectedTitle?: string;
    loading?: boolean;
  }>(),
  {
    placeholder: '',
    error: '',
    noElementMessage: 'not found',
    selectedTitle: 'Ausgewählt:',
    controlInput: true,
    selectOnBlur: true,
    matchFromStart: false,
    autoClearOff: false,
    errorColor: 'red',
    sideWidth: 20,
    optionProjection: (option: TOpt) => JSON.stringify(option),
    listItemClass: () => '',
    multiSelectClass: () => '',
    keyExtractor: (option: TOpt) => JSON.stringify(option),
    name: '',
    showSelected: true,
    backgroundColor: '#f8fafc',
    loading: false,
    showAll: false,
    modelValue: '',
  }
);
const {
  disabled,
  modelValue,
  showAll,
  noElementMessage,
  listClass,
  error,
  errorColor,
  sideWidth,
  sideInputType,
  sideInputClass,
  sideInputMaxLength,
  sideInputVModel,
  placeholder,
  borderColor,
  optionProjection,
  options,
  selected,
  matchFromStart,
  name,
  showSelected,
  keyExtractor,
  autoClearOff,
} = toRefs(props);
const id = ref(JSON.stringify(Math.random()));
const slots = useSlots();
const searchText = ref(modelValue.value || '');

const borderColorComputed = computed(() => (getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value));
const checkIcon = computed(() => !!slots.icon);
const checkButton = computed(() => !!slots.button);
const checkNoElementMessage = computed(() => !!slots.noElementMessage);

const { inputWidth, sideWidthComputed } = useCalcSideWidth(sideWidth);
const filteredItems = computed(() => {
  if (showAll.value) return options.value;
  //options that are still possible
  //escape all characters that have a special meaning in regular expressions
  let escapedQuery = (modelValue.value || searchText.value).replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  let regexp: RegExp;
  if (matchFromStart.value) regexp = new RegExp('^' + escapedQuery, 'i');
  else regexp = new RegExp(escapedQuery, 'i');
  let array: TOpt[] = [];
  try {
    array = options.value?.filter(item => optionProjection.value?.(item).match(regexp));
    if (!array.length) array = array.concat(options.value?.filter(item => optionProjection.value?.(item).match(regexp)));
  } catch {
    array = [];
  }
  if (array.length > 50) return array.slice(0, 50);
  else return array;
});
const isModalOpen = ref(false);
function onOpenModal() {
  console.log('test');
  isModalOpen.value = true;
  setTimeout(() => document.getElementById(id.value)?.focus(), 0);
}
/** is executed when something is entered in selectInput. */
function onInput(event: Event) {
  updateValue(event);
  emit('onInput', {
    modelValue: modelValue.value,
    options: filteredItems.value,
  });
}
/** is executed when the selectInput is focussed */
function onFocus() {
  emit('onFocus', {
    modelValue: modelValue.value,
    options: filteredItems.value,
  });
}

/** is executed when the selectInput is no longer focused */
function onBlur() {
  if (options?.value.find(e => e == (modelValue.value || searchText.value)))
    emit('selectItem', options?.value.find(e => e == (modelValue.value || searchText.value))!);

  emit('onBlur', {
    modelValue: modelValue.value,
    options: filteredItems.value,
  });
}
/** will be executed when an option is selected */
async function selectItem(item: TOpt) {
  if (
    !selected.value.some(e => {
      return keyExtractor.value(e) == keyExtractor.value(item);
    })
  ) {
    if (!autoClearOff.value) updateValue('');
    emit('update:selected', [...selected.value, item]);
    emit('selectItem', item);
  } else {
    deleteItem(item);
  }
}
function deleteItem(item: TOpt) {
  emit(
    'update:selected',
    selected.value.filter(e => keyExtractor.value(e) != keyExtractor.value(item))
  );
  emit('deleteItem', item);
}

/** makes the text you entered in searchInput bold in options */
function boldMatchText(text: string) {
  let regexp: RegExp;
  try {
    regexp = new RegExp(`(${modelValue.value || searchText.value})`, 'ig');
  } catch {
    regexp = new RegExp(`(${(modelValue.value || searchText.value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
  }

  return text.toString().replace(regexp, '<strong>$1</strong>');
}
function updateValue(event: any) {
  if (typeof event == 'string' || typeof event == 'number') {
    emit('update:modelValue', event + '');
    searchText.value = event + '';
  } else {
    emit('update:modelValue', event.target.value);
    searchText.value = event.target.value;
  }
}
function updateSideValue(event: any) {
  emit('update:sideInputVModel', event.target.value);
}
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
.sideButtonSelect,
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
