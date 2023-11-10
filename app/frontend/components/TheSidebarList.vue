<template>
  <v-container>
    <span class="text-h5 font-weight-bold">
      SmashNotice
    </span>
  </v-container>

  <v-list>
    <router-link
      v-slot="{ isActive }"
      :to="{ name: 'TopIndex' }"
    >
      <v-list-item
        link
        :prepend-icon="mdiHome"
        :active="isActive"
        class="mt-4"
      >
        <span class="font-weight-bold">
          TOPページ
        </span>
      </v-list-item>
    </router-link>

    <div class="my-12" />

    <template
      v-for="item in memoItems"
      :key="item.id"
    >
      <router-link
        v-slot="{ isActive }"
        :to="{ name: item.route }"
      >
        <v-list-item
          link
          :prepend-icon="item.icon"
          :active="isActive"
          class="mt-1"
        >
          <span class="font-weight-bold">
            {{ item.title }}
          </span>
        </v-list-item>
      </router-link>
    </template>

    <div class="my-12" />

    <template
      v-for="item in infoItems"
      :key="item.id"
    >
      <router-link
        v-slot="{ isActive }"
        :to="{ name: item.route }"
      >
        <v-list-item
          link
          :prepend-icon="item.icon"
          :active="isActive"
          class="mt-1"
        >
          <span class="font-weight-bold">
            {{ item.title }}
          </span>
        </v-list-item>
      </router-link>
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
          route: "Null",
          icon: mdiChartBar
        },
        matchup: {
          id: 2,
          title: "キャラ対メモ",
          route: "Null",
          icon: mdiSwordCross
        },
        shared: {
          id: 3,
          title: "みんなのメモ",
          route: "Null",
          icon: mdiAccountMultiple
        }
      },
      infoItems: {
        contact: {
          id: 1,
          title: "お問い合わせ",
          route: "Null",
          icon: mdiTooltipTextOutline
        },
        terms: {
          id: 2,
          title: "利用規約",
          route: "Null",
          icon: mdiBookCheckOutline
        },
        policy: {
          id: 3,
          title: "プライバシーポリシー",
          route: "Null",
          icon: mdiShieldLockOutline
        }
      }
    };
  }
};
</script>