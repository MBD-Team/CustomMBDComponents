import { app } from '@storybook/vue3';
import Vue3TouchEvents from 'vue3-touch-events';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

app.use(Vue3TouchEvents);
