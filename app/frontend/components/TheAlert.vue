<template>
  <template v-if="isVisibleAlert">
    <v-alert
      :type="alertType"
      variant="outlined"
      :class="classOption"
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
          icon
          variant="plain"
          size="x-small"
          class="ml-auto"
          @click="closeAlertWithCross"
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
  name: "TheAlert",
  props: {
    isDialog: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters("alert", [
      "isVisibleStandardAlert",
      "isVisibleDialogAlert",
      "alertType",
      "alertTextArray"
    ]),
    isVisibleAlert() {
      return this.isDialog ? this.isVisibleDialogAlert : this.isVisibleStandardAlert;
    },
    classOption() {
      return {
        'w-75': !this.isDialog,
        'mx-10': !this.isDialog,
        'mb-2': this.isDialog
      };
    }
  },
  methods: {
    ...mapActions("alert", ["closeAlertWithCross"])
  }
};
</script>