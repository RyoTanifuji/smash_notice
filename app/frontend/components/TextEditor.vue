<template>
  <v-container>
    <QuillEditor
      ref="editor"
      v-model="content"
      :options="options"
      content-type="html"
      style="height: 200px"
      class="editor"
      @update:content="updateContent"
    />
  </v-container>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';

export default {
  name: "TextEditor",
  components: {
    QuillEditor
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      content: this.value,
      editor: null,
      options: {
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline"],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
          ]
        },
        theme: "snow"
      }
    };
  },
  watch: {
    content: {
      handler: function(newVal) {
      this.$emit('update:modelValue', newVal);
      },
      immediate: true
    }
  },
  mounted() {
    this.$refs.editor.setHTML(this.content);
  },
  methods: {
    updateContent(newContent) {
      this.content = newContent;
      this.$emit('update:modelValue', newContent);
    }
  }
};
</script>