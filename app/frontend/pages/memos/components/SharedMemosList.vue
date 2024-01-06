<template>
  <v-row>
    <template
      v-for="memoItem in sharedMemos"
      :key="memoItem.id"
    >
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="4"
        xl="4"
      >
        <v-card
          border
          rounded="lg"
          height="270"
          class="d-flex flex-column memo-card"
        >
          <v-card-title class="mt-2 font-weight-bold">
            <v-avatar
              :image="getImageUrl(memoItem.fighterId)"
              class="mr-2"
            />
            <router-link :to="{ name: showRouteName(memoItem.type), params: { memoId: memoItem.id }, query: {} }">
              <span class="link-decoration">
                {{ omittedText(memoItem.title, 8) }}
              </span>
            </router-link>
            <template v-if="isBookmarkDisplay(memoItem.userId)">
              <template v-if="!isBookmark(memoItem.id)">
                <v-btn
                  icon
                  :ripple="false"
                  density="compact"
                  size="small"
                  variant="plain"
                  class="memo-bookmark"
                  @click="handleCreateBookmark(memoItem.id)"
                >
                  <v-icon
                    :icon="mdiStarOutline"
                  />
                </v-btn>
              </template>
              <template v-else>
                <v-btn
                  icon
                  :ripple="false"
                  density="compact"
                  size="small"
                  variant="plain"
                  class="memo-bookmark"
                  @click="handleDeleteBookmark(memoItem.id)"
                >
                  <v-icon
                    :icon="mdiStar"
                    color="green-accent-4"
                  />
                </v-btn>
              </template>
            </template>
          </v-card-title>
          
          <v-card-text>
            <SharedMemosListText
              :text="memoItem.sentenceBody"
            />
          </v-card-text>
          <v-spacer />
          <v-card-actions class="mt-n4">
            <v-spacer />
            <div class="justify-end mr-4">
              <p class="text-right link-decoration">
                {{ omittedText(memoItem.user.name, 10) }}
              </p>
              <p class="text-right text-caption font-weight-thin">
                {{ dateFormat(memoItem.updatedAt) }}
              </p>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import { mdiStarOutline, mdiStar } from '@mdi/js';
import SharedMemosListText from './SharedMemosListText';
import dayjs from 'dayjs';
import { FIGHTERS_ARRAY } from '../../../constants/fightersArray';

export default {
  name: "SharedMemosList",
  components: {
    SharedMemosListText
  },
  props: {
    authUser: {
      type: Object,
      default: null
    },
    isGeneral: {
      type: Boolean,
      default: false
    },
    sharedMemos: {
      type: Array,
      required: true
    },
    bookmarkMemoIds: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  emits: [
    "create-bookmark",
    "delete-bookmark"
  ],
  data() {
    return {
      mdiStarOutline,
      mdiStar,
      FIGHTERS_ARRAY
    };
  },
  methods: {
    omittedText(text, length) {
      return text.length > length ? text.slice(0, length) + "…" : text;
    },
    fighterName(fighterId) {
      const fighterData = this.FIGHTERS_ARRAY.find((fighter) => fighter.id == fighterId);
      return fighterData.name;
    },
    isMine(userId) {
      return userId == this.authUser.id;
    },
    isBookmark(memoId) {
      return this.bookmarkMemoIds.includes(memoId);
    },
    isBookmarkDisplay(userId) {
      return this.isGeneral && !this.isMine(userId) && this.$route.name != "TopIndex";
    },
    showRouteName(memoType) {
      return memoType == "MatchupMemo" ? "SharedMatchupMemosShow" : "SharedStrategyMemosShow";
    },
    dateFormat(date) {
      return dayjs(date).format("YYYY-MM-DD");
    },
    getImageUrl(fighterId) {
      const fighterData = this.FIGHTERS_ARRAY.find((fighter) => fighter.id == fighterId);
      return new URL(`../../../../assets/images/character_icon/${fighterData.image}`, import.meta.url).href;
    },
    handleCreateBookmark(memoId) {
      this.$emit("create-bookmark", memoId);
    },
    handleDeleteBookmark(memoId) {
      this.$emit("delete-bookmark", memoId);
    }
  }
};
</script>

<style scoped>
.memo-card {
  position: relative;
}

.memo-bookmark {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>