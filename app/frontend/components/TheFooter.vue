<template>
  <v-footer
    app
    absolute
    border
    class="d-flex justify-center"
  >
    <div class="pt-0 text-center footer-text">
      当サイトは
      <a
        href="https://www.smashbros.com/ja_JP/"
        target="_blank"
        class="text-decoration-underline"
      >
        大乱闘スマッシュブラザーズ
      </a>
      の非公式メモツールです。<br>
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