import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../src/components';
import type { Option, GroupedOption } from '../src/components/Select/types';

const meta: Meta<typeof Select> = {
  title: '数据录入/Select 选择器',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '高度可定制的选择器组件，支持单选、多选、搜索、分组、自定义渲染等功能。基于 FluentUI 设计系统，提供企业级的用户体验和完整的无障碍支持。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '受控模式的选中值，支持单个值或值数组（多选模式）',
    },
    defaultValue: {
      control: 'text',
      description: '非受控模式的默认选中值',
    },
    placeholder: {
      control: 'text',
      description: '输入框占位符文本',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用选择器',
    },
    multiple: {
      control: 'boolean',
      description: '是否支持多选模式',
    },
    showSearch: {
      control: 'boolean',
      description: '是否显示搜索输入框',
    },
    allowClear: {
      control: 'boolean',
      description: '是否显示清除按钮',
    },
    listHeight: {
      control: 'number',
      description: '下拉列表最大高度（像素）',
    },
    open: {
      control: 'boolean',
      description: '受控模式的展开状态',
    },
    options: {
      control: 'object',
      description: '选项数据，支持分组选项',
    },
    onChange: {
      action: 'onChange',
      description: '选中值变化时的回调函数',
    },
    onSearch: {
      action: 'onSearch',
      description: '搜索输入变化时的回调函数',
    },
    onClear: {
      action: 'onClear',
      description: '点击清除按钮时的回调函数',
    },
    filterOption: {
      description: '自定义过滤逻辑函数',
    },
    optionRender: {
      description: '自定义选项渲染函数',
    },
    popupRender: {
      description: '自定义弹窗内容渲染函数',
    },
    labelRender: {
      description: '自定义已选中标签的渲染函数',
    },
  },
  args: {
    placeholder: '请选择',
    disabled: false,
    multiple: false,
    showSearch: false,
    allowClear: false,
    listHeight: 256,
    options: [
      { value: 'option1', label: '选项1' },
      { value: 'option2', label: '选项2' },
      { value: 'option3', label: '选项3' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础选项数据
const fruitOptions: Option[] = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'orange', label: '橙子' },
  { value: 'grape', label: '葡萄' },
  { value: 'watermelon', label: '西瓜' },
  { value: 'strawberry', label: '草莓' },
];

const cityOptions: Option[] = [
  { value: 'beijing', label: '北京' },
  { value: 'shanghai', label: '上海' },
  { value: 'guangzhou', label: '广州' },
  { value: 'shenzhen', label: '深圳' },
  { value: 'hangzhou', label: '杭州' },
  { value: 'nanjing', label: '南京' },
  { value: 'chengdu', label: '成都' },
  { value: 'wuhan', label: '武汉' },
  { value: 'xian', label: '西安' },
  { value: 'chongqing', label: '重庆' },
];

// 基础示例
export const Default: Story = {
  args: {
    placeholder: '请选择水果',
    options: fruitOptions,
  },
  render: args => (
    <div style={{ width: '200px' }}>
      <Select {...args} />
    </div>
  ),
};

// 带清除功能
export const AllowClear: Story = {
  args: {
    placeholder: '支持清除选择',
    options: fruitOptions,
    allowClear: true,
    defaultValue: 'apple',
  },
  render: args => (
    <div style={{ width: '200px' }}>
      <Select {...args} />
    </div>
  ),
};

// 自定义清除图标
export const CustomClearIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>默认清除图标</div>
        <div style={{ width: '180px' }}>
          <Select placeholder='默认图标' options={fruitOptions} allowClear defaultValue='apple' />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>自定义清除图标</div>
        <div style={{ width: '180px' }}>
          <Select
            placeholder='自定义图标'
            options={fruitOptions}
            allowClear={{ clearIcon: <span style={{ color: '#ff4d4f' }}>✗</span> }}
            defaultValue='banana'
          />
        </div>
      </div>
    </div>
  ),
};

// 自定义标签渲染
export const CustomLabelRender: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>单选自定义标签</h4>
        <Select
          placeholder='自定义单选标签'
          options={fruitOptions}
          defaultValue='apple'
          labelRender={option => {
            if (Array.isArray(option)) {
              return `🎯 ${option.map(opt => opt.label).join(', ')}`;
            }
            return `🎯 ${option?.label || ''}`;
          }}
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>多选自定义标签</h4>
        <Select
          placeholder='自定义多选标签'
          options={cityOptions.slice(0, 6)}
          multiple
          defaultValue={['beijing', 'shanghai']}
          labelRender={options => {
            if (Array.isArray(options)) {
              return `已选择 ${options.length} 个城市: ${options.map(opt => opt.label).join(', ')}`;
            }
            return options?.label || '';
          }}
        />
      </div>
    </div>
  ),
};

// 自定义过滤逻辑
export const CustomFilter: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>模糊匹配（默认）</h4>
        <Select placeholder='默认过滤逻辑' options={cityOptions} showSearch />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>首字母匹配</h4>
        <Select
          placeholder='首字母匹配'
          options={cityOptions}
          showSearch
          filterOption={(input, option) => {
            const label = option.label?.toLowerCase() || '';
            return label.startsWith(input.toLowerCase());
          }}
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>值匹配</h4>
        <Select
          placeholder='按值匹配'
          options={cityOptions}
          showSearch
          filterOption={(input, option) => {
            const value = String(option.value || '').toLowerCase();
            return value.includes(input.toLowerCase());
          }}
        />
      </div>
    </div>
  ),
};

// 多选模式
export const Multiple: Story = {
  args: {
    placeholder: '请选择多个城市',
    options: cityOptions,
    multiple: true,
  },
  render: args => (
    <div style={{ width: '300px' }}>
      <Select {...args} />
    </div>
  ),
};

// 多选带默认值
export const MultipleWithDefault: Story = {
  args: {
    placeholder: '请选择多个城市',
    options: cityOptions,
    multiple: true,
    defaultValue: ['beijing', 'shanghai'],
  },
  render: args => (
    <div style={{ width: '300px' }}>
      <Select {...args} />
    </div>
  ),
};

// 可搜索
export const Searchable: Story = {
  args: {
    placeholder: '搜索并选择城市',
    options: cityOptions,
    showSearch: true,
  },
  render: args => (
    <div style={{ width: '200px' }}>
      <Select {...args} />
    </div>
  ),
};

// 多选 + 搜索
export const MultipleSearchable: Story = {
  args: {
    placeholder: '搜索并选择多个城市',
    options: cityOptions,
    multiple: true,
    showSearch: true,
  },
  render: args => (
    <div style={{ width: '350px' }}>
      <Select {...args} />
    </div>
  ),
};

// 禁用状态
export const Disabled: Story = {
  args: {
    placeholder: '禁用状态',
    options: fruitOptions,
    disabled: true,
    defaultValue: 'apple',
  },
  render: args => (
    <div style={{ width: '200px' }}>
      <Select {...args} />
    </div>
  ),
};

// 带禁用选项
export const WithDisabledOptions: Story = {
  args: {
    placeholder: '部分选项禁用',
    options: [
      { value: 'option1', label: '选项1' },
      { value: 'option2', label: '选项2（禁用）', disabled: true },
      { value: 'option3', label: '选项3' },
      { value: 'option4', label: '选项4（禁用）', disabled: true },
      { value: 'option5', label: '选项5' },
    ],
  },
  render: args => (
    <div style={{ width: '200px' }}>
      <Select {...args} />
    </div>
  ),
};

// 自定义高度
export const CustomHeight: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>高度 100px</div>
        <div style={{ width: '150px' }}>
          <Select placeholder='高度100' options={cityOptions} listHeight={100} />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>高度 200px</div>
        <div style={{ width: '150px' }}>
          <Select placeholder='高度200' options={cityOptions} listHeight={200} />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>默认高度 256px</div>
        <div style={{ width: '150px' }}>
          <Select placeholder='默认高度' options={cityOptions} />
        </div>
      </div>
    </div>
  ),
};

// 受控模式示例
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | number | undefined>();
    const [multipleValue, setMultipleValue] = useState<(string | number)[]>([]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>受控单选</h4>
          <Select
            placeholder='受控单选示例'
            options={fruitOptions}
            value={value}
            onChange={newValue => setValue(newValue as string | number)}
          />
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>当前值: {value || '未选择'}</div>
          <button
            onClick={() => setValue('banana')}
            style={{
              marginTop: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '8px',
            }}
          >
            设置为香蕉
          </button>
          <button
            onClick={() => setValue(undefined)}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              background: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            清空
          </button>
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>受控多选</h4>
          <Select
            placeholder='受控多选示例'
            options={cityOptions.slice(0, 5)}
            value={multipleValue}
            onChange={newValue => setMultipleValue(newValue as (string | number)[])}
            multiple
          />
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            当前值: {multipleValue.length > 0 ? JSON.stringify(multipleValue) : '未选择'}
          </div>
          <button
            onClick={() => setMultipleValue(['beijing', 'shanghai'])}
            style={{
              marginTop: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '8px',
            }}
          >
            设置北京、上海
          </button>
          <button
            onClick={() => setMultipleValue([])}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              background: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            清空
          </button>
        </div>
      </div>
    );
  },
};

// 自定义选项渲染
export const CustomOptionRender: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Select
        placeholder='自定义选项样式'
        options={fruitOptions}
        optionRender={option => (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '500' }}>{option.label}</span>
            <span
              style={{
                fontSize: '12px',
                color: '#999',
                background: '#f5f5f5',
                padding: '2px 6px',
                borderRadius: '10px',
              }}
            >
              {option.value}
            </span>
          </div>
        )}
      />
    </div>
  ),
};

// 自定义弹窗渲染
export const CustomPopupRender: Story = {
  render: () => (
    <div style={{ width: '250px' }}>
      <Select
        placeholder='自定义弹窗内容'
        options={fruitOptions}
        popupRender={originNode => (
          <div>
            <div
              style={{
                padding: '8px 12px',
                borderBottom: '1px solid #f0f0f0',
                fontSize: '12px',
                color: '#666',
                background: '#fafafa',
              }}
            >
              🍎 选择您喜欢的水果
            </div>
            {originNode}
            <div
              style={{
                padding: '8px 12px',
                borderTop: '1px solid #f0f0f0',
                fontSize: '12px',
                color: '#999',
                textAlign: 'center',
              }}
            >
              共 {fruitOptions.length} 种水果
            </div>
          </div>
        )}
      />
    </div>
  ),
};

// 异步加载和动态选项
export const DynamicOptions: Story = {
  render: () => {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);
    const [searchText, setSearchText] = useState('');

    const loadOptions = async (search: string = '') => {
      setLoading(true);

      // 模拟异步加载
      await new Promise(resolve => setTimeout(resolve, 800));

      const allOptions = [
        { value: 'user1', label: 'John Doe' },
        { value: 'user2', label: 'Jane Smith' },
        { value: 'user3', label: 'Bob Johnson' },
        { value: 'user4', label: 'Alice Wilson' },
        { value: 'user5', label: 'Charlie Brown' },
        { value: 'user6', label: 'Diana Prince' },
      ];

      const filtered = search
        ? allOptions.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
        : allOptions;

      setOptions(filtered);
      setLoading(false);
    };

    React.useEffect(() => {
      loadOptions();
    }, []);

    return (
      <div style={{ width: '300px' }}>
        <Select
          placeholder={loading ? '加载中...' : '搜索用户'}
          options={options}
          showSearch
          allowClear
          disabled={loading}
          onSearch={value => {
            setSearchText(value);
            if (value) {
              loadOptions(value);
            }
          }}
          optionRender={option => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#1890ff',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                {option.label?.charAt(0)}
              </div>
              <span>{option.label}</span>
            </div>
          )}
        />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          {loading ? '正在加载选项...' : `找到 ${options.length} 个用户`}
        </div>
      </div>
    );
  },
};

// 受控展开状态
export const ControlledOpen: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ width: '300px' }}>
        <Select
          placeholder='受控展开状态'
          options={fruitOptions}
          open={open}
          onChange={value => console.log('Value changed:', value)}
        />
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setOpen(true)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: '#52c41a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            展开
          </button>
          <button
            onClick={() => setOpen(false)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            收起
          </button>
          <button
            onClick={() => setOpen(!open)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            切换 ({open ? '已展开' : '已收起'})
          </button>
        </div>
      </div>
    );
  },
};

// 分组选项示例
export const GroupedOptions: Story = {
  render: () => {
    const groupedOptions: GroupedOption[] = [
      {
        label: 'manager',
        options: [
          { value: 'jack', label: 'Jack' },
          { value: 'lucy', label: 'Lucy' },
        ],
      },
      {
        label: 'engineer',
        options: [
          { value: 'chloe', label: 'Chloe' },
          { value: 'lucas', label: 'Lucas' },
        ],
      },
    ];

    return (
      <div style={{ width: '300px' }}>
        <Select placeholder='请选择员工' options={groupedOptions} />
      </div>
    );
  },
};

// 分组多选示例
export const GroupedMultiple: Story = {
  render: () => {
    const groupedCityOptions: GroupedOption[] = [
      {
        label: '一线城市',
        options: [
          { value: 'beijing', label: '北京' },
          { value: 'shanghai', label: '上海' },
          { value: 'guangzhou', label: '广州' },
          { value: 'shenzhen', label: '深圳' },
        ],
      },
      {
        label: '新一线城市',
        options: [
          { value: 'chengdu', label: '成都' },
          { value: 'hangzhou', label: '杭州' },
          { value: 'wuhan', label: '武汉' },
          { value: 'suzhou', label: '苏州' },
          { value: 'xian', label: '西安' },
        ],
      },
      {
        label: '二线城市',
        options: [
          { value: 'jinan', label: '济南' },
          { value: 'qingdao', label: '青岛' },
          { value: 'dalian', label: '大连' },
          { value: 'kunming', label: '昆明' },
        ],
      },
    ];

    return (
      <div style={{ width: '350px' }}>
        <Select placeholder='请选择城市' options={groupedCityOptions} multiple showSearch />
      </div>
    );
  },
};

// 混合选项（分组 + 普通选项）
export const MixedOptions: Story = {
  render: () => {
    const mixedOptions: GroupedOption[] = [
      { value: 'all', label: '全部' },
      { value: 'recent', label: '最近使用' },
      {
        label: '水果类',
        options: [
          { value: 'apple', label: '苹果' },
          { value: 'banana', label: '香蕉' },
          { value: 'orange', label: '橙子' },
        ],
      },
      {
        label: '蔬菜类',
        options: [
          { value: 'tomato', label: '番茄' },
          { value: 'potato', label: '土豆' },
          { value: 'carrot', label: '胡萝卜' },
        ],
      },
    ];

    return (
      <div style={{ width: '250px' }}>
        <Select placeholder='请选择食物' options={mixedOptions} showSearch />
      </div>
    );
  },
};
