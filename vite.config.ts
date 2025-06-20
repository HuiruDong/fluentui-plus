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
        '@fluentui/react',
        '@fluentui/react-components',
        '@emotion/react',
        '@emotion/styled',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@fluentui/react': 'FluentUIReact',
          '@fluentui/react-components': 'FluentUIReactComponents',
          '@emotion/react': 'EmotionReact',
          '@emotion/styled': 'EmotionStyled',
        },
      },
    },
    sourcemap: true,
    minify: isProduction,
  },
  server: {
    port: 3000,
    open: true,
  },
  root: '.', // 确保根目录正确
})
