import * as Turbo from '@hotwired/turbo';
Turbo.start();

import { createApp } from 'vue';
import TurbolinksAdapter from 'vue-turbolinks';
import vuetify from '~/plugins/vuetify';
import 'vuetify/styles';
import router from '../router';
import axios from '~/plugins/axios';
import store from '../store';

import App from '~/app';

document.addEventListener("turbo:load", () => {
  const app = createApp({});

  app.use(TurbolinksAdapter);
  app.use(vuetify);
  app.use(router);
  app.use(store);

  app.component("App", App);

  app.provide('$axios', axios);

  // axiosでリクエストを送るたびに、アラートを初期化
  axios.interceptors.request.use(request => {
    store.dispatch("alert/closeAlert");
    return request;
  });

  app.mount("#app");
});
