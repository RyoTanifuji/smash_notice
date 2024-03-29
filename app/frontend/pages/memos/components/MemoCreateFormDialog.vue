<template>
  <v-card>
    <v-card-title class="ma-2">
      <span class="text-h5 font-weight-bold">メモの作成</span>
    </v-card-title>
    <v-card-text>
      <TheAlert :is-dialog="true" />
      <form @submit.prevent>
        <v-text-field
          v-model="v$.memo.title.$model"
          :error-messages="v$.memo.title.$errors.map(e => e.$message)"
          :counter="titleMaxLength"
          name="タイトル"
          label="タイトル"
          :hint="formTitleHint"
          variant="underlined"
        />
        <template v-if="isMatchup">
          <v-autocomplete
            v-model="v$.memo.opponentId.$model"
            :error-messages="v$.memo.opponentId.$errors.map(e => e.$message)"
            :items="FIGHTERS_ARRAY"
            item-value="id"
            item-title="name"
            :custom-filter="autocompleteCustomFilter"
            clearable
            :menu-props="{ location: 'top', scrollStrategy: 'none', maxHeight: '250px' }"
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
        </template>
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
  requiredIf,
  maxLength,
  helpers
} from '@vuelidate/validators';
import { requiredMessage, maxLengthMessage } from '../../../constants/validationCustom';
import { textConversion } from '../../../constants/textConversion';
import { FIGHTERS_ARRAY } from '../../../constants/fightersArray';
import TheAlert from '../../../components/TheAlert';

export default {
  name: "MemoCreateFormDialog",
  components: {
    TheAlert
  },
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
      opponentId: {
        type: Number,
        required: true
      }
    },
    formTitleHint: {
      type: String,
      required: true
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
      titleMaxLength: 25,
      applyTemplate: false,
      FIGHTERS_ARRAY
    };
  },
  computed: {
    isMatchup() {
      return this.$route.name == "MatchupMemosIndex";
    }
  },
  validations () {
    return {
      memo: {
        title: {
          required: helpers.withMessage(requiredMessage("タイトル"), requiredIf(!this.isMatchup)),
          maxLength: helpers.withMessage(maxLengthMessage(this.titleMaxLength), maxLength(this.titleMaxLength))
        },
        opponentId: {
          required: helpers.withMessage(requiredMessage("相手ファイター"), requiredIf(this.isMatchup))
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
    },
    autocompleteCustomFilter(itemTitle, queryText, item) {
      const fighterName = textConversion(item.raw.name);
      const searchText = textConversion(queryText);

      return fighterName.indexOf(searchText) > -1;
    }
  }
};
</script>