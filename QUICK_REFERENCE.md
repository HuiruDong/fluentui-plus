# FluentUI Plus - 快速参考卡片

## 🚀 常用命令

```bash
# 开发
yarn dev                    # 启动开发服务器
yarn storybook             # 启动 Storybook

# 代码质量
yarn format                # 格式化代码
yarn lint                  # 检查并修复代码规范
yarn type-check           # TypeScript 类型检查
yarn test                 # 运行测试

# 构建
yarn build                # 完整构建
yarn clean                # 清理构建目录
```

## 📝 提交规范 (Conventional Commits)

```bash
# 格式
<type>(<scope>): <description>

# 示例
git commit -m "feat(Tag): add CheckableTag component"
git commit -m "fix(Button): resolve click event issue"
git commit -m "docs: update README"
git commit -m "test: add unit tests for Tag component"
```

### Type 类型

- `feat` - 新功能
- `fix` - 修复 bug
- `docs` - 文档更新
- `style` - 代码格式
- `refactor` - 重构
- `test` - 测试
- `chore` - 其他

## 🔒 自动检查

| 阶段           | 检查内容               |
| -------------- | ---------------------- |
| **pre-commit** | lint-staged + 类型检查 |
| **pre-push**   | 代码规范 + 测试 + 构建 |
| **commit-msg** | 提交信息格式验证       |

## ⚠️ 问题解决

```bash
# 代码格式问题
yarn format

# 代码规范问题
yarn lint

# 类型错误
yarn type-check

# 测试失败
yarn test

# 紧急跳过检查 (不推荐)
git commit --no-verify
git push --no-verify
```

## 📦 发布流程

```bash
# 1. 更新版本
yarn version [patch|minor|major]

# 2. 发布 (会自动运行 prepublishOnly 检查)
yarn publish
```
