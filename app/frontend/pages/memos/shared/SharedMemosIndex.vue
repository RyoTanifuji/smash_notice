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

  <div :class="{ 'd-flex flex-row justify-start overflow-x-auto' : $vuetify.display.xs, 'mt-2' : true }">
    <v-pagination
      v-model="page"
      :length="totalPages"
      total-visible="6"
    />
  </div>

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
          :memos="sharedMemos"
        />
      </v-window-item>
    </template>
  </v-window>

  <div :class="{ 'd-flex flex-row justify-start overflow-x-auto' : $vuetify.display.xs, 'mt-2' : true }">
    <v-pagination
      v-model="page"
      :length="totalPages"
      total-visible="6"
    />
  </div>
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
      ],
      page: 1,
      tabFlag: false
    };
  },
  computed: {
    ...mapGetters("users", ["authUser"]),
    ...mapGetters("shared", [
      "sharedMemos",
      "totalPages"
    ]),
    isMatchup() {
      return this.$route.name == "SharedMatchupMemosIndex";
    },
    memoType() {
      return this.isMatchup ? "MatchupMemo" : "StrategyMemo";
    },
    pageQuery() {
      return this.$route.query.page ? Number(this.$route.query.page) : 1;
    }
  },
  watch: {
    memoType: function(newVal) {
      if (this.page == 1) {
        this.fetchSharedMemos({ memoType: newVal, page: this.page });
        this.$router.push({ name: this.$route.name, query: { page: 1 }});
      } else {
        this.page = 1;
      }
    },
    page: function(newVal) {
      this.fetchSharedMemos({ memoType: this.memoType, page: newVal });
      this.$router.push({ name: this.$route.name, query: { page: newVal }});
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    },
    pageQuery: function(newVal) {
      this.page = newVal;
    }
  },
  mounted() {
    this.page = this.pageQuery;
    this.fetchSharedMemos({ memoType: this.memoType, page: this.page });
  },
  methods: {
    ...mapActions("shared", ["fetchSharedMemos"])
  }
};
</script>