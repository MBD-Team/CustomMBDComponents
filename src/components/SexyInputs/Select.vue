<template>
  <div :id="'scroll' + id"></div>
  <div class="selectInput" :class="placeholder ? 'mt-3' : ''">
    <div class="simple-typeahead input-contain" :style="{ backgroundColor: backgroundColor }">
      <!-- icon -->
      <div v-if="checkIcon && (isListVisible || modelValue)" class="icon">
        <slot name="icon"></slot>
      </div>
      <!-- /icon -->
      <input
        v-bind="attrs"
        v-if="(listWidth = document.getElementById(id)?.getBoundingClientRect().width + 'px') || true"
        :id="id"
        class="simple-typeahead-input form-control shadow-none"
        :style="[
          checkButton || sideInputType ? `border-radius: 0.5rem 0 0 0.5rem; width:${inputWidth}` : '',
          isListVisible
            ? checkButton || sideInputType
              ? 'border-radius: 0.5rem 0 0 0;border-width: 2px '
              : 'border-radius: 0.5rem 0.5rem 0 0;border-width: 2px '
            : '',
          checkIcon ? 'padding-left: 1.5rem;' : 'padding-left: none;',
        ]"
        :class="{ dirty: modelValue }"
        type="text"
        :value="optionProjection(modelValue) || modelValue"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        autocomplete="off"
      />
      <!-- label for select -->
      <label class="text" :class="labelClass" v-if="placeholder">
        {{ placeholder }}
      </label>
      <!-- /label for select -->
      <!-- options for select -->
      <div
        class="simple-typeahead-list p-0"
        :class="listClass"
        :style="checkButton || sideInputType ? `width:${inputWidth}` : ''"
        v-if="isListVisible"
      >
        <div class="scroll rounded-2">
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
            {{ noElementMessage }}
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
  </div>
</template>
<script lang="ts">
/**
 * ```js
 * const options = ref<any[]>([])
 * const text = ref('')
 * ```
 * ```html
 * <SelectInput  v-model="text" :options="options"></SelectInput>
 *
 * <SelectInput  v-model="text" :options="options" :optionProjection="(e)=>e"></SelectInput>
 * ```
 */
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, ref, toRefs, useSlots, useAttrs } from 'vue';
import { getErrorMessage, useCalcSideWidth, InputError } from './Index';
import Error from './common/Error.vue';

type Any = any;
interface Option extends Any {}

const attrs = useAttrs();
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
    modelValue: string;
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
    optionProjection: (e: Option) => e + '',
    listItemClass: () => '',
    name: '',
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
const isListVisible = ref(false);
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
  if (matchFromStart.value) regexp = new RegExp('^' + modelValue.value, 'i');
  else regexp = new RegExp(modelValue.value, 'i');
  let array = [] as any[];
  try {
    array = options.value?.filter(item => optionProjection.value?.(item).match(regexp));
    if (!array.length) array = array.concat(options.value?.filter((item: any) => item.match(regexp)));
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
    listWidth.value = document.getElementById(id.value)?.getBoundingClientRect().width + 'px';
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
  if (controlInput.value) {
    if (!filteredItems.value?.some(e => optionProjection.value(e) == modelValue.value)) {
      updateValue('');
      return;
    }
  }
  if (selectOnBlur.value) {
    if (options?.value.find(e => optionProjection.value(e) == modelValue.value)) {
      emit(
        'selectItem',
        options?.value.find(e => optionProjection.value(e) == modelValue.value)
      );
    } else {
      if (options?.value.find(e => e == modelValue.value))
        emit(
          'selectItem',
          options?.value.find(e => e == modelValue.value)
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
}

function boldMatchText(text: string) {
  //makes the text you entered in searchInput bold in options
  const regexp = new RegExp(`(${modelValue.value})`, 'ig');
  return text.replace(regexp, '<strong>$1</strong>');
}
function updateValue(event: any) {
  //correct the value if necessary and update it
  if (typeof event == 'string') emit('update:modelValue', event);
  else emit('update:modelValue', event.target.value);
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
