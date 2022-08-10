import Number from '../../components/SexyInputs/Number.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: Number,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const NumberFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Number> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Number },
      setup() {
        return { args, console, NumberVModel: ref(0) };
      },
      template: template(otherArgs),
    };
  };
export const BasicNumber = NumberFromTemplate(
  args =>
    String.raw`
      <Number placeholder="Number" v-model="FileVModel" ${args}></Number>
    `
);
