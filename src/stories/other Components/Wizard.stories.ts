import Wizard from '../../components/Wizard.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Wizard',
  component: Wizard,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const WizardFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Wizard> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Wizard },
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
export const BasicWizard = WizardFromTemplate(
  args =>
    String.raw`
    <Wizard
        :steps="[{ iconName: 'map-marked-alt' }, { iconName: 'futbol' }, { iconName: 'building' }, { iconName: 'people-arrows' }]"
        title="testTitle"
        :showStepIndices="true"
        :initialStepIndex="0"
        :onSubmit="() => console.log('submit')"
    >
        <template #step0>1</template>
        <template #step1>2</template>
        <template #step2>3</template>
        <template #step3>4</template>
    </Wizard>
  `
);
