import ButtonGroup from '../../components/SexyInputs/ButtonGroup.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: ButtonGroup,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const ButtonGroupFromTemplate =
  (template: (args: string) => string): StoryFn<typeof ButtonGroup> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { ButtonGroup },
      setup() {
        return {
          args,
          console,
          items: ref([
            { text: 'testdsvgfh\njsbvdhj', function: () => console.log('a') },
            { text: 'abc', function: () => console.log('b') },
            { text: 'a', function: () => console.log('c') },
            { text: 'b', function: () => console.log('d') },
          ]),
        };
      },
      template: template(otherArgs),
    };
  };

//👇 Each story then reuses that template
export const BasicButtonGroup = ButtonGroupFromTemplate(
  args =>
    String.raw`
    <ButtonGroup :options="items" ${args}></ButtonGroup>
  `
);
