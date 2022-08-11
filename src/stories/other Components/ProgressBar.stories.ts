import ProgressBar from '../../components/ProgressBar.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'ProgressBar',
  component: ProgressBar,
  argTypes: {},
};

//👇 We create a “template” of how args map to rendering
const ProgressBarButtonFromTemplate =
  (template: (args: string) => string): StoryFn<typeof ProgressBar> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { ProgressBar },
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
export const BasicProgressBar = ProgressBarButtonFromTemplate(
  args => String.raw`
 <ProgressBar :progress="20" :maxValue="100"  progressColor="bg-danger"></ProgressBar>
    `
);
