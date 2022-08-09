import Email from '../components/SexyInputs/Email.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: Email,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const EmailFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Email> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Email },
      setup() {
        return { args, console, StringVModel: ref('') };
      },
      template: template(otherArgs),
    };
  };
export const BasicEmail = EmailFromTemplate(
  args =>
    String.raw`
    <Email placeholder="email" ${args}></Email>
  `
);
