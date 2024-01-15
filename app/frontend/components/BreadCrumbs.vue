<template>
  <v-breadcrumbs
    :items="breadCrumbs"
    density="compact"
    class="mt-n4 ml-n4 mb-1"
  >
    <template #title="{ item }">
      {{ omittedText(item.title, item.notOmit) }}
    </template>
    <template #divider>
      <v-icon
        :icon="mdiChevronRight"
        class="mx-n2"
      />
    </template>
  </v-breadcrumbs>
</template>

<script>
import { mdiChevronRight } from '@mdi/js';

export default {
  name: "BreadCrumbs",
  props: {
    breadCrumbs: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mdiChevronRight
    };
  },
  computed: {
    breadCrumbLength() {
      switch (this.$vuetify.display.name) {
        case "xs":
          return this.breadCrumbs.length <= 2 ? 6 : 4;
        case "sm":
          return this.breadCrumbs.length <= 2 ? 12 : 10;
        case "md":
          return 20;
        default:
          return this.breadCrumbs[0].length;
      }
    }
  },
  methods: {
    omittedText(text, notOmit) {
      return text.length > this.breadCrumbLength && !notOmit ? text.slice(0, this.breadCrumbLength) + "…" : text;
    }
  }
};
</script>