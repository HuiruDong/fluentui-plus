// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

export default [eslint.configs.recommended, {
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
      ...globals.browser,
      ...globals.es2021,
      ...globals.node
    },
    parser: tseslintParser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    },
  },
  plugins: {
    "@typescript-eslint": tseslint,
    "react": reactPlugin,
    "react-hooks": reactHooksPlugin
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}, // TypeScript 配置
{
  files: ["**/*.{ts,tsx}"],
  rules: {
    ...tseslint.configs.recommended.rules,
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-spread": "error"
  },
  languageOptions: {
    parserOptions: {
      project: "./tsconfig.json"
    }
  }
}, // React 配置
{
  files: ["**/*.{jsx,tsx}"],
  rules: {
    ...reactPlugin.configs.recommended.rules,
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}, // Jest 测试文件配置
{
  files: ["**/*.{spec,test}.{js,ts,jsx,tsx}", "**/setupTests.ts"],
  languageOptions: {
    globals: globals.jest
  },
  rules: {
    "no-undef": "off" // 测试文件中允许使用jest全局变量
  }
}, // Utils 目录配置
{
  files: ["**/utils/**/*.ts"],
  languageOptions: {
    globals: {
      NodeJS: "readonly"
    }
  }
}, ...storybook.configs["flat/recommended"]];
