import Date from '../../components/SexyInputs/Date.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: Date,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const DateFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Date> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Date },
      setup() {
        return { args, console, DateVmodel: ref('') };
      },
      template: template(otherArgs),
    };
  };
export const BasicDate = DateFromTemplate(
  args =>
    String.raw`
    <Date placeholder="date" v-model="DateVmodel" ${args}></Date>
  `
);
