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

// 辅助函数：提取类型信息的辅助函数
function extractTypeInfo(typeAnnotation) {
  if (!typeAnnotation.typeAnnotation) return 'any';

  const type = typeAnnotation.typeAnnotation;

  switch (type.type) {
    case 'TSStringKeyword':
      return 'string';
    case 'TSNumberKeyword':
      return 'number';
    case 'TSBooleanKeyword':
      return 'boolean';
    case 'TSFunctionType':
      return 'function';
    case 'TSUnionType':
      return type.types.map(t => t.literal?.value || 'unknown').join(' | ');
    default:
      return 'any';
  }
}

// 简化版：智能依赖分类器
function classifyDependency(source) {
  // 简单三分类
  if (source.startsWith('@fluentui')) {
    return 'fluentui';
  } else if (source.startsWith('./') || source.startsWith('../')) {
    return 'local';
  } else {
    return 'external';
  }
}

// 辅助函数：从 AST 中提取 Props 信息，只负责解析 props，支持多种命名方式
// 这里的解析不用 async ，是因为没有异步操作，不需要读取文件内容，ast 本身就是一个已经解析好的 js 对象
function extractPropsFromAST(ast, componentName) {
  const componentInfo = {
    name: componentName,
    props: [],
    hasChildren: false,
    events: [], // 事件处理函数
    dependencies: [], // 所有依赖的模块
    icons: [], // 使用的图标
    defaultValues: {}, // 默认值
    hasState: false, // 是否有内部状态
    functions: [], // 组件内的函数
    // 简化的三分类依赖
    dependencyAnalysis: {
      fluentui: [], // @fluentui 相关
      local: [], // 本地依赖 (./ 或 ../ 开头)
      external: [], // 第三方库
    },
  };

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
            // 先创建 propInfo 对象
            const propInfo = {
              name: prop.key.name,
              required: !prop.optional,
              type: 'any',
            };

            // 分析 prop 类型信息
            if (prop.typeAnnotation) {
              propInfo.type = extractTypeInfo(prop.typeAnnotation);
            }

            // 只添加一次到数组中
            componentInfo.props.push(propInfo);

            if (prop.key.name === 'children') {
              componentInfo.hasChildren = true;
            }

            // 检测事件处理函数
            if (prop.key.name.startsWith('on')) {
              componentInfo.events.push(prop.key.name);
            }
          }
        });
      }
    },

    // 简化的依赖分析
    ImportDeclaration(path) {
      const source = path.node.source.value;
      const dependencyType = classifyDependency(source);

      // 收集图标（只从 @fluentui/react-icons 收集）
      if (source.includes('@fluentui/react-icons')) {
        path.node.specifiers.forEach(spec => {
          if (spec.imported) {
            componentInfo.icons.push(spec.imported.name);
          }
        });
      }

      // 按三分类存储
      componentInfo.dependencyAnalysis[dependencyType].push(source);

      // 保留原有的总依赖列表
      if (!componentInfo.dependencies.includes(source)) {
        componentInfo.dependencies.push(source);
      }
    },

    // 检测 useState 等状态管理
    CallExpression(path) {
      if (path.node.callee.name === 'useState') {
        componentInfo.hasState = true;
      }
    },

    // 分析组件内的函数
    FunctionDeclaration(path) {
      if (path.node.id) {
        componentInfo.functions.push(path.node.id.name);
      }
    },
  });

  return componentInfo;
}

// 辅助函数：合并组件信息，将多个文件的分析结果合并
function mergeComponentInfo(base, additional) {
  // 如果 base 还没有 props，但 additional 有，则使用 additional 的 props
  if (base.props.length === 0 && additional.props.length > 0) {
    base.props = additional.props;
    base.hasChildren = additional.hasChildren;
    base.events = additional.events;
  }

  // 合并依赖信息（去重）
  additional.dependencies.forEach(dep => {
    if (!base.dependencies.includes(dep)) {
      base.dependencies.push(dep);
    }
  });

  // 合并分类依赖（去重）
  ['fluentui', 'local', 'external'].forEach(type => {
    additional.dependencyAnalysis[type].forEach(dep => {
      if (!base.dependencyAnalysis[type].includes(dep)) {
        base.dependencyAnalysis[type].push(dep);
      }
    });
  });

  // 合并图标（去重）
  additional.icons.forEach(icon => {
    if (!base.icons.includes(icon)) {
      base.icons.push(icon);
    }
  });

  // 合并函数（去重）
  additional.functions.forEach(func => {
    if (!base.functions.includes(func)) {
      base.functions.push(func);
    }
  });

  // 状态检测：只要有一个文件有状态，就标记为有状态
  if (additional.hasState) {
    base.hasState = true;
  }

  return base;
}

// 组件分析的函数 - 改进版：智能发现并分析所有相关文件
async function analyzeComponent(componentName) {
  try {
    const componentDir = path.join(__dirname, '..', 'src', 'components', componentName);

    // 🎯 智能文件发现：先扫描目录，再分析文件
    let filesToTry = [];

    try {
      // 获取组件目录下的所有文件
      const allFiles = await fs.readdir(componentDir);

      // 智能过滤和排序文件
      const tsxFiles = allFiles.filter(file => file.endsWith('.tsx'));
      const tsFiles = allFiles.filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'));

      // 按优先级排序：主组件 > 类型文件 > 其他组件文件 > 工具文件
      const prioritizedFiles = [
        // 1. 主组件文件（最高优先级）
        ...tsxFiles.filter(file => file === `${componentName}.tsx`),

        // 2. 类型定义文件
        ...tsFiles.filter(file => file === 'types.ts' || file === 'index.ts'),

        // 3. 其他 tsx 组件文件（可能是子组件）
        ...tsxFiles.filter(
          file => file !== `${componentName}.tsx` && file.includes(componentName) // 包含组件名的文件，如 NavItem.tsx
        ),

        // 4. 其他相关文件
        ...tsxFiles.filter(file => file !== `${componentName}.tsx` && !file.includes(componentName)),

        // 5. 工具文件
        ...tsFiles.filter(
          file =>
            file !== 'types.ts' &&
            file !== 'index.ts' &&
            (file === 'utils.ts' || file === 'constants.ts' || file === 'helpers.ts')
        ),
      ];

      filesToTry = [...new Set(prioritizedFiles)]; // 去重
      console.log(`🔍 发现 ${filesToTry.length} 个相关文件: ${filesToTry.join(', ')}`);
    } catch (dirError) {
      // 如果无法读取目录，回退到基础文件列表
      console.log(`⚠️  无法读取目录，使用默认文件列表: ${dirError.message}`);
      filesToTry = [`${componentName}.tsx`, 'types.ts', 'index.ts', 'utils.ts'];
    }

    // 初始化组件信息
    let componentInfo = {
      name: componentName,
      props: [],
      hasChildren: false,
      events: [],
      dependencies: [],
      icons: [],
      defaultValues: {},
      hasState: false,
      functions: [],
      dependencyAnalysis: {
        fluentui: [],
        local: [],
        external: [],
      },
    };

    let foundProps = false;
    let analyzedFiles = [];

    // 🔄 改进：分析所有文件，而不是找到 Props 就停止
    for (const fileName of filesToTry) {
      try {
        const filePath = path.join(componentDir, fileName);
        const code = await fs.readFile(filePath, 'utf-8');

        // 解析代码
        const ast = parse(code, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx'],
        });

        // 提取信息
        const result = extractPropsFromAST(ast, componentName);

        // 合并信息到主对象
        componentInfo = mergeComponentInfo(componentInfo, result);

        // 记录成功分析的文件
        analyzedFiles.push(fileName);

        // 标记是否找到了 Props
        if (result.props.length > 0 && !foundProps) {
          foundProps = true;
          console.log(`✅ 在 ${fileName} 中找到了 Props 定义`);
        }

        // 如果找到了依赖或其他信息，也记录
        if (result.dependencies.length > 0) {
          console.log(`📦 在 ${fileName} 中发现 ${result.dependencies.length} 个依赖`);
        }
      } catch (fileError) {
        // 文件不存在或读取失败，继续尝试下一个
        console.log(`⚠️  跳过 ${fileName}: ${fileError.message}`);
        continue;
      }
    }

    // 🎯 增强：也尝试分析 hooks 目录下的文件
    try {
      const hooksDir = path.join(componentDir, 'hooks');
      const hooksFiles = await fs.readdir(hooksDir);

      const hooksToAnalyze = hooksFiles.filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));

      for (const hookFile of hooksToAnalyze) {
        try {
          const hookPath = path.join(hooksDir, hookFile);
          const hookCode = await fs.readFile(hookPath, 'utf-8');
          const hookAST = parse(hookCode, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
          });

          const hookResult = extractPropsFromAST(hookAST, componentName);
          componentInfo = mergeComponentInfo(componentInfo, hookResult);
          analyzedFiles.push(`hooks/${hookFile}`);

          if (hookResult.dependencies.length > 0) {
            console.log(`🪝 在 hooks/${hookFile} 中发现 ${hookResult.dependencies.length} 个依赖`);
          }
        } catch (hookError) {
          console.log(`⚠️  跳过 hooks/${hookFile}: ${hookError.message}`);
        }
      }
    } catch (hooksError) {
      // hooks 目录不存在，这很正常
      console.log(`💡 无 hooks 目录，跳过 hooks 分析`);
    }

    // 🚀 增强：尝试分析其他可能的子目录（如 utils, constants 等）
    const subDirsToCheck = ['utils', 'constants', 'helpers'];
    for (const subDir of subDirsToCheck) {
      try {
        const subDirPath = path.join(componentDir, subDir);
        const subDirFiles = await fs.readdir(subDirPath);

        const relevantFiles = subDirFiles.filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));

        for (const subFile of relevantFiles) {
          try {
            const subFilePath = path.join(subDirPath, subFile);
            const subFileCode = await fs.readFile(subFilePath, 'utf-8');
            const subFileAST = parse(subFileCode, {
              sourceType: 'module',
              plugins: ['typescript', 'jsx'],
            });

            const subFileResult = extractPropsFromAST(subFileAST, componentName);
            componentInfo = mergeComponentInfo(componentInfo, subFileResult);
            analyzedFiles.push(`${subDir}/${subFile}`);

            if (subFileResult.dependencies.length > 0) {
              console.log(`📁 在 ${subDir}/${subFile} 中发现 ${subFileResult.dependencies.length} 个依赖`);
            }
          } catch (subFileError) {
            console.log(`⚠️  跳过 ${subDir}/${subFile}: ${subFileError.message}`);
          }
        }
      } catch (subDirError) {
        // 子目录不存在，继续检查下一个
        continue;
      }
    }

    console.log(`🎉 分析完成! 成功分析了 ${analyzedFiles.length} 个文件: ${analyzedFiles.join(', ')}`);

    // 如果没有找到任何有用信息，返回 null
    if (!foundProps && componentInfo.dependencies.length === 0) {
      console.log(`❌ 未找到组件 ${componentName} 的有效信息`);
      return null;
    }

    return componentInfo;
  } catch (error) {
    console.error('分析组件失败:', error);
    return null;
  }
}

// 核心函数：创建智能 Demo
async function createSmartDemoCore(componentName) {
  try {
    const componentInfo = await analyzeComponent(componentName);
    if (!componentInfo) {
      return { success: false, error: '组件分析失败' };
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

    return { success: true, path: demoPath, componentInfo };
  } catch (error) {
    console.error('创建 Demo 失败:', error);
    return { success: false, error: error.message };
  }
}

// 核心函数：创建测试文件
async function createTestFileCore(componentName) {
  try {
    const componentInfo = await analyzeComponent(componentName);
    if (!componentInfo) {
      return { success: false, error: '组件分析失败' };
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

    return { success: true, path: testPath, componentInfo };
  } catch (error) {
    console.error('创建测试文件失败:', error);
    return { success: false, error: error.message };
  }
}

// 核心函数：创建 Storybook 文件
async function createStoryFileCore(componentName) {
  try {
    const componentInfo = await analyzeComponent(componentName);
    if (!componentInfo) {
      return { success: false, error: '组件分析失败' };
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

    return { success: true, path: storyPath, componentInfo };
  } catch (error) {
    console.error('创建 Storybook 文件失败:', error);
    return { success: false, error: error.message };
  }
}

// 定义工具列表，告诉 copilot 我都能做什么，也就是在门口贴个菜单，告诉顾客【我有什么】
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'analyze_component',
        description: '深度分析组件结构，获取 props、依赖、功能等详细信息',
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
      {
        name: 'create_all_files',
        description: '一键创建组件的所有配套文件（Demo、测试、Storybook）',
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

📋 基础信息：
组件名：${componentInfo.name}
Props 数量：${componentInfo.props.length}
支持 children：${componentInfo.hasChildren ? '是' : '否'}

📝 Props 详情：
${componentInfo.props.map(p => `- ${p.name} (${p.type})${p.required ? ' *必需*' : ' *可选*'}`).join('\n')}

🎯 事件处理：
${componentInfo.events.length > 0 ? componentInfo.events.map(e => `- ${e}`).join('\n') : '无事件处理'}

🎨 使用的图标：
${componentInfo.icons.length > 0 ? componentInfo.icons.map(i => `- ${i}`).join('\n') : '无图标'}

⚙️ 组件特性：
- 有内部状态：${componentInfo.hasState ? '是' : '否'}
- 函数数量：${componentInfo.functions.length}

📦 依赖分析：
${componentInfo.dependencyAnalysis.fluentui.length > 0 ? `🔷 FluentUI: ${componentInfo.dependencyAnalysis.fluentui.slice(0, 3).join(', ')}${componentInfo.dependencyAnalysis.fluentui.length > 3 ? '...' : ''}\n` : ''}${componentInfo.dependencyAnalysis.local.length > 0 ? `📁 本地依赖: ${componentInfo.dependencyAnalysis.local.slice(0, 3).join(', ')}${componentInfo.dependencyAnalysis.local.length > 3 ? '...' : ''}\n` : ''}${componentInfo.dependencyAnalysis.external.length > 0 ? `📦 第三方库: ${componentInfo.dependencyAnalysis.external.slice(0, 3).join(', ')}${componentInfo.dependencyAnalysis.external.length > 3 ? '...' : ''}` : ''}`,
        },
      ],
    };
  }

  if (toolName === 'create_smart_demo') {
    const result = await createSmartDemoCore(args.name);

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ 无法创建 Demo，${result.error}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `✅ 智能 Demo 文件已创建！

基于分析结果：
- 检测到 ${result.componentInfo.props.length} 个属性
- ${result.componentInfo.hasChildren ? '支持 children' : '不支持 children'}
- 为每个属性生成了示例

文件位置：${result.path}`,
        },
      ],
    };
  }

  if (toolName === 'create_test_file') {
    const result = await createTestFileCore(args.name);

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ 无法创建测试文件，${result.error}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `✅ 测试文件已创建！

基于分析结果生成了：
- 基础渲染测试
- Props 测试 (${result.componentInfo.props.length} 个属性)
- 交互测试模板
${result.componentInfo.hasChildren ? '- Children 内容测试' : ''}

文件位置：${result.path}

💡 提示：生成的是测试骨架，你可能需要根据组件的具体行为调整测试逻辑。`,
        },
      ],
    };
  }

  if (toolName === 'create_story_file') {
    const result = await createStoryFileCore(args.name);

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ 无法创建 Story，${result.error}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `✅ Storybook 文件已创建！

基于分析结果生成了：
- 基础 Story (Default)
- ${result.componentInfo.props.filter(p => p.name !== 'children' && p.name !== 'className' && p.name !== 'style').length} 个属性变体 Story
- 自动配置了控制项

文件位置：${result.path}`,
        },
      ],
    };
  }

  if (toolName === 'create_all_files') {
    const results = {
      demo: false,
      test: false,
      story: false,
    };

    // 先分析组件
    const componentInfo = await analyzeComponent(args.name);

    if (!componentInfo) {
      return {
        content: [
          {
            type: 'text',
            text: `❌ 无法执行批量创建，组件分析失败`,
          },
        ],
      };
    }

    // 创建 Demo
    const demoResult = await createSmartDemoCore(args.name);
    results.demo = demoResult.success;

    // 创建测试
    const testResult = await createTestFileCore(args.name);
    results.test = testResult.success;

    // 创建 Storybook
    const storyResult = await createStoryFileCore(args.name);
    results.story = storyResult.success;

    return {
      content: [
        {
          type: 'text',
          text: `🎉 批量创建完成！

组件：${componentInfo.name}
✅ Demo 文件: ${results.demo ? '成功' : '失败'}
✅ 测试文件: ${results.test ? '成功' : '失败'}
✅ Storybook: ${results.story ? '成功' : '失败'}

🎯 分析亮点：
- 识别了 ${componentInfo.props.length} 个 Props
- 🔷 FluentUI 依赖: ${componentInfo.dependencyAnalysis.fluentui.length} 个
- 📁 本地依赖: ${componentInfo.dependencyAnalysis.local.length} 个
- 📦 第三方库: ${componentInfo.dependencyAnalysis.external.length} 个
- 检测到 ${componentInfo.icons.length} 个图标
- ${componentInfo.hasState ? '发现内部状态管理' : '无状态组件'}

所有文件已准备就绪！`,
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
