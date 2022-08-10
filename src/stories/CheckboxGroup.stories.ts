import CheckboxGroup from '../components/SexyInputs/CheckboxGroup.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: CheckboxGroup,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const CheckboxGroupFromTemplate =
  (template: (args: string) => string): StoryFn<typeof CheckboxGroup> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { CheckboxGroup },
      setup() {
        return {
          args,
          console,
          items: ref([
            { text: 'testdsvgfhjsbvdhj', value: 1, active: false },
            { text: 'abc', value: 2, active: false },
            { text: 'a', value: 3, active: false },
            { text: 'b', value: 4, active: false },
          ]),
        };
      },
      template: template(otherArgs),
    };
  };

//👇 Each story then reuses that template
export const BasicCheckboxGroup = CheckboxGroupFromTemplate(
  args =>
    String.raw`
    <CheckboxGroup :options="items" ${args}></CheckboxGroup>
  `
);
