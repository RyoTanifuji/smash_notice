<template>
  <v-container>
    <router-link :to="{ name: 'TopIndex' }">
      <span class="text-h5 font-weight-bold">
        SmashNotice
      </span>
    </router-link>
  </v-container>

  <v-list>
    <v-list-item
      :prepend-icon="mdiHome"
      to="/"
      class="mt-4"
    >
      <span class="font-weight-bold">
        TOPページ
      </span>
    </v-list-item>

    <div class="my-12" />

    <template
      v-for="item in memoItems"
      :key="item.id"
    >
      <v-list-item
        :prepend-icon="item.icon"
        :to="item.route"
        :active="isActive(item.route)"
        class="mt-1"
      >
        <span class="font-weight-bold">
          {{ item.title }}
        </span>
      </v-list-item>
    </template>

    <div class="my-12" />

    <template
      v-for="item in infoItems"
      :key="item.id"
    >
      <v-list-item
        :prepend-icon="item.icon"
        :to="item.route"
        class="mt-1"
      >
        <span class="font-weight-bold">
          {{ item.title }}
        </span>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
import { 
  mdiHome,
  mdiChartBar,
  mdiSwordCross,
  mdiAccountMultiple,
  mdiTooltipTextOutline,
  mdiBookCheckOutline,
  mdiShieldLockOutline
} from '@mdi/js';

export default {
  name: "TheSidebarList",
  data() {
    return {
      mdiHome,
      memoItems: {
        strategy: {
          id: 1,
          title: "攻略メモ",
          route: "/strategy",
          icon: mdiChartBar
        },
        matchup: {
          id: 2,
          title: "キャラ対メモ",
          route: "/matchup",
          icon: mdiSwordCross
        },
        shared: {
          id: 3,
          title: "みんなのメモ",
          route: "/shared",
          icon: mdiAccountMultiple
        }
      },
      infoItems: {
        contact: {
          id: 1,
          title: "お問い合わせ",
          route: "/null",
          icon: mdiTooltipTextOutline
        },
        terms: {
          id: 2,
          title: "利用規約",
          route: "/null",
          icon: mdiBookCheckOutline
        },
        policy: {
          id: 3,
          title: "プライバシーポリシー",
          route: "/null",
          icon: mdiShieldLockOutline
        }
      }
    };
  },
  methods: {
    isActive(route) {
      const reg = new RegExp(`^${route}`);
      return reg.test(this.$route.path);
    }
  }
};
</script>