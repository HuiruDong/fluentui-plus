import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 智能组件分析器
 * 基于项目约定和智能识别，提供组件级别的深度分析
 */
export class SmartComponentAnalyzer {
  constructor(componentName) {
    this.componentName = componentName;
    this.componentPath = path.join(__dirname, '..', '..', 'src', 'components', componentName);
  }

  /**
   * 核心分析方法 - 返回完整的组件分析结果
   */
  async analyzeComponent() {
    try {
      // 1. 分析组件结构
      const structure = await this.analyzeComponentStructure();

      // 2. 提取主组件Props
      const mainProps = await this.extractMainProps();

      // 3. 分析所有组件（包括子组件）
      const allComponents = await this.extractAllComponents();

      // 4. 确定组件类型
      const analysisType = this.determineComponentType(structure);

      // 5. 检查是否支持children（需要await）
      const hasChildren = await this.checkHasChildren(mainProps);

      return {
        name: this.componentName,
        structure,
        mainProps,
        allComponents,
        analysisType,
        // 保持向后兼容
        props: mainProps,
        hasChildren,
      };
    } catch (error) {
      console.error('智能组件分析失败:', error);
      return null;
    }
  }

  /**
   * 分析组件文件结构
   */
  async analyzeComponentStructure() {
    const files = await this.getComponentFiles();

    return {
      // 基于约定的确定性识别
      mainComponent: `${this.componentName}.tsx`,
      mainProps: `${this.componentName}Props`,

      // 智能识别的文件类型
      subComponents: this.identifySubComponents(files),
      types: 'types.ts',
      styles: 'index.less',
      hooks: this.identifyHooks(files),
      utils: this.identifyUtils(files),
      tests: this.identifyTests(files),

      // 原始文件列表
      allFiles: files,
    };
  }

  /**
   * 获取组件文件夹下的所有文件
   */
  async getComponentFiles() {
    try {
      const files = await fs.readdir(this.componentPath);
      return files.filter(file => !file.startsWith('.'));
    } catch (error) {
      console.error(`无法读取组件目录 ${this.componentPath}:`, error);
      return [];
    }
  }

  /**
   * 识别子组件文件
   */
  identifySubComponents(files) {
    const excludeFiles = [
      `${this.componentName}.tsx`, // 主组件
      'types.ts', // 类型文件
      'index.ts', // 导出文件
      'index.less', // 样式文件
    ];

    return files.filter(file => {
      return (
        file.endsWith('.tsx') && // 是React组件
        !excludeFiles.includes(file) && // 不在排除列表中
        !file.includes('/') && // 不在子文件夹中
        !file.startsWith('_')
      ); // 不是私有文件
    });
  }

  /**
   * 识别Hooks文件
   */
  identifyHooks(files) {
    return files.filter(file => {
      return (file.startsWith('use') && file.endsWith('.ts')) || file === 'hooks' || file.includes('hooks/');
    });
  }

  /**
   * 识别工具文件
   */
  identifyUtils(files) {
    return files.filter(file => {
      return (
        file.includes('utils/') ||
        file.includes('helper') ||
        (file.endsWith('.ts') && !file.includes('test') && !file.startsWith('use') && file !== 'types.ts')
      );
    });
  }

  /**
   * 识别测试文件
   */
  identifyTests(files) {
    return files.filter(file => {
      return file.includes('test') || file.includes('spec') || file.includes('__tests__');
    });
  }

  /**
   * 提取主组件Props（用于Demo/Storybook）
   */
  async extractMainProps() {
    const typesFilePath = path.join(this.componentPath, 'types.ts');

    try {
      const code = await fs.readFile(typesFilePath, 'utf-8');
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });

      return this.extractPropsFromInterface(ast, `${this.componentName}Props`);
    } catch (error) {
      console.warn(`无法读取 types.ts 文件: ${error.message}`);
      return [];
    }
  }

  /**
   * 从AST中提取指定接口的Props
   */
  extractPropsFromInterface(ast, interfaceName) {
    const props = [];
    // 保存 this 引用，避免在回调中丢失上下文
    const self = this;

    traverse.default(ast, {
      TSInterfaceDeclaration(path) {
        if (path.node.id.name === interfaceName) {
          path.node.body.body.forEach(prop => {
            if (prop.type === 'TSPropertySignature' && prop.key.name) {
              props.push({
                name: prop.key.name,
                required: !prop.optional,
                type: self.getTypeAnnotation(prop.typeAnnotation),
              });
            }
          });
        }
      },
    });

    return props;
  }

  /**
   * 获取类型注解的字符串表示
   */
  getTypeAnnotation(typeAnnotation) {
    if (!typeAnnotation) return 'any';

    const tsType = typeAnnotation.typeAnnotation;
    switch (tsType.type) {
      case 'TSStringKeyword':
        return 'string';
      case 'TSNumberKeyword':
        return 'number';
      case 'TSBooleanKeyword':
        return 'boolean';
      case 'TSUnionType':
        return 'union';
      default:
        return 'any';
    }
  }

  /**
   * 提取所有组件的Props（用于测试）
   */
  async extractAllComponents() {
    const allComponents = [];
    const structure = await this.analyzeComponentStructure();

    // 主组件
    allComponents.push({
      name: this.componentName,
      file: structure.mainComponent,
      props: await this.extractMainProps(),
      isMain: true,
      testStrategy: 'integration',
    });

    // 子组件
    for (const subFile of structure.subComponents) {
      const componentName = subFile.replace('.tsx', '');
      const props = await this.extractSubComponentProps(componentName);

      allComponents.push({
        name: componentName,
        file: subFile,
        props,
        isMain: false,
        testStrategy: 'unit',
      });
    }

    return allComponents;
  }

  /**
   * 提取子组件Props
   */
  async extractSubComponentProps(componentName) {
    const typesFilePath = path.join(this.componentPath, 'types.ts');

    try {
      const code = await fs.readFile(typesFilePath, 'utf-8');
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });

      // 尝试多种可能的Props命名
      const possibleNames = [
        `${componentName}Props`, // CheckableTagProps
        `${this.componentName}${componentName}Props`, // TagCheckableTagProps
        `${componentName.charAt(0).toUpperCase() + componentName.slice(1)}Props`, // 确保首字母大写
      ];

      for (const propsName of possibleNames) {
        const props = this.extractPropsFromInterface(ast, propsName);
        if (props.length > 0) {
          return props;
        }
      }

      return [];
    } catch (error) {
      console.warn(`无法提取子组件 ${componentName} 的Props: ${error.message}`);
      return [];
    }
  }

  /**
   * 确定组件类型
   */
  determineComponentType(structure) {
    const subComponentsCount = structure.subComponents.length;
    const hasHooks = structure.hooks.length > 0;
    const hasUtils = structure.utils.length > 0;

    if (subComponentsCount === 0 && !hasHooks && !hasUtils) {
      return 'simple';
    } else if (subComponentsCount <= 3 && !hasHooks && !hasUtils) {
      return 'moderate';
    } else {
      return 'complex';
    }
  }

  /**
   * 检查是否支持children
   */
  async checkHasChildren(props) {
    // 1. 直接检查props中是否有children属性
    if (props.some(prop => prop.name === 'children')) {
      return true;
    }

    // 2. 检查是否继承了PropsWithChildren（通过分析types.ts文件）
    return await this.checkPropsWithChildrenInheritance();
  }

  /**
   * 检查组件是否继承了PropsWithChildren
   */
  async checkPropsWithChildrenInheritance() {
    const typesFilePath = path.join(this.componentPath, 'types.ts');

    try {
      const code = await fs.readFile(typesFilePath, 'utf-8');

      // 简单的字符串匹配检查
      const hasPropsWithChildren =
        code.includes('PropsWithChildren') && code.includes(`${this.componentName}Props extends PropsWithChildren`);

      return hasPropsWithChildren;
    } catch (error) {
      console.warn(`无法检查PropsWithChildren继承: ${error.message}`);
      return false;
    }
  }
}

/**
 * 为了保持向后兼容，提供原来的分析函数
 */
export async function analyzeComponent(componentName) {
  const analyzer = new SmartComponentAnalyzer(componentName);
  return await analyzer.analyzeComponent();
}

/**
 * 新的智能分析函数，返回更详细的信息
 */
export async function smartAnalyzeComponent(componentName) {
  const analyzer = new SmartComponentAnalyzer(componentName);
  return await analyzer.analyzeComponent();
}
