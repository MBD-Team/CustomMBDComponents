import Spinner from './Spinner.vue';

import { Meta, StoryFn } from '@storybook/vue3';

export default {
  title: 'Spinner',
  component: Spinner,
  argTypes: {
    size: {
      type: 'string',
    },
    color: {
      type: 'select',
      options: ['primary', 'secondary', 'light', 'dark', 'danger', 'warning', 'info', 'success'],
    },
  },
};

//👇 We create a “template” of how args map to rendering
const SpinnerFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Spinner> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Spinner },
      setup() {
        return { args, console };
      },
      template: template(otherArgs),
    };
  };

//👇 Each story then reuses that template
export const CustomSpinner = SpinnerFromTemplate(
  args =>
    String.raw`
    <Spinner ${args}></Spinner>
  `
);
export const BasicSpinners = SpinnerFromTemplate(
  args => String.raw`
        <i class="text-center">all bootstrap colors are possible</i>
        <div style="display: grid; grid-template-columns: repeat(3,1fr);gap:1em;padding:30px;background-color:#444">
            <Spinner size="1em" color="primary" ></Spinner>
            <Spinner color="secondary"></Spinner>
            <Spinner size="2.5em"color="success" ></Spinner>
            <Spinner size="20px" color="danger"></Spinner>
            <Spinner color="info"></Spinner>
            <Spinner size="15px" color="warning"></Spinner>
            <Spinner color="dark"></Spinner>
            <Spinner size="45px" color="light"></Spinner>
        </div>
    `
);
