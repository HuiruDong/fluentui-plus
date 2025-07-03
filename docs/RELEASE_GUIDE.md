# 自动发布设置指南

本项目已配置 GitHub Actions 自动发布流程。当推送版本标签时，会自动触发构建和发布到 npm。

## 设置步骤

### 1. 配置 npm token

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 点击头像 → Access Tokens → Generate New Token
3. 选择 "Granular" 类型的 token
4. 复制生成的 token

### 2. 在 GitHub 中添加 secrets

1. 进入你的 GitHub 仓库
2. 点击 Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 添加以下 secret：
   - Name: `NPM_TOKEN`
   - Value: 你的 npm token

### 3. 确保包名可用

确保 `package.json` 中的包名在 npm 上是可用的：

```bash
npm view fluentui-plus
```

如果返回 404，说明包名可用。

## 发布流程

### 方法一：使用发布脚本（推荐）

```bash
# 发布补丁版本 (0.1.0 → 0.1.1)
yarn release:patch

# 发布次要版本 (0.1.0 → 0.2.0)
yarn release:minor

# 发布主要版本 (0.1.0 → 1.0.0)
yarn release:major

# 或者直接指定版本号
yarn release 1.2.3
```

### 方法二：手动打标签

```bash
# 更新版本号
npm version patch  # 或 minor, major

# 推送代码和标签
git push origin main
git push origin --tags
```

### 方法三：直接创建标签

```bash
# 手动创建标签
git tag v0.1.1
git push origin v0.1.1
```

## 工作流说明

### CI 工作流 (`.github/workflows/ci.yml`)

- 触发条件：推送到 main/develop 分支或创建 PR
- 执行内容：
  - 多版本 Node.js 测试 (20.x)
  - 代码检查 (lint、format、type-check)
  - 运行测试
  - 构建验证

### 发布工作流 (`.github/workflows/release.yml`)

- 触发条件：推送版本标签 (v*.*.*)
- 执行内容：
  - 代码检查和测试
  - 构建项目
  - 发布到 npm
  - 创建 GitHub Release

## 发布前检查清单

- [ ] 代码已合并到 main 分支
- [ ] 所有测试通过
- [ ] 更新了 CHANGELOG.md
- [ ] 确认版本号正确
- [ ] npm token 已配置

## 常见问题

### Q: 发布失败，提示权限错误
A: 检查 NPM_TOKEN 是否正确配置，并且 token 有发布权限。

### Q: 包名已存在
A: 修改 `package.json` 中的包名，或者使用 scoped package（如 `@username/fluentui-plus`）。

### Q: 如何发布 beta 版本？
A: 使用预发布标签：
```bash
npm version prerelease --preid=beta
git push origin main --tags
```

### Q: 如何撤销发布？
A: npm 发布后 72 小时内可以撤销：
```bash
npm unpublish package-name@version
```

## 版本策略

遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范：

- **patch** (0.1.0 → 0.1.1)：修复 bug
- **minor** (0.1.0 → 0.2.0)：新增功能，向后兼容
- **major** (0.1.0 → 1.0.0)：重大变更，可能不向后兼容

## 监控发布状态

- 在 GitHub Actions 页面查看构建状态
- 在 npm 页面确认包已发布
- 检查 GitHub Releases 页面

发布成功后，用户可以通过以下方式安装：

```bash
npm install fluentui-plus
# 或
yarn add fluentui-plus
```
