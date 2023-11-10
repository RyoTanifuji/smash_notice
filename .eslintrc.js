module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
  ],

  rules: {
    "semi": ["error", "always"],
    "semi-spacing": ["error", {"after": true, "before": false}],
    "semi-style": ["error", "last"],
    "no-extra-semi": "error",
    "no-unexpected-multiline": "error",
    "no-unreachable": "error",
    "vue/multi-word-component-names": "off"
  }
}