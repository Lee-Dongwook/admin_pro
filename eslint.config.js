/* eslint-disable style/comma-dangle */
import antfu from "@antfu/eslint-config";

export default antfu(
  {
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: true,
    },

    ignores: [],
  },
  {
    rules: {
      "vue/block-order": ["error", { order: ["script", "template", "style"] }],
      "vue/attributes-order": "off",
      "ts/no-use-before-define": "off",
      "node/prefer-global/process": "off",
      "style/comma-dangle": "off",
      "style/brace-style": ["error", "1tbs"],
      "regexp/no-unused-capturing-group": "off",
      "no-console": "off",
      "no-debugger": "off",
      "symbol-description": "off",
      "antfu/if-newline": "off",
      "unicorn/no-instanceof-builtins": "off",
    },
  }
);
