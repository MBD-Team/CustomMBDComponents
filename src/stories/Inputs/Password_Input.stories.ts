import Password from '../../components/SexyInputs/Password.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: Password,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const PasswordFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Password> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Password },
      setup() {
        return { args, console, StringVModel: ref('') };
      },
      template: template(otherArgs),
    };
  };
export const BasicPassword = PasswordFromTemplate(
  args =>
    String.raw`
          <Password placeholder="Password" v-model="StringVModel" ${args}></Password>
        `
);
