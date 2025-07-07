// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import prettierConfig from 'eslint-config-prettier';

import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  // 基础 ESLint 配置 - 只应用于 src 目录
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    ...eslint.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      parser: tseslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }, // TypeScript 配置
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-spread': 'error',
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  }, // React 配置
  {
    files: ['src/**/*.{jsx,tsx}'],
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  }, // Jest 测试文件配置
  {
    files: ['src/**/*.{spec,test}.{js,ts,jsx,tsx}', '**/setupTests.ts'],
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      'no-undef': 'off', // 测试文件中允许使用jest全局变量
    },
  }, // Demo 目录配置 - 宽松的规则用于开发和示例
  {
    files: ['demo/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parser: tseslintParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // 基础规则 - 保证代码能正常运行
      'no-unused-vars': 'warn', // 未使用变量改为警告
      'no-console': 'off', // 允许 console
      'no-debugger': 'warn', // debugger 改为警告

      // React 规则 - 基础但不严格
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off', // 允许未转义字符
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript 规则 - 如果使用 TS
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  }, // Utils 目录配置
  {
    files: ['**/utils/**/*.ts'],
    languageOptions: {
      globals: {
        NodeJS: 'readonly',
      },
    },
  },
  ...storybook.configs['flat/recommended'],
  // Prettier 配置 - 必须放在最后以禁用冲突的规则
  prettierConfig,
];
