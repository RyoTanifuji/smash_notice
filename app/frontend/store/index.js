import { createStore } from 'vuex';
import alert from './modules/alert';
import users from './modules/users';

const store = createStore({
  modules: {
    alert,
    users
  }
});

export default store;