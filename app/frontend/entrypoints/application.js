import * as Turbo from "@hotwired/turbo";
Turbo.start();

import { createApp } from "vue";
import TurbolinksAdapter from "vue-turbolinks";
import vuetify from "~/plugins/vuetify";
import "vuetify/styles";
import router from '../router'

import App from "~/app";

document.addEventListener("turbo:load", () => {
  const app = createApp({});

  app.use(TurbolinksAdapter);
  app.use(vuetify);
  app.use(router);

  app.component("App", App);

  app.mount("#app");
});
