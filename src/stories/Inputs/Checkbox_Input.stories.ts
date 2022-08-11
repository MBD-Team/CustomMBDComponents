import Checkbox from '../../components/SexyInputs/Checkbox.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: Checkbox,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const CheckboxFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Checkbox> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Checkbox },
      setup() {
        return { args, console };
      },
      template: template(otherArgs),
    };
  };

//👇 Each story then reuses that template
export const BasicCheckbox = CheckboxFromTemplate(
  args =>
    String.raw`
    <Checkbox  ${args}>test</Checkbox>
  `
);
