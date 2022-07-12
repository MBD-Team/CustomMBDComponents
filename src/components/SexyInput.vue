<template>
  <div class="input-contain mt-3 shadow-none">
    <!-- search Icon -->
    <div v-if="type == 'search' && (isListVisible || modelValue)" class="search">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
        <path
          d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
        />
      </svg>
    </div>
    <!-- /search Icon -->
    <!-- standard input field -->
    <input
      v-if="type != 'textarea' && type != 'select' && type != 'multiSelect'"
      v-bind="$attrs"
      class="form-control shadow-none"
      :type="viewPassword ? 'text' : type"
      :value="modelValue"
      @input="updateValue"
      :class="[{ dirty: modelValue }, type == 'range' ? 'pe-4' : '', error && labelBorder ? 'mt-4' : '']"
      :style="btnText || type == 'password' || sideInputType ? `border-radius: 0.5rem 0 0 0.5rem; width:${inputWidth}` : ''"
      :id="id"
      :list="id2"
      autocomplete="off"
      :required="type == 'date' || type == 'time'"
    />
    <!-- /standard input field -->
    <!-- options for datalist -->
    <div :id="wrapperId" class="simple-typeahead input-contain" v-if="type == 'select' || type == 'multiSelect'">
      <input
        v-bind="$attrs"
        :id="id"
        class="simple-typeahead-input form-control shadow-none"
        :style="[
          btnText || sideInputType ? `border-radius: 0.5rem 0 0 0.5rem; width:${inputWidth}` : '',
          isListVisible
            ? sideInputType
              ? 'border-radius: 0.5rem 0 0 0;border: 2px solid'
              : 'border-radius: 0.5rem 0.5rem 0 0;border: 2px solid'
            : '',
        ]"
        :class="{ dirty: modelValue }"
        type="text"
        :value="selectedProjection(modelValue) || modelValue"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown.enter.tab.prevent="selectCurrentSelection"
        autocomplete="off"
      />
      <!-- label for select -->
      <label class="placeholder-text">
        <div class="text" :style="labelStyle" :class="{ withBorder: labelBorder }">
          {{ placeholder }}
        </div>
      </label>
      <!-- /label for select -->
      <div
        v-if="isListVisible && (type == 'select' || type == 'multiSelect')"
        class="simple-typeahead-list"
        :style="[btnText || sideInputType ? `width:${inputWidth}` : '']"
      >
        <div v-if="$slots['list-header']">
          <slot name="list-header"></slot>
        </div>
        <div
          class="simple-typeahead-list-item"
          :class="{
            'simple-typeahead-list-item-active': currentSelectionIndex == index,
          }"
          v-for="(item, index) in filteredItems"
          :key="index"
          @mousedown.prevent
          @click.stop="selectItem(item)"
          @mouseenter="currentSelectionIndex = index"
        >
          <span class="simple-typeahead-list-item-text" :data-text="optionProjection(item)" v-if="$slots['list-item-text']">
            <slot name="list-item-text" :item="item" :optionProjection="optionProjection" :boldMatchText="boldMatchText"></slot>
          </span>
          <span
            class="simple-typeahead-list-item-text"
            :data-text="optionProjection(item)"
            v-html="boldMatchText(optionProjection(item))"
            v-else
          ></span>
        </div>
        <div v-if="!filteredItems.length">{{ noElementMessage }}</div>
        <div v-if="$slots['list-footer']">
          <slot name="list-footer"></slot>
        </div>
      </div>
    </div>
    <!-- /options for datalist -->
    <!-- multiSelect list -->
    <div v-for="(multi, index) of multiSelect" :key="JSON.stringify(multi)" class="mb-1 d-flex justify-content-between px-2">
      {{ multi }}
      <span @click="$emit('deleteItem', index)">
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
    <!-- standard textarea field -->
    <textarea
      v-if="type == 'textarea'"
      v-bind="$attrs"
      class="form-control shadow-none"
      @input="updateValue"
      :value="modelValue"
      :class="{ dirty: modelValue }"
      rows="3"
    ></textarea>
    <!-- /standard textarea field -->
    <!-- label for select -->
    <label class="placeholder-text" v-if="type != 'select' && type != 'multiSelect'">
      <div class="text" :style="labelStyle" :class="{ withBorder: labelBorder }">
        {{ placeholder }}
      </div>
    </label>
    <!-- /label for select -->
    <!-- sideInput -->
    <input
      v-if="sideInputType"
      class="sideInput"
      :type="sideInputType"
      :style="sideInputStyle"
      :maxlength="sideInputMaxLength"
      @input="updateSideValue"
      :value="sideInputVModel"
    />
    <!-- /sideInput -->
    <!-- sideInput for rangeInput -->
    <input
      type="number"
      class="sideInput"
      @input="updateValue"
      :value="modelValue"
      :style="sideInputStyle"
      v-if="type == 'range'"
      :min="element?.min || 0"
      :max="element?.max || 100"
    />
    <!-- /sideInput for rangeInput -->
    <!-- sideButton -->
    <button v-if="btnText" type="button" @click="affirm()" :class="btnClass">
      {{ btnText }}
    </button>
    <!-- /sideButton -->
    <!-- sideButton for passwordInput -->
    <button v-if="type == 'password'" type="button" @click="showPassword()" :class="btnClass">
      <template v-if="!viewPassword">
        <svg xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
          <path
            d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"
          />
          <path
            d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"
          />
          <path
            d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"
          />
        </svg>
      </template>
      <template v-else>
        <svg xmlns="http://www.w3.org/2000/svg" width="70%" height="70%" fill="currentColor" class="bi bi-eye" viewBox="0 0 14 16">
          <path
            d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"
          />
          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
        </svg>
      </template>
    </button>
    <!-- /sideButton for passwordInput -->
  </div>
  <!-- error -->
  <div v-if="error" class="error">
    {{ error }}
  </div>
  <!-- /error -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {
      console,
    };
  },
  props: {
    placeholder: {
      type: String as any,
      required: true,
    },
    modelValue: {
      type: String as any,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    btnText: {
      type: String,
    },
    btnClass: {
      type: String,
    },
    btnAction: {
      type: Function,
    },
    sideInputType: {
      type: String,
    },
    sideInputStyle: {
      type: String,
    },
    sideInputMaxLength: {
      type: String,
    },
    sideInputOnInput: {
      type: Function,
      default: () => {
        return;
      },
    },
    sideInputVModel: {
      type: String,
    },
    sideWidth: {
      type: String,
      default: '20%',
    },
    labelStyle: {
      type: String,
    },
    labelBorder: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
    },
    optionProjection: {
      type: Function,
      default: (item: any) => {
        return item;
      },
    },
    selectedProjection: {
      type: Function,
      default: (item: any) => {
        return item;
      },
    },
    minInputLength: {
      type: Number,
      default: 2,
      validator: (prop: any) => {
        return prop >= 0;
      },
    },
    noElementMessage: {
      type: String,
      default: 'not found',
    },
    controlInput: {
      type: Boolean,
      default: true,
    },
    selectOnBlur: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
    },
    borderColor: {
      type: String,
      default: 'black',
    },
    errorColor: {
      type: String,
      default: 'red',
    },
    multiSelect: {
      type: Array,
    },
  },
  data() {
    return {
      id: 'input' + Math.random(), //id for the standard input field
      id2: 'list' + Math.random(), //id for the datalist
      viewPassword: false,
      element: null as unknown as HTMLInputElement, //the standard element
      isListVisible: false, //make the datalist Visible
      currentSelectionIndex: 0, //the index of the selected option in datalist
    };
  },
  computed: {
    wrapperId() {
      //the id for the div around the datalist
      return `${this.id}_wrapper`;
    },
    filteredItems() {
      //options that are still possible
      const regexp = new RegExp(this.escapeRegExp(this.modelValue), 'i');
      let array = this.options!.filter(item => this.optionProjection(item).match(regexp));
      if (!array.length) array = array.concat(this.options!.filter((item: any) => item.match(regexp)));
      return array.filter(e => !this.multiSelect?.includes(e));
    },
    currentSelection() {
      //the option which is currently selected
      return this.isListVisible && this.currentSelectionIndex < this.filteredItems.length
        ? this.filteredItems[this.currentSelectionIndex]
        : undefined;
    },
    borderColorComputed() {
      //determines the color of the border
      return this.error ? this.errorColor : this.borderColor;
    },
    rangeTrackSize() {
      //determines the marked area of rangeInput
      if (!this.element) return '0%';
      const min = +this.element!.min || 0;
      const max = +this.element!.max || 100;
      const value = parseInt(this.modelValue);
      const size = ((value - min) / (max - min)) * 100;
      return size + '%';
    },
    inputWidth() {
      let width = 100;
      if (this.type == 'range' || this.type == 'password' || this.sideInputType || this.btnText) {
        width -= parseInt(this.sideWidth);
      }
      return width + '%';
    },
  },
  mounted() {
    if (this.type == 'date') {
      //set standard value to today
      if (this.modelValue.length == 10) {
        //return when standard value is set
        return;
      }
      const date = new Date();
      const result = date.toISOString().split('T')[0];
      this.updateValue(result);
    }
    if (this.type == 'time') {
      //set standard value to current time
      if (this.modelValue.length == 5) {
        //return when standard value is set
        return;
      }
      const date = new Date();
      let time = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
      this.updateValue(time);
    }
    if (this.type == 'range') {
      //set Element to standardInput and sets the background in the range input
      setTimeout(() => {
        this.element = document.getElementById(this.id) as HTMLInputElement;
      }, 1);
    }
  },
  methods: {
    showPassword() {
      //makes password visible/invisible
      this.viewPassword = !this.viewPassword;
    },
    updateValue(event: any) {
      //correct the value if necessary and update it
      if (this.controlInput) {
        if (this.type == 'range') {
          let inputValue = parseInt(event.target.value);
          if (inputValue > (event.target.max || 100)) inputValue = parseInt(event.target.max) || 100;
          if (inputValue < (event.target.min || 0)) inputValue = parseInt(event.target.min) || 0;
          if (isNaN(inputValue)) inputValue = 0;
          this.$emit('update:modelValue', inputValue);
          return;
        }
      }
      if (typeof event == 'string') {
        this.$emit('update:modelValue', event);
      } else {
        if (this.type == 'number') {
          this.$emit('update:modelValue', event.target.value * 1);
        } else {
          this.$emit('update:modelValue', event.target.value);
        }
      }
    },
    updateSideValue(event: any) {
      //update the sideInput value
      this.$emit('update:sideInputVModel', event.target.value);
    },
    async affirm() {
      //executes the btnAction
      try {
        if (this.btnAction) await this.btnAction();
      } catch {
        return;
      }
    },
    onInput(event: Event) {
      //is executed when something is entered in selectInput.
      if (this.isListVisible && this.currentSelectionIndex >= this.filteredItems.length) {
        this.currentSelectionIndex = (this.filteredItems.length || 1) - 1;
      }
      this.updateValue(event);
      this.$emit('onInput', {
        modelValue: this.modelValue,
        options: this.filteredItems,
      });
    },
    onFocus() {
      //is executed when the selectInput is focussed

      this.isListVisible = true;
      if (this.type != 'select') return;
      this.$emit('onFocus', {
        modelValue: this.modelValue,
        options: this.filteredItems,
      });
    },
    onBlur() {
      //is executed when the selectInput is no longer focused
      this.isListVisible = false;
      if (this.type != 'select' && this.type != 'multiSelect') return;
      if (this.controlInput) {
        if (!this.filteredItems?.some(e => this.optionProjection(e) == this.modelValue)) {
          this.updateValue('');
          return;
        }
      }
      if (this.selectOnBlur) {
        if (this.options?.find(e => this.optionProjection(e) == this.modelValue)) {
          this.$emit(
            'selectItem',
            this.options?.find(e => this.optionProjection(e) == this.modelValue)
          );
        } else {
          if (this.options?.find(e => e == this.modelValue))
            this.$emit(
              'selectItem',
              this.options?.find(e => e == this.modelValue)
            );
        }
      }
      this.$emit('onBlur', {
        modelValue: this.modelValue,
        options: this.filteredItems,
      });
    },
    scrollSelectionIntoView() {
      //makes it possible to scroll the datalist
      setTimeout(() => {
        const list_node = document.querySelector(`#${this.wrapperId} .simple-typeahead-list`) as HTMLElement;
        const active_node = document.querySelector(`#${this.wrapperId} .simple-typeahead-list-item.simple-typeahead-list-item-active`) as HTMLElement;
        if (
          !(
            active_node!.offsetTop >= list_node.scrollTop &&
            active_node.offsetTop + active_node.offsetHeight < list_node.scrollTop + list_node.offsetHeight
          )
        ) {
          let scroll_to = 0;
          if (active_node.offsetTop > list_node.scrollTop) {
            scroll_to = active_node.offsetTop + active_node.offsetHeight - list_node.offsetHeight;
          } else if (active_node.offsetTop < list_node.scrollTop) {
            scroll_to = active_node.offsetTop;
          }
          list_node.scrollTo(0, scroll_to);
        }
      });
    },
    selectCurrentSelection() {
      //takes the currently selected option when pressing enter
      if (this.currentSelection) {
        this.selectItem(this.currentSelection);
      }
    },
    async selectItem(item: any) {
      //will be executed when an option is selected
      await this.updateValue(this.optionProjection(item));
      this.currentSelectionIndex = 0;
      document.getElementById(this.id)!.blur();
      if (!this.selectOnBlur) this.$emit('selectItem', item);
    },
    escapeRegExp(string: string) {
      //filters unwanted characters from a string
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },
    boldMatchText(text: string) {
      //makes the text you entered in searchInput bold in options
      const regexp = new RegExp(`(${this.escapeRegExp(this.modelValue)})`, 'ig');
      return text.replace(regexp, '<strong>$1</strong>');
    },
  },
});
</script>
<style scoped lang="scss">
//material inputs
.error {
  padding-left: 0.1rem;
  padding-right: 0.1rem;
  background-color: transparent;
  color: v-bind(errorColor);
  z-index: 1;
  text-align: start;
  font-size: 0.8rem;
}
.input-contain {
  position: relative;
  border-radius: 0.5rem;
  .search {
    content: '';
    background-color: white;
    position: absolute;
    z-index: 1;
    top: 0.5rem;
    left: 0.2rem;
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
  }
  input[type='number'] {
    -moz-appearance: textfield;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  input[type='range'] + label + input[type='number'] {
    padding: 0;
    text-align: center;
  }

  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    border-radius: 0.5rem 0 0 0.5rem;
    width: v-bind(inputWidth);
    cursor: pointer;
    &::-moz-range-track {
      height: 0.2rem;
      background: linear-gradient(to right, #293043, #293043), #d7d7d7;
      background-size: var(--background-size, 0%) 100%;
      background-repeat: no-repeat;
      border-radius: 5px;
    }
    &::-webkit-slider-runnable-track {
      height: 0.2rem;
      background: linear-gradient(to right, #293043, #293043), #d7d7d7;
      background-size: v-bind(rangeTrackSize);
      background-repeat: no-repeat;
      border-radius: 5px;
    }
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 1rem;
      height: 1rem;
      background: #293043;
      border: 1px white solid;
      border-radius: 50%;
      margin-top: -0.4rem;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
    }
    &::-moz-range-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 1rem;
      height: 1rem;
      background: #293043;
      border: 1px white solid;
      border-radius: 50%;
      margin-top: -0.4rem;
      box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
    }
  }
  input[type='select'] {
    &::-webkit-calendar-picker-indicator {
      opacity: 0;
    }
  }
  input[type='search'] {
    padding-left: 2rem;
    &::-webkit-search-cancel-button {
      display: none;
    }
  }
  input[type='date'],
  input[type='time'] {
    &::-webkit-calendar-picker-indicator {
      display: flex;
      justify-content: end;
      cursor: pointer;
      height: 1.5rem;
      width: 1.5rem;
    }
  }

  input[type='file'] {
    &::-webkit-file-upload-button {
      display: none;
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
    width: v-bind(sideWidth);
    border-radius: 0 0.5rem 0.5rem 0;
    border-width: 1px;
    border-color: v-bind(borderColorComputed);
    border-style: solid;
    border-left: none;
    display: flex;
    background-color: white;
    justify-content: center;
    outline: none;
  }
  input + .placeholder-text {
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    color: gray;
    pointer-events: none;

    .text {
      font-size: 1rem; // placeholder
      padding: 0 0rem;
      margin: 0 0.6rem;
      transform: translate(0);
      color: gray;
      border-radius: 0.5rem;
      transition: transform 0.15s ease-out, font-size 0.15s ease-out, background-color 0.2s ease-out, color 0.15s ease-out;
    }
  }
  input:focus + .placeholder-text .text,
  input.dirty + .placeholder-text .text,
  input[type='range'] + .placeholder-text .text,
  input[type='file'] + .placeholder-text .text {
    background-color: white;
    border-radius: 0.5rem 0.5rem 0rem 0rem;
    font-size: 0.9rem;
    padding: 0 0.3rem;
    color: black;
    transform: translate(0, -1.15rem);
    &.text.withBorder:after {
      content: '';
      position: absolute;
      left: 0px;
      width: 100%;
      height: 50%;
      margin-top: -1px;
      border-radius: 0.5rem 0.5rem 0rem 0rem;
      border-left: 1px solid;
      border-right: 1px solid;
      border-top: 1px solid;
      border-color: v-bind(borderColorComputed);
    }
  }
  input:focus + .placeholder-text .text {
    border-color: var(--navbarColor1);
    color: var(--navbarColor1);
  }

  textarea {
    text-align: start;
    padding-left: 1rem;
    min-height: 3.5rem;
    width: 100%;
    border: 1px solid;
    border-color: v-bind(borderColorComputed);
    border-radius: 0.5rem;
    padding-top: 1rem;
    text-shadow: none;
  }
  .placeholder-text {
    align-items: start;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    color: gray;
    pointer-events: none;

    .text {
      font-size: 1.4rem; // placeholder
      padding: 0 0.3rem;
      margin: 0.6rem 0.2rem;
      transform: translate(0);
      transition: transform 0.15s ease-out, font-size 0.15s ease-out, background-color 0.2s ease-out, color 0.15s ease-out;
    }
  }
  textarea:focus + .placeholder-text .text,
  textarea.dirty + .placeholder-text .text {
    background-color: white;
    border-radius: 0.5rem;
    padding: 0 0.3rem;
    margin: 0.6rem 0.6rem;
    font-size: 0.9rem;
    color: black;
    transform: translate(0, -1.2rem);
    &.text.withBorder:after {
      content: '';
      position: absolute;
      left: 0px;
      width: 100%;
      margin-top: -1px;
      border-radius: 0.5rem 0.5rem 0rem 0rem;
      height: 50%;
      border-top: 1px solid;
      border-left: 1px solid;
      border-right: 1px solid;
      border-color: v-bind(borderColorComputed);
    }
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
    max-height: 30vh;
    overflow-y: auto;
    background-color: #fafafa;
    border-radius: 0 0 0.5rem 0.5rem;
    border: 2px solid;
    border-color: v-bind(borderColorComputed);
    border-top: none;
    z-index: 1;
    cursor: pointer;
    .simple-typeahead-list-item {
      border-bottom: 1px solid;
      border-color: v-bind(borderColorComputed);
      border-right: 1px solid;
      padding: 0.6rem 1rem;
      &.simple-typeahead-list-item-active {
        background-color: #e1e1e1;
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
      width: 12px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 0.5rem;
      background-color: #555;
    }
  }
}
</style>
