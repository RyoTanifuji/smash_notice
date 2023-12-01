<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    {{ memoDetail.title }}
  </div>

  <div class="my-10" />

  <v-row>
    <v-col
      cols="12"
      sm="10"
      md="8"
      lg="8"
      xl="8"
    >
      <template
        v-for="memoBlockItem in memoDetail.memoBlocks"
        :key="memoBlockItem.id"
      >
        <v-card
          :title="memoBlockItem.blockable.subtitle"
          class="mb-2"
        >
          <v-card-text>
            <template v-if="memoBlockItem.blockableType == 'Sentence'">
              <p v-html="sanitizeHtml(memoBlockItem.blockable.body)" />
            </template>
            <template v-else-if="memoBlockItem.blockableType == 'Image'">
            </template>
            <template v-else-if="memoBlockItem.blockableType == 'Embed'">
            </template>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
            >
              削除
            </v-btn>
            <v-btn
              class="mr-4"
            >
              編集
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
      <v-btn
        block
        color="teal-accent-4"
        class="mt-4"
        @click="handleOpenMemoBlockCreateDialog"
      >
        メモブロックを追加する
      </v-btn>
    </v-col>
  </v-row>
  <div class="justify-center">
    <v-dialog
      v-model="memoBlockCreateDialog"
      width="700px"
    >
      <MemoBlockFormDialog
        :memo-block="memoBlock"
        :sentence="sentence"
        :image="image"
        :embed="embed"
        @close-dialog="handleCloseMemoBlockFormDialog"
        @memoblock-submit="handleMemoBlockCreate"
      >
        <template #radio-button>
          <v-radio-group
            v-model="memoBlock.blockableType"
            inline
            class="ml-4"
          >
            <v-radio
              label="テキスト"
              value="Sentence"
            />
            <v-radio
              label="画像"
              value="Image"
            />
            <v-radio
              label="埋め込み"
              value="Embed"
            />
          </v-radio-group>
        </template>
        <template #title>
          メモブロックの追加
        </template>
        <template #submit>
          作成
        </template>
      </MemoBlockFormDialog>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import sanitizeHtml from 'sanitize-html';
import { serverErrorAlertStatus } from '../../../plugins/alertStatus';
import MemoBlockFormDialog from '../components/MemoBlockFormDialog';

export default {
  name: "MemosEdit",
  components: {
    MemoBlockFormDialog
  },
  data() {
    return {
      memoBlockCreateDialog: false,
      memoBlockDefault: {
        id: null,
        levle: 0,
        blockableType: "Sentence"
      },
      sentenceDefault: {
        subtitle: "",
        body: ""
      },
      imageDefault: {
        subtitle: ""
      },
      embedDefault: {
        subtitle: ""
      },
      memoBlock: {},
      sentence: {},
      image: {},
      embed: {}
    };
  },
  computed: {
    ...mapGetters("memos", ["memoDetail"]),
    memoId() {
      return this.$route.params.memoId;
    }
  },
  mounted() {
    this.$store.dispatch("memos/fetchMemoDetail", this.$route.params.memoId);
  },
  methods: {
    ...mapActions("memos", ["createMemoBlock"]),
    ...mapActions("alert", ["displayAlert"]),
    handleOpenMemoBlockCreateDialog() {
      this.memoBlockInitialize();
      this.memoBlockCreateDialog = true;
    },
    handleCloseMemoBlockFormDialog() {
      this.memoBlockInitialize();
      this.memoBlockCreateDialog = false;
    },
    memoBlockInitialize() {
      this.memoBlock = Object.assign({}, this.memoBlockDefault);
      this.sentence = Object.assign({}, this.sentenceDefault);
      this.image = Object.assign({}, this.imageDefault);
      this.embed = Object.assign({}, this.embedDefault);
    },
    async handleMemoBlockCreate(memoBlockParams) {
      try {
        await this.createMemoBlock({
          memoId: this.memoId,
          memoBlockParams: memoBlockParams
        });
      } catch (error) {
        this.displayAlert(serverErrorAlertStatus);
      }
      this.handleCloseMemoBlockFormDialog();
    },
    sanitizeHtml(html) {
      return sanitizeHtml(html, {
        allowedTags: ["p", "strong", "em", "u",
                      "h1", "h2", "h3", "h4", "h5", "h6",
                      "ol", "ul", "li",
                      "sub", "sup", "span"
                      ],
        allowedAttributes: {
          span: [ "style" ]
        }
      });
    }
  }
};
</script>