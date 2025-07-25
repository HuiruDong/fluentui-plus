# FluentUI Plus - GitHub Copilot 项目指令

## 🎯 项目概述

FluentUI Plus 是一个基于 Fluent UI 的企业级 React 组件库，专为中后台项目设计。项目采用 TypeScript + React + Vite 技术栈，集成了 MCP (Model Context Protocol) 自动化工具链。

## 🏗️ 项目架构

### 目录结构

```
src/
├── components/           # 组件源码
│   ├── InputTag/        # 输入标签组件
│   ├── Nav/             # 导航组件
│   ├── Tag/             # 标签组件
│   └── Select/          # 选择器组件
├── hooks/               # 自定义 Hooks
├── styles/              # 样式文件 (Less)
└── types/               # TypeScript 类型定义

demo/                    # 组件演示
stories/                 # Storybook 配置
mcp-server/             # MCP 自动化服务器
docs/                   # 项目文档
```

### 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: Less + Fluent UI Design Tokens
- **测试框架**: Jest + Testing Library
- **故事书**: Storybook
- **代码质量**: ESLint + Prettier + Commitlint
- **自动化**: MCP Server (Model Context Protocol)

## 🎨 代码规范

### 组件开发规范

1. **文件命名**: 使用 PascalCase，如 `InputTag.tsx`
2. **组件结构**:

   ```tsx
   // 组件 Props 接口
   export interface ComponentNameProps {
     // 必选属性在前，可选属性在后
     required: string;
     optional?: boolean;
   }

   // 组件实现
   export const ComponentName: React.FC<ComponentNameProps> = ({ required, optional = false }) => {
     // 组件逻辑
     return <div>{/* JSX */}</div>;
   };

   // 默认导出
   export default ComponentName;
   ```

3. **Props 设计原则**:
   - 继承原生 HTML 属性 (如 `HTMLDivElement`)
   - 使用 Fluent UI 的设计语言和命名约定
   - 提供合理的默认值
   - 支持 `className` 和 `style` 自定义

### TypeScript 规范

- 严格模式启用，零 TypeScript 错误容忍
- 使用接口定义 Props，避免内联类型
- 善用联合类型和泛型
- 为复杂类型提供 JSDoc 注释

### 样式规范

- 使用 Less 预处理器
- 遵循 BEM 命名约定
- 利用 Fluent UI Design Tokens
- 支持主题定制和暗色模式

## 🧪 测试要求

### 测试覆盖率

- **最低要求**: 80% 覆盖率 (语句、分支、函数、行数)
- **测试文件**: `__tests__/ComponentName.test.tsx`
- **测试框架**: Jest + @testing-library/react

### 测试模式

1. **单元测试**: 组件渲染、Props 传递、事件处理
2. **集成测试**: 组件间交互、Hook 组合使用
3. **快照测试**: 确保组件结构稳定

### 测试最佳实践

- 遵循 AAA 模式 (Arrange-Act-Assert)
- 使用语义化查询 (`getByRole`, `getByLabelText`)
- Mock 外部依赖和 API 调用
- 测试用户行为而非实现细节

## 📚 Storybook 规范

### Story 文件结构

```typescript
// ComponentName.stories.tsx
export default {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    docs: {
      description: {
        component: '组件描述信息'
      }
    }
  }
} as ComponentMeta<typeof ComponentName>;

// 基础用法
export const Default: ComponentStory<typeof ComponentName> = (args) => (
  <ComponentName {...args} />
);

// 变体展示
export const Variants: ComponentStory<typeof ComponentName> = () => (
  <div>
    {/* 多种变体演示 */}
  </div>
);
```

## 🤖 MCP 自动化工具

项目集成了 MCP 服务器，支持以下自动化功能：

### 可用工具

- `mcp_fluentui-plus_analyze_component`: 深度分析组件结构
- `mcp_fluentui-plus_create_all_files`: 一键创建组件配套文件
- `mcp_fluentui-plus_generate_demo_prompt`: 生成 Demo 创建指令
- `mcp_fluentui-plus_generate_test_prompt`: 生成测试创建指令
- `mcp_fluentui-plus_generate_story_prompt`: 生成 Storybook 创建指令

### 使用方式

```
@copilot 为 Button 组件执行完整工作流
@copilot 分析 InputTag 组件并生成测试
@copilot 创建 Modal 组件的 Storybook 故事
```

## 📝 开发工作流

### 新组件开发流程

1. **组件设计**: 定义 Props 接口和 API
2. **核心实现**: 编写组件逻辑和 JSX
3. **样式开发**: 编写 Less 样式文件
4. **Demo 创建**: 在 demo/ 目录创建使用示例
5. **测试编写**: 编写单元测试，确保 80%+ 覆盖率
6. **故事创建**: 编写 Storybook 故事
7. **文档完善**: 更新 README 和 API 文档

### Git 提交规范

使用 Conventional Commits 规范：

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建工具、依赖更新

## 🎯 代码生成指导

### 当我要求创建组件时

1. 分析组件需求和 API 设计
2. 生成符合项目规范的组件代码
3. 创建相应的类型定义
4. 编写基础样式 (Less)
5. 提供使用示例

### 当我要求编写测试时

1. 分析组件的 Props 和功能
2. 生成全面的测试用例
3. 确保覆盖边界情况
4. 使用项目的测试工具和最佳实践
5. 目标覆盖率: 80%+

### 当我要求创建 Storybook 故事时

1. 分析组件的所有 Props 和变体
2. 创建多个故事展示不同用法
3. 添加必要的控件 (Controls)
4. 提供详细的文档描述

## 🔧 开发环境

### 主要依赖

- React 18+
- TypeScript 4.9+
- @fluentui/react-components
- Vite
- Jest + Testing Library
- Storybook

### 开发命令

- `yarn dev`: 启动开发服务器
- `yarn test`: 运行测试
- `yarn test:coverage`: 生成测试覆盖率报告
- `yarn storybook`: 启动 Storybook
- `yarn build`: 构建生产版本
- `yarn lint`: 代码检查和修复

## 🎨 设计原则

1. **用户体验优先**: 组件 API 要直观易用
2. **一致性**: 与 Fluent UI 设计语言保持一致
3. **可访问性**: 支持键盘导航和屏幕阅读器
4. **性能**: 避免不必要的重渲染
5. **灵活性**: 支持主题定制和样式覆盖

## 💡 特别注意

- 这是一个学习和实验性项目，不建议在生产环境使用
- 优先考虑代码质量和最佳实践
- 充分利用 MCP 自动化工具提高开发效率
- 保持与 Fluent UI 生态系统的兼容性
- 所有组件都应该有完整的 TypeScript 类型支持

---

**记住**: 你是我的编程伙伴，帮助我构建高质量的组件库。当不确定时，选择更严格的代码质量标准和更完善的测试覆盖。让我们一起打造优秀的开发体验！
