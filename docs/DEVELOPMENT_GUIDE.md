# FluentUI Plus - 开发规范与工作流指南

## 📋 概述

本项目采用了完整的代码质量保证体系，包括自动化的代码检查、测试、格式化和提交规范。本文档将指导团队成员如何正确使用这些工具。

## 🛠️ 开发环境配置

### 必需工具

- **Node.js** 18+
- **Yarn** 1.22.22+ (项目指定的包管理器)
- **Git**

### 安装依赖

```bash
yarn install
```

## 🔧 开发命令

### 基础开发

```bash
# 启动开发服务器
yarn dev

# 启动 Storybook
yarn storybook
```

### 代码质量检查

```bash
# 代码格式化
yarn format

# 检查代码格式
yarn format:check

# 代码规范检查并自动修复
yarn lint

# 仅检查代码规范（不修复）
yarn lint:check

# TypeScript 类型检查
yarn type-check
```

### 测试

```bash
# 运行所有测试
yarn test

# 监视模式运行测试
yarn test:watch

# 生成测试覆盖率报告
yarn test:coverage
```

### 构建

```bash
# 清理构建目录
yarn clean

# 完整构建
yarn build

# 仅构建库文件
yarn build:lib

# 开发模式构建
yarn build:lib:dev

# 生产模式构建
yarn build:lib:prod
```

## 📝 提交规范

### Commit Message 格式

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 允许的 Type 类型

- **feat**: 新功能
- **fix**: 错误修复
- **docs**: 文档更改
- **style**: 代码格式修改（不影响代码逻辑）
- **refactor**: 代码重构
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建工具或辅助工具的变动
- **build**: 构建系统或依赖项的更改
- **ci**: CI 配置文件和脚本的更改
- **revert**: 回滚之前的提交

### 提交示例

```bash
# ✅ 正确示例
git commit -m "feat(Tag): add CheckableTag component"
git commit -m "fix(Button): resolve click event handling issue"
git commit -m "docs: update installation guide"
git commit -m "style: format code with prettier"

# ❌ 错误示例
git commit -m "add new feature"
git commit -m "Fix Bug"
git commit -m "UPDATE DOCS"
```

## 🔄 Git 工作流

### 提交前检查 (pre-commit)

每次提交时会自动执行：

1. **lint-staged**: 对暂存文件进行代码检查和格式化
2. **type-check**: TypeScript 类型检查

### 推送前检查 (pre-push)

每次推送时会自动执行：

1. **lint:check**: 完整的代码规范检查
2. **test**: 运行所有测试
3. **build:lib**: 构建验证

### 提交信息检查 (commit-msg)

自动验证提交信息是否符合 Conventional Commits 规范。

## 📦 发布流程

### 自动化发布检查

项目配置了 `prepublishOnly` 钩子，发布前会自动执行：

```bash
yarn lint:check && yarn test && yarn build
```

### 手动发布步骤

1. 确保所有更改已提交并推送
2. 更新版本号：
   ```bash
   yarn version [major|minor|patch]
   ```
3. 发布到 npm：
   ```bash
   yarn publish
   ```

## 🚨 常见问题与解决方案

### 提交被阻止

如果提交被阻止，请检查：

1. **代码格式问题**

   ```bash
   yarn format
   ```

2. **代码规范问题**

   ```bash
   yarn lint
   ```

3. **类型检查错误**

   ```bash
   yarn type-check
   ```

4. **提交信息格式错误**
   - 检查是否使用了正确的 type
   - 确保描述清晰且不超过 100 字符

### 推送被阻止

如果推送被阻止，请检查：

1. **测试失败**

   ```bash
   yarn test
   ```

2. **构建失败**
   ```bash
   yarn build
   ```

### 跳过钩子（紧急情况）

⚠️ **不推荐**，仅在紧急情况下使用：

```bash
# 跳过 pre-commit 钩子
git commit -m "emergency fix" --no-verify

# 跳过 pre-push 钩子
git push --no-verify
```

## 📁 文件结构说明

### 配置文件

```
.husky/              # Git 钩子配置
├── pre-commit       # 提交前检查
├── pre-push         # 推送前检查
└── commit-msg       # 提交信息验证

.prettierrc          # Prettier 配置
.prettierignore      # Prettier 忽略文件
commitlint.config.js # Commitlint 配置
eslint.config.js     # ESLint 配置
jest.config.js       # Jest 测试配置
tsconfig.json        # TypeScript 配置
```

### 源码结构

```
src/
├── components/      # 组件库
├── styles/          # 样式文件
├── types/           # 类型定义
└── index.ts         # 主入口文件

demo/                # 演示应用
stories/             # Storybook 故事
```

## 🎯 最佳实践

### 开发流程

1. 创建新分支：`git checkout -b feat/new-component`
2. 开发功能并编写测试
3. 提交更改（遵循提交规范）
4. 推送分支并创建 PR
5. 代码审查通过后合并

### 代码质量

- 保持测试覆盖率 > 80%
- 所有 TypeScript 错误必须修复
- 遵循 ESLint 规则
- 使用 Prettier 保持代码格式一致

### 组件开发

- 为每个组件编写 Storybook 故事
- 编写完整的 TypeScript 类型定义
- 提供使用示例和文档
- 确保组件可访问性 (a11y)

## 🆘 获取帮助

如果遇到问题：

1. 查看本文档的常见问题部分
2. 检查 GitHub Issues
3. 联系项目维护者

---

**注意**: 所有配置都是为了确保代码质量和项目稳定性，请勿随意跳过检查。如有特殊需求，请与团队讨论后再做调整。
