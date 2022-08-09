import Text from '../components/SexyInputs/Text.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: Text,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const TextFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Text> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Text },
      setup() {
        return { args, console, StringVModel: ref('') };
      },
      template: template(otherArgs),
    };
  };
export const BasicText = TextFromTemplate(
  args =>
    String.raw`
              <Text placeholder="Text" v-model="StringVModel"  ${args}></Text>
            `
);
