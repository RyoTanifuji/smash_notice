<template>
  <iframe
    :width="playerWidth"
    :src="embedYoutubeUrl"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
    allowfullscreen
  />
</template>

<script>
export default {
  name: "EmbedYoutube",
  props: {
    youtubeUrl : {
      type: String,
      required: true
    }
  },
  data() {
    return {
      embedYoutubeUrl : ""
    }
  },
  computed: {
    playerWidth() {
      switch (this.$vuetify.display.name) {
        case "xs": return "100%";
        default: return "560px";
      }
    },
  },
  mounted() {
    this.embedYoutubeUrl = this.getYoutubeEmbedUrl(this.youtubeUrl);
  },
  methods: {
    getYoutubeEmbedUrl(url) {
      let result = "";

      const videoIndex = url.split("/").pop().replace("watch?v=", "").split(/[?&]/);
      result = result + videoIndex[0] + "?";

      const params = videoIndex.filter((param) => /^(list=|t=)/.test(param));
      params.forEach((param) => {
        param.replace("t=", "amp;start=");
        result = result + param + "&";
      })

      result = "https://www.youtube.com/embed/" + result.slice(0, -1);
      return result;
    }
  }
};
</script>

<style scoped>
iframe{
  aspect-ratio: 16 / 9;
  border: none;
}
</style>