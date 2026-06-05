// @ts-check

import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig(js.configs.recommended, eslintConfigPrettier, {
  files: ['**/*.js'],
  ignores: ['node_modules/**'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: globals.browser
  }
});
