import { createRouter, createWebHistory } from 'vue-router';

import TopIndex from '../pages/static_pages/TopIndex';

const routes = [
  {
    path: "/",
    name: "TopIndex",
    component: TopIndex
  },
  {
    path: "/null",
    name: "Null",
    component: TopIndex
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;