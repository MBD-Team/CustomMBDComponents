<template>
  <div id="app" style="height: 100vh" class="d-flex align-items-center flex-column">
    <Wizard
      :steps="[{ iconName: 'map-marked-alt' }, { iconName: 'futbol' }, { iconName: 'building' }, { iconName: 'people-arrows' }]"
      :title="'testTitle'"
      :showStepIndices="true"
      :initialStepIndex="0"
      :onSubmit="() => console.log('submit')"
    >
      <!-- this is possible to optimize using Dynamic Slot Names: #[dynamicSlotName], need computed property tho-->
      <template #step0>1</template>
      <template #step1>2</template>
      <template #step2>3</template>
      <template #step3>4</template>
    </Wizard>
  </div>
</template>

<script setup lang="ts">
import Modal from '../src/components/Modal.vue';
import Button from '../src/components/Button.vue';
import Spinner from '../src/components/Spinner.vue';
import Calendar from '../src/components/Calendar/Calendar.vue';
import Carousel from '../src/components/Carousel.vue';
import CheckboxGroup from '../src/components/SexyInputs/CheckboxGroup.vue';
import RadioGroup from '../src/components/SexyInputs/RadioGroup.vue';
import ButtonGroup from '../src/components/SexyInputs/ButtonGroup.vue';
import Tooltip from '../src/components/Tooltip.vue';
import Search from '../src/components/SexyInputs/Search.vue';
import { handleClick } from '../src/utils/clickHandler';
import Wizard from '../src/components/Wizard.vue';
import { ref } from 'vue';

const console = window.console;

const items = ref([
  { text: 'testdsvgfhjsbvdhj', value: 1, function: () => console.log('test') },
  { text: 'abc', value: 2, function: () => console.log('abc') },
  { text: 'a', value: 3, function: () => console.log('a') },
  { text: 'b', value: 4, function: () => console.log('b') },
]);

const loading = ref(false);
const groups = ref([{ id: 1, name: 'Group1', checked: true }]);
</script>
<style lang="scss"></style>
