<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    お試しログイン
  </div>

  <div class="my-6" />

  <div class="text-body-1">
    お試しログインはユーザー登録をせずに、メモの作成を試すことのできる機能です。
  </div>

  <v-row>
    <v-col 
      cols="12"
      sm="10"
      md="10"
      lg="10"
      xl="10"
    >
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="6"
          xl="6"
        >
          <v-sheet
            elevation="4"
            rounded="lg"
            class="px-4 pt-2 pb-6 mt-4 bg-blue-grey-lighten-5"
          >
            <div class="text-h6">
              お試しログインでできること
            </div>
            <ul class="ml-6">
              <li class="my-1">
                フォルダの作成
              </li>
              <li class="mb-1">
                メモの作成
              </li>
              <li>
                キャラ対メモのテンプレート機能
              </li>
            </ul>
          </v-sheet>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="6"
          xl="6"
        >
          <v-sheet
            elevation="4"
            rounded="lg"
            class="px-4 pt-2 pb-6 mt-4"
          >
            <div class="text-h6">
              一般ユーザーのみできること
            </div>
            <ul class="ml-6">
              <li class="my-1">
                メモの公開
              </li>
              <li class="mb-1">
                メモのブックマーク
              </li>
              <li>
                お問い合わせ
              </li>
            </ul>
          </v-sheet>
        </v-col>
      </v-row>
      <div class="mt-4">
        ※注意事項
      </div>
      <div class="text-body-2 mt-1">
        お試しログインで作成したメモなどは、ログアウトもしくは一定時間の経過により削除されるため、
        内容の保存をしたい場合は、ユーザー登録をしてからデータの作成を行なってください。
      </div>
      <div class="d-flex flex-row justify-center mt-6">
        <v-btn
          color="teal-accent-4"
          class="font-weight-bold"
          @click="handleDemoLogin"
        >
          お試しログイン
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import {
  successLoginAlertStatus,
  serverErrorAlertStatus
} from '../../constants/alertStatus';

export default {
  name: "DemoUsersLogin",
  inject: ["$axios"],
  data () {
    return {
      user: {
        name: "デモユーザー",
        email: "",
        password: "password",
        password_confirmation: "password"
      }
    };
  },
  methods: {
    ...mapActions("users", ["loginUser"]),
    ...mapActions("alert", ["displayAlert"]),
    handleDemoLogin() {
      this.$axios.post("users/create_demo")
        .then(res => {
          this.user.email = res.data.email;
          this.login();
        })
        .catch(err => {
          this.displayAlert({ alertStatus: serverErrorAlertStatus });
        });
    },
    async login() {
      try {
        await this.loginUser(this.user);
        this.displayAlert({ alertStatus: successLoginAlertStatus });
        this.$router.push({ name: 'TopIndex' });
      } catch(err) {
        this.displayAlert({ alertStatus: serverErrorAlertStatus });
      }
    }
  }
};
</script>