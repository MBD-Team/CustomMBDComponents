import Button from '../../components/Button.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Button',
  component: Button,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const ButtonFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Button> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Button },
      setup() {
        return { args, console };
      },
      template: template(otherArgs),
    };
  };

//👇 Each story then reuses that template
export const BasicButton = ButtonFromTemplate(
  args =>
    String.raw`
    <Button  ${args}>test</Button>
  `
);
