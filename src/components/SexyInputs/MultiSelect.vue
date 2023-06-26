<template>
  <div :id="'scroll' + id"></div>
  <div class="selectInput" :class="placeholder ? 'mt-3' : ''">
    <div class="simple-typeahead input-contain">
      <!-- icon -->
      <div v-if="checkIcon && (isListVisible || modelValue || searchText)" class="icon">
        <slot name="icon"></slot>
      </div>
      <!-- /icon -->
      <input
        v-bind="$attrs"
        :id="id"
        class="simple-typeahead-input form-control shadow-none"
        :style="[
          checkButton || sideInputType ? `border-radius: 0.5rem 0 0 0.5rem; width:${inputWidth}` : '',
          isListVisible
            ? checkButton || sideInputType
              ? 'border-radius: 0.5rem 0 0 0;border-width: 2px'
              : 'border-radius: 0.5rem 0.5rem 0 0;border-width: 2px'
            : '',
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
      <!-- label for select -->
      <label class="text" :class="labelClass" v-if="placeholder">
        {{ placeholder }}
      </label>
      <!-- /label for select -->
      <!-- options for select -->
      <div
        class="simple-typeahead-list shadow"
        :class="listClass"
        :style="[checkButton || sideInputType ? `width:${inputWidth}` : '']"
        v-if="isListVisible"
      >
        <div v-if="loading" class="text-center p-2">
          <Spinner size="1.5rem"></Spinner>
        </div>
        <div v-else :style="selected.length > 0 ? '' : ''">
          <!-- chips -->
          <div class="py-1 d-flex flex-wrap" style="border-bottom: 1px solid black">
            <div v-for="item of selected" class="chip rounded px-2 border border-dark m-1" @click.stop="selectItem(item)" @mousedown.prevent>
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
              {{ noElementMessage }}
            </div>
          </div>
        </div>
      </div>
      <!-- /options for select -->
      <!-- sideButton -->
      <button class="sideButton" v-if="checkButton" :style="`width:${sideWidthComputed}`"><slot name="button"></slot></button>
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
      />
      <!-- /sideInput -->
    </div>
    <!-- error -->
    <Error :error="error" :error-color="errorColor" :name="name" />
    <!-- /error -->
    <!-- multiSelect list -->
    <div
      v-if="showSelected"
      v-for="multi of selected"
      :key="Math.random()"
      class="mt-1 d-flex justify-content-between px-2"
      :class="multiSelectClass(multi)"
    >
      {{ optionProjection(options.find(e => keyExtractor(e) == keyExtractor(multi))) }}
      <span @click="deleteItem(multi)" style="cursor: pointer" v-if="!disabled">
        <i class="fa fa-trash"></i>
      </span>
    </div>
    <!-- /multiSelect list -->
  </div>
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
<script setup lang="ts">
import { computed, onMounted, ref, toRefs, useSlots } from 'vue';
import { getErrorMessage, useCalcSideWidth, InputError } from './Index';
import Error from './common/Error.vue';
import Checkbox from './Checkbox.vue';
import Spinner from '../Spinner.vue';

type Any = any;
interface Option extends Any {}

const emit = defineEmits<{
  (e: 'update:selected', selected: Option[]): void;
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
  (e: 'deleteItem', option: Option): void;
}>();
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    modelValue?: string;
    /**
     * Option is inferred from `options` prop
     */
    options: Option[];
    selected: Option[];
    showAll?: boolean;
    placeholder?: string;
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
    sideInputVModel?: string;
    borderColor?: string;
    optionProjection?: (option: Option) => string;
    listItemClass?: (option: Option) => string;
    multiSelectClass?: (option: Option) => string;
    matchFromStart?: boolean;
    showSelected?: boolean;
    keyExtractor?: (option: Option) => string;
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
    optionProjection: (o: Option) => o,
    listItemClass: () => '',
    multiSelectClass: () => '',
    keyExtractor: (o: Option) => JSON.stringify(o),
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
  selected,
  matchFromStart,
  name,
  showSelected,
  keyExtractor,
  autoClearOff,
} = toRefs(props);
const id = ref(JSON.stringify(Math.random()));
const slots = useSlots();
const isListVisible = ref(false);
const searchText = ref('');
const document = window.document;

const borderColorComputed = computed(() => {
  return getErrorMessage(error.value, name.value) ? errorColor?.value : borderColor?.value;
});
const checkIcon = computed(() => {
  return !!slots.icon;
});
const checkButton = computed(() => {
  return !!slots.button;
});
const { inputWidth, sideWidthComputed } = useCalcSideWidth(sideWidth);
const filteredItems = computed(() => {
  if (showAll.value) return options.value;
  //options that are still possible
  let regexp: RegExp;
  if (matchFromStart.value) regexp = new RegExp('^' + (modelValue.value || searchText.value), 'i');
  else regexp = new RegExp(modelValue.value || searchText.value, 'i');
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
  isListVisible.value = true;
  setTimeout(() => {
    document.getElementById('scroll' + id.value)?.scrollIntoView();
  }, 0);
  emit('onFocus', {
    modelValue: modelValue.value,
    options: filteredItems.value,
  });
}

function onBlur() {
  //is executed when the selectInput is no longer focused
  isListVisible.value = false;

  if (options?.value.find(e => e == (modelValue.value || searchText.value)))
    emit(
      'selectItem',
      options?.value.find(e => e == (modelValue.value || searchText.value))
    );

  emit('onBlur', {
    modelValue: modelValue.value,
    options: filteredItems.value,
  });
}
async function selectItem(item: Option) {
  //will be executed when an option is selected
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
function deleteItem(item: Option) {
  emit(
    'update:selected',
    selected.value.filter(e => keyExtractor.value(e) != keyExtractor.value(item))
  );
  emit('deleteItem', item);
}

function boldMatchText(text: string) {
  //makes the text you entered in searchInput bold in options
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

function outputsize() {
  listWidth.value = document.getElementById(id.value)?.getBoundingClientRect().width + 'px';
}
outputsize();
onMounted(() => new ResizeObserver(outputsize).observe(document.getElementById(id.value)));
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
  width: v-bind(sideWidthComputed) !important;
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
