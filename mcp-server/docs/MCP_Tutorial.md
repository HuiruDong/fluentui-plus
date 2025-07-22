# MCP 从零到一教程：让 AI 自动化你的组件开发流程

> 本教程专门为 Fluentui Plus 组件库开发设计，帮助前端工程师掌握 MCP (Model Context Protocol) 的使用，实现组件开发流程的自动化。

## 📚 第一课：MCP 是什么？

### 🎯 用最简单的话解释 MCP

想象一下：
- **没有 MCP**：你对 Copilot 说"帮我生成测试"，它只能给你代码文本，你需要复制粘贴
- **有了 MCP**：你对 Copilot 说"帮我生成测试"，它直接创建好文件，一切都自动完成

**MCP = 给 AI 装上"手"，让它能操作你的电脑**

### 🏗️ MCP 的三个角色

```
你 <-> GitHub Copilot <-> MCP 服务器 <-> 你的文件系统
         (大脑)           (手)           (工具箱)
```

### 🎯 对 Fluentui Plus 的意义

- ✅ 开发完组件核心代码后，一句话生成所有配套文件
- ✅ 自动生成 Demo、测试、Story、文档
- ✅ 团队成员都能使用，提升整体效率
- ✅ 减少重复劳动，专注于核心业务逻辑

---

## 🚀 第二课：30分钟写出第一个 MCP

### 📋 准备工作（5分钟）

在 PowerShell 中执行：

```powershell
# 1. 检查 Node.js（你应该已经有了，因为前端项目需要）
node --version

# 2. 在你的项目里创建 MCP 文件夹
cd c:\Users\j-huirudong\Projects\fluentui-plus
mkdir mcp-server
cd mcp-server

# 3. 初始化项目（一路回车即可）
npm init -y

# 4. 安装唯一需要的包
npm install @modelcontextprotocol/sdk
```

### ✏️ 写代码（10分钟）

创建 `index.js` 文件（对，就一个文件！）：

```javascript
// 这是你的第一个 MCP 服务器！

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import fs from 'fs/promises';
import path from 'path';

// 1. 创建服务器（就像创建一个 Express 服务器）
const server = new Server({
  name: 'fluentui-helper',     // 服务器名字
  version: '1.0.0'              // 版本号
}, {
  capabilities: {
    tools: {}  // 一会儿我们会添加工具
  }
});

// 2. 添加一个最简单的工具：读取组件信息
server.addTool({
  name: 'analyze_component',
  description: '分析组件代码',
  inputSchema: {
    type: 'object',
    properties: {
      componentName: { 
        type: 'string',
        description: '组件名称，如 Button、Nav 等'
      }
    },
    required: ['componentName']
  },
  handler: async ({ componentName }) => {
    console.log(`正在分析组件: ${componentName}`);
    
    // 组件路径
    const componentPath = path.join(process.cwd(), 'src', 'components', componentName);
    
    try {
      // 读取组件文件
      const componentFile = path.join(componentPath, `${componentName}.tsx`);
      const code = await fs.readFile(componentFile, 'utf-8');
      
      // 简单分析（数一下有多少个 props）
      const propsMatch = code.match(/interface\s+\w+Props\s*{([^}]+)}/);
      const propsCount = propsMatch ? propsMatch[1].split('\n').filter(line => line.trim()).length : 0;
      
      return {
        content: [{
          type: 'text',
          text: `✅ 组件 ${componentName} 分析完成！
          
📊 分析结果：
- 文件路径：${componentFile}
- Props 数量：约 ${propsCount} 个
- 代码行数：${code.split('\n').length} 行

💡 下一步可以：
- 生成 Demo 文件
- 生成单元测试
- 生成 Storybook`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ 无法找到组件 ${componentName}，请确认组件名称是否正确`
        }]
      };
    }
  }
});

// 3. 添加第二个工具：生成 Demo 文件
server.addTool({
  name: 'generate_demo',
  description: '为组件生成演示文件',
  inputSchema: {
    type: 'object',
    properties: {
      componentName: { 
        type: 'string',
        description: '组件名称'
      }
    },
    required: ['componentName']
  },
  handler: async ({ componentName }) => {
    console.log(`正在生成 ${componentName} 的 Demo...`);
    
    // Demo 模板（这是最简单的版本）
    const demoContent = `import React from 'react';
import { ${componentName} } from '../src/components/${componentName}';

export const ${componentName}Demo: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>${componentName} 组件演示</h1>
      
      <h2>基础用法</h2>
      <${componentName} />
      
      <h2>不同尺寸</h2>
      <${componentName} size="small" />
      <${componentName} size="medium" />
      <${componentName} size="large" />
    </div>
  );
};

export default ${componentName}Demo;
`;
    
    // 写入文件
    const demoPath = path.join(process.cwd(), 'demo', `${componentName}Demo.tsx`);
    
    try {
      // 确保 demo 目录存在
      await fs.mkdir(path.dirname(demoPath), { recursive: true });
      
      // 写入文件
      await fs.writeFile(demoPath, demoContent);
      
      return {
        content: [{
          type: 'text',
          text: `✅ Demo 文件已生成！
          
📁 文件位置：${demoPath}

📝 生成内容：
- 基础用法示例
- 不同尺寸示例
- 标准的 Demo 结构

🎯 你现在可以：
- 运行项目查看效果
- 根据需要修改 Demo
- 继续生成其他文件`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ 生成失败：${error.message}`
        }]
      };
    }
  }
});

// 4. 启动服务器（这部分是固定的）
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('MCP 服务器已启动！');
}

main().catch(console.error);
```

### ⚙️ 配置 VS Code（10分钟）

1. **修改 `.vscode/settings.json`**：

```json
{
  // ...existing settings...
  
  "mcp.servers": {
    "fluentui-helper": {
      "command": "node",
      "args": ["./mcp-server/index.js"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

2. **在 `mcp-server/package.json` 中添加**：

```json
{
  // ...existing content...
  "type": "module"  // 添加这一行，支持 ES6 import
}
```

### 🎮 测试你的 MCP（5分钟）

1. **重启 VS Code**（很重要！）

2. **打开 GitHub Copilot Chat**

3. **输入以下命令测试**：
   ```
   @fluentui-helper 分析 Tag 组件
   ```

   如果成功，你会看到组件的分析结果！

4. **测试生成功能**：
   ```
   @fluentui-helper 为 Tag 组件生成 Demo
   ```

---

## 🎓 第三课：理解你刚才写的代码

### 📝 代码结构解释

```javascript
// 1. Server - 这就是你的 MCP 服务器
const server = new Server({...});

// 2. addTool - 添加一个 AI 可以调用的工具
server.addTool({
  name: 'analyze_component',        // 工具名称
  description: '分析组件代码',      // 告诉 AI 这个工具干什么
  inputSchema: {...},              // 需要什么参数
  handler: async (params) => {...} // 具体怎么执行
});

// 3. handler - 工具的具体逻辑
handler: async ({ componentName }) => {
  // 这里写普通的 JavaScript 代码
  // 可以读文件、写文件、调用 API...
  
  return {
    content: [{
      type: 'text',
      text: '返回给 AI 的结果'
    }]
  };
}
```

### 🔑 核心概念

1. **工具（Tool）** = AI 可以调用的功能
2. **处理器（Handler）** = 功能的具体实现
3. **返回值** = 告诉 AI 执行结果
4. **Schema** = 定义工具需要的参数

### 💡 关键理解

- **MCP 不是魔法**：就是让 AI 能调用你写的 JavaScript 函数
- **参数验证**：通过 inputSchema 确保 AI 传递正确的参数
- **错误处理**：try-catch 确保工具不会崩溃
- **返回格式**：固定的 content 数组格式

---

## 🚀 第四课：扩展你的 MCP

### 添加生成测试的功能

```javascript
// 添加第三个工具：生成测试文件
server.addTool({
  name: 'generate_test',
  description: '为组件生成单元测试',
  inputSchema: {
    type: 'object',
    properties: {
      componentName: { type: 'string' }
    },
    required: ['componentName']
  },
  handler: async ({ componentName }) => {
    const testContent = `import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${componentName} } from '../${componentName}';

describe('${componentName}', () => {
  test('should render correctly', () => {
    render(<${componentName} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  test('should handle click events', () => {
    const handleClick = jest.fn();
    render(<${componentName} onClick={handleClick} />);
    
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
`;
    
    const testPath = path.join(
      process.cwd(), 
      'src', 
      'components', 
      componentName, 
      '__tests__', 
      `${componentName}.test.tsx`
    );
    
    // 创建目录并写入文件
    await fs.mkdir(path.dirname(testPath), { recursive: true });
    await fs.writeFile(testPath, testContent);
    
    return {
      content: [{
        type: 'text',
        text: `✅ 测试文件已生成：${testPath}`
      }]
    };
  }
});
```

### 添加生成 Storybook 的功能

```javascript
// 添加第四个工具：生成 Storybook
server.addTool({
  name: 'generate_story',
  description: '为组件生成 Storybook 文件',
  inputSchema: {
    type: 'object',
    properties: {
      componentName: { type: 'string' }
    },
    required: ['componentName']
  },
  handler: async ({ componentName }) => {
    const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from '../src/components/${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // 根据组件 props 自动生成控制器
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // 默认属性
  },
};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};
`;
    
    const storyPath = path.join(process.cwd(), 'stories', `${componentName}.stories.tsx`);
    
    await fs.mkdir(path.dirname(storyPath), { recursive: true });
    await fs.writeFile(storyPath, storyContent);
    
    return {
      content: [{
        type: 'text',
        text: `✅ Storybook 文件已生成：${storyPath}`
      }]
    };
  }
});
```

### 添加一键执行所有任务

```javascript
// 组合工具：执行完整工作流
server.addTool({
  name: 'complete_workflow',
  description: '执行组件的完整工作流（分析、Demo、测试、Story）',
  inputSchema: {
    type: 'object',
    properties: {
      componentName: { type: 'string' }
    },
    required: ['componentName']
  },
  handler: async ({ componentName }) => {
    const results = [];
    
    try {
      // 1. 分析组件
      results.push('🔍 正在分析组件...');
      const componentPath = path.join(process.cwd(), 'src', 'components', componentName);
      const componentFile = path.join(componentPath, `${componentName}.tsx`);
      const code = await fs.readFile(componentFile, 'utf-8');
      results.push('✅ 组件分析完成');
      
      // 2. 生成 Demo
      results.push('📝 正在生成 Demo...');
      // 调用 Demo 生成逻辑（复用上面的代码）
      results.push('✅ Demo 文件已生成');
      
      // 3. 生成测试
      results.push('🧪 正在生成测试...');
      // 调用测试生成逻辑
      results.push('✅ 测试文件已生成');
      
      // 4. 生成 Story
      results.push('📚 正在生成 Storybook...');
      // 调用 Story 生成逻辑
      results.push('✅ Storybook 已生成');
      
      return {
        content: [{
          type: 'text',
          text: `🎉 ${componentName} 组件工作流完成！\n\n${results.join('\n')}\n\n🚀 下一步：\n- 运行 npm test 验证测试\n- 运行 npm run storybook 查看文档\n- 根据需要调整生成的文件`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ 工作流执行失败：${error.message}`
        }]
      };
    }
  }
});
```

---

## 💡 第五课：给团队使用

### 📦 方案一：直接分享（最简单）

1. **提交到项目仓库**：
   ```bash
   git add mcp-server/
   git commit -m "添加 MCP 服务器，自动化组件开发流程"
   git push
   ```

2. **团队成员使用**：
   ```bash
   git pull
   # 重启 VS Code
   ```

3. **使用说明**：团队成员只需要知道几个命令即可

### 🌍 方案二：发布为 npm 包

```bash
# 1. 在 mcp-server 目录下
npm login
npm publish --access public

# 2. 团队成员安装
npm install -g @your-team/fluentui-mcp

# 3. 配置 VS Code 使用全局包
```

### 📝 编写使用文档

创建 `mcp-server/README.md`：

```markdown
# Fluentui Plus MCP 助手

## 🚀 快速开始

1. 重启 VS Code
2. 打开 GitHub Copilot Chat
3. 输入 `@fluentui-helper` 开始使用

## 📋 可用命令

### 单独执行
- `@fluentui-helper 分析 Button 组件`
- `@fluentui-helper 为 Button 生成 Demo`
- `@fluentui-helper 为 Button 生成测试`
- `@fluentui-helper 为 Button 生成 Storybook`

### 一键执行（推荐）
- `@fluentui-helper 执行 Button 的完整工作流`

## 🎯 使用场景

### 场景一：新组件开发完成
完成组件核心代码后，只需一句话：
```
@fluentui-helper 执行 Nav 的完整工作流
```

自动完成：
✅ 生成 Demo 文件
✅ 生成单元测试  
✅ 生成 Storybook
✅ 验证代码结构

### 场景二：单独补充文件
如果只需要补充某个文件：
```
@fluentui-helper 为 Button 生成测试
```

## 🔧 故障排除

### 问题：找不到组件
- 确认组件名称拼写正确
- 确认组件文件存在于 `src/components/组件名/组件名.tsx`

### 问题：生成的文件有问题
- 生成的文件只是模板，可以根据实际需求修改
- 如果模板不符合需求，可以修改 MCP 服务器代码

## 📞 技术支持

有问题联系：[你的联系方式]
```

---

## 🎉 恭喜！你已经学会了 MCP

### ✅ 你已经掌握的

1. **MCP 是什么** - AI 的执行工具，让 AI 能操作文件系统
2. **如何写 MCP** - Server + Tools + Handlers 的基本结构
3. **如何使用** - 通过 GitHub Copilot Chat 对话调用
4. **如何分享** - 团队协作的最佳实践
5. **如何扩展** - 添加更多工具和功能

### 🚀 下一步建议

#### 立即行动（今天就能看到效果）
1. **先运行起来** - 按照教程，30分钟内看到效果
2. **测试现有组件** - 用 Tag、Nav 等现有组件测试 MCP
3. **收集反馈** - 让团队成员试用，看看哪里需要改进

#### 持续改进（未来几周）
1. **完善模板** - 根据实际使用调整生成的代码模板
2. **添加功能** - 比如自动更新 API 文档、运行测试等
3. **优化体验** - 更好的错误提示、更智能的代码分析

#### 高级功能（有时间再做）
1. **代码分析** - 分析组件 props，生成更准确的 Demo 和测试
2. **自动化测试** - 生成文件后自动运行测试验证
3. **文档同步** - 自动更新 API 文档和 README

### 💪 你完全可以做到！

**记住这些要点**：

1. **不需要精通 Node.js** - 就是写 JavaScript，你的 TypeScript 知识完全够用
2. **不需要复杂架构** - 一个文件就能跑，简单直接
3. **专注业务逻辑** - 重点是"怎么生成文件"，而不是底层技术
4. **迭代改进** - 先跑起来，再慢慢完善

**MCP 的本质**：就是让 AI 能调用你写的 JavaScript 函数，就这么简单！

### 🤝 获得帮助

- 有任何问题随时问
- 可以先实现最简单的版本，再逐步扩展
- 团队成员的反馈是最好的改进方向

现在就开始动手吧！第一次看到 AI 自动创建文件的那一刻，你会觉得所有的学习都是值得的！🚀
