import Radiobuttons from '../../components/SexyInputs/Radiobuttons.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: Radiobuttons,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const RadiobuttonsFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Radiobuttons> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Radiobuttons },
      setup() {
        return { args, console };
      },
      template: template(otherArgs),
    };
  };
export const BasicRadiobuttons = RadiobuttonsFromTemplate(
  args =>
    String.raw`
            <Radiobuttons  :options=" [
              { value: 1, text: 'eins' },
              { value: 2, text: 'zwei' },
              { value: 3, text: 'drei' },
          ]
          "
          ${args}></Radiobuttons>
          `
);
