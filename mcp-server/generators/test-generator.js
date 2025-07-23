import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeComponent } from '../utils/ast-analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 核心函数：创建测试文件
 */
export async function createTestFileCore(componentName) {
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
    const testDir = path.join(__dirname, '..', '..', 'src', 'components', componentInfo.name, '__tests__');
    await fs.mkdir(testDir, { recursive: true });
    const testPath = path.join(testDir, `${componentInfo.name}.test.tsx`);
    await fs.writeFile(testPath, testContent);

    return { success: true, path: testPath, componentInfo };
  } catch (error) {
    console.error('创建测试文件失败:', error);
    return { success: false, error: error.message };
  }
}
