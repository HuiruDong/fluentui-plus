# MCP 从零实战开发指南

## 🎯 开发前准备

### 📋 需要安装的软件

1. **Node.js** (版本 18 以上)
   - 下载地址：https://nodejs.org/
   - 选择 LTS 版本下载安装

2. **VS Code** 
   - 你应该已经有了

3. **Git** 
   - 用于版本控制

### ✅ 验证环境

打开终端（PowerShell），运行以下命令验证：

```powershell
# 检查 Node.js 版本
node --version
# 应该显示类似 v18.17.0

# 检查 npm 版本  
npm --version
# 应该显示类似 9.6.7
```

---

## 🚀 第一步：创建最简单的 MCP 服务器

### 📁 创建项目目录

```powershell
# 在你的项目目录下创建 MCP 服务器
cd c:\Users\j-huirudong\Projects\agent-demo
mkdir mcp-server
cd mcp-server
```

### 📦 初始化项目

```powershell
# 初始化 npm 项目
npm init -y

# 安装必要依赖
npm install @modelcontextprotocol/sdk
npm install --save-dev typescript @types/node tsx

# 创建 TypeScript 配置
```

创建 `tsconfig.json` 文件：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 🔧 创建最简单的服务器

创建 `src/index.ts` 文件：

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// 创建服务器实例
const server = new Server(
  {
    name: 'fluentui-plus-helper',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {
        // 定义第一个工具：分析组件
        analyze_component: {
          description: '分析 React 组件的基本信息',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: {
                type: 'string',
                description: '组件名称，如 Button、Nav 等'
              }
            },
            required: ['componentName']
          }
        }
      }
    }
  }
);

// 处理工具调用请求
server.setRequestHandler('tools/call', async (request) => {
  console.log('收到工具调用请求:', request.params);
  
  if (request.params.name === 'analyze_component') {
    const { componentName } = request.params.arguments;
    
    // 这里是最简单的实现，先返回固定信息
    return {
      content: [
        {
          type: 'text',
          text: `✅ 分析完成！

组件名称: ${componentName}
组件路径: src/components/${componentName}
发现的属性: size, type, disabled, onClick
使用的 Hooks: useState, useCallback
测试覆盖率: 需要生成测试文件

建议下一步: 生成演示文件和单元测试`
        }
      ]
    };
  }
  
  throw new Error(`未知的工具: ${request.params.name}`);
});

// 启动服务器
async function main() {
  console.log('🚀 Fluentui Plus MCP 服务器启动中...');
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.log('✅ MCP 服务器已启动，等待连接...');
}

main().catch((error) => {
  console.error('❌ 服务器启动失败:', error);
  process.exit(1);
});
```

### 📝 添加 package.json 脚本

修改 `package.json`，添加启动脚本：

```json
{
  "name": "fluentui-plus-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 🧪 测试服务器

```powershell
# 编译并运行
npm run build
npm run start
```

如果看到 "✅ MCP 服务器已启动，等待连接..." 说明服务器创建成功！

---

## 🔗 第二步：配置 VS Code 连接

### 📄 创建 MCP 客户端配置

在你的主项目目录下创建或修改 `.vscode/settings.json`：

```json
{
  "mcp.servers": {
    "fluentui-plus-helper": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"],
      "cwd": "./mcp-server"
    }
  }
}
```

### 🔌 重启 VS Code

1. 完全关闭 VS Code
2. 重新打开你的项目
3. 打开 GitHub Copilot Chat

### 🧪 测试连接

在 Copilot Chat 中输入：

```
@workspace 请使用 fluentui-plus-helper 分析 Button 组件
```

如果看到返回的分析结果，说明连接成功！

---

## 🛠️ 第三步：添加真实的组件分析功能

现在我们要让服务器真正能读取和分析组件代码。

### 📦 安装代码分析依赖

```powershell
cd mcp-server
npm install @babel/parser @babel/traverse @babel/types
npm install --save-dev @types/babel__traverse @types/babel__types
```

### 🔧 创建组件分析器

创建 `src/analyzer.ts`：

```typescript
import * as fs from 'fs/promises';
import * as path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

// 组件信息接口
interface ComponentInfo {
  name: string;
  path: string;
  props: Array<{
    name: string;
    type: string;
    required: boolean;
    description?: string;
  }>;
  hooks: string[];
  events: string[];
  hasTests: boolean;
  hasDemo: boolean;
  hasStory: boolean;
}

export class ComponentAnalyzer {
  private projectRoot: string;

  constructor() {
    // 假设 MCP 服务器在项目根目录的 mcp-server 文件夹中
    this.projectRoot = path.resolve('../');
  }

  async analyzeComponent(componentName: string): Promise<ComponentInfo> {
    console.log(`🔍 开始分析组件: ${componentName}`);
    
    const componentPath = path.join(this.projectRoot, 'src', 'components', componentName);
    const componentFile = path.join(componentPath, `${componentName}.tsx`);
    
    // 检查组件文件是否存在
    try {
      await fs.access(componentFile);
    } catch {
      throw new Error(`组件文件不存在: ${componentFile}`);
    }

    // 读取组件代码
    const code = await fs.readFile(componentFile, 'utf-8');
    console.log(`📖 读取到代码文件，长度: ${code.length} 字符`);

    // 解析代码
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    const componentInfo: ComponentInfo = {
      name: componentName,
      path: componentPath,
      props: [],
      hooks: [],
      events: [],
      hasTests: false,
      hasDemo: false,
      hasStory: false
    };

    // 分析 AST
    traverse(ast, {
      // 查找 Props 接口
      TSInterfaceDeclaration(path) {
        if (path.node.id.name === `${componentName}Props`) {
          console.log(`📋 找到 Props 接口: ${componentName}Props`);
          componentInfo.props = this.extractProps(path.node);
        }
      },

      // 查找 Hook 调用
      CallExpression(path) {
        if (t.isIdentifier(path.node.callee) && path.node.callee.name.startsWith('use')) {
          const hookName = path.node.callee.name;
          if (!componentInfo.hooks.includes(hookName)) {
            componentInfo.hooks.push(hookName);
          }
        }
      },

      // 查找事件处理器
      ObjectProperty(path) {
        if (t.isIdentifier(path.node.key) && path.node.key.name.startsWith('on')) {
          const eventName = path.node.key.name;
          if (!componentInfo.events.includes(eventName)) {
            componentInfo.events.push(eventName);
          }
        }
      }
    });

    // 检查相关文件是否存在
    componentInfo.hasTests = await this.checkFileExists(componentPath, '__tests__');
    componentInfo.hasDemo = await this.checkFileExists(this.projectRoot, 'demo', `${componentName}Demo.tsx`);
    componentInfo.hasStory = await this.checkFileExists(this.projectRoot, 'stories', `${componentName}.stories.tsx`);

    console.log(`✅ 分析完成，找到 ${componentInfo.props.length} 个属性，${componentInfo.hooks.length} 个 hooks`);
    return componentInfo;
  }

  private extractProps(interfaceNode: t.TSInterfaceDeclaration): ComponentInfo['props'] {
    const props: ComponentInfo['props'] = [];

    if (interfaceNode.body.type === 'TSInterfaceBody') {
      for (const member of interfaceNode.body.body) {
        if (member.type === 'TSPropertySignature' && t.isIdentifier(member.key)) {
          const propName = member.key.name;
          const isRequired = !member.optional;
          let propType = 'any';

          // 简单的类型提取
          if (member.typeAnnotation?.typeAnnotation) {
            const typeNode = member.typeAnnotation.typeAnnotation;
            propType = this.getTypeString(typeNode);
          }

          props.push({
            name: propName,
            type: propType,
            required: isRequired
          });
        }
      }
    }

    return props;
  }

  private getTypeString(typeNode: t.TSType): string {
    switch (typeNode.type) {
      case 'TSStringKeyword':
        return 'string';
      case 'TSNumberKeyword':
        return 'number';
      case 'TSBooleanKeyword':
        return 'boolean';
      case 'TSUnionType':
        return typeNode.types.map(t => this.getTypeString(t)).join(' | ');
      default:
        return 'unknown';
    }
  }

  private async checkFileExists(...pathParts: string[]): Promise<boolean> {
    try {
      await fs.access(path.join(...pathParts));
      return true;
    } catch {
      return false;
    }
  }
}
```

### 🔄 更新主服务器文件

修改 `src/index.ts`，使用真实的分析器：

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ComponentAnalyzer } from './analyzer.js';

const server = new Server(
  {
    name: 'fluentui-plus-helper',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {
        analyze_component: {
          description: '分析 React 组件的代码结构和相关文件',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: {
                type: 'string',
                description: '组件名称，如 Button、Nav 等'
              }
            },
            required: ['componentName']
          }
        }
      }
    }
  }
);

const analyzer = new ComponentAnalyzer();

server.setRequestHandler('tools/call', async (request) => {
  console.log('🔧 收到工具调用:', request.params.name);
  
  if (request.params.name === 'analyze_component') {
    try {
      const { componentName } = request.params.arguments;
      console.log(`🎯 分析组件: ${componentName}`);
      
      const result = await analyzer.analyzeComponent(componentName);
      
      // 生成详细的分析报告
      const report = `# 🔍 ${result.name} 组件分析报告

## 📊 基本信息
- **组件名称**: ${result.name}
- **组件路径**: ${result.path}

## 🏗️ Props 属性 (${result.props.length} 个)
${result.props.map(prop => 
  `- **${prop.name}**: \`${prop.type}\` ${prop.required ? '(必需)' : '(可选)'}`
).join('\n')}

## 🪝 使用的 Hooks (${result.hooks.length} 个)
${result.hooks.map(hook => `- ${hook}`).join('\n')}

## 🎯 事件处理 (${result.events.length} 个)
${result.events.map(event => `- ${event}`).join('\n')}

## 📁 相关文件状态
- **单元测试**: ${result.hasTests ? '✅ 已存在' : '❌ 需要创建'}
- **演示文件**: ${result.hasDemo ? '✅ 已存在' : '❌ 需要创建'} 
- **Storybook**: ${result.hasStory ? '✅ 已存在' : '❌ 需要创建'}

## 💡 建议
${this.generateSuggestions(result)}`;

      return {
        content: [
          {
            type: 'text',
            text: report
          }
        ]
      };
      
    } catch (error) {
      console.error('❌ 分析失败:', error);
      return {
        content: [
          {
            type: 'text',
            text: `❌ 分析失败: ${error.message}`
          }
        ]
      };
    }
  }
  
  throw new Error(`未知的工具: ${request.params.name}`);
});

// 生成改进建议
function generateSuggestions(result: any): string {
  const suggestions = [];
  
  if (!result.hasTests) {
    suggestions.push('- 建议创建单元测试文件来保证代码质量');
  }
  
  if (!result.hasDemo) {
    suggestions.push('- 建议创建演示文件来展示组件用法');
  }
  
  if (!result.hasStory) {
    suggestions.push('- 建议创建 Storybook 文档来完善组件文档');
  }
  
  if (result.props.length === 0) {
    suggestions.push('- 组件没有 Props 定义，考虑是否需要添加配置选项');
  }
  
  return suggestions.length > 0 ? suggestions.join('\n') : '✨ 组件结构良好，无需特别改进！';
}

async function main() {
  console.log('🚀 Fluentui Plus MCP 服务器启动中...');
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.log('✅ MCP 服务器已启动，可以分析组件了！');
}

main().catch((error) => {
  console.error('❌ 服务器启动失败:', error);
  process.exit(1);
});
```

---

## 🧪 第四步：测试真实功能

### 🔨 编译和启动

```powershell
cd mcp-server
npm run build
npm run start
```

### 📋 创建测试组件

为了测试，我们先创建一个简单的组件结构：

```powershell
# 回到主项目目录
cd ..
mkdir -p src/components/Button
```

创建 `src/components/Button/Button.tsx`：

```typescript
import React from 'react';

interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  type?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  size = 'medium', 
  type = 'primary', 
  disabled = false, 
  onClick, 
  children 
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const handleClick = React.useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);

  return (
    <button
      className={`btn btn-${type} btn-${size}`}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default Button;
```

### 🧪 测试分析功能

重新启动 VS Code，然后在 Copilot Chat 中输入：

```
@workspace 请分析 Button 组件
```

你应该会看到详细的分析报告！

---

## 🎯 第五步：添加文件生成功能

现在我们添加生成演示文件的功能。

### 📝 创建文件生成器

创建 `src/generators.ts`：

```typescript
import * as fs from 'fs/promises';
import * as path from 'path';

interface ComponentInfo {
  name: string;
  props: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
}

export class FileGenerator {
  private projectRoot: string;

  constructor() {
    this.projectRoot = path.resolve('../');
  }

  async generateDemo(componentInfo: ComponentInfo): Promise<string> {
    const demoContent = this.createDemoTemplate(componentInfo);
    const demoPath = path.join(this.projectRoot, 'demo', `${componentInfo.name}Demo.tsx`);
    
    // 确保 demo 目录存在
    await fs.mkdir(path.dirname(demoPath), { recursive: true });
    
    // 写入文件
    await fs.writeFile(demoPath, demoContent, 'utf-8');
    
    return demoPath;
  }

  private createDemoTemplate(componentInfo: ComponentInfo): string {
    const importStatement = `import React from 'react';\nimport { ${componentInfo.name} } from '../src/components/${componentInfo.name}/${componentInfo.name}';`;
    
    // 生成基础示例
    const basicExample = this.generateBasicExample(componentInfo);
    
    // 生成属性示例
    const propsExamples = this.generatePropsExamples(componentInfo);
    
    return `${importStatement}

export const ${componentInfo.name}Demo: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>${componentInfo.name} 组件演示</h1>
      
      ${basicExample}
      
      ${propsExamples}
      
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>📝 使用说明</h3>
        <p>这个演示展示了 ${componentInfo.name} 组件的各种用法和属性配置。</p>
        <p>组件支持 ${componentInfo.props.length} 个属性配置。</p>
      </div>
    </div>
  );
};

export default ${componentInfo.name}Demo;`;
  }

  private generateBasicExample(componentInfo: ComponentInfo): string {
    // 为必需属性生成默认值
    const requiredProps = componentInfo.props
      .filter(prop => prop.required)
      .map(prop => this.getDefaultPropValue(prop))
      .join('\n        ');

    return `
      <section style={{ marginBottom: '30px' }}>
        <h2>🎯 基础用法</h2>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <${componentInfo.name}${requiredProps ? `\n        ${requiredProps}` : ''}>
            ${componentInfo.name === 'Button' ? '点击我' : `${componentInfo.name} 内容`}
          </${componentInfo.name}>
        </div>
      </section>`;
  }

  private generatePropsExamples(componentInfo: ComponentInfo): string {
    if (componentInfo.props.length === 0) {
      return '';
    }

    const examples = componentInfo.props
      .slice(0, 3) // 只展示前3个属性的示例
      .map(prop => this.generateSinglePropExample(componentInfo, prop))
      .join('\n\n');

    return `
      <section style={{ marginBottom: '30px' }}>
        <h2>🎨 属性示例</h2>
        ${examples}
      </section>`;
  }

  private generateSinglePropExample(componentInfo: ComponentInfo, prop: any): string {
    const exampleValue = this.getExamplePropValue(prop);
    
    return `
        <div style={{ marginBottom: '20px' }}>
          <h3>${prop.name} 属性</h3>
          <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <${componentInfo.name} ${prop.name}={${exampleValue}}>
              ${prop.name} 示例
            </${componentInfo.name}>
          </div>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
            类型: {prop.type} | ${prop.required ? '必需' : '可选'}
          </p>
        </div>`;
  }

  private getDefaultPropValue(prop: any): string {
    switch (prop.type) {
      case 'string':
        return `${prop.name}="默认值"`;
      case 'boolean':
        return `${prop.name}={true}`;
      case 'number':
        return `${prop.name}={1}`;
      default:
        if (prop.name === 'children') {
          return '';
        }
        return `${prop.name}={undefined}`;
    }
  }

  private getExamplePropValue(prop: any): string {
    switch (prop.type) {
      case 'string':
        return '"示例文本"';
      case 'boolean':
        return 'true';
      case 'number':
        return '42';
      default:
        if (prop.type.includes('|')) {
          // 联合类型，取第一个值
          const firstType = prop.type.split('|')[0].trim().replace(/'/g, '"');
          return firstType;
        }
        return 'undefined';
    }
  }
}`;
  }
}
```

### 🔄 更新主服务器

修改 `src/index.ts`，添加生成演示文件的工具：

```typescript
// ...existing imports...
import { FileGenerator } from './generators.js';

const server = new Server(
  {
    name: 'fluentui-plus-helper',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {
        analyze_component: {
          // ...existing code...
        },
        generate_demo: {
          description: '为组件生成演示文件',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: {
                type: 'string',
                description: '组件名称'
              }
            },
            required: ['componentName']
          }
        }
      }
    }
  }
);

const analyzer = new ComponentAnalyzer();
const generator = new FileGenerator();

server.setRequestHandler('tools/call', async (request) => {
  console.log('🔧 收到工具调用:', request.params.name);
  
  if (request.params.name === 'analyze_component') {
    // ...existing analyze code...
  }
  
  if (request.params.name === 'generate_demo') {
    try {
      const { componentName } = request.params.arguments;
      console.log(`📝 为组件 ${componentName} 生成演示文件...`);
      
      // 先分析组件
      const componentInfo = await analyzer.analyzeComponent(componentName);
      
      // 生成演示文件
      const demoPath = await generator.generateDemo(componentInfo);
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ 演示文件生成成功！

📁 文件路径: ${demoPath}

🎯 生成内容:
- 基础用法示例
- ${componentInfo.props.length} 个属性的使用示例
- 完整的使用说明

💡 下一步建议:
- 可以运行项目查看演示效果
- 可以继续生成单元测试和 Storybook`
          }
        ]
      };
      
    } catch (error) {
      console.error('❌ 生成演示文件失败:', error);
      return {
        content: [
          {
            type: 'text',
            text: `❌ 生成失败: ${error.message}`
          }
        ]
      };
    }
  }
  
  throw new Error(`未知的工具: ${request.params.name}`);
});

// ...existing main function...
```

---

## 🧪 第六步：完整测试

### 🔨 重新编译

```powershell
cd mcp-server
npm run build
npm run start
```

### 🎯 测试生成功能

在 Copilot Chat 中输入：

```
@workspace 为 Button 组件生成演示文件
```

成功后，你应该在 `demo/` 目录下看到生成的 `ButtonDemo.tsx` 文件！

---

## 📈 第七步：扩展功能

现在你已经掌握了基础，可以继续添加：

1. **生成单元测试** - 类似演示文件的生成方式
2. **生成 Storybook** - 使用 Storybook 的模板格式
3. **更新文档** - 解析现有文档并插入新内容

### 🎯 添加测试生成器示例

```typescript
// 在 generators.ts 中添加
async generateTest(componentInfo: ComponentInfo): Promise<string> {
  const testContent = `import React from 'react';
import { render, screen } from '@testing-library/react';
import { ${componentInfo.name} } from '../${componentInfo.name}';

describe('${componentInfo.name}', () => {
  test('should render correctly', () => {
    render(<${componentInfo.name}>Test content</${componentInfo.name}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  ${componentInfo.props.map(prop => `
  test('should handle ${prop.name} prop', () => {
    // 测试 ${prop.name} 属性
  });`).join('')}
});`;

  const testPath = path.join(
    this.projectRoot, 
    'src/components', 
    componentInfo.name, 
    '__tests__', 
    `${componentInfo.name}.test.tsx`
  );
  
  await fs.mkdir(path.dirname(testPath), { recursive: true });
  await fs.writeFile(testPath, testContent, 'utf-8');
  
  return testPath;
}
```

---

---

## 🤔 部署方式选择

你提到了一个重要问题：**MCP 服务器是否必须放在项目根目录下？**

答案是：**不一定！** 有多种部署方式可以选择：

### 📋 部署方式对比

| 部署方式 | 优势 | 劣势 | 适用场景 |
|----------|------|------|----------|
| **项目内部署** | 项目自包含，易于定制 | 每个项目都要维护一份代码 | 项目特定需求多 |
| **全局安装** | 多项目共享，统一维护 | 升级影响所有项目 | 标准化程度高 |
| **独立服务** | 完全解耦，可远程部署 | 配置复杂，网络依赖 | 团队协作使用 |

### 🎯 方案一：项目内部署（当前方案）

```
fluentui-plus/
├── mcp-server/           # MCP 服务器代码
├── src/components/       # 组件代码
├── demo/                # 生成的演示文件
└── .vscode/settings.json # 指向本地 mcp-server
```

**VS Code 配置**：
```json
{
  "mcp.servers": {
    "fluentui-plus-helper": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"],
      "cwd": "./mcp-server"
    }
  }
}
```

### 🌐 方案二：全局安装

将 MCP 服务器发布为 npm 包，全局安装使用。

#### 🔧 创建可发布的 MCP 包

修改 `mcp-server/package.json`：

```json
{
  "name": "@yourname/fluentui-plus-mcp",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "fluentui-plus-mcp": "./dist/index.js"
  },
  "files": ["dist/**/*"],
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "prepublishOnly": "npm run build"
  }
}
```

#### 📦 全局安装使用

```powershell
# 发布到 npm（或私有仓库）
cd mcp-server
npm publish

# 在任何项目中全局安装
npm install -g @yourname/fluentui-plus-mcp
```

#### ⚙️ 项目配置

任何项目的 `.vscode/settings.json`：

```json
{
  "mcp.servers": {
    "fluentui-plus-helper": {
      "command": "fluentui-plus-mcp"
    }
  }
}
```

### 🚀 方案三：独立服务部署

将 MCP 服务器部署为独立服务，支持多项目访问。

#### 🔧 创建服务版本

修改 `mcp-server/src/index.ts`，支持配置不同项目路径：

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ComponentAnalyzer } from './analyzer.js';
import { FileGenerator } from './generators.js';
import * as path from 'path';

// 从环境变量或参数获取项目路径
const PROJECT_ROOT = process.env.PROJECT_ROOT || process.argv[2] || process.cwd();
console.log(`🎯 服务项目路径: ${PROJECT_ROOT}`);

const server = new Server(
  {
    name: 'fluentui-plus-helper',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {
        set_project_root: {
          description: '设置当前工作的项目根目录',
          inputSchema: {
            type: 'object',
            properties: {
              projectPath: {
                type: 'string',
                description: '项目根目录的绝对路径'
              }
            },
            required: ['projectPath']
          }
        },
        // ...existing tools...
      }
    }
  }
);

// 创建分析器时传入项目路径
const analyzer = new ComponentAnalyzer(PROJECT_ROOT);
const generator = new FileGenerator(PROJECT_ROOT);

server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'set_project_root') {
    const { projectPath } = request.params.arguments;
    // 重新创建分析器和生成器
    analyzer.setProjectRoot(projectPath);
    generator.setProjectRoot(projectPath);
    
    return {
      content: [
        {
          type: 'text',
          text: `✅ 项目路径已设置为: ${projectPath}`
        }
      ]
    };
  }
  
  // ...existing handlers...
});
```

#### 🏠 团队服务器部署

```powershell
# 在团队服务器上部署
git clone your-mcp-server-repo
cd mcp-server
npm install
npm run build

# 创建系统服务（以 Windows 为例）
# 或使用 PM2 等进程管理工具
pm2 start dist/index.js --name fluentui-plus-mcp
```

#### 🔗 项目连接配置

每个项目的 `.vscode/settings.json`：

```json
{
  "mcp.servers": {
    "fluentui-plus-helper": {
      "command": "node",
      "args": [
        "\\\\team-server\\mcp-services\\fluentui-plus-mcp\\dist\\index.js",
        "C:\\Users\\j-huirudong\\Projects\\current-project"
      ]
    }
  }
}
```

### � 推荐方案：混合部署

考虑到你的实际需求，我推荐采用**渐进式部署策略**：

#### 🏃‍♂️ 第一阶段：项目内开发验证

```
fluentui-plus/
├── mcp-server/           # 开发和验证阶段
├── src/components/       
└── .vscode/settings.json
```

#### 🚀 第二阶段：团队标准化

将稳定版本提取为独立仓库：

```
fluentui-plus-mcp-server/     # 独立仓库
├── src/
├── package.json
└── README.md

fluentui-plus/                # 组件库项目
├── src/components/       
├── .vscode/settings.json     # 指向全局或远程 MCP
└── package.json              # 可选：devDependencies 包含 MCP
```

#### ⚙️ 灵活配置支持

创建 `fluentui-plus.config.js` 支持不同部署方式：

```javascript
// fluentui-plus.config.js
export default {
  mcp: {
    // 部署模式：local | global | remote
    deployment: 'local',
    
    // 本地模式配置
    local: {
      serverPath: './mcp-server/dist/index.js'
    },
    
    // 全局模式配置  
    global: {
      packageName: '@yourteam/fluentui-plus-mcp'
    },
    
    // 远程模式配置
    remote: {
      serverHost: 'team-server.company.com',
      serverPort: 3001
    }
  },
  
  // 项目路径配置
  paths: {
    components: 'src/components',
    demo: 'demo',
    stories: 'stories',
    docs: 'docs'
  }
};
```

### 🔧 自动配置脚本

创建 `setup-mcp.js` 脚本自动配置：

```javascript
// setup-mcp.js
import * as fs from 'fs/promises';
import * as path from 'path';

const deploymentModes = {
  local: {
    name: '本地部署（推荐开发使用）',
    config: {
      command: 'node',
      args: ['./mcp-server/dist/index.js'],
      cwd: './mcp-server'
    }
  },
  global: {
    name: '全局安装（推荐团队使用）',
    config: {
      command: 'fluentui-plus-mcp'
    }
  }
};

async function setupMCP() {
  console.log('🎯 Fluentui Plus MCP 配置工具\n');
  
  // 检测现有配置
  const vscodeSettingsPath = '.vscode/settings.json';
  let settings = {};
  
  try {
    const content = await fs.readFile(vscodeSettingsPath, 'utf-8');
    settings = JSON.parse(content);
  } catch {
    await fs.mkdir('.vscode', { recursive: true });
  }
  
  // 选择部署模式（这里简化为自动检测）
  const hasLocalServer = await fs.access('./mcp-server').then(() => true).catch(() => false);
  const mode = hasLocalServer ? 'local' : 'global';
  
  console.log(`🔧 检测到 ${deploymentModes[mode].name} 模式`);
  
  // 配置 MCP 服务器
  settings['mcp.servers'] = {
    'fluentui-plus-helper': deploymentModes[mode].config
  };
  
  // 写入配置
  await fs.writeFile(vscodeSettingsPath, JSON.stringify(settings, null, 2));
  
  console.log('✅ MCP 配置完成！');
  console.log('💡 请重启 VS Code 以生效');
}

setupMCP().catch(console.error);
```

### 🎪 使用建议

1. **开发阶段**：使用项目内部署，便于调试和定制
2. **团队协作**：逐步迁移到全局安装，统一维护
3. **企业使用**：考虑独立服务部署，支持更多项目

你现在可以根据自己的需求选择合适的部署方式。建议先按照当前指南完成项目内部署的验证，确保功能正常后再考虑其他部署方式。

---

## �🎉 总结

恭喜！你现在已经：

1. ✅ **创建了 MCP 服务器** - 能响应 AI 的请求
2. ✅ **实现了组件分析** - 能读取和解析 React 组件代码  
3. ✅ **配置了 VS Code 集成** - 能通过 Copilot 对话操作
4. ✅ **实现了文件生成** - 能自动创建演示文件
5. ✅ **掌握了扩展方法** - 知道如何添加更多功能
6. ✅ **了解了部署选项** - 知道如何灵活部署 MCP 服务器

### 🚀 下一步

- 继续添加测试生成、Storybook 生成功能
- 完善错误处理和用户体验
- 添加更智能的代码分析（如样式、导入等）
- 根据团队需求选择合适的部署方式
- 考虑集成 AI API 来生成更智能的内容

你已经成功搭建了一个可工作的 MCP 自动化系统！这个系统可以大大提高你的组件开发效率。
