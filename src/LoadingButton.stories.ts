import LoadingButton from './LoadingButton.vue';

import { Meta, StoryFn } from '@storybook/vue3';

export default {
  title: 'LoadingButton',
  component: LoadingButton,
  argTypes: {
    loading: { type: 'boolean' },
    onClick: {},
    spinnerColor: {
      control: { type: 'select' },
      options: ['', 'primary', 'secondary', 'light', 'dark', 'danger', 'warning', 'info', 'success'],
    },
    buttonColor: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'light', 'dark', 'danger', 'warning', 'info', 'success'],
    },
  },
};

//👇 We create a “template” of how args map to rendering
const LoadingButtonFromTemplate =
  (template: (args: string) => string): StoryFn<typeof LoadingButton> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { LoadingButton },
      setup() {
        return { args, console };
      },
      template: template(otherArgs),
    };
  };

//👇 Each story then reuses that template
export const BasicLoadingButton = LoadingButtonFromTemplate(
  args => String.raw`
  <LoadingButton :loading="true" class="me-3"  ${args}> I am Loading</LoadingButton>
  <LoadingButton :loading="false" ${args} >I am not Loading</LoadingButton>
    `
);
export const ColoredLoadingButtons = LoadingButtonFromTemplate(
  args => String.raw`
  <div style="display: grid; grid-template-columns: repeat(3,1fr)">
    <LoadingButton :loading="true" class="m-3" spinnerColor="danger"  ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="m-3" spinnerColor="info" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="m-3" spinnerColor="light" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="m-3" spinnerColor="warning" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="m-3" spinnerColor="primary" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="m-3" spinnerColor="secondary"  ${args}> I am Loading</LoadingButton>

    <LoadingButton :loading="true" class="m-3" buttonColor="primary" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="m-3" buttonColor="success"   ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="m-3" buttonColor="danger"  ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="m-3" buttonColor="dark"  ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="m-3" buttonColor="info"  ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="m-3" buttonColor="secondary"  ${args}> I am Loading</LoadingButton>
    </div>
    <i>all bootstrap colors are possible</i>
      `
);
