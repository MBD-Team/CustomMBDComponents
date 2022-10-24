import Alert from '../../components/Alert.vue';
import Button from '../../components/Button.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Alert',
  component: Alert,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const AlertFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Alert> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Alert, Button },
      setup() {
        return { args, console, props: ref(false) };
      },
      template: template(otherArgs),
    };
  };

//👇 Each story then reuses that template
export const BasicAlert = AlertFromTemplate(
  args =>
    String.raw`
    <div class="w-25 m-5"><Button type="button" @click="props=true">spawn alert</Button></div>
    <Alert v-model="props" ${args}>
        <div>testdyfbdfbdgfbdfbebresövnfjaiwb nvaewbvibvbi</div>
        <div>testdsvihvjibdfsvbsjibvdjisbvdsb vdfsbvkjsb vkbdvskjvbsjibvkisdb vo</div>
    </Alert>
  `
);
