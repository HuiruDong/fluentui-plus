import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { analyzeComponent, smartAnalyzeComponent } from '../utils/smart-analyzer.js';
import { createSmartDemoCore } from '../generators/demo-generator.js';
import { createTestFileCore } from '../generators/test-generator.js';
import { createStoryFileCore } from '../generators/story-generator.js';

/**
 * 工具处理器 - 分析组件
 */
export async function handleAnalyzeComponent(args) {
  const componentInfo = await smartAnalyzeComponent(args.name);

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

  // 构建详细的分析报告
  const structureInfo = componentInfo.structure;
  const analysisReport = `✅ 智能组件分析完成！

🏗️ **组件结构分析**
组件名：${componentInfo.name}
组件类型：${
    componentInfo.analysisType === 'simple'
      ? '简单组件'
      : componentInfo.analysisType === 'moderate'
        ? '中等复杂度组件'
        : '复杂组件'
  }
主组件文件：${structureInfo.mainComponent}

📁 **文件构成**
- 子组件：${structureInfo.subComponents.length > 0 ? structureInfo.subComponents.join(', ') : '无'}
- Hooks：${structureInfo.hooks.length > 0 ? structureInfo.hooks.join(', ') : '无'}
- 工具函数：${structureInfo.utils.length > 0 ? structureInfo.utils.join(', ') : '无'}

🎯 **主组件Props (${componentInfo.mainProps.length}个)**
${componentInfo.mainProps.map(p => `- ${p.name}: ${p.type}${p.required ? ' (必需)' : ' (可选)'}`).join('\n')}

👶 **Children支持：** ${componentInfo.hasChildren ? '✅ 是' : '❌ 否'}

📊 **所有组件统计**
${componentInfo.allComponents
  .map(comp => `- ${comp.name}: ${comp.props.length}个props (${comp.isMain ? '主组件' : '子组件'})`)
  .join('\n')}

💡 **生成策略建议**
- Demo/Storybook：关注主组件 (${componentInfo.mainProps.length}个props)
- 测试文件：${componentInfo.analysisType === 'simple' ? '每个组件独立测试' : '主组件集成测试 + 子组件单元测试'}`;

  return {
    content: [
      {
        type: 'text',
        text: analysisReport,
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
