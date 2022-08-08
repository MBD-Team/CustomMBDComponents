import * as Inputs from '../components/SexyInputs/index';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: { ...Inputs },
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const InputFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Inputs[keyof typeof Inputs]> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { ...Inputs },
      setup() {
        return { args, console, DateVmodel: ref(''), FileVModel: ref(null), MultiArray: ref([]), StringVModel: ref(''), NumberVModel: ref(0) };
      },
      template: template(otherArgs),
    };
  };

//👇 Each story then reuses that template
export const Button = InputFromTemplate(
  args =>
    String.raw`
    <Button ${args}>test</Button>
  `
);
export const Checkbox = InputFromTemplate(
  args =>
    String.raw`
    <Checkbox ${args} >test</Checkbox>
  `
);
export const Radiobuttons = InputFromTemplate(
  args =>
    String.raw`
            <Radiobuttons  :options=" [
              { value: 1, text: 'eins' },
              { value: 2, text: 'zwei' },
              { value: 3, text: 'drei' },
          ]"${args}></Radiobuttons>
          `
);
export const Date = InputFromTemplate(
  args =>
    String.raw`
    <Date placeholder="date" v-model="DateVmodel" ${args}></Date>
  `
);
export const Time = InputFromTemplate(
  args =>
    String.raw`
        <Time placeholder="Time" v-model="DateVmodel" ${args}></Time>
      `
);
export const Select = InputFromTemplate(
  args =>
    String.raw`
            <Select placeholder="Select" v-model="StringVModel" :options="['1','2','3']" ${args}></Select>
          `
);
export const MultiSelect = InputFromTemplate(
  args =>
    String.raw`
        <MultiSelect placeholder="Multi Select" :options="['1','2','3']" :multiSelect="MultiArray" v-model="StringVModel"
         @selectItem="
        event => {
          StringVModel = ''
            MultiArray.push(event)
        }
    "
    @deleteItem="
        index => {
          MultiArray = MultiArray.filter((v, i) => i != index)
        }
    " ${args}></MultiSelect>
      `
);
export const File = InputFromTemplate(
  args =>
    String.raw`
      <File placeholder="FileInput" :preview="true" v-model="FileVModel" ${args}></File>
    `
);
export const MultiFile = InputFromTemplate(
  args =>
    String.raw`
        <MultiFile placeholder="Multi File" :preview="true" :fileArray="MultiArray"  :preview="true"
        @addFile="
            newFiles => {
                console.log(newFiles)
                MultiArray = MultiArray.concat(...newFiles)
                MultiArray = MultiArray.filter((v, i, a) => a.findIndex(e => e.name == v.name) === i)
            }
        "
        @deleteFile="
            index => {
              MultiArray = MultiArray.filter((v, i) => i != index)
            }
        " ${args}>test</MultiFile>
      `
);
export const Text = InputFromTemplate(
  args =>
    String.raw`
              <Text placeholder="Text" v-model="StringVModel"  ${args}></Text>
            `
);
export const Textarea = InputFromTemplate(
  args =>
    String.raw`
                <Textarea placeholder="Textarea" v-model="StringVModel"  ${args}></Textarea>
              `
);
export const Email = InputFromTemplate(
  args =>
    String.raw`
    <Email placeholder="email" ${args}></Email>
  `
);
export const Search = InputFromTemplate(
  args =>
    String.raw`
          <Search placeholder="Search" v-model="StringVModel" ${args}>
              <template v-slot:icon>
                  <svg
                      @click="console.log('f')"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-search"
                      viewBox="0 0 16 16"
                  >
                      <path
                          d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                      />
                  </svg>
              </template>
          </Search>
          `
);
export const Password = InputFromTemplate(
  args =>
    String.raw`
          <Password placeholder="Password" v-model="FileVModel" ${args}></Password>
        `
);
export const Number = InputFromTemplate(
  args =>
    String.raw`
      <Number placeholder="Number" v-model="FileVModel" ${args}></Number>
    `
);
export const Range = InputFromTemplate(
  args =>
    String.raw`
            <Range placeholder="Range" min="-5" max="50" v-model="NumberVModel" ${args}></Range>
          `
);
