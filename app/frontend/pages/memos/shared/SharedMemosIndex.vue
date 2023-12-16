<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    みんなのメモ
  </div>

  {{ sharedMemos }}

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
    <v-window-item
      value="/shared"
      exact
    >
      <SharedMemosList
        :memos="strategyMemos"
      />
    </v-window-item>
    <v-window-item
      value="/shared/matchup"
      exact
    >
      <SharedMemosList
        :memos="matchupMemos"
      />
    </v-window-item>
  </v-window>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SharedMemosList from '../components/SharedMemosList';

export default {
  name: "sharedMemosIndex",
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
          route: '/shared'
        },
        {
          id: 2,
          name: "キャラ対メモ",
          route: '/shared/matchup'
        }
      ]
    };
  },
  computed: {
    ...mapGetters("shared", ["sharedMemos"]),
    matchupMemos() {
      return this.sharedMemos.filter(memo => {
        return memo.type == "MatchupMemo";
      });
    },
    strategyMemos() {
      return this.sharedMemos.filter(memo => {
        return memo.type == "StrategyMemo";
      });
    }
  },
  created() {
    this.fetchSharedMemos();
  },
  methods: {
    ...mapActions("shared", ["fetchSharedMemos"])
  }
};
</script>