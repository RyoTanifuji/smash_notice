<template>
  <template v-if="isVisibleAlert">
    <v-alert
      :type="alertType"
      variant="outlined"
      class="w-75 mx-10"
    >
      <div class="d-flex flex-row align-center">
        <ul>
          <template
            v-for="alertText in alertTextArray"
            :key="alertText"
          >
            <li>
              {{ alertText }}
            </li>
          </template>
        </ul>
        <v-btn
          ripple
          variant="plain"
          icon
          size="x-small"
          class="ml-auto"
          @click="closeAlert"
        >
          <span class="text-body-1">×</span>
        </v-btn>
      </div>
    </v-alert>
  </template>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters("alert", [
      "isVisibleAlert",
      "alertType",
      "alertTextArray"
    ])
  },
  methods: {
    ...mapActions("alert", ["closeAlert"])
  }
};
</script>