module.exports = {
  root: true,
  env: {
    browser: true,
    'jest/globals': true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'prettier',
  ],
  plugins: ['jest'],
  // add your custom rules here
  rules: {
    'no-unused-vars': 'warn',
    camelcase: 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['parameter', 'variable'],
        format: ['snake_case'],
      },
      {
        selector: 'function',
        format: ['camelCase'],
      },
    ],
    'vue/prop-name-casing': ['error', 'snake_case'],
    'import/order': 'off',
  },
}
