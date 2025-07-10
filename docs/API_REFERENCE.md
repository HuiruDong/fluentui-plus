# API 参考文档

## 组件 API

### Tag 标签

用于展示信息的标签组件。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `color` | `string` | - | 标签颜色，支持任意颜色值 |
| `closeIcon` | `boolean \| React.ReactNode` | `false` | 是否显示关闭图标，可自定义图标 |
| `bordered` | `boolean` | `true` | 是否显示边框 |
| `className` | `string` | - | 自定义样式类名 |
| `style` | `React.CSSProperties` | - | 自定义内联样式 |
| `onClose` | `(e: React.MouseEvent) => void` | - | 关闭回调函数 |
| `onClick` | `(e: React.MouseEvent) => void` | - | 点击回调函数 |
| `children` | `React.ReactNode` | - | 标签内容 |

#### 示例

```jsx
import { Tag } from '@luoluoyu/fluentui-plus';

// 基础用法
<Tag>默认标签</Tag>

// 不同颜色
<Tag color="#52c41a">成功</Tag>
<Tag color="#f5222d">错误</Tag>
<Tag color="#faad14">警告</Tag>

// 可关闭标签
<Tag closeIcon onClose={() => console.log('关闭')}>
  可关闭标签
</Tag>

// 无边框标签
<Tag bordered={false}>无边框标签</Tag>
```

### CheckableTag 可选择标签

支持选中状态的标签组件，通过 `Tag.CheckableTag` 访问。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `checked` | `boolean` | - | 是否选中 |
| `onChange` | `(checked: boolean) => void` | - | 选中状态变化回调 |
| `color` | `string` | - | 标签颜色，支持任意颜色值 |
| `bordered` | `boolean` | `true` | 是否显示边框 |
| `className` | `string` | - | 自定义样式类名 |
| `style` | `React.CSSProperties` | - | 自定义内联样式 |
| `children` | `React.ReactNode` | - | 标签内容 |

#### 示例

```jsx
import { Tag } from '@luoluoyu/fluentui-plus';

const [checked, setChecked] = useState(false);

<Tag.CheckableTag 
  checked={checked} 
  onChange={setChecked}
>
  可选择标签
</Tag.CheckableTag>
```

### InputTag 标签输入

支持动态添加和删除标签的输入组件。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string[]` | - | 受控模式的标签值 |
| `defaultValue` | `string[]` | - | 非受控模式的默认标签值 |
| `onChange` | `(tags: string[]) => void` | - | 标签列表变化时的回调 |
| `onInputChange` | `(value: string) => void` | - | 输入内容变化时的回调 |
| `placeholder` | `string` | - | 输入框占位符 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `maxTags` | `number` | - | 最大标签数量 |
| `allowDuplicates` | `boolean` | `true` | 是否允许重复标签 |
| `delimiter` | `string \| RegExp` | - | 自定义分隔符，用于自动分割输入内容为标签 |
| `tagClosable` | `boolean` | `true` | 标签是否可关闭 |
| `renderTag` | `(tag: string, index: number, onClose: () => void) => React.ReactNode` | - | 自定义标签渲染 |
| `onTagRemove` | `(tag: string, index: number) => void` | - | 标签被移除时的回调 |
| `className` | `string` | - | 自定义样式类名 |
| `style` | `React.CSSProperties` | - | 自定义内联样式 |

#### 示例

```jsx
import { InputTag } from '@luoluoyu/fluentui-plus';

const [tags, setTags] = useState(['React', 'TypeScript']);

<InputTag 
  value={tags}
  onChange={setTags}
  placeholder="输入新标签..."
  maxTags={10}
  allowDuplicates={false}
  delimiter={[',', ';', ' ']}
/>
```

### Nav 导航

垂直导航菜单组件，支持多级嵌套、展开收起等功能。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `items` | `NavItemType[]` | `[]` | 导航项列表 |
| `mode` | `'inline'` | `'inline'` | 菜单模式，目前仅支持内联模式 |
| `collapsed` | `boolean` | `false` | 是否收起菜单 |
| `selectedKeys` | `string[]` | - | 当前选中的菜单项 |
| `defaultSelectedKeys` | `string[]` | - | 默认选中的菜单项 |
| `openKeys` | `string[]` | - | 当前展开的子菜单 |
| `defaultOpenKeys` | `string[]` | - | 默认展开的子菜单 |
| `onSelect` | `(info: { key: string; keyPath: string[]; selectedKeys: string[]; item: NavItemType }) => void` | - | 选择菜单项时的回调 |
| `onOpenChange` | `(openKeys: string[]) => void` | - | 展开/收起子菜单时的回调 |
| `expandIcon` | `React.ReactNode` | - | 自定义展开图标 |
| `className` | `string` | - | 容器样式类 |
| `style` | `React.CSSProperties` | - | 容器样式 |

#### NavItemType 类型

```typescript
interface NavItemType {
  key: string; // 唯一标识
  type?: 'item' | 'divider' | 'group'; // 菜单项类型
  label?: React.ReactNode; // 菜单项标题（group 类型时作为分组标题）
  title?: string; // 设置收缩时展示的悬浮标题
  icon?: React.ReactNode; // 菜单图标
  disabled?: boolean; // 是否禁用
  children?: NavItemType[]; // 子菜单项（group 类型时作为分组的菜单项）
  className?: string; // 自定义样式类
  style?: React.CSSProperties; // 自定义样式
}
```

#### 示例

```jsx
import { Nav } from '@luoluoyu/fluentui-plus';

const navItems = [
  { key: 'home', label: '首页', icon: '🏠', title: '首页' },
  { 
    key: 'products', 
    label: '产品管理', 
    icon: '📦',
    title: '产品管理',
    children: [
      { key: 'product-list', label: '产品列表', icon: '📋', title: '产品列表' },
      { key: 'add-product', label: '添加产品', icon: '➕', title: '添加产品' }
    ]
  },
  { key: 'settings', label: '设置', icon: '⚙️', title: '设置' }
];

<Nav 
  items={navItems}
  defaultSelectedKeys={['home']}
  defaultOpenKeys={['products']}
  onSelect={({ key, item }) => console.log('选择了:', key, item)}
  onOpenChange={(openKeys) => console.log('展开状态:', openKeys)}
/>
```

## TypeScript 支持

所有组件都提供完整的 TypeScript 类型定义。你可以从组件库导入类型：

```typescript
import type { TagProps, CheckableTagProps, InputTagProps, NavProps, NavItemType } from '@luoluoyu/fluentui-plus';

// 使用类型
const tagProps: TagProps = {
  color: '#1890ff',
  closeIcon: true,
  bordered: true
};

const navItem: NavItemType = {
  key: 'example',
  label: '示例',
  icon: '📝',
  title: '示例菜单'
};
```

## 样式定制

### CSS 变量

组件使用 CSS 变量来支持主题定制：

```css
:root {
  /* 主要颜色 */
  --fluentui-plus-primary: #0078d4;
  --fluentui-plus-success: #107c10;
  --fluentui-plus-warning: #ff8c00;
  --fluentui-plus-error: #d13438;
  
  /* 尺寸 */
  --fluentui-plus-border-radius: 4px;
  --fluentui-plus-font-size-small: 12px;
  --fluentui-plus-font-size-medium: 14px;
  --fluentui-plus-font-size-large: 16px;
}
```

### Less 变量

如果使用 Less 构建，可以覆盖预定义变量：

```less
// 在导入组件样式前定义变量
@fluentui-plus-primary: #your-brand-color;
@fluentui-plus-border-radius: 8px;

@import '~@luoluoyu/fluentui-plus/dist/styles/index.less';
```

## 浏览器兼容性

- ✅ Chrome >= 80
- ✅ Firefox >= 78
- ✅ Safari >= 13
- ✅ Edge >= 80
- ⚠️ IE 11 (需要 polyfill)

### IE 11 支持

如需支持 IE 11，请添加以下 polyfill：

```bash
npm install core-js@3
```

```javascript
// 在应用入口添加
import 'core-js/stable';
```
