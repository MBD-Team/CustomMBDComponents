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
    class: { type: 'string' },
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
  <LoadingButton :loading="true" ${args}> I am Loading</LoadingButton>
  <div class="my-3"></div>
  <LoadingButton :loading="false" ${args} >I am not Loading</LoadingButton>
    `
);
export const ColoredLoadingButtons = LoadingButtonFromTemplate(
  args => String.raw`
  <div style="display: grid; grid-template-columns: repeat(3,1fr);gap:1em">
    <LoadingButton :loading="true" spinnerColor="danger" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" spinnerColor="info" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" spinnerColor="light" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" spinnerColor="warning" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" spinnerColor="primary" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" spinnerColor="secondary"  ${args}> I am Loading</LoadingButton>

    <LoadingButton :loading="true" class="btn btn-primary" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="btn btn-primary" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="btn btn-danger" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="btn btn-dark" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="btn btn-info" ${args}> I am Loading</LoadingButton>
    <LoadingButton :loading="true" class="btn btn-secondary" ${args}> I am Loading</LoadingButton>
    </div>
    <i>all bootstrap colors are possible</i>
      `
);
