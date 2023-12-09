<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    {{ memoDetail.title }}
  </div>

  <div class="my-6" />

  <v-row>
    <v-col
      cols="12"
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
              <v-img
                :src="memoBlockItem.blockable.pictureUrl"
                :width="memoBlockItem.blockable.pictureWidth"
              />
            </template>
            <template v-else-if="memoBlockItem.blockableType == 'Embed'" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error"
              @click="handleOpenMemoBlockDeleteDialog(memoBlockItem)"
            >
              削除
            </v-btn>
            <v-btn
              class="mr-4"
              @click="handleOpenMemoBlockEditDialog(memoBlockItem)"
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
    <v-col
      cols="12"
      md="4"
      lg="4"
      xl="4"
    >
      <MemoEditForm
        :memo="memo"
        @memo-submit="handleMemoUpdate"
      />
      <router-link
        :to="{ name: pageInformation.showRouteName, params: { memoId: memoDetail.id } }"
      >
        <v-btn
          block
          class="mt-4"
        >
          メモ詳細画面へ進む
        </v-btn>
      </router-link>
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
        @close-dialog="handleCloseMemoBlockDialog"
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

  <div class="justify-center">
    <v-dialog
      v-model="memoBlockEditDialog"
      width="700px"
    >
      <MemoBlockFormDialog
        :memo-block="memoBlock"
        :sentence="sentence"
        :image="image"
        :embed="embed"
        @close-dialog="handleCloseMemoBlockDialog"
        @memoblock-submit="handleMemoBlockUpdate"
      >
        <template #radio-button>
          <v-radio-group
            v-model="memoBlock.blockableType"
            inline
            disabled
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
          メモブロックの編集
        </template>
        <template #submit>
          更新
        </template>
      </MemoBlockFormDialog>
    </v-dialog>
  </div>

  <div class="justify-center">
    <v-dialog
      v-model="memoBlockDeleteDialog"
      width="500px"
    >
      <v-card>
        <v-card-title class="ma-2">
          <span class="text-h5 font-weight-bold">メモブロックの削除</span>
        </v-card-title>
        <v-card-text>
          メモブロックを削除してもよろしいですか？
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="handleCloseMemoBlockDialog">
            キャンセル
          </v-btn>
          <v-btn
            class="mr-4"
            color="error"
            @click="handleMemoBlockDelete"
          >
            削除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import sanitizeText from '../../../plugins/sanitizeText';
import { serverErrorAlertStatus } from '../../../constants/alertStatus';
import MemoBlockFormDialog from '../components/MemoBlockFormDialog';
import MemoEditForm from '../components/MemoEditForm';

export default {
  name: "MemosEdit",
  components: {
    MemoBlockFormDialog,
    MemoEditForm
  },
  data() {
    return {
      pageInformationMatchup: {
        showRouteName: "MatchupMemosShow"
      },
      pageInformationStrategy: {
        showRouteName: "StrategyMemosShow"
      },
      memoBlockCreateDialog: false,
      memoBlockEditDialog: false,
      memoBlockDeleteDialog: false,
      memo: {
        title: "",
        fighterId: null,
        state: ""
      },
      memoBlockDefault: {
        id: null,
        level: 0,
        blockableType: "Sentence"
      },
      sentenceDefault: {
        subtitle: "",
        body: ""
      },
      imageDefault: {
        subtitle: "",
        file: "",
        pictureWidth: 500
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
    isMatchup() {
      return (this.$route.name == "MatchupMemosEdit") ? true : false;
    },
    pageInformation() {
      return (this.isMatchup) ? this.pageInformationMatchup : this.pageInformationStrategy;
    },
    memoId() {
      return this.$route.params.memoId;
    }
  },
  created() {
    this.$store.dispatch("memos/fetchMemoDetail", this.$route.params.memoId)
      .then(() => {
        this.memo = Object.assign({}, this.memoDetail);
      })
      .catch(() => {
        this.displayAlert({ alertStatus: serverErrorAlertStatus });
        this.$router.push({ name: "TopIndex" });
      });
  },
  updated() {
    this.memo = Object.assign({}, this.memoDetail);
  },
  methods: {
    ...mapActions("memos", [
      "createMemoBlock",
      "updateMemo",
      "updateMemoBlock",
      "deleteMemoBlock"
    ]),
    ...mapActions("alert", ["displayAlert"]),
    handleOpenMemoBlockCreateDialog() {
      this.memoBlockInitialize();
      this.memoBlockCreateDialog = true;
    },
    handleOpenMemoBlockEditDialog(memoBlock) {
      switch (memoBlock.blockableType) {
        case "Sentence":
          this.memoBlockInitialize();
          this.sentence = Object.assign({}, memoBlock.blockable);
          break;
        case "Image":
          this.memoBlockInitialize();
          this.image = Object.assign({}, memoBlock.blockable);
          break;
        case "Embed":
          this.memoBlockInitialize();
          this.embed = Object.assign({}, memoBlock.blockable);
          break;
        default:
          this.memoBlockInitialize();
      }
      this.memoBlock = Object.assign({}, memoBlock);
      this.memoBlockEditDialog = true;
    },
    handleOpenMemoBlockDeleteDialog(memoBlock) {
      this.memoBlock = Object.assign({}, memoBlock);
      this.memoBlockDeleteDialog = true;
    },
    handleCloseMemoBlockDialog() {
      this.memoBlockInitialize();
      this.memoBlockCreateDialog = false;
      this.memoBlockEditDialog = false;
      this.memoBlockDeleteDialog = false;
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
        this.handleCloseMemoBlockDialog();
      } catch (error) {
        this.displayAlert({ alertStatus: serverErrorAlertStatus, isDialog: true });
      }
    },
    async handleMemoUpdate(memo) {
      try {
        await this.updateMemo(memo);
        this.$router.go({path: this.$router.currentRoute.path, force: true});
      } catch (error) {
        this.displayAlert({ alertStatus: serverErrorAlertStatus });
      }
    },
    async handleMemoBlockUpdate(memoBlockParams) {
      try {
        await this.updateMemoBlock({
          memoId: this.memoId,
          memoBlockId: memoBlockParams.memoBlock.id,
          memoBlockParams: memoBlockParams
        });
        this.handleCloseMemoBlockDialog();
      } catch (error) {
        this.displayAlert({ alertStatus: serverErrorAlertStatus, isDialog: true });
      }
    },
    async handleMemoBlockDelete() {
      try {
        await this.deleteMemoBlock({
          memoId: this.memoId,
          memoBlock: this.memoBlock
        });
      } catch (error) {
        this.displayAlert({ alertStatus: serverErrorAlertStatus });
      }
      this.handleCloseMemoBlockDialog();
    },
    sanitizeHtml(html) {
      return sanitizeText(html);
    }
  }
};
</script>