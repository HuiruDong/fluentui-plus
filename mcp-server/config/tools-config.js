/**
 * 工具配置定义
 */
export const toolsConfig = [
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
];
