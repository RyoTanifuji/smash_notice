import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/home/index';

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/null",
    name: "Null",
    component: Home
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;