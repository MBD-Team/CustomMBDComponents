import Textarea from '../../components/SexyInputs/Textarea.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: Textarea,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const TextareaFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Textarea> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Textarea },
      setup() {
        return { args, console, StringVModel: ref('') };
      },
      template: template(otherArgs),
    };
  };
export const BasicTextarea = TextareaFromTemplate(
  args =>
    String.raw`
                <Textarea placeholder="Textarea" v-model="StringVModel"  ${args}></Textarea>
              `
);
