<template>
  <template v-if="isDataReceived">
    <div class="text-md-h3 text-h4 font-weight-bold">
      {{ folder.name }}
    </div>

    <div class="my-6" />

    <v-row>
      <v-col
        cols="12"
        sm="10"
        md="8"
        lg="8"
        xl="8"
      >
        <template v-if="memos.length">
          <div class="d-flex align-end">
            <span class="text-h6 mb-5">
              メモ一覧
            </span>
            <v-spacer />
            <div>
              <template v-if="isMatchup">
                <div>
                  <router-link
                    :to="{ name: 'MatchupTemplate', params: { folderId: folder.id } }"
                  >
                    <v-btn
                      size="small"
                      color="teal-accent-4"
                      class="mb-2"
                    >
                      テンプレートの編集
                    </v-btn>
                  </router-link>
                </div>
                <div>
                  <v-btn
                    size="small"
                    color="teal-accent-4"
                    @click="handleOpenMemoCreateDialog"
                  >
                    メモの作成
                  </v-btn>
                </div>
              </template>
              <template v-else>
                <v-btn
                  color="teal-accent-4"
                  class="mb-2 mr-2"
                  @click="handleOpenMemoCreateDialog"
                >
                  メモの作成
                </v-btn>
              </template>
            </div>
          </div>

          <div class="d-flex flex-row ml-5 mb-n4">
            <v-icon
              :icon="mdiMagnify"
              class="mt-4 mr-4"
            />
            <v-text-field
              v-model="titleSearchText"
              label="タイトル"
              variant="underlined"
              clearable
              density="compact"
              single-line
              class="mr-8"
            />
            <v-spacer v-if="!$vuetify.display.xs" />
          </div>

          <v-list lines="two">
            <template
              v-for="memoItem in filteredMemos"
              :key="memoItem.id"
            >
              <div class="list-item-memo">
                <v-list-item
                  :title="memoItem.title"
                  :subtitle="dateFormat(memoItem.updatedAt) + memoStateText(memoItem)"
                  :to="{ path: `/${pageInformation.pathPrefix}/memos/${memoItem.id}` }"
                  :prepend-icon="mdiFile"
                />
                <v-btn
                  icon
                  density="compact"
                  variant="plain"
                  class="list-item-memo-info"
                >
                  <v-icon :icon="mdiInformationOutline" />
                  <v-menu activator="parent">
                    <v-list density="compact">
                      <v-list-item
                        :to="{ name: pageInformation.editRouteName, params: { memoId: memoItem.id } }"
                      >
                        <v-list-item-title>
                          <span>
                            メモを編集する
                          </span>
                        </v-list-item-title>
                      </v-list-item>
                      <template v-if="memoItem.state == 'local'">
                        <v-list-item @click="handleMemoStateUpdate(memoItem.id, 'shared')">
                          <v-list-item-title>
                            <span>
                              メモを公開する
                            </span>
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                      <template v-else>
                        <v-list-item @click="handleMemoStateUpdate(memoItem.id, 'local')">
                          <v-list-item-title>
                            <span>
                              メモを非公開にする
                            </span>
                          </v-list-item-title>
                        </v-list-item>
                      </template>
                      <v-list-item @click="handleOpenMemoDeleteDialog(memoItem)">
                        <v-list-item-title>
                          <span class="text-error">
                            メモを削除する
                          </span>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-btn>
              </div>
            </template>
          </v-list>
        </template>

        <template v-else>
          <div class="text-body-1 font-weight-bold">
            まだ、メモがありません。
            「メモの作成」ボタンをクリックして、{{ pageInformation.memoCategory }}を追加しましょう。

            <template v-if="isMatchup">
              <div class="my-8" />

              テンプレート機能を使うと、キャラ対メモの作成時にテンプレートに設定した内容が自動的に追加されます。
            </template>
          </div>

          <div class="my-8" />

          <v-layout>
            <div class="mx-auto">
              <v-btn
                class="mr-8 mb-2"
                color="teal-accent-4"
                @click="handleOpenMemoCreateDialog"
              >
                メモの作成
              </v-btn>
              <template v-if="isMatchup">
                <router-link
                  :to="{ name: 'MatchupTemplate', params: { folderId: folder.id } }"
                >
                  <v-btn
                    class="mb-2"
                    color="teal-accent-4"
                  >
                    テンプレートの編集
                  </v-btn>
                </router-link>
              </template>
            </div>
          </v-layout>
        </template>
      </v-col>
    </v-row>

    <div class="justify-center">
      <v-dialog
        v-model="memoCreateDialog"
        width="700px"
      >
        <MemoCreateFormDialog
          :memo="memo"
          :form-title-hint="pageInformation.formTitleHint"
          @close-dialog="handleCloseMemoDialog"
          @memo-submit="handleMemoCreate"
        />
      </v-dialog>
    </div>
    
    <div class="justify-center">
      <v-dialog
        v-model="memoDeleteDialog"
        width="500px"
      >
        <v-card>
          <v-card-title class="ma-2">
            <span class="text-h5 font-weight-bold">メモの削除</span>
          </v-card-title>
          <v-card-text>
            「{{ memo.title }}」メモを削除してもよろしいですか？
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="handleCloseMemoDialog">
              キャンセル
            </v-btn>
            <v-btn
              class="mr-4"
              color="error"
              @click="handleMemoDelete"
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
import { mdiFile, mdiInformationOutline, mdiMagnify } from '@mdi/js';
import {
  notAuthorizedForDemoAlertStatus,
  serverErrorAlertStatus
} from '../../../constants/alertStatus';
import { textConversion } from '../../../constants/textConversion';
import MemoCreateFormDialog from '../components/MemoCreateFormDialog';
import dayjs from 'dayjs';

export default {
  name: "MemosIndex",
  components: {
    MemoCreateFormDialog
  },
  data() {
    return {
      pageInformationMatchup: {
        memoCategory: "キャラ対メモ",
        memoType: "MatchupMemo",
        pathPrefix: "matchup",
        editRouteName: "MatchupMemosEdit",
        formTitleHint: "未入力の場合、下記の相手ファイター名が設定されます"
      },
      pageInformationStrategy: {
        memoCategory: "自キャラメモ",
        memoType: "StrategyMemo",
        pathPrefix: "strategy",
        editRouteName: "StrategyMemosEdit",
        formTitleHint: "メモのタイトルを入力してください"
      },
      memoDefault: {
        id: null,
        title: "",
        opponentId: null
      },
      memo: {},
      titleSearchText: "",
      memoCreateDialog: false,
      memoDeleteDialog: false,
      isDataReceived: false,
      mdiFile,
      mdiInformationOutline,
      mdiMagnify
    };
  },
  computed: {
    ...mapGetters("users", ["isGeneral"]),
    ...mapGetters("memos", [
      "folder",
      "memos"
    ]),
    isMatchup() {
      return this.$route.name == "MatchupMemosIndex";
    },
    pageInformation() {
      return this.isMatchup ? this.pageInformationMatchup : this.pageInformationStrategy;
    },
    folderId() {
      return this.$route.params.folderId;
    },
    filteredMemos() {
      let result = this.memos.filter((memo) =>
        textConversion(memo.title).includes(textConversion(this.titleSearchText)) ||
        !this.titleSearchText
      );

      result = result.sort((a, b) => {
        if (a.updatedAt > b.updatedAt) return -1;
        if (a.updatedAt < b.updatedAt) return 1;
        return 0;
      });

      return result;
    }
  },
  mounted() {
    this.fetchMemos(this.folderId)
      .then(() => {
        this.isDataReceived = true;
      })
      .catch(() => {
        this.displayAlert({ alertStatus: serverErrorAlertStatus });
        this.applyTransition();
        this.$router.push({ name: "TopIndex" });
      });
  },
  methods: {
    ...mapActions("memos", [
      "fetchMemos",
      "createMemo",
      "updateMemoState",
      "deleteMemo"
    ]),
    ...mapActions("alert", [
      "displayAlert",
      "closeAlertWithCross",
      "applyTransition"
    ]),
    handleOpenMemoCreateDialog() {
      this.memo = Object.assign({}, this.memoDefault);
      if (!this.isMatchup) this.memo.opponentId = 1;
      this.memoCreateDialog = true;
    },
    handleOpenMemoDeleteDialog(memo) {
      this.memo = memo;
      this.memoDeleteDialog = true;
    },
    handleCloseMemoDialog() {
      this.closeAlertWithCross();
      this.memo = Object.assign({}, this.memoDefault);
      this.memoCreateDialog = false;
      this.memoDeleteDialog = false;
    },
    async handleMemoCreate(memo, applyTemplate) {
      this.createMemo({
        memo: memo,
        memoType: this.pageInformation.memoType,
        folderId: this.folderId,
        applyTemplate: applyTemplate
      })
        .then(() => {
          this.$router.push({ name: this.pageInformation.editRouteName, params: { memoId: this.memos.slice(-1)[0].id } });
        })
        .catch(() => {
          this.displayAlert({ alertStatus: serverErrorAlertStatus, isDialog: true });
        });
    },
    async handleMemoStateUpdate(memoId, memoState) {
      if (!this.isGeneral) {
        this.displayAlert({ alertStatus: notAuthorizedForDemoAlertStatus });
        return;
      }

      try {
        await this.updateMemoState({ memoId: memoId, memoState: memoState });
      } catch (error) {
        this.displayAlert({ alertStatus: serverErrorAlertStatus });
      }
    },
    async handleMemoDelete() {
      try {
        await this.deleteMemo(this.memo);
      } catch (error) {
        this.displayAlert({ alertStatus: serverErrorAlertStatus });
      }
      this.handleCloseMemoDialog();
    },
    dateFormat(date) {
      return dayjs(date).format("YYYY-MM-DD");
    },
    memoStateText(memo) {
      return memo.state == "shared" ? " | 公開中" : "";
    }
  }
};
</script>

<style scoped>
.list-item-memo {
  position: relative;
}

.list-item-memo-info {
  position: absolute;
  top: 25%;
  right: 5%;
}
</style>