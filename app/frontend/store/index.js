import { createStore } from 'vuex';
import alert from './modules/alert';

const store = createStore({
  modules: {
    alert
  }
});

export default store;