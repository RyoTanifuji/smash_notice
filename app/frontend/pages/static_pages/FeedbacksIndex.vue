<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    お問い合わせ
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
      <form @submit.prevent>
        <v-select
          v-model="v$.feedback.category.$model"
          :error-messages="v$.feedback.category.$errors.map(e => e.$message)"
          :items="feedbackCategories"
          item-title="name"
          item-value="id"
          name="問い合わせの種類"
          label="問い合わせの種類"
          variant="underlined"
        />

        <div class="text-body-2 mt-6 mb-4">
          {{ feedbackAttention }}
        </div>

        <v-textarea
          v-model="v$.feedback.body.$model"
          :error-messages="v$.feedback.body.$errors.map(e => e.$message)"
          :counter="1000"
          name="問い合わせ内容"
          label="問い合わせ内容"
          variant="underlined"
        />

        <v-row class="justify-center mt-5">
          <v-btn
            color="teal-accent-4"
            class="font-weight-bold"
            @click="handleOpenFeedbackConfirmDialog"
          >
            内容の確認へ進む
          </v-btn>
        </v-row>
      </form>

      <div class="text-body-2 mt-8">
        お問い合わせはこのフォームだけでなく、
        <a
          href="https://twitter.com/SmashNotice"
          target="_blank"
          class="link-decoration"
        >
          SmashNotice運営Twitter
        </a>
        にリプライやダイレクトメッセージで送っていただいても構いません。
      </div>
    </v-col>
  </v-row>

  <div class="justify-center">
    <v-dialog
      v-model="feedbackConfirmDialog"
      width="500px"
    >
      <v-card>
        <v-card-title class="ma-2">
          <span class="text-h5 font-weight-bold">お問い合わせ内容の確認</span>
        </v-card-title>
        <v-card-text>
          以下の内容で送信してよろしいですか？

          <div class="mt-4">
            ・問い合わせの種類
          </div>
          <div class="text-body-2 mt-2 ml-2">
            {{ feedbackCategory }}
          </div>

          <div class="mt-4">
            ・問い合わせ内容
          </div>
          <div class="text-body-2 mt-2 ml-2">
            {{ feedback.body }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="handleCloseFeedbackConfirmDialog">
            キャンセル
          </v-btn>
          <v-btn
            color="teal-accent-4"
            class="mr-4"
            @click="handleSendFeedback"
          >
            送信
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <v-overlay
    v-model="isLoading"
    persistent
    class="d-flex align-center justify-center fill-height"
  >
    <v-progress-circular
      indeterminate
      :size="80"
      color="indigo-lighten-1"
    />
  </v-overlay>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  maxLength,
  helpers
} from '@vuelidate/validators';
import {
  requiredMessage,
  maxLengthMessage
} from '../../constants/validationCustom';
import {
  successFeedBackAlertStatus,
  notAuthorizedForDemoAlertStatus,
  serverErrorAlertStatus
} from '../../constants/alertStatus';

export default {
  name: "FeedbacksIndex",
  inject: ["$axios"],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      feedback: {
        category: 1,
        body: ""
      },
      feedbackCategories: [
        {
          id: 1,
          name: "不具合の報告"
        },
        {
          id: 2,
          name: "改善要望（機能のリクエスト）"
        },
        {
          id: 3,
          name: "その他"
        }
      ],
      feedbackAttentions: [
        "不具合の報告では、どのような不具合かとその不具合が発生した状況を入力してください",
        "どのような機能があると良いか、またはどの機能のどの部分を改善して欲しいかを入力してください",
        ""
      ],
      feedbackConfirmDialog: false,
      isLoading: false
    };
  },
  computed: {
    ...mapGetters("users", ["isGeneral"]),
    feedbackCategory() {
      return this.feedbackCategories[this.feedback.category - 1].name;
    },
    feedbackAttention() {
      let result = "";
      this.feedbackCategories.forEach((category) => {
        if (this.feedback.category == category.id) {
          result = this.feedbackAttentions[category.id - 1];
        }
      });
      return result;
    }
  },
  validations () {
    return {
      feedback: {
        category: {
          required: helpers.withMessage(requiredMessage("問い合わせの種類"), required)
        },
        body: {
          required: helpers.withMessage(requiredMessage("問い合わせ内容"), required),
          maxLength: helpers.withMessage(maxLengthMessage(1000), maxLength(1000))
        }
      }
    };
  },
  methods: {
    ...mapActions("alert", ["displayAlert"]),
    async handleOpenFeedbackConfirmDialog() {
      if (!this.isGeneral) {
        this.displayAlert({ alertStatus: notAuthorizedForDemoAlertStatus });
        return;
      }

      const result = await this.v$.$validate();

      if (!result) return;

      this.feedbackConfirmDialog = true;
    },
    handleSendFeedback() {
      this.handleCloseFeedbackConfirmDialog();
      this.isLoading = true;
      this.$axios.post("feedbacks", { feedback: {
        category: this.feedbackCategory,
        body: this.feedback.body
      } })
        .then(res => {
          this.resetFeedbackForm();
          this.displayAlert({ alertStatus: successFeedBackAlertStatus });
          this.isLoading = false;
        })
        .catch(err => {
          this.displayAlert({ alertStatus: serverErrorAlertStatus });
          this.isLoading = false;
        });
    },
    handleCloseFeedbackConfirmDialog() {
      this.feedbackConfirmDialog = false;
    },
    resetFeedbackForm() {
      this.feedback.category = 1;
      this.feedback.body = "";
      this.v$.$reset();
    }
  }
};
</script>