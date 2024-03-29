<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    新規登録
  </div>

  <div class="my-6" />

  <v-row id="register-form">
    <v-col
      cols="12"
      sm="8"
      md="6"
      lg="6"
      xl="6"
    >
      <form @submit.prevent>
        <v-text-field
          v-model="v$.user.name.$model"
          :error-messages="v$.user.name.$errors.map(e => e.$message)"
          :counter="20"
          name="ユーザー名"
          label="ユーザー名"
          variant="underlined"
        />

        <v-text-field
          v-model="v$.user.email.$model"
          :error-messages="v$.user.email.$errors.map(e => e.$message)"
          name="メールアドレス"
          label="メールアドレス"
          variant="underlined"
        />

        <v-text-field
          v-model="v$.user.password.$model"
          :error-messages="v$.user.password.$errors.map(e => e.$message)"
          name="パスワード"
          label="パスワード"
          type="password"
          variant="underlined"
        />

        <v-text-field
          v-model="v$.user.password_confirmation.$model"
          :error-messages="v$.user.password_confirmation.$errors.map(e => e.$message)"
          name="パスワード（確認）"
          label="パスワード（確認）"
          type="password"
          variant="underlined"
        />

        <div class="d-flex justify-center text-body-2">
          ユーザーの新規登録には、利用規約への同意が必要です。
        </div>

        <div class="d-flex justify-center mt-2">
          <router-link
            :to="{ name: 'TermsIndex' }"
            class="text-decoration-underline text-body-2"
          >
            利用規約はこちら
          </router-link>
        </div>

        <v-layout>
          <div class="mx-auto mb-n6">
            <v-checkbox
              v-model="v$.termsAccepted.$model"
              name="利用規約"
              label="利用規約に同意する"
            />
          </div>
        </v-layout>

        <template v-if="v$.termsAccepted.$errors[0]">
          <div class="d-flex justify-center mt-n2 ml-2 mb-2">
            <p class="text-error text-caption">
              {{ v$.termsAccepted.$errors.map(e => e.$message)[0] }}
            </p>
          </div>
        </template>
      </form>

      <div class="d-flex flex-row justify-center">
        <v-btn
          color="teal-accent-4"
          class="font-weight-bold"
          @click="handleRegister"
        >
          登録
        </v-btn>
      </div>
      <div class="d-flex flex-row justify-center mt-5">
        <router-link
          :to="{ name: 'UsersLogin' }"
          class="text-decoration-underline text-body-2"
        >
          登録済みの方はこちら
        </router-link>
      </div>
      <div class="d-flex flex-row justify-center mt-2">
        <router-link
          :to="{ name: 'DemoUsersLogin' }"
          class="text-decoration-underline text-body-2"
        >
          お試しログイン
        </router-link>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  email,
  maxLength,
  minLength,
  sameAs,
  helpers
} from '@vuelidate/validators';
import {
  requiredMessage,
  emailMessage,
  maxLengthMessage,
  minLengthMessage,
  sameAsMessage
} from '../../constants/validationCustom';
import {
  successRegisterAlertStatus,
  failAlertStatus,
  serverErrorAlertStatus
} from '../../constants/alertStatus';

export default {
  name: "UsersRegister",
  inject: ["$axios"],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data () {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
      },
      termsAccepted: false
    };
  },
  validations () {
    return {
      user: {
        name: { 
          required: helpers.withMessage(requiredMessage("ユーザー名"), required),
          maxLength: helpers.withMessage(maxLengthMessage(20), maxLength(20))
        },
        email: {
          required: helpers.withMessage(requiredMessage("メールアドレス"), required),
          email: helpers.withMessage(emailMessage, email)
        },
        password: {
          required: helpers.withMessage(requiredMessage("パスワード"), required),
          minLength: helpers.withMessage(minLengthMessage(3), minLength(3))
        },
        password_confirmation: {
          sameAs: helpers.withMessage(sameAsMessage("パスワード"), sameAs(this.user.password))
        }
      },
      termsAccepted: {
        sameAs: helpers.withMessage("利用規約への同意が必要です", sameAs(true))
      }
    };
  },
  methods: {
    ...mapActions("users", ["loginUser"]),
    ...mapActions("alert", ["displayAlert"]),
    async handleRegister() {
      const result = await this.v$.$validate();

      if (!result) return;

      this.createUser();
    },
    createUser() {
      this.$axios.post("users", { user: this.user })
        .then(res => {
          this.login();
        })
        .catch(err => {
          // responseが帰ってきたときは格納されているエラーを、返ってこないときはサーバーエラーを表示
          if (err.response) {
            failAlertStatus.alertTextArray = err.response.data;
            this.displayAlert({ alertStatus: failAlertStatus });
          } else {
            this.displayAlert({ alertStatus: serverErrorAlertStatus });
          }
        });
    },
    async login() {
      try {
        await this.loginUser(this.user);
        this.displayAlert({ alertStatus: successRegisterAlertStatus });
        this.$router.push({ name: 'TopIndex' });
      } catch(err) {
        this.displayAlert({ alertStatus: serverErrorAlertStatus });
      }
    }
  }
};
</script>