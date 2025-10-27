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

### Cascader 级联选择

用于级联选择的组件，支持多级嵌套选项和多选模式。基于树形数据结构，提供直观的层级选择体验。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `CascaderValue \| CascaderMultipleValue` | - | 受控模式的选中值，单选时为值数组，多选时为值数组的数组 |
| `defaultValue` | `CascaderValue \| CascaderMultipleValue` | - | 非受控模式的默认选中值 |
| `className` | `string` | - | 自定义样式类名 |
| `style` | `React.CSSProperties` | - | 自定义内联样式 |
| `disabled` | `boolean` | `false` | 是否禁用选择器 |
| `placeholder` | `string` | - | 选择框占位符文本 |
| `multiple` | `boolean` | `false` | 是否支持多选模式 |
| `showSearch` | `boolean` | `false` | 是否显示搜索输入框，支持在选项中搜索 |
| `options` | `CascaderOption[]` | `[]` | 级联选项数据，支持树形结构 |
| `listHeight` | `number` | `256` | 下拉面板的最大高度（像素），超出时显示滚动条 |
| `open` | `boolean` | - | 是否展开下拉面板（受控模式） |
| `expandTrigger` | `'click' \| 'hover'` | `'click'` | 展开子菜单的触发方式 |
| `changeOnSelect` | `boolean` | `false` | 点击选项时是否立即触发 onChange，而不是只在选择叶子节点时触发 |
| `onChange` | `(value, selectedOptions) => void` | - | 选中选项时的回调函数，参数为选中值和选中选项对象 |
| `onSearch` | `(value: string) => void` | - | 搜索输入变化时的回调函数 |
| `optionRender` | `(option: CascaderOption) => React.ReactNode` | - | 自定义选项渲染函数 |
| `popupRender` | `(originNode: React.ReactNode) => React.ReactNode` | - | 自定义下拉容器渲染函数，可添加头部/尾部内容 |
| `onClear` | `() => void` | - | 点击清除按钮时的回调函数 |
| `allowClear` | `boolean \| { clearIcon?: React.ReactNode }` | `false` | 是否显示清除按钮，支持自定义清除图标 |
| `labelRender` | `(option: CascaderOption) => string` | - | 多选模式下自定义单个选项标签的渲染函数 |

#### CascaderOption 类型

```typescript
type CascaderOption = {
  disabled?: boolean;     // 是否禁用该选项
  title?: string;         // 鼠标悬停时显示的提示文本
  value?: string | number; // 选项的值
  label?: string;         // 选项显示的文本
  children?: CascaderOption[]; // 子选项，支持多级嵌套
};

// 级联选择的值类型
type CascaderValue = (string | number)[];

// 多选模式下的级联值类型  
type CascaderMultipleValue = CascaderValue[];
```

#### 示例

```jsx
import { Cascader } from '@luoluoyu/fluentui-plus';

// 基础级联数据
const cascaderOptions = [
  {
    label: '浙江省',
    value: 'zhejiang',
    children: [
      {
        label: '杭州市',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '余杭区', value: 'yuhang' }
        ]
      },
      {
        label: '宁波市', 
        value: 'ningbo',
        children: [
          { label: '海曙区', value: 'haishu' },
          { label: '江北区', value: 'jiangbei' }
        ]
      }
    ]
  },
  {
    label: '江苏省',
    value: 'jiangsu', 
    children: [
      {
        label: '南京市',
        value: 'nanjing',
        children: [
          { label: '鼓楼区', value: 'gulou' },
          { label: '建邺区', value: 'jianye' }
        ]
      }
    ]
  }
];

// 基础用法
<Cascader 
  placeholder="请选择地区"
  options={cascaderOptions}
  onChange={(value, selectedOptions) => console.log('选中:', value, selectedOptions)}
/>

// 多选模式
<Cascader 
  multiple
  placeholder="请选择多个地区"
  options={cascaderOptions}
  allowClear
  onChange={(values, selectedOptions) => console.log('选中:', values, selectedOptions)}
/>

// 支持搜索
<Cascader 
  showSearch
  placeholder="搜索并选择地区"
  options={cascaderOptions}
  onSearch={(value) => console.log('搜索:', value)}
/>

// 悬停展开子菜单
<Cascader 
  expandTrigger="hover"
  placeholder="悬停展开"
  options={cascaderOptions}
/>

// 点击任意级别选项都触发变化
<Cascader 
  changeOnSelect
  placeholder="点击任意级别都可选择"
  options={cascaderOptions}
  onChange={(value, selectedOptions) => console.log('选中:', value, selectedOptions)}
/>

// 自定义选项渲染
<Cascader 
  placeholder="自定义选项样式"
  options={cascaderOptions}
  optionRender={option => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>{option.label}</span>
      {option.children && <span style={{ color: '#999' }}>({option.children.length})</span>}
    </div>
  )}
/>

// 受控模式
const [value, setValue] = useState(['zhejiang', 'hangzhou', 'xihu']);
<Cascader 
  value={value}
  onChange={setValue}
  placeholder="受控模式"
  options={cascaderOptions}
/>
```

### Checkbox 复选框

用于在一组选项中进行多选，支持单独使用或组合使用。

注意：本组件虽然基于 FluentUI 的 Checkbox 组件构建，但在交互和样式上进行了定制化处理，以提供更好的企业级使用体验。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `checked` | `boolean` | - | 是否选中（受控模式） |
| `defaultChecked` | `boolean` | - | 默认是否选中（非受控模式） |
| `onChange` | `(checked: boolean) => void` | - | 选中状态变化时的回调 |
| `indeterminate` | `boolean` | `false` | 设置半选状态，仅在 checked 为 false 时生效 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `className` | `string` | - | 自定义样式类名 |
| `style` | `React.CSSProperties` | - | 自定义内联样式 |
| `labelPosition` | `'before' \| 'after'` | `'after'` | 标签位置，before 表示标签在复选框前面 |
| `children` | `React.ReactNode` | - | 复选框标签内容 |

#### Checkbox.Group 复选框组

用于管理一组复选框的选中状态。

##### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `value` | `(string \| number)[]` | - | 当前选中的选项值数组（受控模式） |
| `defaultValue` | `(string \| number)[]` | - | 默认选中的选项值数组（非受控模式） |
| `onChange` | `(checkedValue: (string \| number)[]) => void` | - | 选中项变化时的回调 |
| `options` | `Option[]` | - | 选项配置 |
| `disabled` | `boolean` | `false` | 是否禁用整个组 |
| `layout` | `'vertical' \| 'horizontal'` | `'horizontal'` | 布局方向 |
| `className` | `string` | - | 自定义样式类名 |
| `style` | `React.CSSProperties` | - | 自定义内联样式 |

##### Option 类型

```typescript
interface Option {
  label: string;               // 选项显示文本
  value: string | number;      // 选项值
  disabled?: boolean;          // 是否禁用该选项
  labelPosition?: 'before' | 'after'; // 该选项的标签位置
}
```

#### 示例

```jsx
import { Checkbox } from '@luoluoyu/fluentui-plus';

// 基础用法
<Checkbox onChange={(checked) => console.log('选中状态:', checked)}>
  我同意用户协议
</Checkbox>

// 受控模式
const [checked, setChecked] = useState(false);
<Checkbox checked={checked} onChange={setChecked}>
  受控复选框
</Checkbox>

// 半选状态
<Checkbox indeterminate onChange={(checked) => console.log('状态变化:', checked)}>
  半选状态
</Checkbox>

// 禁用状态
<Checkbox disabled>禁用复选框</Checkbox>
<Checkbox disabled checked>禁用且选中</Checkbox>

// 标签在前面
<Checkbox labelPosition="before">标签在前面</Checkbox>

// 复选框组 - 使用 options
const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橘子', value: 'orange', disabled: true },
];

<Checkbox.Group 
  options={options}
  defaultValue={['apple']}
  onChange={(values) => console.log('选中的值:', values)}
/>

// 复选框组 - 垂直布局
<Checkbox.Group 
  layout="vertical"
  options={options}
  onChange={(values) => console.log('选中的值:', values)}
/>

// 复选框组 - 受控模式
const [groupValue, setGroupValue] = useState(['apple', 'banana']);
<Checkbox.Group 
  value={groupValue}
  options={options}
  onChange={setGroupValue}
/>

// 复选框组 - 自定义内容
<Checkbox.Group onChange={(values) => console.log('选中的值:', values)}>
  <Checkbox value="option1">选项一</Checkbox>
  <Checkbox value="option2">选项二</Checkbox>
  <Checkbox value="option3" disabled>选项三（禁用）</Checkbox>
</Checkbox.Group>
```

### Modal 对话框

用于在不离开当前页面的情况下，显示重要信息或进行用户交互。支持多种类型和自定义内容。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `open` | `boolean` | `false` | 是否显示对话框 |
| `title` | `React.ReactNode` | - | 对话框标题 |
| `onOk` | `() => void` | - | 点击确定按钮的回调 |
| `onCancel` | `() => void` | - | 点击取消按钮或关闭按钮的回调 |
| `okText` | `string` | `'确定'` | 确定按钮文本 |
| `okType` | `ButtonProps['appearance']` | `'primary'` | 确定按钮类型 |
| `okButtonProps` | `ButtonProps` | - | 确定按钮的额外属性 |
| `cancelButtonProps` | `ButtonProps` | - | 取消按钮的额外属性 |
| `closable` | `boolean` | `true` | 是否显示关闭按钮 |
| `closeIcon` | `ButtonProps['icon']` | - | 自定义关闭图标 |
| `mask` | `boolean` | `true` | 是否显示遮罩层 |
| `footer` | `React.ReactNode \| null \| ((originNode, extra) => React.ReactNode)` | - | 自定义底部内容，null 时不显示底部 |
| `className` | `string` | - | 自定义样式类名 |
| `style` | `React.CSSProperties` | - | 自定义内联样式 |
| `children` | `React.ReactNode` | - | 对话框内容 |

#### 静态方法

Modal 提供了几个静态方法用于快速创建不同类型的对话框：

- `Modal.info(config)` - 信息提示对话框
- `Modal.success(config)` - 成功提示对话框  
- `Modal.error(config)` - 错误提示对话框
- `Modal.warning(config)` - 警告提示对话框
- `Modal.confirm(config)` - 确认对话框

##### 静态方法配置

```typescript
interface StaticModalProps {
  title?: React.ReactNode;         // 对话框标题
  content?: React.ReactNode;       // 对话框内容
  onOk?: () => void | Promise<void>; // 确定按钮回调，支持异步
  onCancel?: () => void;           // 取消按钮回调
  okText?: string;                 // 确定按钮文本
  okType?: ButtonProps['appearance']; // 确定按钮类型
  okButtonProps?: ButtonProps;     // 确定按钮属性
  cancelButtonProps?: ButtonProps; // 取消按钮属性
  closable?: boolean;              // 是否显示关闭按钮
  closeIcon?: ButtonProps['icon']; // 自定义关闭图标
  mask?: boolean;                  // 是否显示遮罩层
  footer?: React.ReactNode | null | ((originNode, extra) => React.ReactNode); // 自定义底部
  className?: string;              // 自定义样式类名
  style?: React.CSSProperties;     // 自定义内联样式
  theme?: Theme;                   // FluentUI 主题
}
```

静态方法返回一个包含 `destroy()` 方法的对象，可以用来手动关闭对话框。

#### 示例

```jsx
import { Modal } from '@luoluoyu/fluentui-plus';

// 基础用法
const [isModalOpen, setIsModalOpen] = useState(false);

<Modal
  title="基础对话框"
  open={isModalOpen}
  onOk={() => setIsModalOpen(false)}
  onCancel={() => setIsModalOpen(false)}
>
  <p>这是对话框的内容...</p>
</Modal>

// 自定义底部按钮
<Modal
  title="自定义按钮"
  open={isModalOpen}
  okText="提交"
  okType="primary"
  okButtonProps={{ disabled: false }}
  cancelButtonProps={{ appearance: 'outline' }}
  onOk={() => console.log('提交')}
  onCancel={() => setIsModalOpen(false)}
>
  <p>自定义按钮文本和属性</p>
</Modal>

// 自定义底部内容
<Modal
  title="自定义底部"
  open={isModalOpen}
  footer={(originNode, { OkBtn, CancelBtn }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <button>额外操作</button>
      <div>
        <CancelBtn />
        <OkBtn />
      </div>
    </div>
  )}
>
  <p>自定义底部布局</p>
</Modal>

// 无底部的对话框
<Modal
  title="无底部对话框"
  open={isModalOpen}
  footer={null}
  onCancel={() => setIsModalOpen(false)}
>
  <p>这个对话框没有底部按钮</p>
</Modal>

// 静态方法使用
// 信息提示
Modal.info({
  title: '提示信息',
  content: '这是一条信息提示',
  onOk: () => console.log('确定')
});

// 成功提示
Modal.success({
  title: '操作成功',
  content: '您的操作已成功完成！',
});

// 错误提示
Modal.error({
  title: '操作失败', 
  content: '操作过程中发生了错误，请重试。',
});

// 警告提示
Modal.warning({
  title: '注意',
  content: '此操作可能会产生风险，请谨慎处理。',
});

// 确认对话框
Modal.confirm({
  title: '确认删除',
  content: '确定要删除这个项目吗？此操作不可恢复。',
  onOk: () => {
    console.log('确认删除');
    // 执行删除操作
  },
  onCancel: () => {
    console.log('取消删除');
  }
});

// 异步确认对话框
Modal.confirm({
  title: '提交数据',
  content: '确定要提交这些数据吗？',
  onOk: async () => {
    try {
      await submitData(); // 异步操作
      console.log('提交成功');
    } catch (error) {
      console.error('提交失败:', error);
    }
  }
});

// 手动控制静态对话框的关闭
const modal = Modal.info({
  title: '加载中',
  content: '正在处理数据...',
});

// 5秒后自动关闭
setTimeout(() => {
  modal.destroy();
}, 5000);
```

### Table 表格

用于展示行列数据的表格组件。基于 rc-table 实现逻辑，支持数据渲染、固定列、横向和纵向滚动等功能。适用于展示大量结构化数据的场景。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `dataSource` | `RecordType[]` | `[]` | 数据源数组 |
| `columns` | `ColumnType<RecordType>[]` | `[]` | 列配置数组 |
| `rowKey` | `string \| ((record: RecordType) => string)` | `'key'` | 数据行的唯一标识字段名或函数 |
| `scroll` | `ScrollConfig` | - | 滚动配置，支持横向和纵向滚动 |
| `showHeader` | `boolean` | `true` | 是否显示表头 |
| `bordered` | `boolean` | `false` | 是否显示边框 |
| `emptyText` | `React.ReactNode` | `'暂无数据'` | 空数据时显示的内容 |
| `className` | `string` | - | 自定义样式类名 |
| `style` | `React.CSSProperties` | - | 自定义内联样式 |

#### ColumnType 列配置类型

```typescript
interface ColumnType<RecordType = Record<string, unknown>> {
  key: string;                    // 列的唯一标识（必填）
  title: React.ReactNode;         // 列头显示的文字
  dataIndex?: string | string[];  // 数据在数据项中对应的路径
  width?: number | string;        // 列宽度
  render?: (value: unknown, record: RecordType, index: number) => React.ReactNode; // 自定义渲染函数
  align?: 'left' | 'center' | 'right';  // 列的对齐方式
  className?: string;             // 列的自定义样式类名
  fixed?: 'left' | 'right';       // 固定列（配合 scroll.x 使用）
}
```

#### ScrollConfig 滚动配置类型

```typescript
interface ScrollConfig {
  x?: number | string | true;  // 横向滚动宽度，true 表示自动计算
  y?: number | string;         // 纵向滚动高度，设置后表格体可纵向滚动
}
```

#### 示例

```jsx
import { Table } from '@luoluoyu/fluentui-plus';

// 基础数据类型
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

// 数据源
const dataSource: DataType[] = [
  { key: '1', name: '张三', age: 32, address: '北京市朝阳区' },
  { key: '2', name: '李四', age: 42, address: '上海市浦东新区' },
  { key: '3', name: '王五', age: 28, address: '广州市天河区' },
];

// 列配置
const columns: ColumnType<DataType>[] = [
  {
    key: 'name',
    title: '姓名',
    dataIndex: 'name',
    width: 120,
  },
  {
    key: 'age',
    title: '年龄',
    dataIndex: 'age',
    width: 100,
  },
  {
    key: 'address',
    title: '地址',
    dataIndex: 'address',
  },
];

// 基础用法
<Table dataSource={dataSource} columns={columns} />

// 带边框
<Table dataSource={dataSource} columns={columns} bordered />

// 隐藏表头
<Table dataSource={dataSource} columns={columns} showHeader={false} />

// 列对齐方式
const alignColumns: ColumnType<DataType>[] = [
  {
    key: 'name',
    title: '姓名（左对齐）',
    dataIndex: 'name',
    align: 'left',
  },
  {
    key: 'age',
    title: '年龄（居中）',
    dataIndex: 'age',
    align: 'center',
  },
  {
    key: 'address',
    title: '地址（右对齐）',
    dataIndex: 'address',
    align: 'right',
  },
];

<Table dataSource={dataSource} columns={alignColumns} />

// 自定义渲染
const customColumns: ColumnType<DataType>[] = [
  {
    key: 'name',
    title: '姓名',
    dataIndex: 'name',
  },
  {
    key: 'age',
    title: '年龄',
    dataIndex: 'age',
    render: (value: unknown) => {
      const age = value as number;
      const color = age > 30 ? '#ff6b6b' : '#51cf66';
      return <span style={{ color, fontWeight: '600' }}>{age} 岁</span>;
    },
  },
  {
    key: 'address',
    title: '地址',
    dataIndex: 'address',
  },
];

<Table dataSource={dataSource} columns={customColumns} />

// 固定列（需配合 scroll.x）
const fixedColumns: ColumnType<DataType>[] = [
  {
    key: 'name',
    title: '姓名',
    dataIndex: 'name',
    width: 100,
    fixed: 'left',  // 固定在左侧
  },
  {
    key: 'age',
    title: '年龄',
    dataIndex: 'age',
    width: 100,
  },
  {
    key: 'address',
    title: '地址',
    dataIndex: 'address',
    width: 200,
  },
  {
    key: 'email',
    title: '邮箱',
    dataIndex: 'email',
    width: 200,
  },
  {
    key: 'phone',
    title: '电话',
    dataIndex: 'phone',
    width: 150,
  },
  {
    key: 'actions',
    title: '操作',
    width: 120,
    fixed: 'right',  // 固定在右侧
    render: () => <button>操作</button>,
  },
];

<Table 
  dataSource={dataSource} 
  columns={fixedColumns} 
  scroll={{ x: 1000 }}  // 设置横向滚动宽度
  bordered 
/>

// 横向滚动
<Table 
  dataSource={dataSource} 
  columns={wideColumns} 
  scroll={{ x: 1200 }}  // 表格总宽度超过容器宽度时出现横向滚动
/>

// 纵向滚动
<Table 
  dataSource={longDataSource} 
  columns={columns} 
  scroll={{ y: 300 }}  // 表格体最大高度 300px，超出可滚动
/>

// 横向和纵向滚动
<Table 
  dataSource={dataSource} 
  columns={columns} 
  scroll={{ x: 1200, y: 400 }}  // 同时支持横向和纵向滚动
  bordered
/>

// 空数据自定义
<Table 
  dataSource={[]} 
  columns={columns} 
  emptyText={
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <div style={{ fontSize: '48px' }}>📭</div>
      <div>暂无数据</div>
    </div>
  }
/>

// 自定义 rowKey
<Table 
  dataSource={dataSource} 
  columns={columns} 
  rowKey="id"  // 使用数据项的 id 字段作为 key
/>

// 或使用函数
<Table 
  dataSource={dataSource} 
  columns={columns} 
  rowKey={record => record.id}  // 使用函数返回唯一标识
/>
```

#### 最佳实践

1. **数据唯一标识**:
   - 确保每行数据都有唯一的 `key` 字段，或通过 `rowKey` 指定唯一标识
   - 这对于 React 的高效渲染和更新至关重要

2. **列宽设置**:
   - 对于固定列，必须设置明确的宽度
   - 建议为所有列设置合理的宽度，避免列宽不稳定

3. **滚动配置**:
   - 横向滚动 (`scroll.x`): 当列总宽度超过容器宽度时使用
   - 纵向滚动 (`scroll.y`): 当数据量大需要固定高度时使用
   - 固定列需要配合 `scroll.x` 使用

4. **性能优化**:
   - 对于大量数据，考虑使用虚拟滚动或分页
   - 在 `render` 函数中避免创建新的对象或函数
   - 合理使用 `React.memo` 包装自定义渲染组件

5. **自定义渲染**:
   - 使用 `render` 函数可以实现复杂的单元格内容
   - 可以渲染任何 React 节点，包括按钮、标签、进度条等
   - `render` 函数接收三个参数：当前单元格的值、当前行数据、行索引

### Message 消息提示

用于在页面顶部显示全局消息提示，支持多种类型和自定义内容。基于 FluentUI 的 Toast 组件实现，提供一致的用户体验。

#### 特性

- 支持多种消息类型：info、success、warning、error
- 自动关闭或手动控制关闭时机
- 支持自定义标题、内容和操作按钮
- 轻量级 API，无需组件形式使用
- 全局单例管理，避免重复渲染

#### API 方法

Message 提供了几个静态方法用于快速显示不同类型的消息：

- `message.info(title, options?)` - 信息提示消息
- `message.success(title, options?)` - 成功提示消息
- `message.warning(title, options?)` - 警告提示消息
- `message.error(title, options?)` - 错误提示消息
- `message.open(options)` - 自定义消息
- `message.destroy()` - 销毁所有消息

##### 方法参数

```typescript
// 基础方法参数 (info, success, warning, error)
type MessageMethod = (
  title: React.ReactNode,          // 消息标题
  options?: MessageOptions         // 可选配置
) => MessageInstance;

// 自定义方法参数
type OpenMethod = (
  options: MessageOptions          // 完整配置
) => MessageInstance;

// 配置项类型
interface MessageOptions {
  title?: React.ReactNode;         // 消息标题（主要内容）
  content?: React.ReactNode;       // 消息内容（详细描述）
  intent?: 'info' | 'success' | 'warning' | 'error'; // 消息类型
  duration?: number;               // 自动关闭延迟时间（毫秒），0 表示不自动关闭
  closable?: boolean;              // 是否显示关闭按钮，默认 true
  onClose?: () => void;            // 关闭时的回调函数
  action?: React.ReactNode;        // 自定义操作按钮
}

// 返回值类型
interface MessageInstance {
  close: () => void;               // 关闭当前消息
}
```

#### 示例

```jsx
import { message } from '@luoluoyu/fluentui-plus';

// 基础用法 - 信息提示
message.info('这是一条信息提示');

// 成功提示
message.success('操作成功！');

// 警告提示
message.warning('请注意数据安全');

// 错误提示
message.error('操作失败，请重试');

// 带详细内容的消息
message.info('系统通知', {
  content: '您有一条新的消息需要处理，请及时查看。',
  duration: 5000 // 5秒后自动关闭
});

// 不自动关闭的消息
message.warning('重要提醒', {
  content: '此操作不可逆，请谨慎处理。',
  duration: 0 // 不自动关闭，需要用户手动关闭
});

// 带操作按钮的消息
message.success('文件上传成功', {
  content: '文件已成功上传到服务器。',
  action: (
    <button onClick={() => console.log('查看详情')}>
      查看详情
    </button>
  )
});

// 带关闭回调的消息
message.info('正在处理...', {
  onClose: () => {
    console.log('消息已关闭');
  }
});

// 使用 open 方法自定义消息
message.open({
  title: '自定义消息',
  content: '这是一条自定义类型的消息。',
  intent: 'success',
  duration: 4000,
  action: (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={() => console.log('确认')}>确认</button>
      <button onClick={() => console.log('取消')}>取消</button>
    </div>
  ),
  onClose: () => {
    console.log('自定义消息已关闭');
  }
});

// 手动控制消息关闭
const instance = message.info('加载中...', {
  duration: 0 // 不自动关闭
});

// 3秒后手动关闭
setTimeout(() => {
  instance.close();
}, 3000);

// 清理所有消息（通常在应用卸载时使用）
message.destroy();

// 结合异步操作使用
const handleSubmit = async () => {
  const loadingMsg = message.info('正在提交...', { duration: 0 });
  
  try {
    await submitData();
    loadingMsg.close();
    message.success('提交成功！');
  } catch (error) {
    loadingMsg.close();
    message.error('提交失败，请重试');
  }
};

// 多个消息同时显示
message.info('第一条消息');
message.success('第二条消息');
message.warning('第三条消息');
// 消息会按顺序在顶部堆叠显示
```

#### 最佳实践

1. **合理设置 duration**: 
   - 普通信息：3000ms (默认)
   - 成功提示：2000-3000ms
   - 警告/错误：4000-5000ms 或不自动关闭
   - 需要用户操作的消息：设置为 0，不自动关闭

2. **使用合适的消息类型**:
   - `info`: 一般性提示信息
   - `success`: 操作成功反馈
   - `warning`: 警告或需要注意的信息
   - `error`: 错误提示或操作失败

3. **避免消息滥用**:
   - 不要同时显示过多消息
   - 重要操作才显示消息
   - 避免频繁弹出相同内容

4. **异步操作中的使用**:
   ```jsx
   const handleAction = async () => {
     const hide = message.info('处理中...', { duration: 0 });
     try {
       await doSomething();
       hide.close();
       message.success('处理成功');
     } catch (error) {
       hide.close();
       message.error('处理失败');
     }
   };
   ```

### Spin 加载中

用于页面和区块的加载中状态，提供直观的用户反馈。支持简单模式、嵌套模式和全屏模式。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `spinning` | `boolean` | `true` | 是否为加载中状态 |
| `size` | `'tiny' \| 'extra-small' \| 'small' \| 'medium' \| 'large' \| 'extra-large' \| 'huge'` | `'medium'` | 组件大小 |
| `tip` | `string` | - | 自定义描述文案 |
| `delay` | `number` | `0` | 延迟显示加载效果的时间（防止闪烁），单位：毫秒 |
| `fullscreen` | `boolean` | `false` | 是否全屏展示 |
| `children` | `React.ReactNode` | - | 包裹的内容 |
| `className` | `string` | - | 自定义样式类名 |
| `style` | `React.CSSProperties` | - | 自定义内联样式 |

#### 使用模式

##### 1. 简单模式

最基础的加载状态，仅显示一个加载图标。

```jsx
import { Spin } from '@luoluoyu/fluentui-plus';

// 基础用法
<Spin />

// 不同尺寸
<Spin size="small" />
<Spin size="medium" />
<Spin size="large" />

// 带提示文案
<Spin tip="加载中..." />
```

##### 2. 嵌套模式

可以嵌套在任何元素中，为其增加加载效果。加载时会显示半透明遮罩层。

```jsx
import { Spin } from '@luoluoyu/fluentui-plus';
import { useState } from 'react';

const MyComponent = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Spin spinning={loading} tip="加载中...">
      <div className="content">
        <h3>卡片内容</h3>
        <p>这是一段示例内容。当加载状态开启时，会显示半透明遮罩层和加载图标。</p>
        <button onClick={() => setLoading(true)}>开始加载</button>
      </div>
    </Spin>
  );
};
```

##### 3. 全屏模式

显示全屏的加载状态，适用于页面级别的加载场景。

```jsx
import { Spin } from '@luoluoyu/fluentui-plus';
import { useState } from 'react';

const MyComponent = () => {
  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    setLoading(true);
    // 模拟异步操作
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <button onClick={handleLoad}>显示全屏加载</button>
      <Spin fullscreen spinning={loading} tip="正在加载..." size="extra-large" />
    </>
  );
};
```

#### 延迟显示

为了避免加载时间过短导致的闪烁问题，可以设置延迟显示时间。如果加载在延迟时间内完成，则不会显示加载状态。

```jsx
import { Spin } from '@luoluoyu/fluentui-plus';
import { useState } from 'react';

const MyComponent = () => {
  const [loading, setLoading] = useState(false);

  const handleQuickLoad = () => {
    setLoading(true);
    // 快速完成的操作（300ms）
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <>
      <button onClick={handleQuickLoad}>快速加载（不会闪烁）</button>
      {/* 设置 delay=500，如果在 500ms 内完成则不显示 */}
      <Spin spinning={loading} delay={500} tip="加载中..." />
    </>
  );
};
```

#### 完整示例

```jsx
import { Spin } from '@luoluoyu/fluentui-plus';
import { useState } from 'react';

const DataTable = () => {
  const [loading, setLoading] = useState(false);
  const [fullscreenLoading, setFullscreenLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchData();
    } finally {
      setLoading(false);
    }
  };

  const handlePageLoad = async () => {
    setFullscreenLoading(true);
    try {
      await loadPageData();
    } finally {
      setFullscreenLoading(false);
    }
  };

  return (
    <div>
      {/* 嵌套模式 - 表格加载 */}
      <Spin spinning={loading} tip="正在加载数据...">
        <div className="data-table">
          <button onClick={handleRefresh}>刷新数据</button>
          <table>
            <thead>
              <tr>
                <th>姓名</th>
                <th>年龄</th>
                <th>地址</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>张三</td>
                <td>28</td>
                <td>北京</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Spin>

      {/* 全屏模式 - 页面加载 */}
      <button onClick={handlePageLoad}>加载页面</button>
      <Spin 
        fullscreen 
        spinning={fullscreenLoading} 
        tip="正在加载页面..." 
        size="extra-large" 
      />
    </div>
  );
};
```

#### 最佳实践

1. **合理使用延迟显示**:
   - 对于可能快速完成的操作，设置 `delay` 可以避免闪烁
   - 推荐延迟时间：300-500ms

2. **选择合适的尺寸**:
   - 简单模式：`medium` 或 `large`
   - 嵌套模式：根据容器大小选择 `small` 到 `large`
   - 全屏模式：`extra-large` 或 `huge`

3. **提供有意义的提示文案**:
   ```jsx
   <Spin tip="正在加载数据..." />
   <Spin tip="正在提交表单..." />
   <Spin tip="正在生成报告..." />
   ```

4. **嵌套模式的容器要求**:
   - 确保父容器有明确的尺寸
   - 避免在没有内容的空容器中使用

5. **全屏模式的使用场景**:
   - 页面初始化加载
   - 重要的全局操作
   - 需要阻止用户交互的场景

6. **结合异步操作**:
   ```jsx
   const handleSubmit = async () => {
     setLoading(true);
     try {
       await submitForm();
       message.success('提交成功');
     } catch (error) {
       message.error('提交失败');
     } finally {
       setLoading(false);
     }
   };
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
  GroupedOption,
  CascaderProps,
  CascaderOption,
  CascaderValue,
  CascaderMultipleValue,
  CheckboxProps,
  GroupProps,
  ModalProps,
  StaticModalProps,
  MessageOptions,
  MessageInstance,
  MessageApi,
  TableProps,
  ColumnType,
  ScrollConfig,
  SpinProps
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

// Cascader 类型示例
const cascaderOption: CascaderOption = {
  label: '浙江省',
  value: 'zhejiang',
  children: [
    { label: '杭州市', value: 'hangzhou' },
    { label: '宁波市', value: 'ningbo' }
  ]
};

const cascaderProps: CascaderProps = {
  placeholder: '请选择地区',
  options: [cascaderOption],
  multiple: false,
  showSearch: true,
  expandTrigger: 'click',
  onChange: (value, selectedOptions) => {
    console.log('选中值:', value);
    console.log('选中选项:', selectedOptions);
  }
};

// Checkbox 类型示例  
const checkboxProps: CheckboxProps = {
  checked: true,
  indeterminate: false,
  disabled: false,
  labelPosition: 'after',
  onChange: (checked) => {
    console.log('选中状态:', checked);
  }
};

const checkboxGroupProps: GroupProps = {
  options: [
    { label: '选项一', value: 'option1' },
    { label: '选项二', value: 'option2', disabled: true }
  ],
  layout: 'horizontal',
  onChange: (checkedValues) => {
    console.log('选中的选项:', checkedValues);
  }
};

// Modal 类型示例
const modalProps: ModalProps = {
  title: '确认对话框',
  open: true,
  okText: '确定',
  okType: 'primary',
  closable: true,
  mask: true,
  onOk: () => console.log('确定'),
  onCancel: () => console.log('取消')
};

const staticModalConfig: StaticModalProps = {
  title: '提示',
  content: '这是一个静态对话框',
  onOk: async () => {
    console.log('异步确定操作');
  },
  onCancel: () => console.log('取消操作')
};

// Message 类型示例
const messageOptions: MessageOptions = {
  title: '系统通知',
  content: '您有新的消息',
  intent: 'info',
  duration: 3000,
  closable: true,
  onClose: () => console.log('消息关闭'),
  action: <button>查看详情</button>
};

// 使用 Message API
const messageInstance: MessageInstance = message.info('操作成功');

// 异步操作中使用 Message
const handleAsyncAction = async () => {
  const loadingMessage: MessageInstance = message.info('处理中...', { 
    duration: 0 
  });
  
  try {
    await someAsyncOperation();
    loadingMessage.close();
    message.success('处理成功');
  } catch (error) {
    loadingMessage.close();
    message.error('处理失败');
  }
};

// Table 类型示例
interface UserData {
  key: string;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'inactive';
}

const tableColumns: ColumnType<UserData>[] = [
  {
    key: 'name',
    title: '姓名',
    dataIndex: 'name',
    width: 120,
  },
  {
    key: 'age',
    title: '年龄',
    dataIndex: 'age',
    width: 100,
    align: 'center',
  },
  {
    key: 'email',
    title: '邮箱',
    dataIndex: 'email',
    width: 200,
  },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    width: 100,
    render: (value, record, index) => {
      const status = value as 'active' | 'inactive';
      return <span>{status === 'active' ? '激活' : '未激活'}</span>;
    },
  },
];

const scrollConfig: ScrollConfig = {
  x: 1200,
  y: 400,
};

const tableProps: TableProps<UserData> = {
  dataSource: [
    { key: '1', name: '张三', age: 25, email: 'zhangsan@example.com', status: 'active' },
    { key: '2', name: '李四', age: 30, email: 'lisi@example.com', status: 'inactive' },
  ],
  columns: tableColumns,
  scroll: scrollConfig,
  bordered: true,
  showHeader: true,
  rowKey: 'key',
  emptyText: '暂无数据',
};

// Spin 类型示例
const spinProps: SpinProps = {
  spinning: true,
  size: 'large',
  tip: '加载中...',
  delay: 300,
  fullscreen: false,
};

// 嵌套模式使用
const SpinWithContent = () => {
  const [loading, setLoading] = useState(false);
  
  const spinConfig: SpinProps = {
    spinning: loading,
    tip: '正在加载数据...',
    size: 'medium',
    delay: 500,
  };

  return (
    <Spin {...spinConfig}>
      <div className="content">
        <button onClick={() => setLoading(true)}>加载数据</button>
      </div>
    </Spin>
  );
};

// 全屏模式使用
const FullscreenSpinExample = () => {
  const [pageLoading, setPageLoading] = useState(false);
  
  const fullscreenSpinConfig: SpinProps = {
    fullscreen: true,
    spinning: pageLoading,
    tip: '正在加载页面...',
    size: 'extra-large',
  };

  return (
    <>
      <button onClick={() => setPageLoading(true)}>加载页面</button>
      <Spin {...fullscreenSpinConfig} />
    </>
  );
};
```

## 样式定制

### CSS 变量

组件库基于 FluentUI Design Tokens，使用原生 CSS 变量来支持主题定制。所有变量都会根据当前主题自动更新：

```css
/* 组件库使用的主要 FluentUI Design Tokens */
:root {
  /* 颜色系统 - 前景色 */
  --colorNeutralForeground1: #242424;
  --colorNeutralForeground2: #424242;
  --colorBrandForeground1: #0078d4;
  
  /* 颜色系统 - 背景色 */
  --colorNeutralBackground1: #ffffff;
  --colorNeutralBackground2: #f5f5f5;
  --colorBrandBackground: #0078d4;
  
  /* 颜色系统 - 描边色 */
  --colorNeutralStroke1: #d1d1d1;
  --colorNeutralStroke2: #e1e1e1;
  --colorBrandStroke1: #0078d4;
  
  /* 间距系统 */
  --spacingHorizontalS: 8px;
  --spacingHorizontalM: 12px;
  --spacingHorizontalL: 16px;
  --spacingVerticalS: 8px;
  --spacingVerticalM: 12px;
  --spacingVerticalL: 16px;
  
  /* 边框圆角 */
  --borderRadiusSmall: 4px;
  --borderRadiusMedium: 6px;
  --borderRadiusLarge: 8px;
  
  /* 字体系统 */
  --fontSizeBase300: 12px;
  --fontSizeBase400: 14px;
  --fontSizeBase500: 16px;
  --fontWeightRegular: 400;
  --fontWeightMedium: 500;
  --fontWeightSemibold: 600;
}
```

### Less 变量

组件库提供了完整的 Less 变量映射，直接对应 FluentUI Design Tokens：

```less
// 导入组件库的 Less 变量
@import '~@luoluoyu/fluentui-plus/dist/styles/variables.less';

// 常用变量示例
.my-component {
  color: @color-neutral-foreground-1;
  background: @color-neutral-background-1;
  border: @stroke-width-thin solid @color-neutral-stroke-1;
  border-radius: @border-radius-medium;
  padding: @spacing-vertical-m @spacing-horizontal-m;
  font-size: @font-size-400;
  font-weight: @font-weight-regular;
}

// 状态颜色
.success-message {
  color: @color-status-success-foreground-1;
  background: @color-status-success-background-1;
  border-color: @color-status-success-border-1;
}

.warning-message {
  color: @color-status-warning-foreground-1;
  background: @color-status-warning-background-1;
  border-color: @color-status-warning-border-1;
}

.error-message {
  color: @color-status-danger-foreground-1;
  background: @color-status-danger-background-1;
  border-color: @color-status-danger-border-1;
}
```

### 主题定制

通过 FluentUI 的主题系统，可以轻松实现深色模式和自定义主题：

```tsx
import { 
  FluentProvider, 
  webLightTheme, 
  webDarkTheme,
  createLightTheme,
  createDarkTheme,
  BrandVariants 
} from '@fluentui/react-components';

// 使用内置主题
<FluentProvider theme={webLightTheme}>
  <App />
</FluentProvider>

<FluentProvider theme={webDarkTheme}>
  <App />
</FluentProvider>

// 自定义品牌色
const brandRamp: BrandVariants = {
  10: "#061724",
  20: "#082338",
  30: "#0a2e4a",
  40: "#0c3b5e",
  50: "#0e4775",
  60: "#0f548c",
  70: "#115ea3",
  80: "#0f6cbd",
  90: "#2886de",
  100: "#479ef5",
  110: "#62abf5",
  120: "#77b7f7",
  130: "#96c6fa",
  140: "#b4d6fa",
  150: "#cfe4fa",
  160: "#ebf3fc"
};

const lightTheme = createLightTheme(brandRamp);
const darkTheme = createDarkTheme(brandRamp);

<FluentProvider theme={lightTheme}>
  <App />
</FluentProvider>
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
