<template>
  <v-navigation-drawer
    v-model="drawer"
    floating
    class="elevation-0 bg-blue-grey-lighten-5"
  >
    <TheSidebarList />
  </v-navigation-drawer>
  <v-card>
    <v-app-bar class="elevation-0">
      <template #prepend>
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
        />
      </template>

      <v-app-bar-title v-if="!drawer">
        <router-link :to="{ name: 'Home' }">
          <span class="text-h5 font-weight-bold">
            SmashNotice
          </span>
        </router-link>
      </v-app-bar-title>

      <template #append>
        <v-btn>
          <span class="text-body-1">
            ログイン
          </span>
        </v-btn>

        <v-btn class="hidden-sm-and-down">
          <span class="text-body-1">
            新規登録
          </span>
        </v-btn>
      </template>
    </v-app-bar>
  </v-card>
</template>

<script>
import TheSidebarList from './TheSidebarList';

export default {
  name: "TheHeader",
  components: {
    TheSidebarList
  },
  data() {
    return {
      drawer: null,
    }
  }
};
</script>

<style>
</style>