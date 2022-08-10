import Carousel from '../../components/Carousel.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Carousel',
  component: Carousel,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const CarouselFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Carousel> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Carousel },
      setup() {
        return {
          args,
          console,
          items: [
            { name: 'test1', value: 'abc' },
            { name: 'test2', value: 2 },
            { name: 'test3', value: { test: 1 } },
          ],
        };
      },
      template: template(otherArgs),
    };
  };

//👇 Each story then reuses that template
export const BasicCarousel = CarouselFromTemplate(
  args =>
    String.raw`
    <div style="height:50vh">
        <Carousel v-slot="slotProps" :itemArray="items" style="border:1px solid black" itemsPerPage="2" indicatorColor="black" ${args}>
        <div>
            <div>{{ slotProps.item.name }}</div>
            <div>{{ slotProps.item.value }} </div>
        </div>
        </Carousel>
    </div>
  `
);
