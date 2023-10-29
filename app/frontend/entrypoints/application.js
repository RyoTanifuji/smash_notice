import * as Turbo from "@hotwired/turbo";
Turbo.start();

import { createApp } from "vue";
import TurbolinksAdapter from "vue-turbolinks";
import vuetify from "~/plugins/vuetify";
import "vuetify/styles";

import App from "~/app";

document.addEventListener("turbo:load", () => {
  const app = createApp({});

  app.use(TurbolinksAdapter);
  app.use(vuetify);

  app.component("App", App);

  app.mount("#app");
});
