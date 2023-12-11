<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    {{ folderName }}
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
          <span class="text-h5 mb-5">
            メモ一覧
          </span>
          <v-spacer />
          <div>
            <template v-if="isMatchup">
              <div>
                <v-btn
                  size="small"
                  color="teal-accent-4"
                  class="mb-2"
                >
                  テンプレートの編集
                </v-btn>
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
        <v-list lines="two">
          <template
            v-for="memoItem in sortedMemos"
            :key="memoItem.id"
          >
            <div class="list-item-memo">
              <v-list-item
                :title="memoItem.title"
                :subtitle="dateFormat(memoItem.updatedAt)"
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
          メモの作成から{{ pageInformation.memoCategory }}を追加しましょう。

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
              <v-btn
                class="mb-2"
                color="teal-accent-4"
              >
                テンプレートの編集
              </v-btn>
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

<script>
import { mapGetters, mapActions } from 'vuex';
import { mdiFile, mdiInformationOutline } from '@mdi/js';
import { serverErrorAlertStatus } from '../../../constants/alertStatus';
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
        editRouteName: "MatchupMemosEdit"
      },
      pageInformationStrategy: {
        memoCategory: "攻略メモ",
        memoType: "StrategyMemo",
        pathPrefix: "strategy",
        editRouteName: "StrategyMemosEdit"
      },
      memoDefault: {
        id: null,
        title: "",
        opponentId: null
      },
      memo: {},
      memoCreateDialog: false,
      memoDeleteDialog: false,
      mdiFile,
      mdiInformationOutline
    };
  },
  computed: {
    ...mapGetters("memos", [
      "folderName",
      "memos"
    ]),
    isMatchup() {
      return this.$route.name == "MatchupMemosIndex" ? true : false;
    },
    pageInformation() {
      return this.isMatchup ? this.pageInformationMatchup : this.pageInformationStrategy;
    },
    folderId() {
      return this.$route.params.folderId;
    },
    sortedMemos() {
      return this.memos.slice().sort((a, b) => {
        if (a.updatedAt > b.updatedAt) return -1;
        if (a.updatedAt < b.updatedAt) return 1;
        return 0;
      });
    }
  },
  created() {
    this.$store.dispatch("memos/fetchMemos", this.folderId)
      .catch(() => {
        this.displayAlert({ alertStatus: serverErrorAlertStatus });
        this.$router.push({ name: "TopIndex" });
      });
  },
  methods: {
    ...mapActions("memos", [
      "createMemo",
      "deleteMemo"
    ]),
    ...mapActions("alert", [
      "displayAlert",
      "closeAlertWithCross"
    ]),
    handleOpenMemoCreateDialog() {
      this.memo = Object.assign({}, this.memoDefault);
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
      try {
        await this.createMemo({
          memo: memo,
          memoType: this.pageInformation.memoType,
          folderId: this.folderId,
          applyTemplate: applyTemplate
        });
        this.handleCloseMemoDialog();
      } catch (error) {
        this.displayAlert({ alertStatus: serverErrorAlertStatus, isDialog: true });
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
  right: 2%
}
</style>