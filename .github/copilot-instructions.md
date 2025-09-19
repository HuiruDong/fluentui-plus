# FluentUI Plus - Copilot Instructions

## 📋 项目概述

FluentUI Plus 是一个基于 Fluent UI 的企业级组件库，专为中后台项目设计。本文档将帮助 Copilot 更好地理解项目内容、开发规范和最佳实践。

## 🏗️ 项目架构

### 核心架构

- **基础框架**: React 18 + TypeScript + Vite
- **UI 基础**: @fluentui/react-components
- **样式系统**: Less 预处理器 + `src/styles` 目录下的变量和 mixins，自动支持多主题
- **构建工具**: Vite + TypeScript + ESLint + Prettier
- **测试框架**: Jest + Testing Library
- **文档系统**: Storybook
- **版本管理**: Yarn + Husky + Conventional Commits

### 技术栈选择优先级

1. **UI 组件**: 优先使用 `@fluentui/react-components`
2. **图标库**: 优先使用 `@fluentui/react-icons` 的 icon
3. **样式处理**: 使用 `clsx` 处理类名
4. **浮层定位**: 使用 `@floating-ui/react`
5. **工具函数**: 使用 `lodash` 的特定函数

## 📁 目录结构规范

```
src/
├── components/           # 组件库核心
│   ├── ComponentName/   # 单个组件目录
│   │   ├── index.ts     # 组件导出文件
│   │   ├── ComponentName.tsx    # 主组件文件
│   │   ├── SubComponent.tsx     # 子组件文件（如有）
│   │   ├── types.ts     # TypeScript 类型定义
│   │   ├── index.less   # 组件样式文件
│   │   ├── hooks/       # 组件相关 hooks
│   │   ├── utils/       # 组件相关工具函数
│   │   └── __tests__/   # 单元测试文件
│   └── index.ts         # 所有组件统一导出
├── hooks/               # 通用 hooks
│   ├── index.ts
│   ├── useHookName.ts
│   └── __tests__/
├── styles/              # 全局样式
│   ├── index.less       # 样式主入口
│   ├── variables.less   # FluentUI Design Tokens
│   └── mixins.less      # Less mixins
├── types/               # 全局类型定义
└── index.ts             # 项目主入口
```

### 组件目录结构规范

1. **单组件结构**（推荐）:

   ```
   ComponentName/
   ├── index.ts                    # 导出文件
   ├── ComponentName.tsx           # 主组件
   ├── types.ts                    # 类型定义
   ├── index.less                  # 样式文件
   └── __tests__/                  # 测试文件
       └── ComponentName.test.tsx
   ```

2. **复合组件结构**:
   ```
   ComponentName/
   ├── index.ts                    # 导出文件
   ├── ComponentName.tsx           # 主组件
   ├── SubComponent.tsx            # 子组件
   ├── types.ts                    # 类型定义
   ├── index.less                  # 样式文件
   ├── hooks/                      # 组件专用 hooks
   │   └── useComponentHook.ts
   ├── utils/                      # 组件专用工具
   │   └── helper.ts
   └── __tests__/                  # 测试文件
       ├── ComponentName.test.tsx
       └── SubComponent.test.tsx
   ```

## 🎨 开发规范

### 组件开发规范

#### 1. 基础组件优先级

- **第一优先级**: 使用项目内已有组件
- **第二优先级**: 使用 `@fluentui/react-components` 基础组件
- **最后选择**: 创建新组件

#### 2. 组件命名规范

- 组件文件: PascalCase (如: `InputTag.tsx`)
- 组件目录: PascalCase (如: `InputTag/`)
- Hook 文件: camelCase with `use` prefix (如: `useInputValue.ts`)
- 工具文件: camelCase (如: `formatValue.ts`)

#### 3. 组件开发模板

```tsx
import React from 'react';
import clsx from 'clsx';
import type { ComponentNameProps } from './types';
import './index.less';

const prefixCls = 'fluentui-plus-component-name';

const ComponentName: React.FC<ComponentNameProps> = ({ className, ...props }) => {
  const classes = clsx(prefixCls, className);

  return <div className={classes}>{/* 组件内容 */}</div>;
};

export default ComponentName;
export type { ComponentNameProps } from './types';
```

#### 4. 路径 Alias 使用

当导入路径过长时，可以使用项目配置的路径别名简化导入。当前支持的 alias 配置可查看 `vite.config.ts` 文件：

- `@` → `src` 目录

```tsx
// ✅ 使用 alias 简化路径
import { useInputValue } from '@/hooks/useInputValue';
import type { ComponentProps } from '@/components/Component/types';

// ❌ 避免过长的相对路径
import { useInputValue } from '../../../hooks/useInputValue';
import type { ComponentProps } from '../../Component/types';
```

#### 5. TypeScript 类型定义规范

```typescript
// types.ts
import React, { PropsWithChildren } from 'react';

export interface ComponentNameProps extends PropsWithChildren {
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  // 其他属性...
}

// 导出时使用 type 关键字
export type { ComponentNameProps };
```

### 样式规范

#### 1. CSS 类命名规范 (BEM)

- **Block**: `fluentui-plus-component-name`
- **Element**: `fluentui-plus-component-name__element`
- **Modifier**: `fluentui-plus-component-name--modifier`

示例:

```less
.fluentui-plus-tag {
  // Block
  // 基础样式

  &__content {
    // Element
    // 内容样式
  }

  &__close {
    // Element
    // 关闭按钮样式
  }

  &--bordered {
    // Modifier
    // 有边框的变体
  }

  &--borderless {
    // Modifier
    // 无边框的变体
  }
}
```

#### 2. 样式处理

使用 `clsx` 处理类名：

```tsx
import clsx from 'clsx';

// 基础用法
const classes = clsx(prefixCls, className);

// 条件类名
const classes = clsx(
  prefixCls,
  {
    [`${prefixCls}--bordered`]: bordered,
    [`${prefixCls}--disabled`]: disabled,
    [`${prefixCls}--multiple`]: multiple,
  },
  className
);
```

#### 3. 样式变量使用

- 优先使用 `src/styles` 目录下的变量 (variables.less 和 mixins.less)
- 避免硬编码颜色值
- 使用语义化的变量名
- 变量和 mixins 自动支持多主题，开发时无需考虑多主题兼容

```less
.fluentui-plus-component {
  color: @color-neutral-foreground-1; // ✅ 推荐
  background: @color-neutral-background-1; // ✅ 推荐
  border-radius: @border-radius-medium; // ✅ 推荐

  // color: #333333;                               // ❌ 避免硬编码
}
```

## 🧪 单元测试规范

### 测试文件结构

根据组件结构组织测试文件，确保测试目录与组件结构保持一致：

#### 单组件测试结构

```
__tests__/
└── ComponentName.test.tsx              # 主组件测试
```

#### 复合组件测试结构

```
__tests__/
├── ComponentName.test.tsx              # 主组件测试
├── SubComponent1.test.tsx              # 子组件测试
├── SubComponent2.test.tsx              # 子组件测试
├── hooks/                              # hooks 测试目录
│   └── useComponentHook.test.ts
└── utils/                              # 工具函数测试目录
    └── helper.test.ts
```

#### 实际项目示例

**Nav 组件测试结构**:

```
Nav/__test__/                           # 注意：Nav 使用 __test__ 目录名
├── Nav.test.tsx
├── NavItem.test.tsx
├── NavSubmenu.test.tsx
├── hooks/
└── utils/
```

**Select 组件测试结构**:

```
Select/__tests__/                       # 注意：Select 使用 __tests__ 目录名
├── Select.test.tsx
├── Listbox.test.tsx
├── MultipleSelector.test.tsx
├── OptionGroup.test.tsx
├── OptionItem.test.tsx
├── SearchInput.test.tsx
├── SelectClear.test.tsx
├── Selector.test.tsx
├── TextDisplay.test.tsx
├── hooks/
└── utils/
```

**Cascader 组件测试结构**:

```
Cascader/__tests__/
├── Cascader.test.tsx
├── CascaderColumn.test.tsx
├── CascaderEmpty.test.tsx
├── CascaderOption.test.tsx
├── CascaderPanel.test.tsx
├── hooks/
└── utils/
```

### 测试编写规范

#### 1. 基础测试模板

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComponentName from '../ComponentName';

// Mock 外部依赖
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
}));

describe('ComponentName', () => {
  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<ComponentName>Test Content</ComponentName>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('交互测试', () => {
    it('should handle click events', () => {
      const handleClick = jest.fn();
      render(<ComponentName onClick={handleClick}>Clickable</ComponentName>);

      fireEvent.click(screen.getByText('Clickable'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
```

#### 2. 测试覆盖要求

- **组件渲染**: 基础渲染、prop 传递、条件渲染
- **用户交互**: 点击、输入、键盘事件
- **状态管理**: 状态变化、副作用
- **边界情况**: 空值、极值、错误情况

#### 3. Hook 测试模板

```tsx
import { renderHook, act } from '@testing-library/react';
import { useHookName } from '../useHookName';

describe('useHookName', () => {
  it('should return correct initial state', () => {
    const { result } = renderHook(() => useHookName());

    expect(result.current.value).toBe(expectedInitialValue);
  });

  it('should update state correctly', () => {
    const { result } = renderHook(() => useHookName());

    act(() => {
      result.current.setValue(newValue);
    });

    expect(result.current.value).toBe(newValue);
  });
});
```

## 📚 文档规范

### Storybook Stories 规范

#### 1. Story 文件结构

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from '../src/components';

const meta: Meta<typeof ComponentName> = {
  title: '分类/ComponentName 组件名',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '组件描述信息',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // 控件配置
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Default: Story = {
  args: {
    // 默认参数
  },
};

// 场景示例
export const ScenarioName: Story = {
  render: () => {
    // 复杂示例实现
  },
};
```

#### 2. Story 分类规范

- **通用组件**: `通用/ComponentName`
- **导航组件**: `导航/ComponentName`
- **数据录入**: `数据录入/ComponentName`
- **数据展示**: `数据展示/ComponentName`
- **反馈组件**: `反馈/ComponentName`

#### 3. 必需的 Stories

- `Default`: 基础用法
- `Variants`: 不同变体
- `Interactive`: 交互示例
- `Enterprise`: 企业级应用场景

### API 文档规范

每个组件都应提供完整的 API 文档，包括:

- 组件描述和使用场景
- 属性列表和类型定义
- 方法列表（如有）
- 事件列表（如有）
- 使用示例

## 🔧 开发工具配置

### 依赖管理规范

#### 生产依赖 (dependencies)

- `@floating-ui/react`: 浮层定位
- `clsx`: 条件类名处理
- `lodash`: 工具函数库

#### 开发依赖 (devDependencies)

- `@fluentui/react-components`: 基础 UI 组件库
- `react`, `react-dom`: React 框架
- `typescript`: 类型系统
- `vite`: 构建工具
- `jest`, `@testing-library/*`: 测试框架
- `eslint`, `prettier`: 代码质量工具

### 构建配置

项目使用 Vite 进行构建，支持:

- ES Module 和 CommonJS 格式
- TypeScript 类型声明自动生成
- Source Map 生成
- Tree-shaking 优化

### 代码质量工具

#### ESLint 配置

- 基于 TypeScript ESLint 规则
- React Hooks 规则检查
- 自动代码修复

#### Prettier 配置

- 统一代码格式化
- 与 ESLint 集成

#### Git Hooks

- `pre-commit`: 代码检查和格式化
- `commit-msg`: 提交信息规范检查

## 📝 提交规范

使用 Conventional Commits 规范:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Type 类型

- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更改
- `style`: 代码格式修改
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建工具或辅助工具的变动

### 示例

```bash
feat(Tag): add CheckableTag component
fix(InputTag): resolve input focus issue
docs: update component API documentation
style: format code with prettier
```

## 🎯 开发最佳实践

### 组件开发流程

1. **组件设计阶段**
   - 确定组件 API 设计
   - 创建组件目录结构
   - 定义 TypeScript 类型

2. **组件实现阶段**（重点关注）
   - 实现基础组件功能
   - 编写组件样式
   - 处理交互逻辑
   - **暂时跳过单元测试**（开发初期）

3. **文档和示例阶段**
   - 创建 Storybook Stories
   - 编写使用示例
   - 完善 API 文档

4. **测试和优化阶段**
   - 补充单元测试
   - 性能优化

### 常见模式和代码片段

#### 1. 组件导出模式

```tsx
// 主组件文件
const ComponentName: React.FC<ComponentProps> = props => {
  // 组件实现
};

// 复合组件模式
interface ComponentType extends React.FC<ComponentProps> {
  SubComponent: React.FC<SubComponentProps>;
}

const Component: ComponentType = ComponentName as ComponentType;
Component.SubComponent = SubComponent;

export default Component;
```

#### 2. Hook 开发模式

```tsx
export const useComponentHook = (options: HookOptions) => {
  const [state, setState] = useState(options.initialValue);

  const methods = useMemo(
    () => ({
      setValue: (value: ValueType) => setState(value),
      reset: () => setState(options.initialValue),
    }),
    [options.initialValue]
  );

  return {
    value: state,
    ...methods,
  };
};
```

#### 3. 样式处理模式

```tsx
import clsx from 'clsx';

// 基础用法
const basicClasses = clsx(prefixCls, className);

// 条件类名
const conditionalClasses = clsx(
  prefixCls,
  {
    [`${prefixCls}--active`]: active,
    [`${prefixCls}--disabled`]: disabled,
    [`${prefixCls}--multiple`]: multiple,
  },
  className
);
```

#### 4. Context 使用模式

```tsx
import React, { createContext, useContext, useMemo } from 'react';

// Context 类型定义
interface ComponentContextValue {
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  theme?: 'light' | 'dark';
  onAction?: (action: string) => void;
}

// 创建 Context
const ComponentContext = createContext<ComponentContextValue | undefined>(undefined);

// Provider 组件
export const ComponentProvider: React.FC<{
  children: React.ReactNode;
  value: ComponentContextValue;
}> = ({ children, value }) => {
  const contextValue = useMemo(() => value, [value]);

  return <ComponentContext.Provider value={contextValue}>{children}</ComponentContext.Provider>;
};

// Hook 封装
export const useComponentContext = () => {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error('useComponentContext must be used within ComponentProvider');
  }
  return context;
};

// 在子组件中使用
const SubComponent: React.FC = () => {
  const { size, disabled, onAction } = useComponentContext();

  return (
    <button disabled={disabled} className={`component-button--${size}`} onClick={() => onAction?.('click')}>
      Button
    </button>
  );
};
```

### 性能优化建议

1. **使用 React.memo** 包装纯组件
2. **使用 useMemo** 缓存计算结果
3. **使用 useCallback** 缓存事件处理函数
4. **避免在 render 中创建内联对象**
5. **合理使用 key 属性**

### 模块化设计原则

1. **组件单一职责**: 每个组件应该专注于单一的功能或职责
2. **逻辑拆分**: 复杂逻辑应拆分为独立的 hooks 或工具函数
3. **样式模块化**: 样式文件按组件维度组织，避免全局样式污染
4. **类型定义隔离**: 每个组件的类型定义应在独立的 `types.ts` 文件中
5. **工具函数复用**: 通用工具函数放在 `utils/` 目录，组件专用工具放在组件内的 `utils/` 目录
6. **接口清晰**: 组件间通过明确的 props 和回调函数进行通信
7. **Context 优化**: 对于复杂的 props 传递（如多层嵌套组件、大量共享状态），考虑使用 React Context 避免 props drilling
8. **依赖最小化**: 减少不必要的依赖，保持组件的独立性

## 🚀 快速开始开发

### 创建新组件的步骤

1. **创建组件目录**

   ```bash
   mkdir src/components/NewComponent
   cd src/components/NewComponent
   ```

2. **创建基础文件**

   ```bash
   touch index.ts NewComponent.tsx types.ts index.less
   mkdir __tests__
   touch __tests__/NewComponent.test.tsx
   ```

3. **编写组件代码**（按照上述模板）

4. **更新组件导出**
   在 `src/components/index.ts` 中添加导出

5. **创建 Storybook Story**
   在 `stories/` 目录创建对应的 `.stories.tsx` 文件

6. **开发完成后补充测试**
   编写完整的单元测试

### 常用开发命令

```bash
# 启动开发服务器
yarn dev

# 启动 Storybook
yarn storybook

# 运行测试
yarn test

# 代码检查
yarn lint

# 代码格式化
yarn format

# 构建项目
yarn build
```

## ⚠️ 注意事项

1. **组件开发初期应该聚焦于组件本身的开发，单元测试可暂时跳过**
2. 始终使用 `src/styles` 目录下的变量而不是硬编码值
3. 优先考虑组件的可复用性和扩展性
4. 保持代码简洁和可维护性

---

通过遵循以上规范和最佳实践，Copilot 可以更好地协助开发高质量、一致性的组件库代码。
