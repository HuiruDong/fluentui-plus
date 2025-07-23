import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsResultSchemam, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径（ES 模块中的 __dirname）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建一个服务器，类似于创建 React 组件，挂上招牌，告诉别人我开店了
const server = new Server(
  {
    name: 'fluentui-plus', // 服务器的名称，和 mcp.json 中保持一致，也就是店铺名称
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {}, // 告诉 copilot 我能提供哪些工具
    },
  }
);

// 定义工具列表，告诉 copilot 我都能做什么，也就是在门口贴个菜单，告诉顾客【我有什么】
server.setRequestHandler(ListToolsResultSchemam, async () => {
  return {
    tools: [
      {
        name: 'say_hello', // 工具名称
        description: '打个招呼', // 工具描述，意图判断就是基于这个判断的
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '你的名字',
            },
          },
          required: ['name'],
        },
      },
       {
        name: 'create_demo', // 工具名称
        description: '创建组件的 Demo 文件', // 工具描述
        inputSchema: {
          // 需要什么参数
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '组件名，比如 Button',
            },
          },
          required: ['name'],
        },
      },
    ],
  };
});

// 实现工具功能，也就是 copilot 调用的时候执行
server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name: toolName, arguments: args } = request.params;

  // 开始实现具体的功能步骤
  if (toolName === 'say_hello') {
    return {
      content: [{ type: 'text', text: `你好 ${args.name}! 🎉 MCP 服务器正在运行！` }],
    };
  }

  // 开始实施创建 demo 文件的功能
    if (toolName === 'create_demo') {
    // 这里的捕获主要是用来捕获编译和运行时的错误
    try {
      const { name: componentName } = args;

      // 创建 Demo 文件内容，就是个模板
      const demoContent = `import React from 'react';
import { ${componentName} } from '../src/components';

const ${componentName}Demo = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>${componentName} 组件演示</h2>
      <${componentName}>这是 ${componentName} 组件</${componentName}>
    </div>
  );
};

export default ${componentName}Demo;`;

      // 确保 demo 目录存在
      const demoDir = path.join(__dirname, '..', 'demo');
      await fs.mkdir(demoDir, { recursive: true });

      // 写入文件
      const demoPath = path.join(demoDir, `${componentName}Demo.tsx`);
      await fs.writeFile(demoPath, demoContent);

      return {
        content: [
          {
            type: 'text',
            text: `✅ 已创建 ${componentName} 组件的 Demo 文件：${demoPath}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ 创建 Demo 文件失败：${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP 服务器已启动！');
}

// 运行
main().catch(error => {
  console.error('启动失败', error);
  process.exit(1);
});

/**
 * mcp.json
 *
 *     "fluentui-plus": {
      "type": "stdio",
      "command": "node",
      "args": [
        "C:/Users/j-huirudong/Projects/fluentui-plus/mcp-server/index.js" 文件路径
      ],
      "env": {}
    }
 */
