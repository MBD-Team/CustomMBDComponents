import Select from '../../components/SexyInputs/Select.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: Select,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const SelectFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Select> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Select },
      setup() {
        return { args, console, StringVModel: ref('') };
      },
      template: template(otherArgs),
    };
  };
export const BasicSelect = SelectFromTemplate(
  args =>
    String.raw`
            <Select placeholder="Select" v-model="StringVModel" :options="['1','2','3']" ${args}></Select>
          `
);
