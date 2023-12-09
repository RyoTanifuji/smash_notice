<template>
  <v-card>
    <v-card-title class="ma-2">
      <span class="text-h5 font-weight-bold"><slot name="title" /></span>
    </v-card-title>
    <v-card-text>
      <TheAlert :is-dialog="true" />
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
          <v-text-field
            v-model="v$.image.subtitle.$model"
            :error-messages="v$.image.subtitle.$errors.map(e => e.$message)"
            :counter="20"
            name="見出し"
            label="見出し"
            hint="未入力にすることも可能です"
            variant="underlined"
            class="w-75 ml-4"
          />
          <template v-if="previewUrl">
            <v-img
              :src="previewUrl"
              width="200"
              class="ml-4"
            />
          </template>
          <v-file-input
            label="ファイルを選択してください"
            prepend-icon=""
            variant="underlined"
            class="w-75 ml-4"
            @change="handleFileChange"
          />
          <template v-if="v$.image.file.$errors">
            <p class="text-error text-caption ml-4 mt-n4">
              {{ v$.image.file.$errors.map(e => e.$message)[0] }}
            </p>
          </template>
          <p class="text-body-2 font-weight-thin mt-2 ml-4">
            画像サイズ
          </p>
          <v-slider
            v-model="v$.image.pictureWidth.$model"
            name="画像サイズ"
            max="800"
            min="200"
            step="10"
            thumb-label
            class="w-75 ml-4"
          />
        </template>
        <template v-else-if="memoBlock.blockableType == 'Embed'" />
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
import { image, maxLengthMessage } from '../../../constants/validationCustom';
import imageCompression from '../../../plugins/imageCompression';
import TextEditor from '../../../components/TextEditor';
import TheAlert from '../../../components/TheAlert';

export default {
  name: "MemoBlockFormDialog",
  components: {
    TextEditor,
    TheAlert
  },
  props: {
    memoBlock: {
      type: Object,
      required: true,
      id: {
        type: Number,
        required: true
      },
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
      },
      file: {
        type: String,
        default: ""
      },
      pictureWidth: {
        type: Number,
        default: 500
      },
      pictureUrl: {
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
  data() {
    return {
      formPreviewUrl: ""
    };
  },
  computed: {
    previewUrl() {
      return this.formPreviewUrl ? this.formPreviewUrl
        : this.image.pictureUrl ? this.image.pictureUrl
        : "";
    }
  },
  validations () {
    return {
      sentence: {
        subtitle: { 
          maxLength: helpers.withMessage(maxLengthMessage(20), maxLength(20))
        },
        body: {
          maxLength: helpers.withMessage("保存できる文字数を超えています", maxLength(65535))
        }
      },
      image: {
        subtitle: { 
          maxLength: helpers.withMessage(maxLengthMessage(20), maxLength(20))
        },
        file: {
          image: helpers.withMessage("無効なファイル形式です", image)
        },
        pictureWidth: {}
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
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target.result;
        this.v$.image.file.$model = base64Data;
      };
      try {
        const compFile = await imageCompression.getCompressImageFileAsync(file);
        this.formPreviewUrl = await imageCompression.getDataUrlFromFile(compFile);
        reader.readAsDataURL(compFile);
      } catch(err) {
        console.log(err);
      }
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