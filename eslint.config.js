const tsEslintPlugin = require('@typescript-eslint/eslint-plugin');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = [
  {
    ignores: ['coverage/**', 'dist/**', 'node_modules/**'],
  },
  ...tsEslintPlugin.configs['flat/recommended'],
  {
    files: ['**/*.ts'],
    rules: {},
  },
  prettierRecommended,
];
