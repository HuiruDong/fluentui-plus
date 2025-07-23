import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeComponent } from '../utils/ast-analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 核心函数：创建智能 Demo
 */
export async function createSmartDemoCore(componentName) {
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
    const demoDir = path.join(__dirname, '..', '..', 'demo');
    await fs.mkdir(demoDir, { recursive: true });
    const demoPath = path.join(demoDir, `${componentInfo.name}Demo.tsx`);
    await fs.writeFile(demoPath, demoContent);

    return { success: true, path: demoPath, componentInfo };
  } catch (error) {
    console.error('创建 Demo 失败:', error);
    return { success: false, error: error.message };
  }
}
