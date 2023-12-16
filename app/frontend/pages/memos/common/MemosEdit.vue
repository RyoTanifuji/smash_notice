<template>
  <template v-if="isDataReceived">
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
        <template v-if="memoDetail.memoBlocks.length">
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
                <template v-else-if="memoBlockItem.blockableType == 'Embed'">
                  <EmbedYoutube
                    :youtube-url="memoBlockItem.blockable.identifier"
                  />
                </template>
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
        </template>
        <template v-else>
          <template v-if="isTemplate">
            <div class="text-body-1 font-weight-bold">
              <span class="d-inline-block">キャラ対メモの作成時に「テンプレートを適用する」にチェックを入れることで、</span>
              <span class="d-inline-block">テンプレートに設定した内容が自動的に追加されます。</span>
            </div>
          </template>
          <template v-else>
            <div class="text-body-1 font-weight-bold">
              まだ、メモブロックがありません。
              メモブロックを追加しましょう。
            </div>
          </template>

            <div class="my-8" />
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

      <template v-if="!isTemplate">
        <v-col
          cols="12"
          md="4"
          lg="4"
          xl="4"
        >
          <MemoEditForm
            :memo="memo"
            :form-title-hint="pageInformation.formTitleHint"
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
      </template>
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
          :is-edit="false"
          @close-dialog="handleCloseMemoBlockDialog"
          @memoblock-submit="handleMemoBlockCreate"
        >
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
          :is-edit="true"
          @close-dialog="handleCloseMemoBlockDialog"
          @memoblock-submit="handleMemoBlockUpdate"
        >
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { serverErrorAlertStatus } from '../../../constants/alertStatus';
import MemoBlockFormDialog from '../components/MemoBlockFormDialog';
import MemoEditForm from '../components/MemoEditForm';
import EmbedYoutube from '../components/EmbedYoutube';
import { sanitizeText } from '../../../plugins/sanitizeText';

export default {
  name: "MemosEdit",
  components: {
    MemoBlockFormDialog,
    MemoEditForm,
    EmbedYoutube
  },
  data() {
    return {
      pageInformationTemplate: {
        showRouteName: "",
        formTitleHint: ""
      },
      pageInformationMatchup: {
        showRouteName: "MatchupMemosShow",
        formTitleHint: "未入力の場合、下記の相手ファイター名が設定されます"
      },
      pageInformationStrategy: {
        showRouteName: "StrategyMemosShow",
        formTitleHint: "メモのタイトルを入力してください"
      },
      memoBlockCreateDialog: false,
      memoBlockEditDialog: false,
      memoBlockDeleteDialog: false,
      memo: {
        title: "",
        opponentId: null,
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
        pictureWidth: 500,
        pictureUrl: ""
      },
      embedDefault: {
        subtitle: "",
        embedType: "youtube",
        identifier: ""
      },
      memoBlock: {},
      sentence: {},
      image: {},
      embed: {},
      isDataReceived: false
    };
  },
  computed: {
    ...mapGetters("memos", ["memoDetail"]),
    isTemplate() {
      return this.$route.name == "MatchupTemplate";
    },
    isMatchup() {
      return this.$route.name == "MatchupMemosEdit";
    },
    pageInformation() {
      return this.isTemplate ? pageInformationTemplate
        : this.isMatchup ? this.pageInformationMatchup
        : this.pageInformationStrategy;
    },
    memoId() {
      return this.isTemplate ? this.memoDetail.id : this.$route.params.memoId;
    }
  },
  created() {
    if (this.isTemplate) {
      this.fetchTemplate(this.$route.params.folderId)
        .then(() => {
          this.memo = Object.assign({}, this.memoDetail);
          this.isDataReceived = true;
        })
        .catch(() => {
          this.displayAlert({ alertStatus: serverErrorAlertStatus });
          this.$router.push({ name: "TopIndex" });
        });
    } else {
      this.fetchMemoDetail(this.memoId)
        .then(() => {
          this.memo = Object.assign({}, this.memoDetail);
          this.isDataReceived = true;
        })
        .catch(() => {
          this.displayAlert({ alertStatus: serverErrorAlertStatus });
          this.$router.push({ name: "TopIndex" });
        });
    }
  },
  updated() {
    this.memo = Object.assign({}, this.memoDetail);
  },
  methods: {
    ...mapActions("memos", [
      "fetchTemplate",
      "fetchMemoDetail",
      "createMemoBlock",
      "updateMemo",
      "updateMemoBlock",
      "deleteMemoBlock"
    ]),
    ...mapActions("alert", [
      "displayAlert",
      "closeAlertWithCross"
    ]),
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
      this.closeAlertWithCross();
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
        this.$router.go({ name: this.$route.name, force: true });
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