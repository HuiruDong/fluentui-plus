import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsResultSchemam, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';

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
