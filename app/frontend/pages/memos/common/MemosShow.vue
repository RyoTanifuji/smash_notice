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
      <template v-if="memoDetail.memoBlocks.length">
        <div style="min-height: 55vh;">
          <template
            v-for="memoBlockItem in memoDetail.memoBlocks"
            :key="memoBlockItem.id"
          >
            <div class="text-md-h5 text-h6 mb-2">
              {{ memoBlockItem.blockable.subtitle }}
            </div>
            <template v-if="memoBlockItem.blockableType == 'Sentence'">
              <div
                class="ml-2 mb-6 sentence-body"
                v-html="sanitizeHtml(memoBlockItem.blockable.body)"
              />
            </template>
            <template v-else-if="memoBlockItem.blockableType == 'Image'" />
            <template v-else-if="memoBlockItem.blockableType == 'Embed'" />
          </template>
        </div>
        <div class="d-flex flex-row justify-end mt-8">
          <v-btn
            color="error"
            @click="handleOpenMemoDeleteDialog"
          >
            削除
          </v-btn>
          <router-link
            :to="{ name: pageInformation.editRouteName, params: { memoId: memoDetail.id }}"
          >
            <v-btn
              color="teal-accent-4"
              class="mx-4"
            >
              編集
            </v-btn>
          </router-link>
        </div>
      </template>
      <template v-else>
        <div class="text-body-1 font-weight-bold">
          まだ、メモブロックがありません。
          メモの編集からメモブロックを追加しましょう。
        </div>

        <div class="my-8" />

        <v-layout>
          <router-link
            :to="{ name: pageInformation.editRouteName, params: { memoId: memoDetail.id }}"
            class="mx-auto"
          >
            <v-btn
              color="teal-accent-4"
            >
              メモの編集
            </v-btn>
          </router-link>
        </v-layout>
      </template>
    </v-col>
  </v-row>

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
          「{{ memoDetail.title }}」メモを削除してもよろしいですか？
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
import sanitizeText from '../../../plugins/sanitizeText';
import { serverErrorAlertStatus } from '../../../constants/alertStatus';

export default {
  name: "MemosEdit",
  data() {
    return {
      memoDeleteDialog: false,
      pageInformation: {}
    };
  },
  computed: {
    ...mapGetters("memos", ["memoDetail"]),
    isMatchup() {
      return (this.$route.name == "MatchupMemosShow") ? true : false;
    },
    memoId() {
      return this.$route.params.memoId;
    }
  },
  created() {
    this.$store.dispatch("memos/fetchMemoDetail", this.$route.params.memoId)
      .then(() => {
        if (this.isMatchup) {
          this.pageInformation = {
            editRouteName: "MatchupMemosEdit",
            indexRouteName: "MatchupMemosIndex"
          };
        } else {
          this.pageInformation = {};
        }
      })
      .catch(() => {
        this.displayAlert({ alertStatus: serverErrorAlertStatus });
        this.$router.push({ name: "TopIndex" });
      });
  },
  methods: {
    ...mapActions("memos", ["deleteMemo"]),
    ...mapActions("alert", ["displayAlert"]),
    handleOpenMemoDeleteDialog() {
      this.memoDeleteDialog = true;
    },
    handleCloseMemoDialog() {
      this.memoDeleteDialog = false;
    },
    async handleMemoDelete() {
      try {
        await this.deleteMemo(this.memoDetail);
        this.$router.push({ name: this.pageInformation.indexRouteName, params: { folderId: this.memoDetail.folderId } });
      } catch (error) {
        this.handleCloseMemoDialog();
        this.displayAlert({ alertStatus: serverErrorAlertStatus });
      }
    },
    sanitizeHtml(html) {
      return sanitizeText(html);
    }
  }
};
</script>

<style scoped>
.sentence-body {
  line-height: 1.6em;
}
</style>