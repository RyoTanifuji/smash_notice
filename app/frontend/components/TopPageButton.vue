<template>
  <v-btn
    :to="{ name: path }"
    color="cyan-accent-4"
    outlined
    rounded
    class="font-weight-bold"
  >
    <slot />
  </v-btn>
</template>

<script>
export default {
  name: "TopPageButton",
  props: {
    path: {
      type: String,
      required: true
    }
  }
};
</script>