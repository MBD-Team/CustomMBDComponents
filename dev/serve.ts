import { createApp } from 'vue';
import Dev from './serve.vue';
import Vue3TouchEvents from 'vue3-touch-events';
import bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const app = createApp(Dev);
app.use(Vue3TouchEvents).mount('#app');
