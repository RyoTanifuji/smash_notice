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
          height="250"
          class="d-flex flex-column memo-card"
        >
          <v-card-title class="mt-2 mb-n3 font-weight-bold memo-title">
            {{ omittedText(memoItem.title, 12) }}
          </v-card-title>
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
          <v-card-text>
            <SharedMemosListText
              :text="memoItem.sentences[0].body"
            />
          </v-card-text>
          <v-spacer />
          <v-card-actions>
            {{ fighterName(memoItem.fighterId) }}
          </v-card-actions>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import { mdiStarOutline, mdiStar } from '@mdi/js';
import SharedMemosListText from './SharedMemosListText';
import { FIGHTERS_ARRAY } from '../../../constants/fightersArray';

export default {
  name: "SharedMemosList",
  components: {
    SharedMemosListText
  },
  props: {
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
    }
  }
};
</script>

<style scoped>
.memo-title {
  text-decoration: underline;
  color: #0099CC;
}

.memo-card {
  position: relative;
}

.memo-bookmark {
  position: absolute;
  top: 18px;
  right: 18px;
}
</style>