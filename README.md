# FluentUI Plus

[![npm version](https://badge.fury.io/js/fluentui-plus.svg)](https://badge.fury.io/js/fluentui-plus)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

基于 Fluent UI 的企业级组件库，专为中后台项目设计。

## ✨ 特性

- 🎨 **设计语言**: 基于 Fluent UI 设计语言，提供现代化的用户界面
- 📦 **开箱即用**: 高质量的 React 组件，满足企业级产品需求
- 🛡 **TypeScript**: 使用 TypeScript 开发，提供完整的类型定义
- 🎯 **按需加载**: 支持 tree-shaking，优化包体积
- 🌈 **主题定制**: 支持通过 CSS 变量和 className 进行深度定制
- 📱 **现代浏览器**: 支持现代浏览器及 IE11+

## 📦 安装

```bash
npm install fluentui-plus @fluentui/react @fluentui/react-components
```

或者使用 yarn:

```bash
yarn add fluentui-plus @fluentui/react @fluentui/react-components
```

## 🔨 使用

```jsx
import React from 'react'
import { Button, Input, Table, DatePicker } from 'fluentui-plus'

function App() {
  return (
    <div>
      <Button type="primary">主要按钮</Button>
      <Input placeholder="请输入内容" />
    </div>
  )
}
```

## 🌍 按需加载

```jsx
import Button from 'fluentui-plus/lib/Button'
import Input from 'fluentui-plus/lib/Input'
```

## 🔗 链接

- [📖 文档地址](https://your-docs-site.com)
- [🐛 问题反馈](https://github.com/your-username/fluentui-plus/issues)
- [📦 NPM 包](https://www.npmjs.com/package/fluentui-plus)

## 🤝 参与贡献

我们欢迎所有的贡献，请参考 [贡献指南](./CONTRIBUTING.md)。

## 📄 开源协议

本项目遵循 [MIT](./LICENSE) 开源协议。

## 🏗️ 本地开发

```bash
# 克隆项目
git clone https://github.com/your-username/fluentui-plus.git

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm run test

# 构建组件库
npm run build

# 启动文档站点
npm run docs:dev
```

## 📋 项目结构

```
fluentui-plus/
├── src/                 # 源代码
│   ├── components/      # 组件源码
│   ├── styles/          # 样式和主题
│   └── utils/           # 工具函数
├── docs/                # 文档源码
├── dist/                # 构建产物
└── tests/               # 测试文件
```