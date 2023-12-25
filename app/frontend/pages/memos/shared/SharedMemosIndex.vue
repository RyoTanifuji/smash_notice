<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    みんなのメモ
  </div>

  <div class="my-6" />

  <v-tabs
    v-model="activeTab"
    align-tabs="center"
    center-active
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

  <template v-if="totalPages">
    <div :class="{ 'd-flex flex-row overflow-x-auto' : ($vuetify.display.xs && totalPages > 4), 'mt-2' : true }">
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="totalVisible"
      />
    </div>
  </template>

  <template v-if="isDataReceived">
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
            :shared-memos="sharedMemos"
            :bookmark-memo-ids="bookmarkMemoIds"
            @create-bookmark="handleCreateBookmark"
            @delete-bookmark="handleDeleteBookmark"
          />
        </v-window-item>
      </template>
    </v-window>
  </template>

  <template v-if="routeName == 'BookmarkMemosIndex' && !totalPages">
    <div class="d-flex flex-row justify-center">
      <template v-if="authUser">
        <div class="font-weight-bold mt-10">
          ここにブックマークしたメモの一覧が表示されます。

          <div class="my-4" />

          参考にしたいメモなどをブックマークしてみましょう。
        </div>
      </template>
      <template v-else>
        <div class="font-weight-bold mt-16">
          ログインすることで、ブックマーク機能を利用できるようになります。

          <div class="my-4" />

          ログイン・ユーザー登録は以下のリンクから行えます。

          <div class="d-flex flex-row justify-center mt-8">
            <v-btn
              :to="{ name: 'UsersLogin' }"
              class="mr-8"
            >
              ログイン
            </v-btn>
            <v-btn :to="{ name: 'UsersRegister' }">
              新規登録
            </v-btn>
          </div>
        </div>
      </template>
    </div>
  </template>

  <template v-if="totalPages">
    <div :class="{ 'd-flex flex-row justify-start overflow-x-auto' : ($vuetify.display.xs && totalPages > 4), 'mt-2' : true }">
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="totalVisible"
      />
    </div>
  </template>
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
        },
        {
          id: 3,
          name: "ブックマーク",
          route: '/shared/bookmarks'
        }
      ],
      page: 1,
      totalVisible: 6,
      isDataReceived: false,
      pushCancel: false
    };
  },
  computed: {
    ...mapGetters("users", ["authUser"]),
    ...mapGetters("shared", [
      "sharedMemos",
      "totalPages",
      "bookmarkMemoIds"
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
        "SharedStrategyMemosIndex",
        "BookmarkMemosIndex"
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
    ...mapActions("shared", [
      "fetchSharedMemos",
      "fetchBookmarkMemos",
      "createBookmark",
      "deleteBookmark"
    ]),
    handleFetchSharedMemos() {
      this.isDataReceived = false;
      if (this.routeName == "BookmarkMemosIndex") {
        this.fetchBookmarkMemos(this.page)
          .then(() => {
            this.isDataReceived = true;
          });
      } else {
        const memoType = this.routeName == "SharedMatchupMemosIndex" ? "MatchupMemo" : "StrategyMemo";
        this.fetchSharedMemos({ memoType: memoType, page: this.page })
          .then(() => {
            this.isDataReceived = true;
          });
      }
    },
    handleCreateBookmark(memoId) {
      this.createBookmark(memoId);
    },
    handleDeleteBookmark(memoId) {
      this.deleteBookmark(memoId);
    }
  }
};
</script>