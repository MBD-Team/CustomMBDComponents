import MultiSelect from '../../components/SexyInputs/MultiSelect.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: MultiSelect,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const MultiSelectFromTemplate =
  (template: (args: string) => string): StoryFn<typeof MultiSelect> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { MultiSelect },
      setup() {
        return { args, console, MultiArray: ref([]), StringVModel: ref('') };
      },
      template: template(otherArgs),
    };
  };
export const BasicMultiSelect = MultiSelectFromTemplate(
  args =>
    String.raw`
        <MultiSelect placeholder="Multi Select" :options="['1','2','3']" :multiSelect="MultiArray" v-model="StringVModel"
         @selectItem="
        event => {
          StringVModel = ''
            MultiArray.push(event)
        }
    "
    @deleteItem="
        index => {
          MultiArray = MultiArray.filter((v, i) => i != index)
        }
    " ${args}></MultiSelect>
      `
);
