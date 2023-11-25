import { createStore } from 'vuex';
import users from './modules/users';
import folders from './modules/folders';
import memos from './modules/memos';
import alert from './modules/alert';

const store = createStore({
  modules: {
    users,
    folders,
    memos,
    alert
  }
});

export default store;