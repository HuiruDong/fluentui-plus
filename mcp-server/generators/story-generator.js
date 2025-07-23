import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeComponent } from '../utils/ast-analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 核心函数：创建 Storybook 文件
 */
export async function createStoryFileCore(componentName) {
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

    const storiesDir = path.join(__dirname, '..', '..', 'stories');
    await fs.mkdir(storiesDir, { recursive: true });
    const storyPath = path.join(storiesDir, `${componentInfo.name}.stories.tsx`);
    await fs.writeFile(storyPath, storyContent);

    return { success: true, path: storyPath, componentInfo };
  } catch (error) {
    console.error('创建 Storybook 文件失败:', error);
    return { success: false, error: error.message };
  }
}
