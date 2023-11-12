import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

import TopIndex from '../pages/static_pages/TopIndex';
import UsersSignUp from '../pages/users/UsersSignUp';
import UsersSignIn from '../pages/users/UsersSignIn';

const routes = [
  {
    path: "/",
    name: "TopIndex",
    component: TopIndex,
    meta: { requiredAuth: false }
  },
  {
    path: "/signup",
    name: "UsersSignUp",
    component: UsersSignUp,
    meta: { requiredAuth: false }
  },
  {
    path: "/signin",
    name: "UsersSignIn",
    component: UsersSignIn,
    meta: { requiredAuth: false }
  },
  {
    path: "/null",
    name: "Null",
    component: TopIndex,
    meta: { requiredAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  store.dispatch("alert/closeAlert");

  store.dispatch("users/fetchAuthUser").then((authUser) => {
    if (to.matched.some(record => record.meta.requiredAuth) && !authUser) {
      next({ name: 'UsersSignIn' });
    } else {
      next();
    }
  });
});

export default router;