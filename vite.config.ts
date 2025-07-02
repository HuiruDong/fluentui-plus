import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

const isProduction = process.env.NODE_ENV === 'production'
const buildFormat = process.env.BUILD_FORMAT || 'es'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
    ...(isProduction ? [dts({
      insertTypesEntry: true,
      copyDtsFiles: true,
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
        '**/utils/**',  // 排除 utils 目录
        'src/utils/**', // 明确排除 src/utils
      ],
      outDir: 'dist',
      tsconfigPath: './tsconfig.json',
    })] : []),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'FluentUIPlus',
      formats: buildFormat === 'es' ? ['es'] : ['cjs'],
      fileName: (format) => {
        if (format === 'es') return 'index.esm.js'
        if (format === 'cjs') return 'index.js'
        return `index.${format}.js`
      },
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        '@fluentui/react-components',
        '@emotion/react',
        '@emotion/styled',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@fluentui/react-components': 'FluentUIReactComponents',
          '@emotion/react': 'EmotionReact',
          '@emotion/styled': 'EmotionStyled',
        },
      },
    },
    sourcemap: true, // 始终生成 source map 以提供更好的开发体验
    minify: isProduction,
  },
  root: '.', // 确保根目录正确
})
