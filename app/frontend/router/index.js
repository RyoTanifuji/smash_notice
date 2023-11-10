import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

import TopIndex from '../pages/static_pages/TopIndex';
import UsersSignUp from '../pages/users/UsersSignUp';

const routes = [
  {
    path: "/",
    name: "TopIndex",
    component: TopIndex
  },
  {
    path: "/signup",
    name: "UsersSignUp",
    component: UsersSignUp
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

router.beforeEach((to, from, next) => {
  store.dispatch("alert/closeAlert");
  next();
});

export default router;