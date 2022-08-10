import Range from '../../components/SexyInputs/Range.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: Range,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const RangeFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Range> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Range },
      setup() {
        return { args, console, NumberVModel: ref(0) };
      },
      template: template(otherArgs),
    };
  };
export const BasicRange = RangeFromTemplate(
  args =>
    String.raw`
            <Range placeholder="Range" min="-5" max="50" v-model="NumberVModel" ${args}></Range>
          `
);
