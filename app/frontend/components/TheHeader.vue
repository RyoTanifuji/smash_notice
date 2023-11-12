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
        <router-link :to="{ name: 'TopIndex' }">
          <span class="text-h5 font-weight-bold">
            SmashNotice
          </span>
        </router-link>
      </v-app-bar-title>

      <template #append>
        <template v-if="!authUser">
          <v-btn
            :to="{ name: 'UsersSignIn' }"
            :active="false"
          >
            <span class="text-body-1">
              ログイン
            </span>
          </v-btn>

          <v-btn
            :to="{ name: 'UsersSignUp' }"
            :active="false"
            class="hidden-xs"
          >
            <span class="text-body-1">
              新規登録
            </span>
          </v-btn>
        </template>
        <template v-else>
          <v-btn
            :active="false"
            @click="handleLogout"
          >
            <span class="text-body-1">
              ログアウト
            </span>
          </v-btn>
        </template>
      </template>
    </v-app-bar>
  </v-card>
</template>

<script>
import TheSidebarList from './TheSidebarList';
import { mapGetters, mapActions } from 'vuex';
import {
  successLogOutAlertStatus,
  serverErrorAlertStatus
} from '../plugins/alertStatus';

export default {
  name: "TheHeader",
  components: {
    TheSidebarList
  },
  data() {
    return {
      drawer: null
    };
  },
  computed: {
    ...mapGetters("users", ["authUser"])
  },
  methods: {
    ...mapActions("users", ["logoutUser"]),
    ...mapActions("alert", ["displayAlert"]),
    async handleLogout() {
      try {
        await this.logoutUser();
        // すでにトップページにいるときは、routerのbeforeEachが行われないためisTransitionをfalseに
        if (this.$route.name == 'TopIndex') successLogOutAlertStatus.isTransition = false;
        this.displayAlert(successLogOutAlertStatus);
        this.$router.push({ name: 'TopIndex' });
      } catch (err) {
        this.displayAlert(serverErrorAlertStatus);
      }
    }
  }
};
</script>