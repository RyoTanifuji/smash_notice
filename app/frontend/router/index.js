import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

import TopIndex from '../pages/static_pages/TopIndex';
import UsersRegister from '../pages/users/UsersRegister';
import UsersLogin from '../pages/users/UsersLogin';
import DemoUsersLogin from '../pages/users/DemoUsersLogin';
import ProfileEdit from '../pages/users/ProfileEdit';
import FoldersIndex from '../pages/memos/common/FoldersIndex';
import MemosIndex from '../pages/memos/common/MemosIndex';
import MemosShow from '../pages/memos/common/MemosShow';
import MemosEdit from '../pages/memos/common/MemosEdit';
import SharedMemosIndex from '../pages/memos/shared/SharedMemosIndex';
import SharedMemosList from '../pages/memos/components/SharedMemosList';
import SharedMemosShow from '../pages/memos/shared/SharedMemosShow';
import FeedbacksIndex from '../pages/static_pages/FeedbacksIndex';
import TermsIndex from '../pages/static_pages/TermsIndex';
import PrivacyPolicyIndex from '../pages/static_pages/PrivacyPolicyIndex';

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
    path: "/demo_login",
    name: "DemoUsersLogin",
    component: DemoUsersLogin,
    meta: { requiredAuth: false }
  },
  {
    path: "/profile",
    name: "ProfileEdit",
    component: ProfileEdit,
    meta: { requiredAuth: true }
  },
  {
    path: "/matchup",
    name: "MatchupFoldersIndex",
    component: FoldersIndex,
    meta: { requiredAuth: true }
  },
  {
    path: "/strategy",
    name: "StrategyFoldersIndex",
    component: FoldersIndex,
    meta: { requiredAuth: true }
  },
  {
    path: "/matchup/:folderId/template",
    name: "MatchupTemplate",
    component: MemosEdit,
    meta: { requiredAuth: true }
  },
  {
    path: "/matchup/:folderId/memos",
    name: "MatchupMemosIndex",
    component: MemosIndex,
    meta: { requiredAuth: true }
  },
  {
    path: "/strategy/:folderId/memos",
    name: "StrategyMemosIndex",
    component: MemosIndex,
    meta: { requiredAuth: true }
  },
  {
    path: "/matchup/memos/:memoId",
    name: "MatchupMemosShow",
    component: MemosShow,
    meta: { requiredAuth: true }
  },
  {
    path: "/strategy/memos/:memoId",
    name: "StrategyMemosShow",
    component: MemosShow,
    meta: { requiredAuth: true }
  },
  {
    path: "/matchup/memos/:memoId/edit",
    name: "MatchupMemosEdit",
    component: MemosEdit,
    meta: { requiredAuth: true }
  },
  {
    path: "/strategy/memos/:memoId/edit",
    name: "StrategyMemosEdit",
    component: MemosEdit,
    meta: { requiredAuth: true }
  },
  {
    path: "/shared",
    component: SharedMemosIndex,
    meta: { requiredAuth: false },
    children: [
      {
        path: "",
        name: "SharedStrategyMemosIndex",
        component: SharedMemosList
      },
      {
        path: "matchup",
        name: "SharedMatchupMemosIndex",
        component: SharedMemosList
      },
      {
        path: "bookmarks",
        name: "BookmarkMemosIndex",
        component: SharedMemosList
      }
    ]
  },
  {
    path: "/shared/matchup/:memoId",
    name: "SharedMatchupMemosShow",
    component: SharedMemosShow,
    meta: { requiredAuth: false }
  },
  {
    path: "/shared/strategy/:memoId",
    name: "SharedStrategyMemosShow",
    component: SharedMemosShow,
    meta: { requiredAuth: false }
  },
  {
    path: "/feedbacks",
    name: "FeedbacksIndex",
    component: FeedbacksIndex,
    meta: { requiredAuth: true }
  },
  {
    path: "/terms",
    name: "TermsIndex",
    component: TermsIndex,
    meta: { requiredAuth: false }
  },
  {
    path: "/privacy_policy",
    name: "PrivacyPolicyIndex",
    component: PrivacyPolicyIndex,
    meta: { requiredAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        top: 0
      };
    }
  },
  routes
});

router.beforeEach((to, from, next) => {
  // ページ遷移のたびに、アラートを初期化
  store.dispatch("alert/closeAlert");

  // ログインしているかをチェック
  store.dispatch("users/fetchAuthUser").then((authUser) => {
    if (to.matched.some(record => record.meta.requiredAuth) && !authUser) {
      store.dispatch("alert/displayAlert", { alertStatus: requireLoginAlertStatus });
      if (from.name == 'DemoUsersLogin') store.dispatch("alert/cancelTransition");
      next({ name: 'DemoUsersLogin' });
    } else {
      next();
    }
  });
});

export default router;