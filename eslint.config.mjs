import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import prettier from "eslint-config-prettier";

export default [
  prettier,
  ...pluginVue.configs["flat/recommended"],
  {
    rules: {
      "no-duplicate-imports": "error",
      "no-unused-vars": "warn",
    },
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    ignores: [
      "**/*.cy.js",
      "cypress",
      "cypress.config.js",
      "dist",
      "node_modules/",
      "public/",
    ],
  },
];
