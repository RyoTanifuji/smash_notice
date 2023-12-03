<template>
  <div class="text-md-h3 text-h4 font-weight-bold">
    {{ folderName }}
  </div>

  <div class="my-6" />

  <template v-if="memos.length">
    <v-row>
      <v-col
        cols="12"
        sm="10"
        md="8"
        lg="8"
        xl="8"
      >
        <div class="d-flex align-end">
          <span class="text-h5 mb-5">
            メモ一覧
          </span>
          <v-spacer />
          <div>
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
                :to="{ name: 'Null' }"
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
                    <v-list-item :to="{ name: 'MatchupMemosEdit', params: { memoId: memoItem.id } }">
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
      </v-col>
    </v-row>
  </template>

  <template v-else>
    <v-row>
      <v-col
        cols="12"
        sm="10"
        md="8"
        lg="8"
        xl="8"
      >
        <div class="text-body-1 font-weight-bold">
          まだ、メモがありません。メモの作成からキャラ対メモを追加しましょう

          <div class="my-8" />

          テンプレート機能を使うと、キャラ対メモの作成時にテンプレートに設定した内容が自動的に追加されます
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
            <v-btn
              class="mb-2"
              color="teal-accent-4"
            >
              テンプレートの編集
            </v-btn>
          </div>
        </v-layout>
      </v-col>
    </v-row>
  </template>

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
import dayjs from 'dayjs';
import { mdiFile, mdiInformationOutline } from '@mdi/js';
import {
  serverErrorAlertStatus,
  accessForbiddenAlertStatus
} from '../../../constants/alertStatus';
import MemoCreateFormDialog from '../components/MemoCreateFormDialog';

export default {
  name: "MatchupMemosIndex",
  components: {
    MemoCreateFormDialog
  },
  data() {
    return {
      memoDefault: {
        id: null,
        title: "",
        fighterId: null
      },
      memo: {},
      memoType: "MatchupMemo",
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
  mounted() {
    this.$store.dispatch("memos/fetchMemos", this.folderId)
      .catch(() => {
        this.displayAlert(accessForbiddenAlertStatus);
        this.$router.push({ name: "TopIndex" });
      });
  },
  methods: {
    ...mapActions("memos", [
      "createMemo",
      "deleteMemo"
    ]),
    ...mapActions("alert", ["displayAlert"]),
    handleOpenMemoCreateDialog() {
      this.memo = Object.assign({}, this.memoDefault);
      this.memoCreateDialog = true;
    },
    handleOpenMemoDeleteDialog(memo) {
      this.memo = memo;
      this.memoDeleteDialog = true;
    },
    handleCloseMemoDialog() {
      this.memo = Object.assign({}, this.memoDefault);
      this.memoCreateDialog = false;
      this.memoDeleteDialog = false;
    },
    async handleMemoCreate(memo, applyTemplate) {
      try {
        await this.createMemo({
          memo: memo,
          memoType: this.memoType,
          folderId: this.folderId,
          applyTemplate: applyTemplate
        });
      } catch (error) {
        this.displayAlert(serverErrorAlertStatus);
      }
      this.handleCloseMemoDialog();
    },
    async handleMemoDelete() {
      try {
        await this.deleteMemo(this.memo);
      } catch (error) {
        this.displayAlert(serverErrorAlertStatus);
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