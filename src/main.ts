import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import Vue3TouchEvents from 'vue3-touch-events';

createApp(App).use(Vue3TouchEvents).mount('#app');
