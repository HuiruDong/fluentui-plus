import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { analyzeComponent } from '../utils/ast-analyzer.js';
import { createSmartDemoCore } from '../generators/demo-generator.js';
import { createTestFileCore } from '../generators/test-generator.js';
import { createStoryFileCore } from '../generators/story-generator.js';

/**
 * 工具处理器 - 分析组件
 */
export async function handleAnalyzeComponent(args) {
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

  // 格式化 Props 信息
  const propsInfo =
    componentInfo.props.length > 0
      ? componentInfo.props
          .map(p => {
            const typeInfo = p.type ? ` (${p.type})` : '';
            const requiredMark = p.required ? ' ⭐' : '';
            const defaultValue = p.defaultValue ? ` = ${p.defaultValue}` : '';
            return `  • ${p.name}${typeInfo}${defaultValue}${requiredMark}`;
          })
          .join('\n')
      : '  无';

  // 格式化依赖信息
  const depsInfo =
    componentInfo.dependencies?.length > 0
      ? componentInfo.dependencies.map(dep => `  • ${dep}`).join('\n')
      : '  无外部依赖';

  // 格式化场景信息
  const scenariosInfo =
    componentInfo.scenarios?.length > 0
      ? componentInfo.scenarios.map(scenario => `  • ${scenario}`).join('\n')
      : '  基础用法';

  // 格式化复杂度信息
  const complexityIcon =
    {
      simple: '🟢',
      medium: '🟡',
      complex: '🔴',
    }[componentInfo.complexity] || '❓';

  return {
    content: [
      {
        type: 'text',
        text: `✅ 组件深度分析完成！

📋 **基础信息**
组件名称：${componentInfo.name}
组件类别：${componentInfo.category || '未分类'}
控制模式：${componentInfo.controlPattern || '未知'}
复杂度：${complexityIcon} ${componentInfo.complexity || '未知'}

🔧 **Props 分析** (${componentInfo.props.length} 个)
${propsInfo}

👶 **Children 支持**
${componentInfo.hasChildren ? '✅ 支持 children 属性' : '❌ 不支持 children 属性'}

📦 **依赖分析**
${depsInfo}

🎭 **推荐场景** (${componentInfo.scenarios?.length || 0} 个)
${scenariosInfo}

${
  componentInfo.hooks?.length > 0
    ? `🪝 **内置 Hooks**
${componentInfo.hooks.map(hook => `  • ${hook}`).join('\n')}

`
    : ''
}📊 **技术特征**
• TypeScript 支持：${componentInfo.hasTypeScript ? '✅' : '❌'}
• 样式系统：${componentInfo.styleSystem || '未知'}
• 测试覆盖：${componentInfo.testCoverage ? '✅' : '❓'}`,
      },
    ],
  };
}

/**
 * 工具处理器 - 创建 Demo
 */
export async function handleCreateSmartDemo(args) {
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

/**
 * 工具处理器 - 创建测试文件
 */
export async function handleCreateTestFile(args) {
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

/**
 * 工具处理器 - 创建 Storybook 文件
 */
export async function handleCreateStoryFile(args) {
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

/**
 * 工具处理器 - 批量创建所有文件
 */
export async function handleCreateAllFiles(args) {
  console.error('🔍 [DEBUG] create_all_files 开始执行');
  console.error('🔍 [DEBUG] 组件名称:', args.name);

  const results = {
    demo: false,
    test: false,
    story: false,
  };

  // 先分析组件
  const componentInfo = await analyzeComponent(args.name);
  console.error('🔍 [DEBUG] 组件分析结果:', componentInfo ? '成功' : '失败');

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

  // 创建 Demo - 直接调用核心函数
  console.error('🔍 [DEBUG] 开始创建 Demo...');
  const demoResult = await createSmartDemoCore(args.name);
  results.demo = demoResult.success;
  console.error('🔍 [DEBUG] Demo 创建结果:', results.demo ? '成功' : '失败');

  // 创建测试 - 直接调用核心函数
  console.error('🔍 [DEBUG] 开始创建测试文件...');
  const testResult = await createTestFileCore(args.name);
  results.test = testResult.success;
  console.error('🔍 [DEBUG] 测试文件创建结果:', results.test ? '成功' : '失败');

  // 创建 Storybook - 直接调用核心函数
  console.error('🔍 [DEBUG] 开始创建 Storybook...');
  const storyResult = await createStoryFileCore(args.name);
  results.story = storyResult.success;
  console.error('🔍 [DEBUG] Storybook 创建结果:', results.story ? '成功' : '失败');

  console.error('🔍 [DEBUG] 最终结果:', JSON.stringify(results));
  console.error('🔍 [DEBUG] 准备返回最终响应');

  return {
    content: [
      {
        type: 'text',
        text: `🎉 批量创建完成！

组件：${componentInfo.name}
✅ Demo 文件: ${results.demo ? '成功' : '失败'}
✅ 测试文件: ${results.test ? '成功' : '失败'}
✅ Storybook: ${results.story ? '成功' : '失败'}

所有文件已准备就绪！`,
      },
    ],
  };
}

/**
 * 工具路由器 - 根据工具名称分发到对应的处理器
 */
export async function handleToolCall(toolName, args) {
  switch (toolName) {
    case 'analyze_component':
      return await handleAnalyzeComponent(args);
    case 'create_smart_demo':
      return await handleCreateSmartDemo(args);
    case 'create_test_file':
      return await handleCreateTestFile(args);
    case 'create_story_file':
      return await handleCreateStoryFile(args);
    case 'create_all_files':
      return await handleCreateAllFiles(args);
    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${toolName}`);
  }
}
