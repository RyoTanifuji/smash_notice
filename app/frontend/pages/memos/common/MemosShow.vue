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
          <div style="min-height: 55vh;">
            <template
              v-for="memoBlockItem in memoDetail.memoBlocks"
              :key="memoBlockItem.id"
            >
              <template v-if="!(memoBlockItem.blockable.subtitle == '')">
                <div class="text-h5 mb-4">
                  {{ memoBlockItem.blockable.subtitle }}
                </div>
              </template>
              <template v-if="memoBlockItem.blockableType == 'Sentence'">
                <div
                  class="ml-2 mt-n2 mb-4"
                  v-html="sanitizeHtml(memoBlockItem.blockable.body)"
                />
              </template>
              <template v-else-if="memoBlockItem.blockableType == 'Image'">
                <v-img
                  :src="memoBlockItem.blockable.pictureUrl"
                  :width="memoBlockItem.blockable.pictureWidth"
                  class="ml-2 mt-n2 mb-4"
                />
              </template>
              <template v-else-if="memoBlockItem.blockableType == 'Embed'">
                <div class="ml-2 mt-n2 mb-4">
                  <EmbedYoutube
                    :youtube-url="memoBlockItem.blockable.identifier"
                  />
                </div>
              </template>
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

      <template v-if="$vuetify.display.mdAndUp">
        <v-col
          md="4"
          lg="4"
          xl="4"
        >
          <router-link
            :to="{ name: pageInformation.editRouteName, params: { memoId: memoDetail.id }}"
          >
            <v-btn
              block
              color="teal-accent-4"
              class="mt-4"
            >
              メモを編集する
            </v-btn>
          </router-link>
          <v-btn
            block
            color="error"
            class="mt-4"
            @click="handleOpenMemoDeleteDialog"
          >
            メモを削除する
          </v-btn>
        </v-col>
      </template>
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
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { serverErrorAlertStatus } from '../../../constants/alertStatus';
import EmbedYoutube from '../components/EmbedYoutube';
import { sanitizeText } from '../../../plugins/sanitizeText';

export default {
  name: "MemosShow",
  components: {
    EmbedYoutube
  },
  data() {
    return {
      pageInformationMatchup: {
        indexRouteName: "MatchupMemosIndex",
        editRouteName: "MatchupMemosEdit"
      },
      pageInformationStrategy: {
        indexRouteName: "StrategyMemosIndex",
        editRouteName: "StrategyMemosEdit"
      },
      memoDeleteDialog: false,
      isDataReceived: false
    };
  },
  computed: {
    ...mapGetters("memos", ["memoDetail"]),
    isMatchup() {
      return this.$route.name == "MatchupMemosShow";
    },
    pageInformation() {
      return this.isMatchup ? this.pageInformationMatchup : this.pageInformationStrategy;
    },
    memoId() {
      return this.$route.params.memoId;
    }
  },
  mounted() {
    this.fetchMemoDetail(this.memoId)
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
      "fetchMemoDetail",
      "deleteMemo"
    ]),
    ...mapActions("alert", [
      "displayAlert",
      "closeAlertWithCross",
      "applyTransition"
    ]),
    handleOpenMemoDeleteDialog() {
      this.memoDeleteDialog = true;
    },
    handleCloseMemoDialog() {
      this.closeAlertWithCross();
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
:deep(ol), :deep(ul) {
  margin-left: 20px;
}
</style>