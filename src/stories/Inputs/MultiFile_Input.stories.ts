import MultiFile from '../../components/SexyInputs/MultiFile.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: MultiFile,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const MultiFileFromTemplate =
  (template: (args: string) => string): StoryFn<typeof MultiFile> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { MultiFile },
      setup() {
        return { args, console, MultiArray: ref([]) };
      },
      template: template(otherArgs),
    };
  };
export const BasicMultiFile = MultiFileFromTemplate(
  args =>
    String.raw`
        <MultiFile placeholder="Multi File" :preview="true" :fileArray="MultiArray"
        @addFile="
            newFiles => {
                console.log(newFiles)
                MultiArray = MultiArray.concat(...newFiles)
                MultiArray = MultiArray.filter((v, i, a) => a.findIndex(e => e.name == v.name) === i)
            }
        "
        @deleteFile="
            index => {
              MultiArray = MultiArray.filter((v, i) => i != index)
            }
        " ${args}>Click to add files</MultiFile>
      `
);
