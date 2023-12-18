<template>
  <v-row>
    <template
      v-for="memoItem in memos"
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
            <v-avatar :image="getImageUrl(memoItem.fighterId)" class="mr-2"/>
            <span class="memo-card-link">
              {{ omittedText(memoItem.title, 12) }}
            </span>
            <template v-if="authUser && !isMine(memoItem.userId)">
              <v-btn
                icon
                :ripple="false"
                density="compact"
                size="small"
                variant="plain"
                class="memo-bookmark"
              >
                <v-icon
                  :icon="mdiStarOutline"
                />
              </v-btn>
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
              <p class="text-right memo-card-link">
                {{ sliceUserName(memoItem.user.name) }}
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
    memos: {
      type: Array,
      required: true
    }
  },
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
    sliceUserName(name) {
      if (name.length <= 10) return name;
      return name.slice(0, 10) + "…";
    },
    isMine(userId) {
      return userId == this.authUser.id;
    },
    dateFormat(date) {
      return dayjs(date).format("YYYY-MM-DD");
    },
    getImageUrl(fighterId) {
      const fighterData = this.FIGHTERS_ARRAY.find((fighter) => fighter.id == fighterId);
      return new URL(`../../../../assets/images/character_icon/${fighterData.image}`, import.meta.url).href;
    }
  }
};
</script>

<style scoped>
.memo-card-link {
  text-decoration: underline;
  color: #0099CC;
}

.memo-card {
  position: relative;
}

.memo-bookmark {
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>