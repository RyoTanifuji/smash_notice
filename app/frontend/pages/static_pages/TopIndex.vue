<template>
  <div class="mx-10 mt-6 w-75">
    <div class="text-h3 font-weight-bold">
      スマブラ専用メモツール
    </div>

    <div class="my-10" />

    <div class="text-body-1 font-weight-bold">
      SmashNoticeは「大乱闘スマッシュブラザーズSPECIAL」の攻略メモを整理・共有できるメモツールです
    </div>

    <div class="my-8" />

    <div class="text-body-1 font-weight-bold">
      まずは
      <router-link
        :to="{ name: 'Null' }"
        class="text-decoration-underline"
      >
        お試しログイン
      </router-link>
      でメモの作成を試してみましょう
    </div>

    <div class="my-8" />

    <div class="text-body-1 font-weight-bold">
      <router-link
        :to="{ name: 'Null' }"
        class="text-decoration-underline"
      >
        みんなのメモ
      </router-link>
      から他のユーザーが公開しているメモを見ることもできます
    </div>

    <div class="my-12" />

    <div>
      <v-btn class="mx-8">
        ログイン
      </v-btn>
      <v-btn :to="{ name: 'UsersSignUp' }">
        新規登録
      </v-btn>
    </div>
  </div>
</template>

<script>
</script>