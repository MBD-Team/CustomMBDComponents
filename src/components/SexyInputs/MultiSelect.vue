<template>
  <div class="mt-3">
    <div class="simple-typeahead input-contain">
      <!-- icon -->
      <div v-if="checkIcon && (isListVisible || modelValue)" class="icon">
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
        :class="{ dirty: modelValue }"
        type="text"
        :value="optionProjection(modelValue) || modelValue"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        autocomplete="off"
      />
      <!-- label for select -->
      <label class="text" :class="labelClass">
        {{ placeholder }}
      </label>
      <!-- /label for select -->
      <!-- options for select -->
      <div class="simple-typeahead-list" :class="listClass" :style="[checkButton || sideInputType ? `width:${inputWidth}` : '']" v-if="isListVisible">
        <div
          class="simple-typeahead-list-item"
          :class="listItemClass(item)"
          v-for="(item, index) in filteredItems"
          :key="Math.random()"
          @mousedown.prevent
          @click.stop="selectItem(item, index)"
        >
          <Checkbox :value="selected.some(e => keyExtractor(e) == keyExtractor(item))">
            <span class="simple-typeahead-list-item-text" :data-text="optionProjection(item)" v-html="boldMatchText(optionProjection(item))"></span>
          </Checkbox>
        </div>
        <div v-if="!filteredItems?.length" class="simple-typeahead-list-item" :class="listItemClass(noElementMessage)">
          {{ noElementMessage }}
        </div>
      </div>
      <!-- /options for select -->
      <!-- sideButton -->
      <button v-if="checkButton" :type="btnType" @click="affirm()" :class="btnClass">
        <slot name="button"></slot>
      </button>
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
      v-for="(multi, index) of selected"
      :key="Math.random()"
      class="mt-1 d-flex justify-content-between px-2"
      :class="multiSelectClass(multi)"
    >
      {{ optionProjection(options.find(e => keyExtractor(e) == keyExtractor(multi))) }}
      <span @click="deleteItem(multi, index)" style="cursor: pointer">
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
    <!-- /multiSelect list -->
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { computed, ref, toRefs, useSlots, watch } from 'vue';
import { getErrorMessage, useCalcSideWidth } from './Index';
import Error from './common/Error.vue';
import Checkbox from './Checkbox.vue';
const emit = defineEmits([
  'update:selected',
  'update:modelValue',
  'update:sideInputVModel',
  'onInput',
  'onFocus',
  'selectItem',
  'onBlur',
  'deleteItem',
]);
const props = withDefaults(
  defineProps<{
    modelValue: string;
    options: any[];
    selected: any[];
    placeholder: string;
    noElementMessage?: string;
    listClass?: string;
    name?: string;
    error?: { [key: string]: string | string[] } | string;
    errorColor?: string;
    labelClass?: string;
    btnType?: 'button' | 'submit' | 'reset';
    btnClass?: string;
    btnAction?: Function;
    sideWidth?: number;
    sideInputType?: 'number' | 'text';
    sideInputClass?: string;
    sideInputMaxLength?: string;
    sideInputVModel?: any;
    borderColor?: string;
    optionProjection?: Function;
    listItemClass?: Function;
    multiSelectClass?: Function;
    matchFromStart?: boolean;
    showSelected?: boolean;
    keyExtractor?: Function;
  }>(),
  {
    error: '',
    noElementMessage: 'not found',
    controlInput: true,
    selectOnBlur: true,
    matchFromStart: false,
    errorColor: 'red',
    sideWidth: 20,
    optionProjection: (item: any) => {
      return item;
    },
    listItemClass: (item: any) => {
      return '';
    },
    multiSelectClass: (item: any) => {
      return '';
    },
    keyExtractor: (item: any) => {
      return JSON.stringify(item);
    },
    name: '',
    showSelected: true,
  }
);
const {
  modelValue,
  noElementMessage,
  listClass,
  error,
  errorColor,
  labelClass,
  btnType,
  btnClass,
  btnAction,
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
} = toRefs(props);
const id = ref(JSON.stringify(Math.random()));
const slots = useSlots();
const isListVisible = ref(false);

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
  //options that are still possible
  let regexp: RegExp;
  if (matchFromStart.value) regexp = new RegExp('^' + escapeRegExp(modelValue.value), 'i');
  else regexp = new RegExp(escapeRegExp(modelValue.value), 'i');
  let array = [] as any[];
  try {
    array = options.value?.filter(item => optionProjection.value?.(typeof item == 'number' ? item.toString() : item).match(regexp));
    if (!array.length) array = array.concat(options.value?.filter((item: any) => (typeof item == 'number' ? item.toString() : item).match(regexp)));
  } catch {
    array = [];
  }
  if (array.length > 50) return array.slice(0, 50);
  else return array;
});

async function affirm() {
  //executes the btnAction
  if (btnAction?.value) await btnAction.value();
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
  isListVisible.value = true;
  emit('onFocus', {
    modelValue: modelValue.value,
    options: filteredItems.value,
  });
}

function onBlur() {
  //is executed when the selectInput is no longer focused
  isListVisible.value = false;

  if (options?.value.find(e => e == modelValue.value))
    emit(
      'selectItem',
      options?.value.find(e => e == modelValue.value)
    );

  emit('onBlur', {
    modelValue: modelValue.value,
    options: filteredItems.value,
  });
}
async function selectItem(item: any, index: number) {
  //will be executed when an option is selected
  if (!selected.value.some(e => keyExtractor.value(e) == keyExtractor.value(item))) {
    emit('update:selected', [...selected.value, item]);
    emit('selectItem', item);
  } else {
    deleteItem(item, index);
  }
}
function deleteItem(item: any, index: number) {
  emit(
    'update:selected',
    selected.value.filter(e => keyExtractor.value(e) != keyExtractor.value(item))
  );
  emit('deleteItem', item);
}
function escapeRegExp(string: string) {
  //filters unwanted characters from a string
  return string.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function boldMatchText(text: string) {
  //makes the text you entered in searchInput bold in options
  const regexp = new RegExp(`(${escapeRegExp(modelValue.value)})`, 'ig');
  return text.toString().replace(regexp, '<strong>$1</strong>');
}
function updateValue(event: any) {
  if (typeof event == 'string' || typeof event == 'number') emit('update:modelValue', event);
  else emit('update:modelValue', event.target.value);
}
function updateSideValue(event: any) {
  emit('update:sideInputVModel', event.target.value);
}
</script>
<style scoped lang="scss">
.input-contain {
  position: relative;
  border-radius: 0.5rem;

  .icon {
    background-color: transparent;
    position: absolute;
    top: 0.5rem;
    left: 0.3rem;
    z-index: 2;
  }
  input {
    text-align: start;
    padding-left: 1rem;
    padding-top: 0.5rem;
    height: 2.5rem;
    width: 100%;
    border: 1px solid;
    border-color: v-bind(borderColorComputed);
    border-radius: 0.5rem;
    &:hover:not(:focus) + .text,
    &:hover:not(:focus) {
      @media (pointer: fine) {
        filter: brightness(95%);
      }
    }
    &:focus {
      border-width: 2px;
    }
  }
  button {
    transition: all 0.25s ease-out;
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
  input.sideInput {
    &:focus {
      border: 2px solid;
      border-color: v-bind(borderColorComputed);
    }
  }
  button,
  input.sideInput {
    align-items: center;
    text-align: center;
    position: absolute;
    padding: 0;
    top: 0;
    bottom: 0;
    left: v-bind(inputWidth);
    right: 0;
    width: v-bind(sideWidthComputed);
    border-radius: 0 0.5rem 0.5rem 0;
    border-width: 1px;
    border-color: v-bind(borderColorComputed);
    border-style: solid;
    border-left: none;
    background-color: white;
    justify-content: center;
    outline: none;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  input + .text {
    align-items: center;
    position: absolute;
    top: 0.5rem;
    bottom: 0;
    left: 0;
    height: min-content;
    display: flex;
    color: gray;
    pointer-events: none;
    font-size: 1rem;
    padding: 0 0rem;
    margin: 0 0.6rem;
    transform: translate(0);
    color: gray;
    border-radius: 0.5rem;
    transition: transform 0.15s ease-out, font-size 0.15s ease-out, background-color 0.2s ease-out, color 0.15s ease-out, 0.15s padding ease-in-out;
  }
  input:focus + .text,
  input.dirty + .text {
    background-color: white;
    border-radius: 0.5rem 0.5rem 0rem 0rem;
    font-size: 0.9rem;
    padding: 0 0.3rem;
    color: black;
    transform: translate(0, -1rem);
    height: 0.9rem;
  }
}
//select
.simple-typeahead {
  position: relative;
  width: 100%;
  & > input {
    margin-bottom: 0;
  }
  .simple-typeahead-list {
    position: absolute;
    width: 100%;
    max-height: 60vh;
    @media (min-width: 900px) {
      max-height: 30vh;
    }
    overflow-y: auto;
    background-color: #fafafa;
    border-radius: 0 0 0.5rem 0.5rem;
    border: 2px solid;
    border-color: v-bind(borderColorComputed);
    border-top: none;
    z-index: 2;
    cursor: pointer;
    .simple-typeahead-list-item {
      border-bottom: 1px solid;
      border-color: v-bind(borderColorComputed);
      background-color: #fafafa;
      padding: 0.6rem 1rem;
      &:hover {
        @media (pointer: fine) {
          filter: brightness(95%);
        }
      }
      &:last-child {
        border-bottom: none;
      }
    }
    &::-webkit-scrollbar-track {
      border-radius: 0 0 0.5rem 0;
      background-color: transparent;
    }

    &::-webkit-scrollbar {
      width: 0.5rem;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 0.5rem;
      background-color: #555;
    }
  }
}
</style>
