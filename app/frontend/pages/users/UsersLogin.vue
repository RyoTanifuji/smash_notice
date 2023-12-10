<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    ログイン
  </div>

  <div class="my-6" />

  <v-row>
    <v-col 
      cols="12"
      sm="8"
      md="6"
      lg="6"
      xl="6"
    >
      <form id="login-form">
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

        <v-row class="justify-center mt-5">
          <v-btn
            color="teal-accent-4"
            class="font-weight-bold"
            @click="handleLogin"
          >
            ログイン
          </v-btn>
        </v-row>
        <div class="mt-10 d-flex flex-row justify-center">
          <router-link
            :to="{ name: 'UsersRegister' }"
            class="text-decoration-underline text-body-2"
          >
            新規登録はこちら
          </router-link>
        </div>
      </form>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  email,
  minLength,
  helpers
} from '@vuelidate/validators';
import {
  requiredMessage,
  emailMessage,
  minLengthMessage
} from '../../constants/validationCustom';
import {
  successLoginAlertStatus,
  failLoginAlertStatus,
  serverErrorAlertStatus
} from '../../constants/alertStatus';

export default {
  name: "UsersLogin",
  inject: ["$axios"],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data () {
    return {
      user: {
        email: "",
        password: "",
      }
    };
  },
  validations () {
    return {
      user: {
        email: {
          required: helpers.withMessage(requiredMessage("メールアドレス"), required),
          email: helpers.withMessage(emailMessage, email)
        },
        password: {
          required: helpers.withMessage(requiredMessage("パスワード"), required),
          minLength: helpers.withMessage(minLengthMessage(3), minLength(3))
        }
      }
    };
  },
  methods: {
    ...mapActions("users", ["loginUser"]),
    ...mapActions("alert", ["displayAlert"]),
    async handleLogin() {
      const result = await this.v$.$validate();

      if (!result) return;

      this.login();
    },
    async login() {
      try {
        await this.loginUser(this.user);
        this.displayAlert({ alertStatus: successLoginAlertStatus });
        this.$router.push({ name: 'TopIndex' });
      } catch(err) {
        if (err.response) {
          this.displayAlert({ alertStatus: failLoginAlertStatus });
        } else {
          this.displayAlert({ alertStatus: serverErrorAlertStatus });
        }
      }
    }
  }
};
</script>