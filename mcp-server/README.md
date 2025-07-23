# MCP Server 文件结构说明

重构后的 MCP 服务器采用模块化设计，将原本的单一文件拆分为多个功能模块：

## 📁 文件结构

```
mcp-server/
├── index.js                    # 主入口文件（服务器启动和路由）
├── package.json                # 依赖配置
├── config/                     # 配置模块
│   └── tools-config.js         # 工具配置定义
├── utils/                      # 工具模块
│   └── ast-analyzer.js         # AST 分析器（组件分析）
├── generators/                 # 生成器模块
│   ├── demo-generator.js       # Demo 文件生成器
│   ├── test-generator.js       # 测试文件生成器
│   └── story-generator.js      # Storybook 文件生成器
└── handlers/                   # 处理器模块
    └── tool-handlers.js        # 工具调用处理器
```

## 🔧 模块说明

### 1. `index.js` - 主入口文件

- 服务器初始化和启动
- 路由配置
- 最小化的核心逻辑

### 2. `config/tools-config.js` - 工具配置

- 定义所有可用工具的配置
- 包含工具名称、描述和输入模式

### 3. `utils/ast-analyzer.js` - AST 分析器

- `extractPropsFromAST()` - 从 AST 提取 Props 信息
- `analyzeComponent()` - 组件结构分析

### 4. `generators/` - 生成器模块

- `demo-generator.js` - 智能 Demo 文件生成
- `test-generator.js` - 测试文件生成
- `story-generator.js` - Storybook 文件生成

### 5. `handlers/tool-handlers.js` - 工具处理器

- 所有工具调用的处理逻辑
- 统一的错误处理和响应格式
- 工具路由分发

## ✨ 重构优势

1. **模块化**: 每个模块职责单一，便于维护和测试
2. **可扩展**: 添加新功能只需在对应模块中扩展
3. **代码复用**: 公共逻辑可以在模块间共享
4. **可读性**: 代码结构清晰，便于理解和协作
5. **测试友好**: 每个模块可以独立测试

## 🚀 使用方式

所有原有功能保持不变，使用方式完全一致：

```bash
# 启动服务器
node index.js

# 或通过 VS Code 的 MCP 扩展使用
```

所有工具调用接口和返回格式都与重构前保持一致。
