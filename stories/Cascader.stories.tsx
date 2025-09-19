import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Cascader } from '../src/components';
import type { CascaderOption, CascaderValue, CascaderMultipleValue } from '../src/components/Cascader/types';

const meta: Meta<typeof Cascader> = {
  title: '数据录入/Cascader 级联选择器',
  component: Cascader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '级联选择器，用于多层级数据的选择。支持单选、多选、搜索、自定义渲染等功能。适用于省市区选择、组织架构选择、分类目录选择等场景。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'object',
      description: '受控模式的选中值，单选为路径数组，多选为路径数组的数组',
    },
    defaultValue: {
      control: 'object',
      description: '非受控模式的默认选中值',
    },
    placeholder: {
      control: 'text',
      description: '输入框占位符文本',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用级联选择器',
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
      description: '下拉面板最大高度（像素）',
    },
    open: {
      control: 'boolean',
      description: '受控模式的展开状态',
    },
    expandTrigger: {
      control: 'select',
      options: ['click', 'hover'],
      description: '展开子级的触发方式',
    },
    changeOnSelect: {
      control: 'boolean',
      description: '选择中间层级时是否立即触发 onChange',
    },
    options: {
      control: 'object',
      description: '级联数据源',
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
    expandTrigger: 'click',
    changeOnSelect: false,
    options: [
      {
        value: 'zhejiang',
        label: '浙江',
        children: [
          {
            value: 'hangzhou',
            label: '杭州',
            children: [
              { value: 'xihu', label: '西湖' },
              { value: 'xiacheng', label: '下城' },
            ],
          },
          {
            value: 'ningbo',
            label: '宁波',
            children: [
              { value: 'jiangbei', label: '江北' },
              { value: 'jiangdong', label: '江东' },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: '江苏',
        children: [
          {
            value: 'nanjing',
            label: '南京',
            children: [
              { value: 'xuanwu', label: '玄武' },
              { value: 'gulou', label: '鼓楼' },
            ],
          },
        ],
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础地区数据
const regionOptions: CascaderOption[] = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      {
        value: 'hangzhou',
        label: '杭州',
        children: [
          { value: 'xihu', label: '西湖区' },
          { value: 'xiacheng', label: '下城区' },
          { value: 'jianggan', label: '江干区' },
          { value: 'gongshu', label: '拱墅区' },
          { value: 'shangcheng', label: '上城区' },
        ],
      },
      {
        value: 'ningbo',
        label: '宁波',
        children: [
          { value: 'jiangbei', label: '江北区' },
          { value: 'jiangdong', label: '江东区' },
          { value: 'haishu', label: '海曙区' },
          { value: 'beilun', label: '北仑区' },
        ],
      },
      {
        value: 'wenzhou',
        label: '温州',
        children: [
          { value: 'lucheng', label: '鹿城区' },
          { value: 'longwan', label: '龙湾区' },
          { value: 'ouhai', label: '瓯海区' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [
      {
        value: 'nanjing',
        label: '南京',
        children: [
          { value: 'xuanwu', label: '玄武区' },
          { value: 'gulou', label: '鼓楼区' },
          { value: 'jianye', label: '建邺区' },
          { value: 'qinhuai', label: '秦淮区' },
          { value: 'yuhuatai', label: '雨花台区' },
        ],
      },
      {
        value: 'suzhou',
        label: '苏州',
        children: [
          { value: 'gusu', label: '姑苏区' },
          { value: 'huqiu', label: '虎丘区' },
          { value: 'wuzhong', label: '吴中区' },
          { value: 'xiangcheng', label: '相城区' },
        ],
      },
      {
        value: 'wuxi',
        label: '无锡',
        children: [
          { value: 'liangxi', label: '梁溪区' },
          { value: 'xinwu', label: '新吴区' },
          { value: 'binhu', label: '滨湖区' },
        ],
      },
    ],
  },
  {
    value: 'guangdong',
    label: '广东',
    children: [
      {
        value: 'guangzhou',
        label: '广州',
        children: [
          { value: 'tianhe', label: '天河区' },
          { value: 'haizhu', label: '海珠区' },
          { value: 'liwan', label: '荔湾区' },
          { value: 'yuexiu', label: '越秀区' },
        ],
      },
      {
        value: 'shenzhen',
        label: '深圳',
        children: [
          { value: 'futian', label: '福田区' },
          { value: 'luohu', label: '罗湖区' },
          { value: 'nanshan', label: '南山区' },
          { value: 'yantian', label: '盐田区' },
        ],
      },
    ],
  },
];

// 公司组织架构数据
const orgOptions: CascaderOption[] = [
  {
    value: 'tech',
    label: '技术部',
    children: [
      {
        value: 'frontend',
        label: '前端组',
        children: [
          { value: 'react', label: 'React 小组' },
          { value: 'vue', label: 'Vue 小组' },
          { value: 'mobile', label: '移动端小组' },
        ],
      },
      {
        value: 'backend',
        label: '后端组',
        children: [
          { value: 'java', label: 'Java 小组' },
          { value: 'nodejs', label: 'Node.js 小组' },
          { value: 'python', label: 'Python 小组' },
        ],
      },
      {
        value: 'devops',
        label: '运维组',
        children: [
          { value: 'docker', label: '容器小组' },
          { value: 'k8s', label: 'K8s 小组' },
          { value: 'ci', label: 'CI/CD 小组' },
        ],
      },
    ],
  },
  {
    value: 'product',
    label: '产品部',
    children: [
      {
        value: 'pm',
        label: '产品经理组',
        children: [
          { value: 'b2b', label: 'B2B 产品组' },
          { value: 'b2c', label: 'B2C 产品组' },
        ],
      },
      {
        value: 'design',
        label: '设计组',
        children: [
          { value: 'ui', label: 'UI 设计组' },
          { value: 'ux', label: 'UX 设计组' },
        ],
      },
    ],
  },
  {
    value: 'market',
    label: '市场部',
    children: [
      {
        value: 'sales',
        label: '销售组',
        children: [
          { value: 'enterprise', label: '企业销售' },
          { value: 'channel', label: '渠道销售' },
        ],
      },
      {
        value: 'marketing',
        label: '市场营销组',
        children: [
          { value: 'brand', label: '品牌营销' },
          { value: 'digital', label: '数字营销' },
        ],
      },
    ],
  },
];

// 商品分类数据
const categoryOptions: CascaderOption[] = [
  {
    value: 'electronics',
    label: '电子产品',
    children: [
      {
        value: 'mobile',
        label: '手机数码',
        children: [
          { value: 'smartphone', label: '智能手机' },
          { value: 'tablet', label: '平板电脑' },
          { value: 'accessory', label: '数码配件' },
        ],
      },
      {
        value: 'computer',
        label: '电脑办公',
        children: [
          { value: 'laptop', label: '笔记本电脑' },
          { value: 'desktop', label: '台式电脑' },
          { value: 'peripheral', label: '电脑外设' },
        ],
      },
    ],
  },
  {
    value: 'clothing',
    label: '服装服饰',
    children: [
      {
        value: 'mens',
        label: '男装',
        children: [
          { value: 'mens_tops', label: '上装' },
          { value: 'mens_bottoms', label: '下装' },
          { value: 'mens_shoes', label: '鞋靴' },
        ],
      },
      {
        value: 'womens',
        label: '女装',
        children: [
          { value: 'womens_tops', label: '上装' },
          { value: 'womens_bottoms', label: '下装' },
          { value: 'womens_shoes', label: '鞋靴' },
        ],
      },
    ],
  },
];

// 基础示例
export const Default: Story = {
  args: {
    placeholder: '请选择地区',
    options: regionOptions,
  },
  render: args => (
    <div style={{ width: '280px' }}>
      <Cascader {...args} />
    </div>
  ),
};

// 带清除功能
export const AllowClear: Story = {
  args: {
    placeholder: '支持清除选择',
    options: regionOptions,
    allowClear: true,
    defaultValue: ['zhejiang', 'hangzhou', 'xihu'],
  },
  render: args => (
    <div style={{ width: '280px' }}>
      <Cascader {...args} />
    </div>
  ),
};

// 自定义清除图标
export const CustomClearIcon: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>默认清除图标</div>
        <div style={{ width: '200px' }}>
          <Cascader
            placeholder='默认图标'
            options={regionOptions}
            allowClear
            defaultValue={['zhejiang', 'hangzhou', 'xihu']}
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>自定义清除图标</div>
        <div style={{ width: '200px' }}>
          <Cascader
            placeholder='自定义图标'
            options={regionOptions}
            allowClear={{ clearIcon: <span style={{ color: '#ff4d4f' }}>✗</span> }}
            defaultValue={['jiangsu', 'nanjing', 'xuanwu']}
          />
        </div>
      </div>
    </div>
  ),
};

// 多选模式
export const Multiple: Story = {
  args: {
    placeholder: '请选择多个地区',
    options: regionOptions,
    multiple: true,
  },
  render: args => (
    <div style={{ width: '350px' }}>
      <Cascader {...args} />
    </div>
  ),
};

// 多选带默认值
export const MultipleWithDefault: Story = {
  args: {
    placeholder: '请选择多个地区',
    options: regionOptions,
    multiple: true,
    defaultValue: [
      ['zhejiang', 'hangzhou', 'xihu'],
      ['jiangsu', 'nanjing', 'xuanwu'],
    ],
  },
  render: args => (
    <div style={{ width: '380px' }}>
      <Cascader {...args} />
    </div>
  ),
};

// 可搜索
export const Searchable: Story = {
  args: {
    placeholder: '搜索并选择地区',
    options: regionOptions,
    showSearch: true,
  },
  render: args => (
    <div style={{ width: '280px' }}>
      <Cascader {...args} />
    </div>
  ),
};

// 多选 + 搜索
export const MultipleSearchable: Story = {
  args: {
    placeholder: '搜索并选择多个地区',
    options: regionOptions,
    multiple: true,
    showSearch: true,
  },
  render: args => (
    <div style={{ width: '400px' }}>
      <Cascader {...args} />
    </div>
  ),
};

// 禁用状态
export const Disabled: Story = {
  args: {
    placeholder: '禁用状态',
    options: regionOptions,
    disabled: true,
    defaultValue: ['zhejiang', 'hangzhou', 'xihu'],
  },
  render: args => (
    <div style={{ width: '280px' }}>
      <Cascader {...args} />
    </div>
  ),
};

// 带禁用选项
export const WithDisabledOptions: Story = {
  render: () => {
    const optionsWithDisabled: CascaderOption[] = [
      {
        value: 'zhejiang',
        label: '浙江',
        children: [
          {
            value: 'hangzhou',
            label: '杭州',
            children: [
              { value: 'xihu', label: '西湖区' },
              { value: 'xiacheng', label: '下城区（禁用）', disabled: true },
            ],
          },
          {
            value: 'ningbo',
            label: '宁波（禁用）',
            disabled: true,
            children: [
              { value: 'jiangbei', label: '江北区' },
              { value: 'jiangdong', label: '江东区' },
            ],
          },
        ],
      },
      {
        value: 'jiangsu',
        label: '江苏',
        children: [
          {
            value: 'nanjing',
            label: '南京',
            children: [
              { value: 'xuanwu', label: '玄武区' },
              { value: 'gulou', label: '鼓楼区' },
            ],
          },
        ],
      },
    ];

    return (
      <div style={{ width: '280px' }}>
        <Cascader placeholder='部分选项禁用' options={optionsWithDisabled} />
      </div>
    );
  },
};

// 悬停展开
export const HoverExpand: Story = {
  args: {
    placeholder: '悬停展开下级',
    options: regionOptions,
    expandTrigger: 'hover',
  },
  render: args => (
    <div style={{ width: '280px' }}>
      <Cascader {...args} />
    </div>
  ),
};

// 选择即改变
export const ChangeOnSelect: Story = {
  args: {
    placeholder: '选择任何层级都会触发 onChange',
    options: regionOptions,
    changeOnSelect: true,
  },
  render: args => (
    <div style={{ width: '300px' }}>
      <Cascader {...args} />
    </div>
  ),
};

// 自定义高度
export const CustomHeight: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>高度 150px</div>
        <div style={{ width: '200px' }}>
          <Cascader placeholder='高度150' options={regionOptions} listHeight={150} />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>高度 300px</div>
        <div style={{ width: '200px' }}>
          <Cascader placeholder='高度300' options={regionOptions} listHeight={300} />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>默认高度 256px</div>
        <div style={{ width: '200px' }}>
          <Cascader placeholder='默认高度' options={regionOptions} />
        </div>
      </div>
    </div>
  ),
};

// 受控模式示例
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<CascaderValue | undefined>();
    const [multipleValue, setMultipleValue] = useState<CascaderMultipleValue>([]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '450px' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>受控单选</h4>
          <Cascader
            placeholder='受控单选示例'
            options={regionOptions}
            value={value}
            onChange={(newValue, selectedOptions) => {
              setValue(newValue as CascaderValue);
              console.log('单选值变化:', newValue, selectedOptions);
            }}
          />
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            当前值: {value ? JSON.stringify(value) : '未选择'}
          </div>
          <div style={{ marginTop: '4px', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setValue(['zhejiang', 'hangzhou', 'xihu'])}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                background: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              设置杭州西湖
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
        </div>

        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>受控多选</h4>
          <Cascader
            placeholder='受控多选示例'
            options={regionOptions}
            value={multipleValue}
            onChange={(newValue, selectedOptions) => {
              setMultipleValue(newValue as CascaderMultipleValue);
              console.log('多选值变化:', newValue, selectedOptions);
            }}
            multiple
          />
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
            当前值: {multipleValue.length > 0 ? JSON.stringify(multipleValue) : '未选择'}
          </div>
          <div style={{ marginTop: '4px', display: 'flex', gap: '8px' }}>
            <button
              onClick={() =>
                setMultipleValue([
                  ['zhejiang', 'hangzhou', 'xihu'],
                  ['jiangsu', 'nanjing', 'xuanwu'],
                ])
              }
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                background: '#1890ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              设置两个区域
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
      </div>
    );
  },
};

// 自定义标签渲染
export const CustomLabelRender: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px' }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>单选自定义标签</h4>
        <Cascader
          placeholder='自定义单选标签'
          options={regionOptions}
          defaultValue={['zhejiang', 'hangzhou', 'xihu']}
          labelRender={option => `📍 ${option.label}`}
        />
      </div>

      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>多选自定义标签</h4>
        <Cascader
          placeholder='自定义多选标签'
          options={regionOptions}
          multiple
          defaultValue={[
            ['zhejiang', 'hangzhou', 'xihu'],
            ['jiangsu', 'nanjing', 'xuanwu'],
          ]}
          labelRender={option => `🏙️ ${option.label}`}
        />
      </div>
    </div>
  ),
};

// 自定义选项渲染
export const CustomOptionRender: Story = {
  render: () => (
    <div style={{ width: '320px' }}>
      <Cascader
        placeholder='自定义选项样式'
        options={orgOptions}
        optionRender={option => (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '500' }}>{option.label}</span>
            <span
              style={{
                fontSize: '11px',
                color: '#999',
                background: '#f5f5f5',
                padding: '1px 5px',
                borderRadius: '8px',
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
    <div style={{ width: '300px' }}>
      <Cascader
        placeholder='自定义弹窗内容'
        options={categoryOptions}
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
              🛒 选择商品分类
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
              请从左到右依次选择分类
            </div>
          </div>
        )}
      />
    </div>
  ),
};

// 受控展开状态
export const ControlledOpen: Story = {
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ width: '350px' }}>
        <Cascader
          placeholder='受控展开状态'
          options={regionOptions}
          open={open}
          onChange={(value, selectedOptions) => {
            console.log('Value changed:', value, selectedOptions);
          }}
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
