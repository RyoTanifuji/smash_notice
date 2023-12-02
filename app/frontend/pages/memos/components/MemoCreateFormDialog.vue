<template>
  <v-card>
    <v-card-title class="ma-2">
      <span class="text-h5 font-weight-bold">メモの作成</span>
    </v-card-title>
    <v-card-text>
      <form>
        <v-text-field
          v-model="v$.memo.title.$model"
          :error-messages="v$.memo.title.$errors.map(e => e.$message)"
          :counter="20"
          name="タイトル"
          label="タイトル"
          hint="未入力の場合、下記の相手ファイター名が設定されます"
          variant="underlined"
        />
        <v-autocomplete
          v-model="v$.memo.fighterId.$model"
          :error-messages="v$.memo.fighterId.$errors.map(e => e.$message)"
          :items="fightersArray"
          item-value="id"
          item-title="name"
          clearable
          :menu-props="{ location: 'top', scrollStrategy: 'none' }"
          name="相手ファイター"
          label="相手ファイター"
          hint="対策するファイターを選択してください"
          variant="underlined"
        />
        <v-checkbox
          v-model="applyTemplate"
          name="キャラ対テンプレート"
          label="テンプレートを適用する"
        />
      </form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="handleCloseMemoCreateFormDialog">
        キャンセル
      </v-btn>
      <v-btn
        class="mr-4"
        color="teal-accent-4"
        @click="handleMemoSubmit"
      >
        作成
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  maxLength,
  helpers
} from '@vuelidate/validators';
import { requiredMessage, maxLengthMessage } from '../../../plugins/validationMessages';
import { FIGHTERS_ARRAY } from '../../../plugins/fightersArray';

export default {
  name: "MemoCreateFormDialog",
  props: {
    memo: {
      type: Object,
      required: true,
      id: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      fighterId: {
        type: Number,
        required: true
      }
    }
  },
  emits: [
    "close-dialog",
    "memo-submit"
  ],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      applyTemplate: false,
      fightersArray: FIGHTERS_ARRAY
    };
  },
  validations () {
    return {
      memo: {
        title: { 
          maxLength: helpers.withMessage(maxLengthMessage(20), maxLength(20))
        },
        fighterId: {
          required: helpers.withMessage(requiredMessage("相手ファイター"), required)
        }
      }
    };
  },
  methods: {
    handleCloseMemoCreateFormDialog() {
      this.v$.$reset();
      this.$emit("close-dialog");
    },
    async handleMemoSubmit() {
      const result = await this.v$.$validate();

      if (!result) return;

      this.$emit("memo-submit", this.memo, this.applyTemplate);
    }
  }
};
</script>