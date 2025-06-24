# 贡献指南

首先，感谢你考虑为 FluentUI Plus 做出贡献！每一个贡献都会让这个组件库变得更好。

## 🐛 问题反馈

在提交新的问题报告前，请先检查是否已经存在类似的报告。提交问题时，请尽可能详细地描述以下信息：

- 问题的详细描述
- 复现步骤
- 预期行为和实际行为
- 截图（如果适用）
- 环境信息（浏览器版本、操作系统、Node.js 版本等）
- 可能的解决方案（如果你有）

## 🔀 提交 Pull Request

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'feat: add some amazing feature'`)
4. 将你的更改推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

### 分支命名规范

- `feature/*`: 新功能开发
- `fix/*`: 错误修复
- `docs/*`: 文档更新
- `style/*`: 代码样式调整（不影响代码运行的变动）
- `refactor/*`: 代码重构（不是新增功能，也不是修改 bug 的代码变动）
- `perf/*`: 性能优化
- `test/*`: 测试相关
- `chore/*`: 构建过程或辅助工具的变动

### Commit 消息规范

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范:

```
<类型>[可选 作用域]: <描述>

[可选 正文]

[可选 脚注]
```

常见类型:
- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更新
- `style`: 代码样式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

例如: `feat(button): add size prop to Button component`

## 📝 代码规范

- 使用 ESLint 和 Prettier 保持代码风格一致
- 遵循已有的代码风格和命名约定
- 为所有新功能编写测试
- 保证所有测试通过
- 更新相关文档

## 🔧 开发环境设置

按照 README 中的[本地开发](#本地开发)部分设置开发环境:

```bash
# 克隆仓库
git clone https://github.com/<your-username>/fluentui-plus.git

# 进入项目目录
cd fluentui-plus

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## ⚙️ 开发流程

1. 运行开发服务器: `npm run dev`
2. 编写代码和测试
3. 运行测试确保通过: `npm run test`
4. 构建项目确保无错误: `npm run build`

## 📢 沟通渠道

如果你有任何问题或建议，可以通过以下方式联系我们:

- [GitHub Issues](https://github.com/HuiruDong/fluentui-plus/issues)
- 电子邮件: [example@email.com](mailto:example@email.com)

## 📝 版权协议

通过向本项目提供代码，你同意将代码的版权授予本项目，代码将使用项目现有的 MIT 许可证。

再次感谢你的贡献！
