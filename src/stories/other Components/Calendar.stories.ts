import Calendar from '../../components/Calendar/Calendar.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Calendar',
  component: Calendar,
  argTypes: {},
};

//👇 We create a “template” of how args map to rendering
const CalendarButtonFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Calendar> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Calendar },
      setup() {
        return {
          args,
          console,
          groups: ref(
            Array(15)
              .fill(0)
              .map((e, i) => ({ id: i, name: 'Group' + i, checked: true }))
          ),
          events: ref([
            {
              start: new Date().toISOString().split('T')[0] + ' 12:00',
              end: new Date().toISOString().split('T')[0] + ' 15:00',
              name: 'Test Event',
              id: 1,
              group_id: 1,
            },
          ]),
        };
      },
      template: template(otherArgs),
    };
  };

//👇 Each story then reuses that template
export const BasicCalendar = CalendarButtonFromTemplate(
  args => String.raw`
  <div class="bg-danger text-light p-1">Calendar breaks on click because Vue3TouchEvents cannot be imported in Storybook because it crashes Storybook for some reason</div>
 <Calendar
        hash="calendar"
        :displayHours="[7, 20]"
        :events='events'
        v-model:groups='groups'
    />
    `
);
