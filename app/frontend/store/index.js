import { createStore } from 'vuex';
import alert from './modules/alert';
import folders from './modules/folders';
import users from './modules/users';

const store = createStore({
  modules: {
    alert,
    folders,
    users
  }
});

export default store;