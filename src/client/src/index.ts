import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import home from './views/home';

const routes = [
  { path: '/', component: home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp({
  template: `<router-view></router-view>`
});

app.use(router);

app.mount('#app');