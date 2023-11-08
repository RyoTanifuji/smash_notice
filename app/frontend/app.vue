<template>
  <v-app id="vuetify-app">
    <TheHeader />
    <v-main>
      <router-view />
    </v-main>
    <TheFooter />
  </v-app>
</template>

<script>
import TheHeader from './components/TheHeader';
import TheFooter from './components/TheFooter';
import './plugins/yupSetLocale';

export default {
  components: {
    TheHeader,
    TheFooter
  }
};
</script>

<style>
a {
  /* router-linkによるaタグの装飾の無効化 */
  text-decoration: none;
  color: inherit;
}
</style>