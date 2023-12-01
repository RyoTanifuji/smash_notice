<template>
  <v-card>
    <v-card-title class="ma-2">
      <span class="text-h5 font-weight-bold"><slot name="title" /></span>
    </v-card-title>
    <v-card-text>
      <form>
        <slot name="radio-button" />
        <template v-if="memoBlock.blockableType == 'Sentence'">
          <v-text-field
            v-model="v$.sentence.subtitle.$model"
            :error-messages="v$.sentence.subtitle.$errors.map(e => e.$message)"
            :counter="20"
            name="見出し"
            label="見出し"
            hint="未入力にすることも可能です"
            variant="underlined"
            class="w-75 ml-4"
          />
          <TextEditor
            :value="v$.sentence.body.$model"
            @update:model-value="updateContent"
          />
          <template v-if="v$.sentence.body.$errors">
            <p class="text-error text-caption ml-4 mt-n3">
              {{ v$.sentence.body.$errors.map(e => e.$message)[0] }}
            </p>
          </template>
        </template>
        <template v-else-if="memoBlock.blockableType == 'Image'">
        </template>
        <template v-else-if="memoBlock.blockableType == 'Embed'">
        </template>
      </form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="handleCloseMemoBlockFormDialog">
        キャンセル
      </v-btn>
      <v-btn
        class="mr-4"
        color="teal-accent-4"
        @click="handleMemoBlockSubmit"
      >
        <slot name="submit" />
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { maxLength, helpers } from '@vuelidate/validators';
import { maxLengthMessage } from '../../../plugins/validationMessages';
import TextEditor from '../../../components/TextEditor';

export default {
  name: "MemoBlockFormDialog",
  components: {
    TextEditor
  },
  props: {
    memoBlock: {
      type: Object,
      required: true,
      blockableType: {
        type: String,
        required: true
      }
    },
    sentence: {
      type: Object,
      required: true,
      subtitle: {
        type: String,
        default: ""
      },
      body: {
        type: String,
        default: ""
      }
    },
    image: {
      type: Object,
      required: true,
      subtitle: {
        type: String,
        default: ""
      }
    },
    embed: {
      type: Object,
      required: true,
      subtitle: {
        type: String,
        default: ""
      }
    }
  },
  emits: [
    "close-dialog",
    "memoblock-submit",
    "change-type"
  ],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  validations () {
    return {
      sentence: {
        subtitle: { 
          maxLength: helpers.withMessage(maxLengthMessage(20), maxLength(20))
        },
        body: {
          maxLength: helpers.withMessage("保存できる文字数を超えています", maxLength(60))
        }
      }
    };
  },
  methods: {
    handleCloseMemoBlockFormDialog() {
      this.v$.$reset();
      this.$emit("close-dialog");
    },
    updateContent(newContent) {
      this.v$.sentence.body.$model = newContent;
    },
    async handleMemoBlockSubmit() {
      const result = await this.v$.$validate();

      if (!result) return;

      let memoBlockParams = null;
      switch (this.memoBlock.blockableType) {
        case "Sentence":
          memoBlockParams = {
            memoBlock: this.memoBlock,
            sentence: this.sentence
          };
          break;
        case "Image":
          memoBlockParams = {
            memoBlock: this.memoBlock,
            image: this.image
          };
          break;
        case "Embed":
          memoBlockParams = {
            memoBlock: this.memoBlock,
            embed: this.embed
          };
          break;
        default:
          blockable = null;
      }
      this.$emit("memoblock-submit", memoBlockParams);
    }
  }
};
</script>