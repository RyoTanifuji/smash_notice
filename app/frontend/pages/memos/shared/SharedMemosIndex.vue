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
        :value="tab.route"
        exact
        class="w-25"
        @click="isTabChange = true"
      >
        {{ tab.name }}
      </v-tab>
    </template>
  </v-tabs>

  <div class="mb-n4">
    <v-row no-gutters>
      <v-icon
        :icon="mdiMagnify"
        class="mt-6"
      />
      <v-col
        cols="8"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="6"
            md="6"
            lg="6"
            xl="6"
          >
            <v-autocomplete
              v-model="searchQueryModel.fighter_id_eq"
              :items="FIGHTERS_ARRAY"
              item-value="id"
              item-title="name"
              :custom-filter="autocompleteCustomFilter"
              :menu-props="{ location: 'bottom', scrollStrategy: 'none' }"
              name="使用ファイター"
              label="使用ファイター"
              density="compact"
              single-line
              clearable
              variant="underlined"
              class="ma-2"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
            lg="6"
            xl="6"
          >
            <template v-if="routeName != 'SharedStrategyMemosIndex'">
              <v-autocomplete
                v-model="searchQueryModel.opponent_id_eq"
                :items="FIGHTERS_ARRAY"
                item-value="id"
                item-title="name"
                :custom-filter="autocompleteCustomFilter"
                :menu-props="{ location: 'bottom', scrollStrategy: 'none' }"
                name="相手ファイター"
                label="相手ファイター"
                density="compact"
                single-line
                clearable
                variant="underlined"
                :class="{ 'ma-2': true, 'mt-n6': $vuetify.display.xs }"
              />
            </template>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="1"
      >
        <v-btn
          color="teal-accent-4"
          class="mt-4 ml-2"
          @click="handleSearchMemos"
        >
          検索
        </v-btn>
      </v-col>
    </v-row>
  </div>

  <template v-if="isDataReceived">
    <template v-if="totalPages">
      <div :class="{ 'd-flex flex-row overflow-x-auto' : ($vuetify.display.xs && totalPages > 4), 'mt-2' : true }">
        <v-pagination
          v-model="page"
          :length="totalPages"
          :total-visible="totalVisible"
        />
      </div>
    </template>

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

  <template v-if="isNoSearchResult">
    <div class="d-flex flex-row justify-center">
      <div class="font-weight-bold mt-10">
        該当するメモが見つかりませんでした。

        <div class="my-4" />

        別の検索条件でお試しください。
      </div>
    </div>
  </template>
  <template v-else-if="isNoBookmark">
    <div class="d-flex flex-row justify-center">
      <template v-if="authUser">
        <div class="font-weight-bold mt-10">
          ここにブックマークしたメモの一覧が表示されます。

          <div class="my-4" />

          参考にしたいメモなどをブックマークしてみましょう。
        </div>
      </template>
      <template v-else>
        <div class="font-weight-bold mt-10">
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mdiMagnify } from '@mdi/js';
import SharedMemosList from '../components/SharedMemosList';
import { textConversion } from '../../../constants/textConversion';
import { FIGHTERS_ARRAY } from '../../../constants/fightersArray';

export default {
  name: "SharedMemosIndex",
  components: {
    SharedMemosList
  },
  data() {
    return {
      activeTab: "SharedStrategyMemosIndex",
      tabs: [
        {
          id: 1,
          name: "攻略メモ",
          route: "SharedStrategyMemosIndex"
        },
        {
          id: 2,
          name: "キャラ対メモ",
          route: "SharedMatchupMemosIndex"
        },
        {
          id: 3,
          name: "ブックマーク",
          route: "BookmarkMemosIndex"
        }
      ],
      searchQuerySubmit: {
        fighter_id_eq: null,
        opponent_id_eq: null
      },
      searchQueryModel: {
        fighter_id_eq: null,
        opponent_id_eq: null
      },
      searchQueryDefault: {
        fighter_id_eq: null,
        opponent_id_eq: null
      },
      page: 1,
      totalVisible: 6,
      isDataReceived: false,
      pushCancel: false,
      pushStateFlag: true,
      searchQueryFlag: true,
      isTabChange: false,
      FIGHTERS_ARRAY,
      mdiMagnify
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
    searchQuery() {
      const searchQuery = Object.assign({}, this.searchQueryDefault);
      searchQuery.fighter_id_eq = this.fighterQuery;
      searchQuery.opponent_id_eq = this.opponentQuery;
      return searchQuery;
    },
    fighterQuery() {
      return this.$route.query.fighter ? Number(this.$route.query.fighter) : null;
    },
    opponentQuery() {
      return this.$route.query.opponent ? Number(this.$route.query.opponent) : null;
    },
    routerState() {
      return JSON.stringify({
        routeName: this.routeName,
        page: this.pageQuery,
        fighter: this.fighterQuery,
        opponent: this.opponentQuery
      });
    },
    isSearchQueryDefault() {
      return JSON.stringify(this.searchQuerySubmit) != JSON.stringify(this.searchQueryDefault);
    },
    isNoSearchResult() {
      return this.isSearchQueryDefault && !this.totalPages;
    },
    isNoBookmark() {
      return this.$route.name == "BookmarkMemosIndex" && !this.totalPages;
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
    activeTab: function(newVal) {
      if (this.isTransitionWithinSame) {
        if (this.isTabChange) {
          if (this.page != 1) {
            this.page = 1;
            this.pushCancel = true;
          }
          this.searchQueryInitialize();
          this.isTabChange = false;
        }
        if (this.pushStateFlag) {
          this.$router.push({ name: newVal, query: {
            page: 1,
            fighter: this.searchQuerySubmit.fighter_id_eq,
            opponent: this.searchQuerySubmit.opponent_id_eq
          }});
          this.pushStateFlag = false;
        } else {
          this.pushStateFlag = true;
        }
        this.searchQueryFlag = true;
      }
      console.log("tab");
    },
    page: function(newVal) {
      if (this.isTransitionWithinSame && !this.pushCancel) {
        if (this.pushStateFlag) {
          this.$router.push({ name: this.routeName, query: {
            page: newVal,
            fighter: this.searchQuerySubmit.fighter_id_eq,
            opponent: this.searchQuerySubmit.opponent_id_eq
          }});
          this.pushStateFlag = false;
        } else {
          this.pushStateFlag = true;
        }
      }
      this.pushCancel = false;
      this.searchQueryFlag = false;
    },
    "searchQuerySubmit.fighter_id_eq": function(newVal) {
      if (this.searchQueryFlag) this.pushStateFlag = !this.pushStateFlag;
      console.log("fighter");
    },
    "searchQuerySubmit.opponent_id_eq": function(newVal) {
      if (this.searchQueryFlag) this.pushStateFlag = !this.pushStateFlag;
    },
    routerState: function(newVal) {
      this.activeTab = this.routeName;
      this.page = this.pageQuery;
      this.setSearchQuery();
      this.handleFetchSharedMemos();
      this.pushStateFlag = !this.pushStateFlag;
      this.searchQueryFlag = true;
    }
  },
  mounted() {
    this.page = this.pageQuery;
    this.setSearchQuery();
    this.$router.replace({ name: this.$route.name, query: {
      page: 1,
      fighter: this.searchQuerySubmit.fighter_id_eq,
      opponent: this.searchQuerySubmit.opponent_id_eq
    }});
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
        this.fetchBookmarkMemos({ page: this.page, searchQuery: this.searchQuerySubmit })
          .then(() => {
            this.isDataReceived = true;
          });
      } else {
        const memoType = this.routeName == "SharedMatchupMemosIndex" ? "MatchupMemo" : "StrategyMemo";
        this.fetchSharedMemos({ memoType: memoType, page: this.page, searchQuery: this.searchQuerySubmit })
          .then(() => {
            this.isDataReceived = true;
          });
      }
    },
    handleSearchMemos() {
      this.searchQuerySubmit = Object.assign({}, this.searchQueryModel);
      if (this.page != 1) {
        this.page = 1;
        this.pushCancel = true;
      }
      this.$router.push({ name: this.$route.name, query: {
        page: 1,
        fighter: this.searchQuerySubmit.fighter_id_eq,
        opponent: this.searchQuerySubmit.opponent_id_eq
      }});
    },
    handleCreateBookmark(memoId) {
      this.createBookmark(memoId);
    },
    handleDeleteBookmark(memoId) {
      this.deleteBookmark(memoId);
    },
    searchQueryInitialize() {
      this.searchQuerySubmit = Object.assign({}, this.searchQueryDefault);
      this.searchQueryModel = Object.assign({}, this.searchQueryDefault);
    },
    setSearchQuery() {
      this.searchQuerySubmit = Object.assign({}, this.searchQuery);
      this.searchQueryModel = Object.assign({}, this.searchQuery);
    },
    autocompleteCustomFilter(itemTitle, queryText, item) {
      const fighterName = textConversion(item.raw.name);
      const searchText = textConversion(queryText);

      return fighterName.indexOf(searchText) > -1;
    }
  }
};
</script>