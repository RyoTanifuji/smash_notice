<template>
  <v-app id="vuetify-app">
    <TheHeader />
    <v-main class="main-contents">
      <TheAlert />
      <div class="mx-10 my-2">
        <router-view />
      </div>
    </v-main>
    <TheFooter />
  </v-app>
</template>

<script>
import TheHeader from './components/TheHeader';
import TheFooter from './components/TheFooter';
import TheAlert from './components/TheAlert';

export default {
  components: {
    TheHeader,
    TheFooter,
    TheAlert
  }
};
</script>

<style>
a {
  /* router-linkによるaタグの装飾の無効化 */
  text-decoration: none;
  color: inherit;
}

.main-contents {
  margin-bottom: 60px;
}

.link-decoration {
  text-decoration: underline;
  color: #00B8D4;
}
</style>