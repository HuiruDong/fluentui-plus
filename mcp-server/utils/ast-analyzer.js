import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 从 TypeScript 类型注解中提取详细的类型信息
 */
function extractTypeInfo(typeAnnotation) {
  if (!typeAnnotation) return { type: 'any', unionTypes: [], isArray: false };

  const typeInfo = {
    type: 'any',
    unionTypes: [],
    isArray: false,
    isOptional: false,
    defaultValue: undefined,
  };

  if (typeAnnotation.type === 'TSTypeAnnotation') {
    const tsType = typeAnnotation.typeAnnotation;

    // 处理联合类型 (string | number | boolean)
    if (tsType.type === 'TSUnionType') {
      typeInfo.unionTypes = tsType.types.map(t => getSimpleTypeName(t));
      typeInfo.type = typeInfo.unionTypes.join(' | ');
    }
    // 处理数组类型 (string[], Option[])
    else if (tsType.type === 'TSArrayType') {
      typeInfo.isArray = true;
      const elementType = getSimpleTypeName(tsType.elementType);
      typeInfo.type = `${elementType}[]`;
      typeInfo.unionTypes = [elementType];
    }
    // 处理简单类型
    else {
      const simpleType = getSimpleTypeName(tsType);
      typeInfo.type = simpleType;
      typeInfo.unionTypes = [simpleType];
    }
  }

  return typeInfo;
}

/**
 * 获取简单类型名称
 */
function getSimpleTypeName(tsType) {
  switch (tsType.type) {
    case 'TSStringKeyword':
      return 'string';
    case 'TSNumberKeyword':
      return 'number';
    case 'TSBooleanKeyword':
      return 'boolean';
    case 'TSTypeReference':
      if (tsType.typeName && tsType.typeName.name) {
        return tsType.typeName.name;
      }
      return 'object';
    case 'TSFunctionType':
      return 'function';
    case 'TSArrayType':
      return `${getSimpleTypeName(tsType.elementType)}[]`;
    default:
      return 'any';
  }
}

/**
 * 检测组件分类
 */
function detectComponentCategory(componentInfo) {
  const { props, name } = componentInfo;

  // 表单组件：有 value/onChange 或输入相关属性
  if (hasValueAndOnChange(props) || hasInputRelatedProps(props)) {
    return 'form';
  }

  // 导航组件：有 items/children 且名称包含导航关键词
  if (hasNavigationFeatures(props, name)) {
    return 'navigation';
  }

  // 展示组件：主要用于信息展示
  if (hasDisplayFeatures(props, name)) {
    return 'display';
  }

  // 反馈组件：Modal、Message、Toast 等
  if (hasFeedbackFeatures(props, name)) {
    return 'feedback';
  }

  return 'display'; // 默认分类
}

/**
 * 检测控制模式
 */
function detectControlPattern(componentInfo) {
  const { props } = componentInfo;

  const hasValue = props.some(p => p.name === 'value');
  const hasDefaultValue = props.some(p => p.name === 'defaultValue');
  const hasOnChange = props.some(p => p.name === 'onChange');

  if (hasValue && hasOnChange) {
    return hasDefaultValue ? 'both' : 'controlled';
  }

  if (hasDefaultValue) {
    return 'uncontrolled';
  }

  return 'stateless';
}

/**
 * 计算组件复杂度
 */
function calculateComplexity(componentInfo) {
  const { props } = componentInfo;
  let score = 0;

  // 基础评分：Props 数量
  score += props.length;

  // 复杂类型加分
  props.forEach(prop => {
    if (prop.type.includes('[]')) score += 2; // 数组类型
    if (prop.type.includes('|')) score += 1; // 联合类型
    if (prop.type === 'function') score += 2; // 函数类型
    if (prop.name.startsWith('on')) score += 1; // 事件处理
  });

  // 特殊属性加分
  if (props.some(p => p.name === 'children')) score += 1;
  if (props.some(p => p.name.includes('render'))) score += 2;

  if (score <= 3) return 'simple';
  if (score <= 8) return 'medium';
  return 'complex';
}

/**
 * 检测交互模式
 */
function detectInteractionPatterns(componentInfo) {
  const { props, name } = componentInfo;
  const patterns = [];

  if (props.some(p => p.name.startsWith('onClick'))) patterns.push('click');
  if (props.some(p => p.name.includes('search') || p.name.includes('filter'))) patterns.push('search');
  if (props.some(p => p.name === 'value' && p.name === 'onChange')) patterns.push('input');
  if (props.some(p => p.name === 'multiple')) patterns.push('multiSelect');
  if (props.some(p => p.name.includes('drag') || p.name.includes('drop'))) patterns.push('drag');
  if (name.toLowerCase().includes('nav') || name.toLowerCase().includes('menu')) patterns.push('navigation');

  return patterns;
}

/**
 * 自动检测适用场景
 */
function detectApplicableScenarios(componentInfo) {
  const scenarios = ['basic']; // 基础场景必有

  // 受控模式检测
  if (componentInfo.controlPattern === 'controlled' || componentInfo.controlPattern === 'both') {
    scenarios.push('controlled');
  }

  // 禁用状态检测
  if (componentInfo.props.some(p => p.name === 'disabled')) {
    scenarios.push('disabled');
  }

  // 多选模式检测
  if (componentInfo.props.some(p => p.name === 'multiple')) {
    scenarios.push('multiple');
  }

  // 搜索功能检测
  if (componentInfo.interactionPatterns.includes('search')) {
    scenarios.push('searchable');
  }

  // 自定义渲染检测
  if (componentInfo.hasCustomRender) {
    scenarios.push('customRender');
  }

  return scenarios;
}

// 辅助函数
function hasValueAndOnChange(props) {
  return props.some(p => p.name === 'value') && props.some(p => p.name === 'onChange');
}

function hasInputRelatedProps(props) {
  const inputProps = ['placeholder', 'disabled', 'maxLength', 'pattern', 'required'];
  return props.some(p => inputProps.includes(p.name));
}

function hasNavigationFeatures(props, name) {
  const navProps = ['items', 'selectedKeys', 'onSelect'];
  const navNames = ['nav', 'menu', 'breadcrumb', 'tabs'];
  return props.some(p => navProps.includes(p.name)) || navNames.some(n => name.toLowerCase().includes(n));
}

function hasDisplayFeatures(props, name) {
  const displayNames = ['tag', 'badge', 'avatar', 'card', 'list'];
  return displayNames.some(n => name.toLowerCase().includes(n));
}

function hasFeedbackFeatures(props, name) {
  const feedbackNames = ['modal', 'dialog', 'message', 'toast', 'notification', 'alert'];
  return feedbackNames.some(n => name.toLowerCase().includes(n));
}

/**
 * 生成智能样例值
 */
function generateSampleValues(prop, componentName) {
  const { name, type } = prop;

  // 字符串类型的智能取值
  if (type === 'string') {
    if (name === 'placeholder') return ['请输入...', '输入内容'];
    if (name === 'title') return [`${componentName}示例`, '标题文本'];
    if (name === 'label') return [`${componentName}标签`, '标签文本'];
    if (name === 'className') return ['custom-class', 'demo-style'];
    return ['示例文本', '演示内容'];
  }

  // 数组类型的智能取值
  if (type.includes('[]')) {
    if (type === 'string[]') {
      if (name.toLowerCase().includes('tag')) {
        return [['React', 'TypeScript', 'JavaScript']];
      }
      return [['选项1', '选项2', '选项3']];
    }
    if (type === 'Option[]') {
      return [
        [
          { label: '选项一', value: '1' },
          { label: '选项二', value: '2' },
          { label: '选项三', value: '3' },
        ],
      ];
    }
  }

  // 布尔类型
  if (type === 'boolean') {
    if (name === 'disabled') return [false, true];
    if (name === 'multiple') return [false, true];
    return [true, false];
  }

  // 数字类型
  if (type === 'number') {
    if (name === 'max') return [100];
    if (name === 'min') return [0];
    return [42];
  }

  return ['示例值'];
}

/**
 * 从 AST 中提取增强的 Props 信息
 */
export function extractPropsFromAST(ast, componentName) {
  const componentInfo = {
    name: componentName,
    props: [],
    hasChildren: false,
    hasCustomRender: false,
    subComponents: [],
    dependencies: ['React'], // 基础依赖
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
            const propName = prop.key.name;
            const typeInfo = extractTypeInfo(prop.typeAnnotation);

            const propInfo = {
              name: propName,
              required: !prop.optional,
              type: typeInfo.type,
              unionTypes: typeInfo.unionTypes,
              isArray: typeInfo.isArray,
              defaultValue: typeInfo.defaultValue,
              sampleValues: generateSampleValues({ name: propName, type: typeInfo.type }, componentName),
            };

            componentInfo.props.push(propInfo);

            // 特殊属性检测
            if (propName === 'children') {
              componentInfo.hasChildren = true;
            }

            if (propName.includes('render') || propName.includes('Render')) {
              componentInfo.hasCustomRender = true;
            }

            // 检测需要的依赖
            if (propName.startsWith('on') && typeInfo.type === 'function') {
              if (!componentInfo.dependencies.includes('useCallback')) {
                componentInfo.dependencies.push('useCallback');
              }
            }
          }
        });
      }
    },

    // 检测子组件（如 Tag.CheckableTag）
    TSTypeAliasDeclaration(path) {
      const typeName = path.node.id.name;
      if (typeName.includes(componentName) && typeName !== `${componentName}Props`) {
        componentInfo.subComponents.push(typeName.replace(`${componentName}`, ''));
      }
    },
  });

  return componentInfo;
}

/**
 * 增强的组件分析函数 - 提取丰富的组件信息用于智能 Demo 生成
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

    let componentInfo = {
      name: componentName,
      props: [],
      hasChildren: false,
      hasCustomRender: false,
      subComponents: [],
      dependencies: ['React'],
    };

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

    // 进行智能分析增强
    const enhancedInfo = {
      ...componentInfo,
      category: detectComponentCategory(componentInfo),
      complexity: calculateComplexity(componentInfo),
      controlPattern: detectControlPattern(componentInfo),
      interactionPatterns: detectInteractionPatterns(componentInfo),
    };

    // 基于分析结果检测适用场景
    enhancedInfo.scenarios = detectApplicableScenarios(enhancedInfo);

    // 根据场景添加需要的 React hooks
    if (enhancedInfo.scenarios.includes('controlled')) {
      if (!enhancedInfo.dependencies.includes('useState')) {
        enhancedInfo.dependencies.push('useState');
      }
    }

    console.log(`🔍 组件分析完成:`, {
      name: enhancedInfo.name,
      category: enhancedInfo.category,
      complexity: enhancedInfo.complexity,
      controlPattern: enhancedInfo.controlPattern,
      scenarios: enhancedInfo.scenarios,
      propsCount: enhancedInfo.props.length,
    });

    return enhancedInfo;
  } catch (error) {
    console.error('分析组件失败:', error);
    return null;
  }
}
