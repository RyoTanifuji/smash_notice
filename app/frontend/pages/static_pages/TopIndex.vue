<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    スマブラ専用メモツール
  </div>

  <div class="my-6" />

  <div class="text-body-1 font-weight-bold">
    SmashNoticeは「大乱闘スマッシュブラザーズSPECIAL」の攻略メモを整理・共有できるメモツールです。
  </div>

  <div class="my-8" />

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

    <div class="my-8" />

    <div class="text-body-1 font-weight-bold">
      <router-link
        :to="{ name: 'MatchupFoldersIndex' }"
        class="text-decoration-underline"
      >
        キャラ対メモ
      </router-link>
      では相手ファイターの対策をファイターごとにまとめることができます。

      <div class="my-4" />

      テンプレート機能を活用して、統一されたフォーマットで整理することも可能です。
    </div>
  </template>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "TopIndex",
  computed: {
    ...mapGetters("users", ["authUser"])
  },
};
</script>