<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    みんなのメモ
  </div>

  <div class="my-6" />

  <v-tabs
    v-model="activeTab"
    align-tabs="center"
  >
    <template
      v-for="tab in tabs"
      :key="tab.id"
    >
      <v-tab
        :to="tab.route"
        exact
        class="w-25"
      >
        {{ tab.name }}
      </v-tab>
    </template>
  </v-tabs>

  <v-window
    v-model="activeTab"
    class="mt-4"
  >
    <template
      v-for="tab in tabs"
      :key="tab.id"
    >
      <v-window-item
        :value="tab.route"
        exact
      >
        <SharedMemosList
          :auth-user="authUser"
          :memos="memosList(tab.memoType)"
        />
      </v-window-item>
    </template>
  </v-window>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SharedMemosList from '../components/SharedMemosList';

export default {
  name: "SharedMemosIndex",
  components: {
    SharedMemosList
  },
  data() {
    return {
      activeTab: '/shared',
      tabs: [
        {
          id: 1,
          name: "攻略メモ",
          route: '/shared',
          memoType: "StrategyMemo"
        },
        {
          id: 2,
          name: "キャラ対メモ",
          route: '/shared/matchup',
          memoType: "MatchupMemo"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("users", ["authUser"]),
    ...mapGetters("shared", ["sharedMemos"])
  },
  mounted() {
    this.fetchSharedMemos();
  },
  methods: {
    ...mapActions("shared", ["fetchSharedMemos"]),
    memosList(memoType) {
      return this.sharedMemos.filter(memo => {
        return memo.type == memoType;
      });
    }
  }
};
</script>