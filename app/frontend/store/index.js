import { createStore } from 'vuex';
import alert from './modules/alert';
import memos from './modules/memos';
import users from './modules/users';

const store = createStore({
  modules: {
    alert,
    memos,
    users
  }
});

export default store;