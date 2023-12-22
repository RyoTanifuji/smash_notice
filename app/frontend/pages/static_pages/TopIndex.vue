<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    <span class="d-inline-block">スマブラ専用</span>
    <span class="d-inline-block">メモツール</span>
  </div>

  <div class="my-6" />

  <template v-if="displayDescription">
    <div class="text-body-1 font-weight-bold">
      SmashNoticeは「大乱闘スマッシュブラザーズSPECIAL」の攻略メモを整理・共有できるメモツールです。
    </div>

    <div class="my-8" />
  </template>

  <template v-if="!authUser">
    <div class="text-body-1 font-weight-bold">
      まずは
      <router-link
        :to="{ name: 'Null' }"
        class="top-page-link"
      >
        お試しログイン
      </router-link>
      でメモの作成を試してみましょう。
    </div>

    <div class="my-8" />

    <div class="text-body-1 font-weight-bold">
      <router-link
        :to="{ name: 'SharedStrategyMemosIndex' }"
        class="top-page-link"
      >
        みんなのメモ
      </router-link>
      から他のユーザーが公開しているメモを見ることもできます。
    </div>

    <div class="my-12" />

    <div>
      <v-btn
        :to="{ name: 'UsersLogin' }"
        class="mx-8"
      >
        ログイン
      </v-btn>
      <v-btn :to="{ name: 'UsersRegister' }">
        新規登録
      </v-btn>
    </div>
  </template>

  <template v-else>
    <div class="text-body-1 font-weight-bold">
      <router-link
        :to="{ name: 'StrategyFoldersIndex' }"
        class="top-page-link"
      >
        攻略メモ
      </router-link>
      では自分の使用しているファイターに関する立ち回りやコンボなどをまとめることができます。
    </div>

    <template v-if="strategyFolders.length">
      <v-card
        max-width="500"
        class="mt-2"
      >
        <v-card-title>
          攻略メモフォルダ一覧
        </v-card-title>
        <v-card-text>
          <v-list max-height="120">
            <template
              v-for="folderItem in strategyFolders"
              :key="folderItem.id"
            >
              <v-list-item
                :title="folderItem.name"
                :subtitle="dateFormat(folderItem.updatedAt)"
                :to="{ path: `/strategy/${folderItem.id}/memos` }"
                :prepend-icon="mdiFolder"
              />
            </template>
          </v-list>
        </v-card-text>
      </v-card>
    </template>

    <div class="my-6" />

    <div class="text-body-1 font-weight-bold">
      <router-link
        :to="{ name: 'MatchupFoldersIndex' }"
        class="top-page-link"
      >
        キャラ対メモ
      </router-link>
      では相手ファイターの対策をファイターごとにまとめることができます。

      <template v-if="matchupFolders.length">
        <v-card
          max-width="500"
          class="mt-2"
        >
          <v-card-title>
            キャラ対メモフォルダ一覧
          </v-card-title>
          <v-card-text>
            <v-list max-height="120">
              <template
                v-for="folderItem in matchupFolders"
                :key="folderItem.id"
              >
                <v-list-item
                  :title="folderItem.name"
                  :subtitle="dateFormat(folderItem.updatedAt)"
                  :to="{ path: `/matchup/${folderItem.id}/memos` }"
                  :prepend-icon="mdiFolder"
                />
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </template>

      <div class="my-4" />

      テンプレート機能を活用して、統一されたフォーマットで整理することも可能です。
    </div>
  </template>

  <div class="my-16" />

  <div class="text-h5 font-weight-bold mb-4">
    みんなのメモ一覧
  </div>

  <SharedMemosList
    :auth-user="authUser"
    :memos="sharedMemos.slice(0, 6)"
  />

  <div class="d-flex flex-row justify-end mt-4">
    <router-link
      :to="{ name: 'SharedStrategyMemosIndex' }"
      class="top-page-link"
    >
      もっと見る
    </router-link>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mdiFolder } from '@mdi/js';
import dayjs from 'dayjs';
import SharedMemosList from '../memos/components/SharedMemosList';

export default {
  name: "TopIndex",
  data() {
    return {
      mdiFolder
    };
  },
  components: {
    SharedMemosList
  },
  computed: {
    ...mapGetters("users", ["authUser"]),
    ...mapGetters("folders", ["folders"]),
    ...mapGetters("shared", ["sharedMemos"]),
    displayDescription() {
      return !this.authUser || !this.folders.length ? true : false;
    },
    matchupFolders() {
      return this.folders.filter(folder => {
        return folder.type == "MatchupFolder";
      });
    },
    strategyFolders() {
      return this.folders.filter(folder => {
        return folder.type == "StrategyFolder";
      });
    }
  },
  mounted() {
    if (this.authUser) this.$store.dispatch("folders/fetchFolders", ["MatchupFolder", "StrategyFolder"]);
    this.fetchSharedMemos({ memoType: ["MatchupMemo", "StrategyMemo"], page: 1 });
  },
  methods: {
    ...mapActions("shared", ["fetchSharedMemos"]),
    dateFormat(date) {
      return dayjs(date).format("YYYY-MM-DD");
    }
  }
};
</script>

<style>
.text-body-1 {
  line-height: 1.7em;
}

.top-page-link {
  text-decoration: underline;
  color: #0099CC;
}
</style>