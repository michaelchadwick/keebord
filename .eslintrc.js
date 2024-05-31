/* eslint-env node */
module.exports = {
  root: true,
  env: {
    "node": true
  },
  extends: [
    'eslint:recommended',
    'plugin:cypress/recommended',
    'plugin:vue/vue3-essential'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-unused-vars': ['warn', {
      varsIgnorePattern: 'emit'
    }]
  }
}
