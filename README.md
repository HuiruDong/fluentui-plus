# FluentUI Plus

[![npm version](https://badge.fury.io/js/@luoluoyu%2Ffluentui-plus.svg)](https://badge.fury.io/js/@luoluoyu%2Ffluentui-plus)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

基于 Fluent UI 的企业级组件库，专为中后台项目设计
**（不要使用在项目中！！！我闲的做来玩的！！！）**。

## ✨ 特性

- 🎨 **设计语言**: 基于 Fluent UI 设计语言，提供现代化的用户界面
- 📦 **开箱即用**: 高质量的 React 组件，满足企业级产品需求
- 🛡 **TypeScript**: 使用 TypeScript 开发，提供完整的类型定义
- 🎯 **按需加载**: 支持 tree-shaking，优化包体积
- � **样式系统**: 使用 Less 预处理器，支持主题定制和变量覆盖
- 📱 **现代浏览器**: 支持现代浏览器及 IE11+

## 📦 安装

```bash
npm install @luoluoyu/fluentui-plus @fluentui/react-components
```

或者使用 yarn:

```bash
yarn add @luoluoyu/fluentui-plus @fluentui/react-components
```

## 🔨 使用

```jsx
import React from 'react';
import { Tag, InputTag, Nav } from '@luoluoyu/fluentui-plus';
// 样式会自动导入，无需手动引入

function App() {
  const navItems = [
    { key: 'home', label: '首页', icon: '🏠', title: '首页' },
    { key: 'components', label: '组件', icon: '📦', title: '组件' },
  ];

  return (
    <div>
      <Tag color='#1890ff'>蓝色标签</Tag>
      <Tag.CheckableTag checked={true} onChange={checked => console.log(checked)}>
        可选择标签
      </Tag.CheckableTag>
      <InputTag defaultValue={['React', 'TypeScript']} placeholder='输入标签...' maxTags={10} allowDuplicates={false} />
      <Nav items={navItems} defaultSelectedKeys={['home']} onSelect={info => console.log('选择了:', info.key)} />
    </div>
  );
}
```

### 样式定制

如果需要定制主题，可以覆盖 Less 变量：

```less
// your-theme.less
@import '~@luoluoyu/fluentui-plus/dist/styles/variables.less';

// 覆盖品牌色
@brand-primary: #your-brand-color;
@neutral-background-1: #your-background-color;
```

## 🌍 按需加载

你可以直接从主包按需引入组件（推荐方式，支持 tree-shaking）：

```jsx
import { Tag, InputTag, Nav } from '@luoluoyu/fluentui-plus';
```

如果需要兼容某些工具链或自定义打包方式，也可以使用子路径导入：

```jsx
import Tag from '@luoluoyu/fluentui-plus/lib/Tag';
import InputTag from '@luoluoyu/fluentui-plus/lib/InputTag';
```

## 👥 开发指南

如果你是团队成员或想要为项目贡献代码，请参考以下文档：

- **[API 参考文档](./docs/API_REFERENCE.md)** - 详细的组件 API 文档和使用示例
- **[开发规范与工作流指南](./docs/DEVELOPMENT_GUIDE.md)** - 详细的开发规范、提交规范和工作流说明
- **[快速参考](./docs/QUICK_REFERENCE.md)** - 常用命令和规范的快速参考卡片
- **[贡献指南](./docs/CONTRIBUTING.md)** - 如何参与项目贡献

### 快速开始开发

```bash
# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 启动 Storybook
yarn storybook
```

### 提交规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 示例
git commit -m "feat(Tag): add CheckableTag component"
git commit -m "fix(Button): resolve click event issue"
```

详细信息请查看 [开发指南](./docs/DEVELOPMENT_GUIDE.md)。

## 🔗 链接

- [📖 文档地址](https://your-docs-site.com)
- [🐛 问题反馈](https://github.com/HuiruDong/fluentui-plus/issues)
- [📦 NPM 包](https://www.npmjs.com/package/@luoluoyu/fluentui-plus)

## 🤝 参与贡献

我们欢迎所有的贡献，请参考 [贡献指南](./docs/CONTRIBUTING.md)。

## 📄 开源协议

本项目遵循 [MIT](./LICENSE) 开源协议。

## 🏗️ 本地开发

```bash
# 克隆项目
git clone https://github.com/HuiruDong/fluentui-plus.git

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm run test

# 构建组件库
npm run build

# 开发环境构建（包含详细 source map）
npm run build:lib:dev

# 生产环境构建（包含优化 source map）
npm run build:lib:prod

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
├── dist/                # 构建产物（包含 source map）
├── BUILD.md             # 构建配置说明
└── tests/               # 测试文件
```
