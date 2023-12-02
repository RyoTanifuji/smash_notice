import { defineConfig } from "vite";
import RailsPlugin from "vite-plugin-rails";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

export default defineConfig({
  plugins: [RailsPlugin({ stimulus: false }), vue(), vuetify()],
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
      "url": "./config/builtins_placeholder.tsx",
      "path": "./config/builtins_placeholder.tsx",
      "source-map-js": "./config/builtins_placeholder.tsx",
      "fs": "./config/builtins_placeholder.tsx",
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue", ".sass", ".scss", ".css", ".png", ".svg"],
  },
  appType: "mpa",
  clearScreen: false,
});
