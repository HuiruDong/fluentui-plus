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
| `onClose` | `(e: React.MouseEvent<HTMLElement>) => void` | - | 关闭回调函数 |
| `onClick` | `(e: React.MouseEvent<HTMLElement>) => void` | - | 点击回调函数 |
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
| `closeIcon` | `boolean \| React.ReactNode` | `false` | 是否显示关闭图标，可自定义图标 |
| `bordered` | `boolean` | `true` | 是否显示边框 |
| `className` | `string` | - | 自定义样式类名 |
| `style` | `React.CSSProperties` | - | 自定义内联样式 |
| `onClose` | `(e: React.MouseEvent<HTMLElement>) => void` | - | 关闭回调函数 |
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
| `delimiter` | `string \| RegExp` | - | 自定义分隔符，支持字符串或正则表达式，用于自动分割输入内容为标签 |
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

### Select 选择器

高度可定制的选择器组件，支持单选、多选、搜索、分组、自定义渲染等功能。基于 FluentUI 设计系统，提供企业级的用户体验和完整的无障碍支持。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string \| number \| (string \| number)[]` | - | 受控模式的选中值，单选时为单个值，多选时为值数组 |
| `defaultValue` | `string \| number \| (string \| number)[]` | - | 非受控模式的默认选中值 |
| `className` | `string` | - | 自定义样式类名 |
| `style` | `React.CSSProperties` | - | 自定义内联样式 |
| `disabled` | `boolean` | `false` | 是否禁用选择器 |
| `placeholder` | `string` | - | 选择框占位符文本 |
| `multiple` | `boolean` | `false` | 是否支持多选模式 |
| `showSearch` | `boolean` | `false` | 是否显示搜索输入框，支持过滤选项 |
| `options` | `GroupedOption[]` | `[]` | 选项数据，支持分组选项和普通选项混合使用 |
| `listHeight` | `number` | `256` | 下拉列表的最大高度（像素），超出时显示滚动条 |
| `open` | `boolean` | - | 是否展开下拉菜单（受控模式） |
| `onChange` | `(value, selectedOptions) => void` | - | 选中选项时的回调函数，参数为选中值和选中选项对象 |
| `onSearch` | `(value: string) => void` | - | 搜索输入变化时的回调函数，用于异步搜索场景 |
| `filterOption` | `(input: string, option: Option) => boolean` | - | 自定义过滤逻辑函数，返回 true 表示选项匹配 |
| `optionRender` | `(option: Option) => React.ReactNode` | - | 自定义选项渲染函数，可实现复杂的选项样式 |
| `popupRender` | `(originNode: React.ReactNode) => React.ReactNode` | - | 自定义下拉容器渲染函数，可添加头部/尾部内容 |
| `onClear` | `() => void` | - | 点击清除按钮时的回调函数 |
| `allowClear` | `boolean \| { clearIcon?: React.ReactNode }` | `false` | 是否显示清除按钮，支持自定义清除图标 |
| `labelRender` | `(selectedOptions: Option \| Option[] \| null) => string` | - | 自定义已选中标签的渲染函数，用于个性化显示选中内容 |

#### Option 类型

```typescript
// 基础选项类型
type Option = {
  disabled?: boolean;    // 是否禁用该选项
  title?: string;        // 鼠标悬停时显示的提示文本
  value?: string | number; // 选项的值，作为 onChange 回调的参数
  label?: string;        // 选项显示的文本
};

// 分组选项类型
type OptionGroup = {
  label: string;         // 分组标题
  options: Option[];     // 该分组下的选项列表
};

// 组合选项类型（支持普通选项和分组选项混合使用）
type GroupedOption = Option | OptionGroup;
```

#### 示例

```jsx
import { Select } from '@luoluoyu/fluentui-plus';

// 基础用法
const options = [
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3', disabled: true }
];

<Select 
  placeholder="请选择"
  options={options}
  onChange={(value, option) => console.log('选中:', value, option)}
/>

// 多选模式
<Select 
  multiple
  placeholder="请选择多个选项"
  options={options}
  allowClear
  onChange={(values, options) => console.log('选中:', values, options)}
/>

// 支持搜索和过滤
<Select 
  showSearch
  placeholder="搜索并选择"
  options={options}
  onSearch={(value) => console.log('搜索:', value)}
  filterOption={(input, option) => 
    option.label?.toLowerCase().includes(input.toLowerCase())
  }
/>

// 自定义清除图标
<Select 
  allowClear={{ clearIcon: <span>✗</span> }}
  placeholder="自定义清除图标"
  options={options}
  defaultValue="option1"
  onClear={() => console.log('已清除')}
/>

// 分组选项
const groupedOptions = [
  // 普通选项（与分组混合使用）
  { label: '全部', value: 'all' },
  
  // 分组选项
  {
    label: '水果类',
    options: [
      { label: '苹果', value: 'apple' },
      { label: '香蕉', value: 'banana' }
    ]
  },
  {
    label: '蔬菜类',
    options: [
      { label: '胡萝卜', value: 'carrot' },
      { label: '西兰花', value: 'broccoli' }
    ]
  }
];

<Select 
  placeholder="请选择食物"
  options={groupedOptions}
  showSearch
  onChange={(value, option) => console.log('选中:', value, option)}
/>

// 自定义选项渲染
<Select 
  placeholder="自定义选项样式"
  options={options}
  optionRender={option => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{option.label}</span>
      <span style={{ color: '#999', fontSize: '12px' }}>{option.value}</span>
    </div>
  )}
/>

// 自定义弹窗内容
<Select 
  placeholder="自定义弹窗"
  options={options}
  popupRender={originNode => (
    <div>
      <div style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
        选择您需要的选项
      </div>
      {originNode}
      <div style={{ padding: '8px', textAlign: 'center', color: '#999' }}>
        共 {options.length} 个选项
      </div>
    </div>
  )}
/>

// 自定义标签渲染
<Select 
  multiple
  placeholder="自定义标签显示"
  options={options}
  defaultValue={['option1', 'option2']}
  labelRender={selectedOptions => {
    if (Array.isArray(selectedOptions)) {
      return `已选择 ${selectedOptions.length} 项: ${selectedOptions.map(opt => opt.label).join(', ')}`;
    }
    return selectedOptions?.label || '';
  }}
/>

// 受控模式
const [value, setValue] = useState();
<Select 
  value={value}
  onChange={setValue}
  placeholder="受控模式"
  options={options}
/>

// 受控展开状态
const [open, setOpen] = useState(false);
<Select 
  open={open}
  placeholder="受控展开"
  options={options}
  onChange={(value) => {
    console.log('选中:', value);
    setOpen(false); // 选择后自动关闭
  }}
/>

// 异步搜索
const [loading, setLoading] = useState(false);
const [searchOptions, setSearchOptions] = useState([]);

<Select 
  showSearch
  placeholder={loading ? "搜索中..." : "异步搜索"}
  options={searchOptions}
  disabled={loading}
  onSearch={async (searchText) => {
    if (searchText) {
      setLoading(true);
      // 模拟异步搜索
      const results = await fetchSearchResults(searchText);
      setSearchOptions(results);
      setLoading(false);
    }
  }}
/>
```

## TypeScript 支持

所有组件都提供完整的 TypeScript 类型定义。你可以从组件库导入类型：

```typescript
import type { 
  TagProps, 
  CheckableTagProps, 
  InputTagProps, 
  NavProps, 
  NavItemType,
  SelectProps,
  Option,
  OptionGroup,
  GroupedOption
} from '@luoluoyu/fluentui-plus';

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

const selectOptions: Option[] = [
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' }
];

// 分组选项示例
const groupedSelectOptions: GroupedOption[] = [
  { label: '全部', value: 'all' },
  {
    label: '水果类',
    options: [
      { label: '苹果', value: 'apple' },
      { label: '香蕉', value: 'banana' }
    ]
  }
];

const selectProps: SelectProps = {
  placeholder: '请选择',
  options: selectOptions,
  allowClear: true,
  showSearch: true,
  multiple: false,
  onChange: (value, selectedOptions) => {
    console.log('选中值:', value);
    console.log('选中选项:', selectedOptions);
  }
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

## 通用 Hooks

组件库还提供了一些通用的 React Hooks，可以在自定义组件开发中使用：

### useTagManager

用于管理标签列表的状态，提供标签的添加、删除、批量操作等功能。

#### 参数

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `string[]` | - | 受控模式的标签数组 |
| `defaultValue` | `string[]` | `[]` | 非受控模式的默认标签数组 |
| `onChange` | `(tags: string[]) => void` | - | 标签变化回调 |
| `maxTags` | `number` | - | 最大标签数量 |
| `allowDuplicates` | `boolean` | `true` | 是否允许重复标签 |

#### 返回值

```typescript
{
  getCurrentTags: () => string[];  // 获取当前标签数组
  addTag: (tag: string) => boolean;  // 添加单个标签
  removeTag: (index: number) => boolean;  // 删除指定位置的标签
  addMultipleTags: (tags: string[]) => number;  // 批量添加标签，返回实际添加的数量
}
```

#### 示例

```typescript
import { useTagManager } from '@luoluoyu/fluentui-plus';

const MyComponent = () => {
  const {
    getCurrentTags,
    addTag,
    removeTag,
    addMultipleTags
  } = useTagManager({
    defaultValue: ['React', 'TypeScript'],
    maxTags: 10,
    allowDuplicates: false,
    onChange: (tags) => console.log('标签变化:', tags)
  });

  const handleAddTag = () => {
    const success = addTag('JavaScript');
    console.log('添加成功:', success);
  };

  const tags = getCurrentTags();
  
  return (
    <div>
      {tags.map((tag, index) => (
        <span key={index} onClick={() => removeTag(index)}>
          {tag} ×
        </span>
      ))}
      <button onClick={handleAddTag}>添加标签</button>
      <button onClick={() => addMultipleTags(['Vue', 'Angular'])}>
        批量添加
      </button>
    </div>
  );
};
```

### useInputValue

用于管理输入框的值状态和焦点状态。

#### 参数

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `initialValue` | `string` | `''` | 初始输入值 |
| `onInputChange` | `(value: string) => void` | - | 输入值变化回调 |

#### 返回值

```typescript
{
  inputValue: string;  // 当前输入值
  setInputValue: (value: string) => void;  // 设置输入值
  isFocused: boolean;  // 是否处于焦点状态
  setIsFocused: (focused: boolean) => void;  // 设置焦点状态
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;  // 处理输入变化事件
  clearInput: () => void;  // 清空输入
}
```

#### 示例

```typescript
import { useInputValue } from '@luoluoyu/fluentui-plus';

const MyInput = () => {
  const {
    inputValue,
    setInputValue,
    isFocused,
    setIsFocused,
    handleInputChange,
    clearInput
  } = useInputValue({
    initialValue: '',
    onInputChange: (value) => console.log('输入变化:', value)
  });

  return (
    <div>
      <input 
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="请输入内容"
      />
      <button onClick={clearInput}>清空</button>
      <p>当前值: {inputValue}</p>
      <p>焦点状态: {isFocused ? '有焦点' : '无焦点'}</p>
    </div>
  );
};
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
