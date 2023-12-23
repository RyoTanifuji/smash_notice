<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    みんなのメモ
  </div>

  <div class="my-6" />

  <v-tabs
    v-model="activeTab"
    align-tabs="center"
    :grow="$vuetify.display.xs"
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

  <div :class="{ 'd-flex flex-row overflow-x-auto' : ($vuetify.display.xs && totalPages > 4), 'mt-2' : true }">
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
      >
        <SharedMemosList
          :auth-user="authUser"
          :memos="sharedMemos"
        />
      </v-window-item>
    </template>
  </v-window>

  <div :class="{ 'd-flex flex-row justify-start overflow-x-auto' : ($vuetify.display.xs && totalPages > 4), 'mt-2' : true }">
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
          route: '/shared'
        },
        {
          id: 2,
          name: "キャラ対メモ",
          route: '/shared/matchup'
        }
      ],
      page: 1,
      pushCancel: false
    };
  },
  computed: {
    ...mapGetters("users", ["authUser"]),
    ...mapGetters("shared", [
      "sharedMemos",
      "totalPages"
    ]),
    routeName() {
      return this.$route.name;
    },
    pageQuery() {
      return this.$route.query.page ? Number(this.$route.query.page) : 1;
    },
    isTransitionWithinSame() {
      return [
        "SharedMatchupMemosIndex",
        "SharedStrategyMemosIndex"
        ].includes(this.$route.name);
    }
  },
  watch: {
    routeName: function(newVal) {
      if (this.isTransitionWithinSame) {
        if (this.page != 1) {
          this.page = 1;
          this.pushCancel = true;
        }
        this.handleFetchSharedMemos();
        this.$router.replace({ name: newVal, query: { page: 1 }});
      }
    },
    page: function(newVal) {
      if (this.isTransitionWithinSame && !this.pushCancel) {
        this.handleFetchSharedMemos();
        this.$router.push({ name: this.$route.name, query: { page: newVal }});
      }
      this.pushCancel = false;
    },
    pageQuery: function(newVal) {
      this.page = newVal;
    }
  },
  mounted() {
    this.page = this.pageQuery;
    this.$router.replace({ name: this.routeName, query: { page: 1 }});
    this.handleFetchSharedMemos();
  },
  methods: {
    ...mapActions("shared", ["fetchSharedMemos"]),
    handleFetchSharedMemos() {
      const memoType = this.routeName == "SharedMatchupMemosIndex" ? "MatchupMemo" : "StrategyMemo";
      this.fetchSharedMemos({ memoType: memoType, page: this.page });
    }
  }
};
</script>