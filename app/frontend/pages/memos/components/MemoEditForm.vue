<template>
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
    </template>
    <template v-if="isGeneral">
      <v-switch
        v-model="v$.memo.state.$model"
        true-value="shared"
        false-value="local"
        :label="`ステータス: ${memoStateLabel}`"
        color="teal-accent-4"
      />
    </template>
  </form>
  <v-btn
    block
    color="teal-accent-4"
    @click="handleMemoSubmit"
  >
    更新
  </v-btn>
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

export default {
  name: "MemosEdit",
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
      },
      state: {
        type: String,
        default: "local"
      }
    },
    formTitleHint: {
      type: String,
      required: true
    },
    isGeneral: {
      type: Boolean,
      required: true
    }
  },
  emits: ["memo-submit"],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      titleMaxLength: 25,
      memoStates: {
        local: "非公開",
        shared: "公開"
      },
      FIGHTERS_ARRAY
    };
  },
  computed: {
    isMatchup() {
      return this.$route.name == "MatchupMemosEdit";
    },
    memoStateLabel() {
      return this.memoStates[this.memo.state];
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
        },
        state: {}
      }
    };
  },
  methods: {
    async handleMemoSubmit() {
      const result = await this.v$.$validate();

      if (!result) return;

      this.$emit("memo-submit", this.memo);
    },
    autocompleteCustomFilter(itemTitle, queryText, item) {
      const fighterName = textConversion(item.raw.name);
      const searchText = textConversion(queryText);

      return fighterName.indexOf(searchText) > -1;
    }
  }
};
</script>