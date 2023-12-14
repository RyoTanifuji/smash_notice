<template>
  <v-footer
    app
    absolute
    border
    class="d-flex justify-center"
  >
    <div class="pt-0 text-center footer-text">
      <a
        href="https://www.smashbros.com/ja_JP/"
        target="_blank"
        class="text-decoration-underline"
      >
        大乱闘スマッシュブラザーズ
      </a>
      は、任天堂株式会社様の登録商標です。<br>
      当サイトは個人のスマブラファンが運営する非公式のWebサービスです。<br>
      任天堂株式会社様、他関連企業様とは一切関係ありません。
    </div>
  </v-footer>
</template>

<script>
export default {
  name: "TheFooter"
};
</script>

<style scoped>
.footer-text {
  font-size: 60%;
}
</style>