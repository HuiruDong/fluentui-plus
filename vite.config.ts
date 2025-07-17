import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const buildFormat = process.env.BUILD_FORMAT || 'es';

export default defineConfig({
  plugins: [
    react(),
    ...(isProduction
      ? [
          dts({
            insertTypesEntry: true,
            copyDtsFiles: true,
            tsconfigPath: './tsconfig.build.json',
            exclude: [
              '**/*.test.ts',
              '**/*.test.tsx',
              '**/*.spec.ts',
              '**/*.spec.tsx',
              '**/setupTests.ts',
              '**/test/**',
              '**/tests/**',
              '**/__tests__/**',
              '**/demo/**',
              '**/stories/**',
              '**/.storybook/**',
              '**/utils/**', // 排除 utils 目录
              'src/utils/**', // 明确排除 src/utils
            ],
            outDir: 'dist',
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${resolve(__dirname, 'src/styles/variables.less')}"; @import "${resolve(__dirname, 'src/styles/mixins.less')}";`,
        modifyVars: {
          // 可以在这里添加全局 Less 变量
        },
      },
    },
    modules: {
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FluentUIPlus',
      formats: buildFormat === 'es' ? ['es'] : ['cjs'],
      fileName: format => {
        if (format === 'es') return 'index.esm.js';
        if (format === 'cjs') return 'index.js';
        return `index.${format}.js`;
      },
    },
    rollupOptions: {
      external: ['react', 'react-dom', '@fluentui/react-components'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@fluentui/react-components': 'FluentUIReactComponents',
        },
      },
    },
    sourcemap: true, // 始终生成 source map 以提供更好的开发体验
    minify: isProduction,
  },
  root: '.', // 确保根目录正确
});
