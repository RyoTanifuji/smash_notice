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
        </template>
      </v-col>

      <template v-if="$vuetify.display.smAndDown">
        <v-divider thickness="5" />
      </template>

      <v-col
        cols="12"
        md="3"
        lg="3"
        xl="2"
      >
        <div class="d-flex flex-row justify-end align-center mb-2">
          <span class="mr-3">使用ファイター</span>
          <v-avatar :image="getImageUrl(memoDetail.fighterId)" />
        </div>
        <template v-if="isMatchup">
          <div class="d-flex flex-row justify-end align-center mb-2">
            <span class="mr-3">相手ファイター</span>
            <v-avatar :image="getImageUrl(memoDetail.opponentId)" />
          </div>
        </template>

        <div class="my-6" />

        <template v-if="isGeneral && !isMine(memoDetail.userId)">
          <template v-if="!isBookmark(memoDetail.id)">
            <div class="d-flex flex-row justify-end mb-2">
              <v-btn
                variant="elevated"
                elevation="2"
                :prepend-icon="mdiStarOutline"
                color="teal-accent-4"
                @click="handleCreateBookmark"
              >
                ブックマーク
              </v-btn>
            </div>
          </template>
          <template v-else>
            <div class="d-flex flex-row justify-end mb-2">
              <v-btn
                variant="elevated"
                elevation="2"
                :prepend-icon="mdiStar"
                color="teal-accent-4"
                @click="handleDeleteBookmark"
              >
                ブックマーク済み
              </v-btn>
            </div>
          </template>
        </template>
        <p class="text-right link-decoration">
          {{ memoDetail.user.name }}
        </p>
        <p class="text-right text-caption font-weight-thin">
          {{ dateFormat(memoDetail.updatedAt) }}
        </p>
      </v-col>
    </v-row>
  </template>
</template>

<script>
import { mdiStarOutline, mdiStar } from '@mdi/js';
import { mapGetters, mapActions } from 'vuex';
import { serverErrorAlertStatus } from '../../../constants/alertStatus';
import EmbedYoutube from '../components/EmbedYoutube';
import { sanitizeText } from '../../../plugins/sanitizeText';
import dayjs from 'dayjs';
import { FIGHTERS_ARRAY } from '../../../constants/fightersArray';

export default {
  name: "SharedMemosShow",
  components: {
    EmbedYoutube
  },
  data() {
    return {
      isDataReceived: false,
      mdiStarOutline,
      mdiStar,
      FIGHTERS_ARRAY
    };
  },
  computed: {
    ...mapGetters("users", [
      "authUser",
      "isGeneral"
    ]),
    ...mapGetters("shared", [
      "memoDetail",
      "bookmarkMemoIds"
    ]),
    isMatchup() {
      return this.memoDetail.type == "MatchupMemo";
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
        this.$router.push({ name: "SharedStrategyMemosIndex" });
      });
  },
  methods: {
    ...mapActions("shared", [
      "fetchMemoDetail",
      "createBookmark",
      "deleteBookmark"
    ]),
    ...mapActions("alert", [
      "displayAlert",
      "applyTransition"
    ]),
    isMine(userId) {
      return userId == this.authUser.id;
    },
    isBookmark(memoId) {
      return this.bookmarkMemoIds.includes(memoId);
    },
    getImageUrl(fighterId) {
      const fighterData = this.FIGHTERS_ARRAY.find((fighter) => fighter.id == fighterId);
      return new URL(`../../../../assets/images/character_icon/${fighterData.image}`, import.meta.url).href;
    },
    sanitizeHtml(html) {
      return sanitizeText(html);
    },
    dateFormat(date) {
      return dayjs(date).format("YYYY-MM-DD");
    },
    handleCreateBookmark() {
      this.createBookmark(this.memoDetail.id);
    },
    handleDeleteBookmark() {
      this.deleteBookmark(this.memoDetail.id);
    }
  }
};
</script>

<style scoped>
:deep(ol), :deep(ul) {
  margin-left: 20px;
}
</style>