<template>
  <div
    v-if="isVisibleAlert"
    class="w-75 mx-10"
  >
    <v-alert
      closable
      :type="alertType"
      variant="outlined"
    >
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
    </v-alert>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters("alert", [
      "isVisibleAlert",
      "alertType",
      "alertTextArray"
    ])
  }
};
</script>