<template>
  <form>
    <v-text-field
      v-model="v$.memo.title.$model"
      :error-messages="v$.memo.title.$errors.map(e => e.$message)"
      :counter="30"
      name="タイトル"
      label="タイトル"
      variant="underlined"
    />
    <template v-if="isMatchup">
      <v-autocomplete
        v-model="v$.memo.opponentId.$model"
        :error-messages="v$.memo.opponentId.$errors.map(e => e.$message)"
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
    </template>
    <v-switch
      v-model="v$.memo.state.$model"
      true-value="shared"
      false-value="local"
      :label="`ステータス: ${memoStateLabel}`"
      color="teal-accent-4"
    />
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
  required,
  maxLength,
  helpers
} from '@vuelidate/validators';
import { requiredMessage, maxLengthMessage } from '../../../constants/validationCustom';
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
      memoStates: {
        local: "非公開",
        shared: "公開"
      },
      fightersArray: FIGHTERS_ARRAY
    };
  },
  computed: {
    isMatchup() {
      return this.$route.name == "MatchupMemosEdit" ? true : false;
    },
    memoStateLabel() {
      return this.memoStates[this.memo.state];
    }
  },
  validations () {
    return {
      memo: {
        title: { 
          maxLength: helpers.withMessage(maxLengthMessage(30), maxLength(30))
        },
        opponentId: {
          required: helpers.withMessage(requiredMessage("相手ファイター"), required)
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
    }
  }
};
</script>