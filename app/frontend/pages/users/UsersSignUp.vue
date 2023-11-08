<template>
  <div class="mx-10 mt-6">
    <div class="text-h3 font-weight-bold">
      新規登録
    </div>

    <div class="my-10" />

    <v-row>
      <v-col 
        cols="12"
        sm="8"
        md="6"
        lg="6"
        xl="6"
      >
        <form @submit.prevent="onSubmit">
          <v-text-field
            v-model="name.value.value"
            label="ユーザー名"
            :error-messages="name.errorMessage.value"
            variant="underlined"
          />

          <v-text-field
            v-model="email.value.value"
            label="メールアドレス"
            :error-messages="email.errorMessage.value"
            variant="underlined"
          />

          <v-text-field
            v-model="password.value.value"
            label="パスワード"
            type="password"
            :error-messages="password.errorMessage.value"
            variant="underlined"
          />

          <v-text-field
            v-model="password_confirmation.value.value"
            label="パスワード（確認）"
            type="password"
            :error-messages="password_confirmation.errorMessage.value"
            variant="underlined"
          />

          <v-row class="justify-center mt-5">
            <v-btn
              type="submit"
              color="indigo-accent-4"
              class="font-weight-bold"
            >
              登録
            </v-btn>
          </v-row>
        </form>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useField, useForm } from 'vee-validate';
import { object, string, ref as yupref } from 'yup';

export default {
  setup() {
    const validationSchema = object().shape({
      name: string().label("ユーザー名").required(),
      email: string().label("メールアドレス").email().required(),
      password: string().label("パスワード").required().min(3),
      password_confirmation: string().label("パスワード（確認）").oneOf([yupref("password"), null], "パスワードと一致していません")
    });

    const { handleSubmit, handleReset } = useForm({
      validationSchema,
    });

    const name = useField("name", validationSchema);
    const email = useField("email", validationSchema);
    const password = useField("password", validationSchema);
    const password_confirmation = useField("password_confirmation", validationSchema);

    const onSubmit = handleSubmit(async (values) => {
      alert(JSON.stringify(values, null, 2));
    });

    return { name, email, password, password_confirmation, onSubmit, handleReset };
  }
};
</script>