import File from '../components/SexyInputs/File.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: File,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const FileFromTemplate =
  (template: (args: string) => string): StoryFn<typeof File> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { File },
      setup() {
        return { args, console, FileVModel: ref(null) };
      },
      template: template(otherArgs),
    };
  };
export const BasicFile = FileFromTemplate(
  args =>
    String.raw`
      <File placeholder="FileInput" :preview="true" v-model="FileVModel" ${args}></File>
    `
);
