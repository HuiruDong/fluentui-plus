import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 从 AST 中提取 Props 信息，只负责解析 props，支持多种命名方式
 * 这里的解析不用 async ，是因为没有异步操作，不需要读取文件内容，ast 本身就是一个已经解析好的 js 对象
 */
export function extractPropsFromAST(ast, componentName) {
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

/**
 * 组件分析的函数，因为生成 Demo、测试、Story 都需要知道组件的结构（有哪些 props、类型是什么等），只负责查找 props，支持在多个文件内查找，找到了之后会去调用 extractPropsFromAST 返回 ast 解析结果
 */
export async function analyzeComponent(componentName) {
  try {
    const componentDir = path.join(__dirname, '..', '..', 'src', 'components', componentName);

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
