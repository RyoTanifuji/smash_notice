<template>
  <div
    ref="memo"
    class="memo-text"
  >
    {{ memoTextPreview }}
  </div>
</template>

<script>
import { sanitizePreviewText, removeHtml } from '../../../plugins/sanitizeText';

export default {
  props: {
    text: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      memoTextPreview: "",
      memoTextWidth: 0,
      maxLines: 5
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.memoTextWidth = this.$refs.memo.clientWidth;
      this.memoTextPreview = this.getMemoTextPreview(this.text);
    });
  },
  methods: {
    getMemoTextPreview(text) {
      let memoText = sanitizePreviewText(text);
      memoText = memoText.replaceAll(/<\/..?>/g, "\n");
      memoText = removeHtml(memoText);
      const maxWordCount = Math.floor(this.memoTextWidth / 14);
      memoText = this.sliceMemoText(memoText, maxWordCount);
      return memoText;
    },
    sliceMemoText(text, count) {
      let result = "";
      let lines = 0;
      let i = 0;
      while (lines < this.maxLines && i < text.length) {
        const num = text.indexOf("\n", i);
        if (num != -1 && num < count) {
          result += text.slice(i, num + 2);
          i = num + 2;
        } else {
          result += text.slice(i, i + count);
          i += count;
        }
        lines++;
      }
      if (lines == this.maxLines && i < text.length) {
        result = result.slice(0, -2);
        result += "…";
      }
      return result;
    }
  }
};
</script>

<style scoped>
.memo-text {
  white-space: pre-line;
}
</style>