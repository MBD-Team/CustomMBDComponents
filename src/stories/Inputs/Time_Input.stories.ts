import Time from '../../components/SexyInputs/Time.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: Time,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const TimeFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Time> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Time },
      setup() {
        return { args, console, DateVmodel: ref('') };
      },
      template: template(otherArgs),
    };
  };
export const BasicTime = TimeFromTemplate(
  args =>
    String.raw`
        <Time placeholder="Time" v-model="DateVmodel" ${args}></Time>
      `
);
