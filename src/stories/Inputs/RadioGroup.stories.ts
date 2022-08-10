import RadioGroup from '../../components/SexyInputs/RadioGroup.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: RadioGroup,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const RadioGroupFromTemplate =
  (template: (args: string) => string): StoryFn<typeof RadioGroup> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { RadioGroup },
      setup() {
        return {
          args,
          console,
          items: ref([
            { text: 'testdsvgfhjsbvdhj', value: 1 },
            { text: 'abc', value: 2 },
            { text: 'a', value: 3 },
            { text: 'b', value: 4 },
          ]),
          RadioVModel: ref(2),
        };
      },
      template: template(otherArgs),
    };
  };

//👇 Each story then reuses that template
export const BasicRadioGroup = RadioGroupFromTemplate(
  args =>
    String.raw`
    <RadioGroup :options="items" v-model="RadioVModel" ${args}></RadioGroup>
  `
);
