import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeComponent } from '../utils/ast-analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Phase 3: Props 智能取值系统
 */
const smartValueGenerators = {
  // 基础类型智能生成
  string: {
    placeholder: () => '"请输入..."',
    title: componentName => `"${componentName}示例"`,
    label: componentName => `"${componentName}标签"`,
    name: () => `"demo_${Date.now()}"`,
    className: () => '"custom-class"',
    id: () => '"demo-id"',
    text: () => '"示例文本"',
    content: () => '"内容示例"',
    description: () => '"这是一个描述"',
    default: () => '"示例文本"',
  },

  number: {
    max: () => '100',
    min: () => '0',
    step: () => '1',
    value: () => '50',
    defaultValue: () => '10',
    size: () => '16',
    width: () => '200',
    height: () => '100',
    maxLength: () => '100',
    maxTags: () => '10',
    tabIndex: () => '0',
    default: () => '42',
  },

  boolean: {
    disabled: () => 'false',
    multiple: () => 'false',
    checked: () => 'true',
    selected: () => 'true',
    visible: () => 'true',
    loading: () => 'false',
    readonly: () => 'false',
    required: () => 'false',
    allowClear: () => 'true',
    allowDuplicates: () => 'true',
    showSearch: () => 'true',
    collapsed: () => 'false',
    bordered: () => 'true',
    default: () => 'true',
  },

  // 复杂类型智能生成
  'Option[]': (propName, componentName) => {
    if (componentName.toLowerCase().includes('select')) {
      return `[
        { label: '选项一', value: '1' },
        { label: '选项二', value: '2' },
        { label: '选项三', value: '3' }
      ]`;
    }
    return `[
      { label: '项目1', value: 'item1' },
      { label: '项目2', value: 'item2' }
    ]`;
  },

  'NavItemType[]': () => `[
    { key: '1', label: '首页', icon: '🏠' },
    { key: '2', label: '产品', icon: '📦', children: [
      { key: '2-1', label: '产品列表' },
      { key: '2-2', label: '产品详情' }
    ]},
    { key: '3', label: '关于', icon: 'ℹ️' }
  ]`,

  'string[]': propName => {
    if (propName.toLowerCase().includes('tag')) {
      return "['React', 'TypeScript', 'JavaScript']";
    }
    if (propName.toLowerCase().includes('item')) {
      return "['项目1', '项目2', '项目3']";
    }
    if (propName.toLowerCase().includes('key')) {
      return "['key1', 'key2', 'key3']";
    }
    return "['选项1', '选项2', '选项3']";
  },

  'number[]': () => '[1, 2, 3, 4, 5]',

  // 函数类型智能生成
  function: (propName, componentName) => {
    if (propName.startsWith('on')) {
      // 特殊事件处理
      if (propName === 'onChange') {
        if (componentName.toLowerCase().includes('input') || componentName.toLowerCase().includes('tag')) {
          return '(value) => console.log("onChange:", value)';
        }
        return '(e) => console.log("onChange:", e.target.value)';
      }

      if (propName === 'onSelect') {
        return '(key) => console.log("选中:", key)';
      }

      if (propName === 'onInputChange') {
        return '(value) => console.log("输入变化:", value)';
      }

      if (propName === 'onOpenChange') {
        return '(openKeys) => console.log("展开变化:", openKeys)';
      }

      if (propName === 'onClick') {
        return '() => console.log("点击事件")';
      }

      if (propName === 'onClose') {
        return '() => console.log("关闭")';
      }

      return `() => console.log('${propName} triggered')`;
    }

    // 非事件函数
    if (propName.includes('render') || propName.includes('Render')) {
      return '(item) => <span>{item.label}</span>';
    }

    return '() => {}';
  },

  // React 元素类型
  ReactNode: propName => {
    if (propName.includes('icon') || propName.includes('Icon')) {
      return '<span>🎯</span>';
    }
    if (propName.includes('prefix') || propName.includes('Prefix')) {
      return '<span>📝</span>';
    }
    if (propName.includes('suffix') || propName.includes('Suffix')) {
      return '<span>✅</span>';
    }
    return '<span>内容</span>';
  },
};

/**
 * Phase 3: 智能生成 Prop 值
 */
function generateSmartValue(prop, componentName) {
  const { name, type } = prop;

  // 优先匹配确切类型
  if (smartValueGenerators[type]) {
    const generator = smartValueGenerators[type];
    if (typeof generator === 'function') {
      return generator(name, componentName);
    }
    if (typeof generator === 'object') {
      const specificGenerator = generator[name] || generator.default;
      return specificGenerator(componentName);
    }
  }

  // 模糊匹配类型
  const lowerType = type.toLowerCase();

  if (lowerType.includes('string')) {
    const generator = smartValueGenerators.string;
    const specificGenerator = generator[name] || generator.default;
    return specificGenerator(componentName);
  }

  if (lowerType.includes('number')) {
    const generator = smartValueGenerators.number;
    const specificGenerator = generator[name] || generator.default;
    return specificGenerator(componentName);
  }

  if (lowerType.includes('boolean')) {
    const generator = smartValueGenerators.boolean;
    const specificGenerator = generator[name] || generator.default;
    return specificGenerator(componentName);
  }

  if (lowerType.includes('function')) {
    return smartValueGenerators.function(name, componentName);
  }

  if (lowerType.includes('reactnode') || lowerType.includes('jsx')) {
    return smartValueGenerators.ReactNode(name);
  }

  if (lowerType.includes('[]') || lowerType.includes('array')) {
    if (lowerType.includes('string')) {
      return smartValueGenerators['string[]'](name);
    }
    if (lowerType.includes('number')) {
      return smartValueGenerators['number[]']();
    }
    return '[]';
  }

  // 默认值
  return smartValueGenerators.string.default(componentName);
}

/**
 * Phase 3: 智能生成 Props 字符串
 */
function generateSmartProps(componentInfo, options = {}) {
  const { props, name } = componentInfo;
  const { excludeProps = [], maxProps = 3, includeRequired = true } = options;

  let relevantProps = props.filter(
    p => !excludeProps.includes(p.name) && p.name !== 'children' && p.name !== 'className' && p.name !== 'style'
  );

  // 如果需要包含必需属性，优先选择必需属性
  if (includeRequired) {
    const requiredProps = relevantProps.filter(p => p.required);
    const optionalProps = relevantProps.filter(p => !p.required).slice(0, maxProps - requiredProps.length);
    relevantProps = [...requiredProps, ...optionalProps];
  } else {
    relevantProps = relevantProps.slice(0, maxProps);
  }

  if (relevantProps.length === 0) return '';

  const propStrings = relevantProps.map(prop => {
    const value = generateSmartValue(prop, name);
    return `${prop.name}={${value}}`;
  });

  return ' ' + propStrings.join(' ');
}

/**
 * Phase 3: 场景模板系统 (增强版)
 */
const SCENARIO_TEMPLATES = {
  // 基础场景 - 所有组件都适用
  basic: {
    title: '基础用法',
    description: '组件的基本使用方式',
    generator: componentInfo => {
      const props = generateSmartProps(componentInfo, { maxProps: 0, includeRequired: true });

      if (componentInfo.hasChildren) {
        return `<${componentInfo.name}${props}>
            基础内容
          </${componentInfo.name}>`;
      }
      return `<${componentInfo.name}${props} />`;
    },
  },

  // 受控场景 - 有 value + onChange 的组件
  controlled: {
    title: '受控模式',
    description: '通过 value 和 onChange 控制组件状态',
    generator: componentInfo => {
      const valueProps = componentInfo.props.filter(
        p => p.name.includes('value') || p.name === 'checked' || p.name === 'selected'
      );

      if (valueProps.length === 0) return null;

      const stateVars = valueProps
        .map(p => {
          const stateName = p.name === 'value' ? 'value' : p.name;
          const defaultValue = getDefaultValueForType(p.type);
          return `const [${stateName}, set${capitalize(stateName)}] = useState(${defaultValue});`;
        })
        .join('\n    ');

      const propsString = valueProps
        .map(p => {
          const stateName = p.name === 'value' ? 'value' : p.name;
          const onChangeName = `onChange${p.name === 'value' ? '' : capitalize(p.name)}`;
          return `${p.name}={${stateName}} ${onChangeName}={set${capitalize(stateName)}}`;
        })
        .join(' ');

      return `{(() => {
    ${stateVars}
    return <${componentInfo.name} ${propsString} />;
  })()}`;
    },
  },

  // 不同尺寸变体
  sizes: {
    title: '不同尺寸',
    description: '展示组件的不同尺寸选项',
    generator: componentInfo => {
      const sizeProps = componentInfo.props.filter(p => p.name.includes('size') || p.name.includes('Size'));

      if (sizeProps.length === 0) return null;

      const sizes = ['small', 'medium', 'large'];
      return `<div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        ${sizes
          .map(
            size =>
              `<${componentInfo.name} size="${size}"${componentInfo.hasChildren ? `>${size} 尺寸</${componentInfo.name}>` : ' />'}`
          )
          .join('\n        ')}
      </div>`;
    },
  },

  // 禁用状态
  disabled: {
    title: '禁用状态',
    description: '展示组件的禁用状态',
    generator: componentInfo => {
      const hasDisabled = componentInfo.props.some(p => p.name === 'disabled');
      if (!hasDisabled) return null;

      return `<div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <${componentInfo.name}${componentInfo.hasChildren ? `>正常状态</${componentInfo.name}>` : ' />'}
        <${componentInfo.name} disabled${componentInfo.hasChildren ? `>禁用状态</${componentInfo.name}>` : ' />'}
      </div>`;
    },
  },

  // 加载状态
  loading: {
    title: '加载状态',
    description: '展示组件的加载状态',
    generator: componentInfo => {
      const hasLoading = componentInfo.props.some(p => p.name === 'loading' || p.name === 'isLoading');
      if (!hasLoading) return null;

      const loadingProp = componentInfo.props.find(p => p.name === 'loading' || p.name === 'isLoading').name;

      return `<div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <${componentInfo.name}${componentInfo.hasChildren ? `>正常状态</${componentInfo.name}>` : ' />'}
        <${componentInfo.name} ${loadingProp}${componentInfo.hasChildren ? `>加载中...</${componentInfo.name}>` : ' />'}
      </div>`;
    },
  },

  // 交互事件
  events: {
    title: '事件处理',
    description: '展示组件的事件处理能力',
    generator: componentInfo => {
      const eventProps = componentInfo.props.filter(p => p.type === 'function' && p.name.startsWith('on'));

      if (eventProps.length === 0) return null;

      const handlers = eventProps
        .slice(0, 3)
        .map(p => {
          const value = generateSmartValue(p, componentInfo.name);
          return `${p.name}={${value}}`;
        })
        .join(' ');

      return `<${componentInfo.name} ${handlers}${componentInfo.hasChildren ? `>点击测试事件</${componentInfo.name}>` : ' />'}`;
    },
  },

  // 导航组件专用 - 使用左右布局
  navigation: {
    title: '导航菜单',
    description: '展示导航组件的完整功能',
    generator: componentInfo => {
      if (componentInfo.category !== 'navigation') return null;

      const itemsProp = componentInfo.props.find(p => p.name === 'items' && p.type.includes('[]'));

      if (!itemsProp) return null;

      const itemsValue = generateSmartValue(itemsProp, componentInfo.name);
      const onSelectValue = generateSmartValue({ name: 'onSelect', type: 'function' }, componentInfo.name);

      return `<div
        style={{
          display: 'flex',
          gap: '20px',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '260px',
            minHeight: '300px',
            background: '#fafafa',
            borderRight: '1px solid #d9d9d9',
          }}
        >
          <${componentInfo.name}
            items={${itemsValue}}
            onSelect={${onSelectValue}}
          />
        </div>
        <div
          style={{
            flex: 1,
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
          }}
        >
          <div>
            <h3>导航组件演示</h3>
            <p>点击菜单项查看交互效果</p>
          </div>
        </div>
      </div>`;
    },
  },

  // 输入组件专用
  input: {
    title: '输入示例',
    description: '展示输入组件的不同用法',
    generator: componentInfo => {
      if (componentInfo.category !== 'form') return null;

      const examples = [{ placeholder: '"请输入内容"' }, { defaultValue: '"默认值"' }, { maxLength: '100' }].filter(
        example => {
          const propName = Object.keys(example)[0];
          return componentInfo.props.some(p => p.name === propName);
        }
      );

      return `<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        ${examples
          .map(example => {
            const propName = Object.keys(example)[0];
            const propValue = example[propName];
            return `<${componentInfo.name} ${propName}={${propValue}} />`;
          })
          .join('\n        ')}
      </div>`;
    },
  },
};

/**
 * 获取类型的默认值
 */
function getDefaultValueForType(type) {
  if (!type) return "''";

  const lowerType = type.toLowerCase();
  if (lowerType.includes('string')) return "''";
  if (lowerType.includes('number')) return '0';
  if (lowerType.includes('boolean')) return 'false';
  if (lowerType.includes('array')) return '[]';
  if (lowerType.includes('object')) return '{}';

  return "''";
}

/**
 * 首字母大写
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 根据组件信息选择合适的场景模板
 */
function selectScenariosForComponent(componentInfo) {
  const scenarios = ['basic']; // 基础场景总是包含

  // 根据组件分析结果智能选择场景
  if (componentInfo.scenarios?.includes('controlled')) {
    scenarios.push('controlled');
  }

  if (componentInfo.scenarios?.includes('disabled')) {
    scenarios.push('disabled');
  }

  // 根据组件类别添加特定场景
  if (componentInfo.category === 'form') {
    scenarios.push('input', 'events');
  }

  if (componentInfo.category === 'navigation') {
    scenarios.push('navigation', 'events');
  }

  if (componentInfo.category === 'display') {
    scenarios.push('sizes', 'disabled');
  }

  // 根据Props特征添加场景
  const hasEventProps = componentInfo.props.some(p => p.type === 'function' && p.name.startsWith('on'));
  if (hasEventProps && !scenarios.includes('events')) {
    scenarios.push('events');
  }

  const hasSizeProps = componentInfo.props.some(p => p.name.includes('size') || p.name.includes('Size'));
  if (hasSizeProps && !scenarios.includes('sizes')) {
    scenarios.push('sizes');
  }

  const hasLoadingProps = componentInfo.props.some(p => p.name === 'loading' || p.name === 'isLoading');
  if (hasLoadingProps) {
    scenarios.push('loading');
  }

  return [...new Set(scenarios)]; // 去重
}

/**
 * Phase 3: 智能导入语句生成
 */
function generateImportStatements(componentInfo, scenarios) {
  const reactImports = new Set(['React']);
  const componentImports = new Set([componentInfo.name]);
  const typeImports = new Set();

  // 根据场景添加需要的 hooks
  if (scenarios.some(s => ['controlled', 'multiple', 'searchable'].includes(s))) {
    reactImports.add('useState');
  }

  if (componentInfo.complexity === 'complex') {
    reactImports.add('useCallback');
  }

  // 子组件导入 (如果有)
  if (componentInfo.subComponents) {
    componentInfo.subComponents.forEach(sub => componentImports.add(sub));
  }

  // 生成导入语句
  const reactImportStr = `import React${reactImports.size > 1 ? `, { ${Array.from(reactImports).slice(1).join(', ')} }` : ''} from 'react';`;
  const componentImportStr = `import { ${Array.from(componentImports).join(', ')} } from '../src/components';`;

  return `${reactImportStr}
${componentImportStr}`;
}

/**
 * Phase 3: 生成智能Demo内容
 */
function generateSmartDemo(componentInfo) {
  const scenarios = selectScenariosForComponent(componentInfo);

  // 生成导入语句
  const imports = generateImportStatements(componentInfo, scenarios);

  // 生成场景代码
  const scenarioCode = scenarios
    .map(scenarioKey => {
      const template = SCENARIO_TEMPLATES[scenarioKey];
      if (!template) return null;

      const code = template.generator(componentInfo);
      if (!code) return null;

      return `      {/* ${template.title} */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>
          ${template.title}
        </h2>
        <div
          style={{
            padding: '20px',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            background: '#fff'
          }}
        >
          ${code}
        </div>
        <p style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
          ${template.description}
        </p>
      </div>`;
    })
    .filter(Boolean);

  // 生成完整Demo文件
  return `${imports}

const ${componentInfo.name}Demo = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '32px',
          fontWeight: '600',
          color: '#262626',
        }}
      >
        ${componentInfo.name} 组件演示
      </h1>

${scenarioCode.join('\n\n')}

    </div>
  );
};

export default ${componentInfo.name}Demo;`;
}

/**
 * 核心函数：创建智能 Demo (Phase 3 增强版)
 */
export async function createSmartDemoCore(componentName) {
  try {
    console.log(`🔍 开始分析组件: ${componentName}`);
    const componentInfo = await analyzeComponent(componentName);
    if (!componentInfo) {
      return { success: false, error: '组件分析失败' };
    }

    console.log(`✅ 组件分析完成，类别: ${componentInfo.category}, 复杂度: ${componentInfo.complexity}`);

    // Phase 3: 使用智能生成系统
    const demoContent = generateSmartDemo(componentInfo);

    // 写入文件
    const demoDir = path.join(__dirname, '..', '..', 'demo');
    await fs.mkdir(demoDir, { recursive: true });
    const demoPath = path.join(demoDir, `${componentInfo.name}Demo.tsx`);
    await fs.writeFile(demoPath, demoContent);

    console.log(`✅ 智能Demo文件已创建: ${demoPath}`);

    return {
      success: true,
      path: demoPath,
      componentInfo,
      scenarios: selectScenariosForComponent(componentInfo),
    };
  } catch (error) {
    console.error('创建 Demo 失败:', error);
    return { success: false, error: error.message };
  }
}
