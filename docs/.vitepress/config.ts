import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'FluentUI Plus',
  description: '基于 Fluent UI 的企业级组件库',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '组件', link: '/components/' },
      { text: '指南', link: '/guide/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '主题定制', link: '/guide/theming' },
            { text: '按需加载', link: '/guide/tree-shaking' },
          ]
        }
      ],
      '/components/': [
        {
          text: '通用组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Input 输入框', link: '/components/input' },
          ]
        },
        {
          text: '数据展示',
          items: [
            { text: 'Table 表格', link: '/components/table' },
          ]
        },
        {
          text: '数据录入',
          items: [
            { text: 'DatePicker 日期选择器', link: '/components/datepicker' },
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-username/fluentui-plus' }
    ]
  }
})
