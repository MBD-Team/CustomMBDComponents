import Search from '../../components/SexyInputs/Search.vue';

import { Meta, StoryFn } from '@storybook/vue3';
import { ref } from 'vue';

export default {
  title: 'Inputs',
  component: Search,
  argTypes: {},
};
//👇 We create a “template” of how args map to rendering
const SearchFromTemplate =
  (template: (args: string) => string): StoryFn<typeof Search> =>
  (args: any) => {
    const otherArgs = Object.entries(args)
      .map(([key, value]) => `:${key}='${JSON.stringify(value)}'`)
      .join(' ');
    return {
      components: { Search },
      setup() {
        return { args, console, StringVModel: ref('') };
      },
      template: template(otherArgs),
    };
  };
export const BasicSearch = SearchFromTemplate(
  args =>
    String.raw`
          <Search placeholder="Search" v-model="StringVModel" ${args}>
              <template v-slot:icon>
                  <svg
                      @click="console.log('f')"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-search"
                      viewBox="0 0 16 16"
                  >
                      <path
                          d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                      />
                  </svg>
              </template>
          </Search>
          `
);
