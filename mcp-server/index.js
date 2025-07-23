import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
// node 文件操作
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// 代码分析
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

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

// 辅助函数：从 AST 中提取 Props 信息，只负责解析 props，支持多种命名方式
// 这里的解析不用 async ，是因为没有异步操作，不需要读取文件内容，ast 本身就是一个已经解析好的 js 对象
function extractPropsFromAST(ast, componentName) {
  const componentInfo = { name: componentName, props: [], hasChildren: false };

  // 支持的 Props 命名模式
  const possiblePropsNames = [
    `${componentName}Props`, // SelectProps
    'ComponentProps', // 统一命名
    'Props', // 简化命名 (可选)
  ];

  traverse.default(ast, {
    TSInterfaceDeclaration(path) {
      // 检查是否匹配任何一种命名模式
      if (possiblePropsNames.includes(path.node.id.name)) {
        path.node.body.body.forEach(prop => {
          if (prop.type === 'TSPropertySignature' && prop.key.name) {
            componentInfo.props.push({
              name: prop.key.name,
              required: !prop.optional,
              type: 'any',
            });

            if (prop.key.name === 'children') {
              componentInfo.hasChildren = true;
            }
          }
        });
      }
    },
  });

  return componentInfo;
}

// 组件分析的函数，因为生成 Demo、测试、Story 都需要知道组件的结构（有哪些 props、类型是什么等），只负责查找 props，支持在多个文件内查找，找到了之后会去调用 extractPropsFromAST 返回 ast 解析结果
async function analyzeComponent(componentName) {
  try {
    const componentDir = path.join(__dirname, '..', 'src', 'components', componentName);

    // 要尝试的文件列表（按优先级）
    const filesToTry = [
      `${componentName}.tsx`, // 主组件文件
      'types.ts', // 类型定义文件
      'index.ts', // 索引文件
    ];

    let componentInfo = { name: componentName, props: [], hasChildren: false };

    // 依次尝试每个文件
    for (const fileName of filesToTry) {
      try {
        const filePath = path.join(componentDir, fileName);
        const code = await fs.readFile(filePath, 'utf-8');

        // 解析代码
        const ast = parse(code, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx'],
        });

        // 提取 Props 信息
        const result = extractPropsFromAST(ast, componentName);

        // 如果找到了 Props，就使用这个结果
        if (result.props.length > 0) {
          componentInfo = result;
          console.log(`✅ 在 ${fileName} 中找到了 Props 定义`);
          break; // 找到了就停止查找
        }
      } catch (fileError) {
        // 文件不存在或读取失败，继续尝试下一个
        console.log(`⚠️  无法读取 ${fileName}:`, fileError.message);
        continue;
      }
    }

    return componentInfo;
  } catch (error) {
    console.error('分析组件失败:', error);
    return null;
  }
}

// 定义工具列表，告诉 copilot 我都能做什么，也就是在门口贴个菜单，告诉顾客【我有什么】
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_component',
        description: '分析组件结构，获取 props 等信息',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '组件名称',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'create_smart_demo',
        description: '基于组件分析，智能创建 Demo 文件',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '组件名称',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'create_test_file',
        description: '基于组件分析，智能创建测试文件',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '组件名称',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'create_story_file',
        description: '基于组件分析，智能创建 Storybook 文件',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: '组件名称',
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

  if (toolName === 'analyze_component') {
    const componentInfo = await analyzeComponent(args.name);

    if (!componentInfo) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ 无法分析组件 ${args.name}，请确认组件文件存在`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `✅ 组件分析完成！

组件名：${componentInfo.name}
Props 数量：${componentInfo.props.length}
${componentInfo.props.map(p => `- ${p.name}${p.required ? ' (必需)' : ' (可选)'}`).join('\n')}
支持 children：${componentInfo.hasChildren ? '是' : '否'}`,
        },
      ],
    };
  }

  if (toolName === 'create_smart_demo') {
    // 调用函数分析组件
    const componentInfo = await analyzeComponent(args.name);

    if (!componentInfo) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ 无法创建 Demo，组件分析失败`,
          },
        ],
      };
    }

    // 基于组件信息生成更智能的 Demo
    const demoContent = `import React from 'react';
import { ${componentInfo.name} } from '../src/components';

const ${componentInfo.name}Demo = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>${componentInfo.name} 组件演示</h2>

      <h3>基础用法</h3>
      <${componentInfo.name}${componentInfo.hasChildren ? `>基础内容</${componentInfo.name}>` : ' />'}

      ${
        componentInfo.props.length > 0
          ? `<h3>不同属性</h3>
      ${componentInfo.props
        .filter(p => p.name !== 'children')
        .map(
          prop =>
            `<${componentInfo.name} ${prop.name}="示例值"${componentInfo.hasChildren ? `>${prop.name} 示例</${componentInfo.name}>` : ' />'}`
        )
        .join('\n      ')}`
          : ''
      }
    </div>
  );
};
export default ${componentInfo.name}Demo;`;

    // 写入文件
    const demoDir = path.join(__dirname, '..', 'demo');
    await fs.mkdir(demoDir, { recursive: true });
    const demoPath = path.join(demoDir, `${componentInfo.name}Demo.tsx`);
    await fs.writeFile(demoPath, demoContent);

    return {
      content: [
        {
          type: 'text',
          text: `✅ 智能 Demo 文件已创建！

基于分析结果：
- 检测到 ${componentInfo.props.length} 个属性
- ${componentInfo.hasChildren ? '支持 children' : '不支持 children'}
- 为每个属性生成了示例

文件位置：${demoPath}`,
        },
      ],
    };
  }

    if (toolName === 'create_test_file') {
    // 获取组件详情
    const componentInfo = await analyzeComponent(args.name);
    if (!componentInfo) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ 无法创建测试文件，组件分析失败`,
          },
        ],
      };
    }

    // 生成测试内容
    const testContent = `import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ${componentInfo.name} from '../${componentInfo.name}';

// Mock FluentUI components
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' '),
}));

describe('${componentInfo.name} Component', () => {
  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<${componentInfo.name}${componentInfo.hasChildren ? '>Test Content</' + componentInfo.name + '>' : ' />'});
      ${
        componentInfo.hasChildren
          ? `expect(screen.getByText('Test Content')).toBeInTheDocument();`
          : `expect(screen.getByRole('${componentInfo.name.toLowerCase()}')).toBeInTheDocument();`
      }
    });

    ${
      componentInfo.hasChildren
        ? `
    it('should render children correctly', () => {
      render(<${componentInfo.name}>Child Content</${componentInfo.name}>);
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });`
        : ''
    }

    it('should apply custom className', () => {
      render(<${componentInfo.name} className="custom-class"${componentInfo.hasChildren ? '>Content</' + componentInfo.name + '>' : ' />'});
      // Add specific className test based on component structure
    });

    it('should apply custom styles', () => {
      const customStyle = { fontSize: '16px', padding: '8px' };
      render(<${componentInfo.name} style={customStyle}${componentInfo.hasChildren ? '>Content</' + componentInfo.name + '>' : ' />'});
      // Add specific style test based on component structure
    });
  });

  ${
    componentInfo.props.filter(p => p.name !== 'children' && p.name !== 'className' && p.name !== 'style').length > 0
      ? `
  describe('属性测试', () => {
    ${componentInfo.props
      .filter(p => p.name !== 'children' && p.name !== 'className' && p.name !== 'style')
      .map(
        prop => `
    it('should handle ${prop.name} prop correctly', () => {
      render(<${componentInfo.name} ${prop.name}={${prop.name === 'onClick' ? 'jest.fn()' : '"test-value"'}}${componentInfo.hasChildren ? '>Content</' + componentInfo.name + '>' : ' />'});
      // Add specific ${prop.name} test logic
    });`
      )
      .join('')}
  });`
      : ''
  }

  describe('交互测试', () => {
    ${
      componentInfo.props.some(p => p.name.startsWith('on'))
        ? `
    it('should handle user interactions', async () => {
      const user = userEvent.setup();
      const mockHandler = jest.fn();

      render(<${componentInfo.name} ${componentInfo.props.find(p => p.name.startsWith('on'))?.name}={mockHandler}${componentInfo.hasChildren ? '>Content</' + componentInfo.name + '>' : ' />'});

      // Add interaction test logic
      // Example: await user.click(screen.getByRole('button'));
      // expect(mockHandler).toHaveBeenCalled();
    });`
        : `
    it('should be accessible', () => {
      render(<${componentInfo.name}${componentInfo.hasChildren ? '>Content</' + componentInfo.name + '>' : ' />'});
      // Add accessibility tests
    });`
    }
  });
});`;

    // 写入文件
    const testDir = path.join(__dirname, '..', 'src', 'components', componentInfo.name, '__tests__');
    await fs.mkdir(testDir, { recursive: true });
    const testPath = path.join(testDir, `${componentInfo.name}.test.tsx`);
    await fs.writeFile(testPath, testContent);

    return {
      content: [
        {
          type: 'text',
          text: `✅ 测试文件已创建！

基于分析结果生成了：
- 基础渲染测试
- Props 测试 (${componentInfo.props.length} 个属性)
- 交互测试模板
${componentInfo.hasChildren ? '- Children 内容测试' : ''}

文件位置：${testPath}

💡 提示：生成的是测试骨架，你可能需要根据组件的具体行为调整测试逻辑。`,
        },
      ],
    };
  }

    if (toolName === 'create_story_file') {
    // 获取组件详情
    const componentInfo = await analyzeComponent(args.name);
    if (!componentInfo) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ 无法创建 Story，组件分析失败`,
          },
        ],
      };
    }

    // 生成 Storybook 内容
    const storyContent = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentInfo.name} } from '../src/components';

const meta: Meta<typeof ${componentInfo.name}> = {
  title: 'Components/${componentInfo.name}',
  component: ${componentInfo.name},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // 自动生成的控制项
    ${componentInfo.props
      .filter(p => p.name !== 'children')
      .map(prop => `${prop.name}: { control: 'text' },`)
      .join('\n    ')}
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ${componentInfo.hasChildren ? "children: '默认内容'," : ''}
  },
};

${componentInfo.props
  .filter(p => p.name !== 'children' && p.name !== 'className' && p.name !== 'style')
  .map(
    prop => `
export const With${prop.name.charAt(0).toUpperCase() + prop.name.slice(1)}: Story = {
  args: {
    ${prop.name}: '示例值',
    ${componentInfo.hasChildren ? "children: '带 " + prop.name + " 的内容'," : ''}
  },
};`
  )
  .join('\n')}`;

    const storiesDir = path.join(__dirname, '..', 'stories');
    await fs.mkdir(storiesDir, { recursive: true });
    const storyPath = path.join(storiesDir, `${componentInfo.name}.stories.tsx`);
    await fs.writeFile(storyPath, storyContent);

    return {
      content: [
        {
          type: 'text',
          text: `✅ Storybook 文件已创建！

基于分析结果生成了：
- 基础 Story (Default)
- ${componentInfo.props.filter(p => p.name !== 'children' && p.name !== 'className' && p.name !== 'style').length} 个属性变体 Story
- 自动配置了控制项

文件位置：${storyPath}`,
        },
      ],
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
