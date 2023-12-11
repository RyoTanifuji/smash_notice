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
        class="text-decoration-underline"
      >
        お試しログイン
      </router-link>
      でメモの作成を試してみましょう。
    </div>

    <div class="my-8" />

    <div class="text-body-1 font-weight-bold">
      <router-link
        :to="{ name: 'Null' }"
        class="text-decoration-underline"
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
        class="text-decoration-underline"
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
        class="text-decoration-underline"
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { mdiFolder } from '@mdi/js';
import dayjs from 'dayjs';

export default {
  name: "TopIndex",
  data() {
    return {
      mdiFolder
    }
  },
  computed: {
    ...mapGetters("users", ["authUser"]),
    ...mapGetters("folders", ["folders"]),
    displayDescription() {
      if (!this.authUser) return true;
      if (!this.folders.length) return true;
      return false;
    },
    matchupFolders() {
      return this.folders.filter(folder => {
        return folder.type == "MatchupFolder";
      })
    },
    strategyFolders() {
      return this.folders.filter(folder => {
        return folder.type == "StrategyFolder";
      })
    }
  },
  created() {
    if (this.authUser) this.$store.dispatch("folders/fetchFolders", ["MatchupFolder", "StrategyFolder"]);
  },
  methods: {
    dateFormat(date) {
      return dayjs(date).format("YYYY-MM-DD");
    }
  }
};
</script>