<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    プロフィール編集
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
      <template v-if="isGeneral">
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
        </form>

        <div class="d-flex flex-row justify-center">
          <v-btn
            color="teal-accent-4"
            class="font-weight-bold"
            @click="handleUserUpdate"
          >
            更新
          </v-btn>
        </div>
      </template>
      <template v-else>
        <div class="text-body-1 font-weight-bold">
          お試しログインでは、プロフィールの編集はできません。

          <div class="my-8" />

          ログイン・ユーザー登録は以下のリンクから行えます。

          <div class="mt-8">
            <v-btn
              :to="{ name: 'UsersLogin' }"
              color="teal-accent-4"
              class="mx-8"
            >
              ログイン
            </v-btn>
            <v-btn
              :to="{ name: 'UsersRegister' }"
              color="teal-accent-4"
            >
              新規登録
            </v-btn>
          </div>
        </div>
      </template>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  email,
  maxLength,
  helpers
} from '@vuelidate/validators';
import {
  requiredMessage,
  emailMessage,
  maxLengthMessage
} from '../../constants/validationCustom';
import {
  successProfileEditAlertStatus,
  failAlertStatus,
  serverErrorAlertStatus
} from '../../constants/alertStatus';

export default {
  name: "ProfileEdit",
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
        email: ""
      }
    };
  },
  computed: {
    ...mapGetters("users", [
      "authUser",
      "isGeneral"
    ])
  },
  mounted() {
    this.user.name = this.authUser.name;
    this.user.email = this.authUser.email;
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
        }
      }
    };
  },
  methods: {
    ...mapActions("users", ["updateUser"]),
    ...mapActions("alert", ["displayAlert"]),
    async handleUserUpdate() {
      const result = await this.v$.$validate();

      if (!result || !this.isGeneral) return;

      this.updateUser(this.user)
        .then(() => {
          this.displayAlert({ alertStatus: successProfileEditAlertStatus });
        })
        .catch(err => {
          if (err.response) {
            failAlertStatus.alertTextArray = err.response.data;
            this.displayAlert({ alertStatus: failAlertStatus });
          } else {
            this.displayAlert({ alertStatus: serverErrorAlertStatus });
          }
        })
    }
  }
};
</script>