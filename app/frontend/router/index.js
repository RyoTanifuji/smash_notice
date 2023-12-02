import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

import TopIndex from '../pages/static_pages/TopIndex';
import UsersRegister from '../pages/users/UsersRegister';
import UsersLogin from '../pages/users/UsersLogin';
import MatchupFoldersIndex from '../pages/memos/matchup/MatchupFoldersIndex';
import MatchupMemosIndex from '../pages/memos/matchup/MatchupMemosIndex';
import MemosEdit from '../pages/memos/common/MemosEdit';

import { requireLoginAlertStatus } from '../constants/alertStatus';

const routes = [
  {
    path: "/",
    name: "TopIndex",
    component: TopIndex,
    meta: { requiredAuth: false }
  },
  {
    path: "/register",
    name: "UsersRegister",
    component: UsersRegister,
    meta: { requiredAuth: false }
  },
  {
    path: "/login",
    name: "UsersLogin",
    component: UsersLogin,
    meta: { requiredAuth: false }
  },
  {
    path: "/matchup",
    name: "MatchupFoldersIndex",
    component: MatchupFoldersIndex,
    meta: { requiredAuth: true }
  },
  {
    path: "/matchup/:folderId/memos",
    name: "MatchupMemosIndex",
    component: MatchupMemosIndex,
    meta: { requiredAuth: true }
  },
  {
    path: "/matchup/memos/:memoId/edit",
    name: "MatchupMemosEdit",
    component: MemosEdit,
    meta: { requiredAuth: true }
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
  // ページ遷移のたびに、アラートを初期化
  store.dispatch("alert/closeAlert");

  // ログインしているかをチェック
  store.dispatch("users/fetchAuthUser").then((authUser) => {
    if (to.matched.some(record => record.meta.requiredAuth) && !authUser) {
      store.dispatch("alert/displayAlert", requireLoginAlertStatus);
      if (from.name == 'UsersLogin') store.dispatch("alert/cancelTransition");
      next({ name: 'UsersLogin' });
    } else {
      next();
    }
  });
});

export default router;