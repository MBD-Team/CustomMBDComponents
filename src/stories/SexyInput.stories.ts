import SexyInput from '../components/SexyInput.vue';

import { Meta, StoryFn } from '@storybook/vue3';

export default {
  title: 'SexyInput',
  component: SexyInput,
  argTypes: {},
};

//👇 We create a “template” of how args map to rendering
const SexyInputFromTemplate =
  (template: (args: string) => string): StoryFn<typeof SexyInput> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { SexyInput },
      setup() {
        return { args, console };
      },
      template: template(otherArgs),
    };
  };

//👇 Each story then reuses that template
export const CustomSexyInput = SexyInputFromTemplate(
  args =>
    String.raw`
    <SexyInput ${args}></SexyInput>
  `
);
export const BasicSexyInputs = SexyInputFromTemplate(
  args => String.raw`
        <div style="padding:80px;display:grid;grid-template-columns:repeat(3,1fr)">
            <div style="width:80%"><SexyInput type="text" placeholder="test"></SexyInput></div>
            <div style="width:80%"><SexyInput type="textarea" placeholder="test"></SexyInput></div>
        </div>
    `
);
