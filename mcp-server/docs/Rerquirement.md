我是一名前端开发工程师，目前在开发维护一款 UI 组件库，下面是这款组件库的介绍

# UI 组件库介绍

## 🎯 Fluentui Plus 的作用

**Fluentui Plus** 是一个基于 Microsoft Fluent UI 设计语言的企业级 React 组件库，专门为中后台项目设计。主要特点包括：

- **设计语言**: 遵循 Fluent UI 设计规范，提供现代化、一致的用户界面
- **企业级应用**: 专门针对企业级中后台系统的需求和场景
- **TypeScript 支持**: 完整的类型定义，提供更好的开发体验
- **按需加载**: 支持 tree-shaking，优化包体积
- **样式系统**: 使用 Less 预处理器，支持主题定制

## 🏗️ 架构设计

### 1. **项目结构**
```
fluentui-plus/
├── src/                    # 源代码
│   ├── components/         # 组件库
│   │   ├── Tag/           # 标签组件
│   │   ├── InputTag/      # 标签输入组件
│   │   └── Nav/           # 导航组件
│   ├── styles/            # 样式系统
│   └── types/             # 类型定义
├── demo/                  # 演示示例
├── stories/               # Storybook 文档
├── docs/                  # 文档
└── dist/                  # 构建输出
```

### 2. **组件架构**
每个组件都采用统一的结构：
- **组件文件**: 主要的 React 组件实现
- **类型定义**: TypeScript 接口和类型
- **样式文件**: Less 样式文件
- **Hooks**: 自定义 React Hooks
- **测试文件**: 单元测试和集成测试

### 3. **技术栈**
- **框架**: React + TypeScript
- **构建工具**: Vite
- **样式**: Less 预处理器
- **测试**: Jest + React Testing Library
- **文档**: Storybook
- **代码质量**: ESLint + Prettier + Husky
- **发布**: 支持 ES Module 和 CommonJS

### 5. **开发工作流**
- 使用 Vite 进行快速开发和构建
- 集成 Storybook 进行组件文档和演示
- 完整的代码质量检查体系
- 支持按需导入和 tree-shaking

# 开发流程

开发流程如下：

1. **开发组件核心代码阶段：** 在 components 目录下创建组件目录用于存放组件代码，例如我需要创建一个 Nav 组件，会分为以下几个步骤：

    1. 在 components 目录下创建一个名为 Nav 的文件夹，这个名字和组件名字保持一致
    1. 在 components/Nav 目录下创建一个 index.ts 文件，文件名称固定就是 index.ts，文件作用是用于导出 Nav 组件和导出 NavProps
    1. 在 components/Nav 目录下创建一个 Nav.tsx 文件，文件名称和组件名称保持一致，文件作用为组件的核心文件
    1. （可选）若需要自定义 hook 就在 components/Nav 下创建一个 hooks 目录

        1. 在 components/Nav/hooks 目录下创建一个 index.ts 文件，文件名称固定就是 index.ts，作用就是导出所有自定义 hook
        1. 在 components/Nav/hooks 目录下创建一个 useHookName.ts 的文件，文件名称就是 hook 名称

1. **验证组件功能阶段：** 核心代码开发差不多，需要做验证调试的时候，会在 demo 目录下创建一个 NavDemo.tsx 文件用于调试 Nav 组件，文件名称规则是 `组件名称Demo.tsx`
1. **单元测试阶段：** 组件验证没有问题后，我会开始编写单元测试

    1. 在 components/Nav 目录下创建一个名字为 `__tests__` 的目录，用于存放 Nav 组件的单元测试文件

1. **storybook 阶段：** 单元测试没问题后我会在 stories 目录下创建 Nav 组件的 stories，创建一个名字为 `Nav.stories.tsx` 的文件来编写 stories
1. **更新文档阶段：** 以上步骤都完成并且验证没有问题后，我会更新 docs/API_REFERENCE.md 文件

# 目前遇到的问题

除了**开发组件核心代码阶段**以外，其余阶段几乎都是重复的劳动力，并且是使用 ai 生成的，导致对于我来说这部分是重复且无意义的工作，我希望通过 mcp 的模式，借助 copilot 能够实现自己生成，自己修复，自己验证的目的。但是我不确定 mcp 是不是可以帮助我实现

# 问题

我该咋整，你推荐什么方式，我更加期望是 mcp 的实现方案，原因有两个：

1. 除了**开发组件核心代码阶段**和**验证组件功能阶段** 以外，剩余的阶段目前就是通过 prompt 生成的，本身就依赖的 AI 服务
1. 希望团队成员都可以使用，而且团队成员本身就是 AI 使用的经验和能力


    
