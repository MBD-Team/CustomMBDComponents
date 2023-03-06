<template>
  <SelectInput :options="options"></SelectInput>
  <MultiSelectInput v-model="date" :selected="list" :options="options" :loading="true"></MultiSelectInput>
  <Button href="/">test</Button>
  <div style="margin: 100px" v-for="i in 10">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere eius dignissimos quis, excepturi quae, atque deserunt impedit repellat non nihil
    illo ratione aliquid rem. Quidem odio hic deleniti possimus. Incidunt?
  </div>
  <Wizard
    title="test"
    :steps="[{ iconName: 'map-marked-alt', title: 'step 1' }, { iconName: 'futbol' }, { iconName: 'building' }, { iconName: 'people-arrows' }]"
    :showStepIndices="false"
    :initialStepIndex="0"
    :initialMaxReachedStep="3"
    :onSubmit="() => {}"
    :showCompletionBtn="false"
    :disableNext="false"
  >
    <template
      v-for="(step, index) in [
        { content: 'test 1' },
        { content: 'testtets 2' },
        { content: 'test 3' },
        { content: 'testtets 4' },
        { content: 'test 5' },
        { content: 'testtets 6' },
      ]"
      #[`step${index}`]
    >
      <div>
        <div>
          <div style="margin: 100px" v-for="i in 10">
            {{ step.content }}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere eius dignissimos quis, excepturi quae, atque deserunt impedit repellat non
            nihil illo ratione aliquid rem. Quidem odio hic deleniti possimus. Incidunt?
          </div>
        </div>
      </div>
    </template>
  </Wizard>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Calendar from './components/Calendar/Calendar.vue';
import ButtonGroup from './components/SexyInputs/ButtonGroup.vue';
import CheckboxInput from './components/SexyInputs/Checkbox.vue';
import CheckboxGroup from './components/SexyInputs/CheckboxGroup.vue';
import DateInput from './components/SexyInputs/Date.vue';
import EmailInput from './components/SexyInputs/Email.vue';
import FileInput from './components/SexyInputs/File.vue';
import MultiFileInput from './components/SexyInputs/MultiFile.vue';
import MultiSelectInput from './components/SexyInputs/MultiSelect.vue';
import NumberInput from './components/SexyInputs/Number.vue';
import PasswordInput from './components/SexyInputs/Password.vue';
import Radiobuttons from './components/SexyInputs/Radiobuttons.vue';
import RadioGroup from './components/SexyInputs/RadioGroup.vue';
import RangeInput from './components/SexyInputs/Range.vue';
import SearchInput from './components/SexyInputs/Search.vue';
import SelectInput from './components/SexyInputs/Select.vue';
import TextInput from './components/SexyInputs/Text.vue';
import TextAreaInput from './components/SexyInputs/Textarea.vue';
import TimeInput from './components/SexyInputs/Time.vue';

import Accordion from './components/Accordion.vue';
import Alert from './components/Alert.vue';
import Button from './components/Button.vue';
import Carousel from './components/Carousel.vue';
import Message from './components/Message.vue';
import Modal from './components/Modal.vue';
import ProgressBar from './components/ProgressBar.vue';
import Spinner from './components/Spinner.vue';
import Tooltip from './components/Tooltip.vue';
import Wizard from './components/Wizard.vue';

const text = ref('alertMessage');
const showAlert = ref(true);

const options = [1, 2, 3];
const list = ref<number[]>([1]);
const selected = ref([]);
const date = ref('');
const number = ref(0);
const files = ref<File[]>([]);
const file = ref<File | null>(null);
const checked = ref(false);
const config = ref<{ text: string; action?: () => Promise<void> | void; class?: string; disabled?: boolean }>({ text: 'test' });
const sections = ref(
  [
    { title: 'Section', content: 'abc' },
    { title: 'Section2', content: 'test' },
  ].map((e, i) => ({ ...e, hash: e.title + i }))
);

const log = console.log;
</script>

<style lang="scss"></style>
