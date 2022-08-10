import ExpBar from '../../components/ExpBar.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'ExpBar',
  component: ExpBar,
  argTypes: {},
};

const replaceCharAtIndex = (str: string, index: number, replacement: string) => {
  return str.substring(0, index) + replacement + str.substring(index + replacement.length);
};

//👇 We create a “template” of how args map to rendering
const ExpBarButtonFromTemplate =
  (template: (args: string) => string): StoryFn<typeof ExpBar> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { ExpBar },
      setup() {
        return {
          args,
          console,
        };
      },
      template: template(otherArgs),
    };
  };

//👇 Each story then reuses that template
export const BasicExpBar = ExpBarButtonFromTemplate(
  args => String.raw`
 <ExpBar :progress="20" :maxValue="100"  progressColor="bg-danger"></ExpBar>
    `
);
