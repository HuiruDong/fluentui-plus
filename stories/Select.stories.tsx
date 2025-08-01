import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../src/components';
import type { Option } from '../src/components/Select/types';

const meta: Meta<typeof Select> = {
  title: '数据录入/Select 选择器',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '选择器组件，支持单选、多选、搜索等功能，适用于各种选择场景。提供丰富的配置选项和自定义能力。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: '受控模式的选中值',
    },
    defaultValue: {
      control: 'text',
      description: '非受控模式的默认选中值',
    },
    placeholder: {
      control: 'text',
      description: '输入框占位符',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    multiple: {
      control: 'boolean',
      description: '是否支持多选',
    },
    showSearch: {
      control: 'boolean',
      description: '是否支持搜索',
    },
    listHeight: {
      control: 'number',
      description: '下拉列表最大高度',
    },
    open: {
      control: 'boolean',
      description: '受控模式的展开状态',
    },
    options: {
      control: 'object',
      description: '选项数据',
    },
    onChange: {
      action: 'onChange',
      description: '选中值变化时的回调',
    },
    onSearch: {
      action: 'onSearch',
      description: '搜索时的回调',
    },
  },
  args: {
    placeholder: '请选择',
    disabled: false,
    multiple: false,
    showSearch: false,
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

// 带默认值
export const WithDefaultValue: Story = {
  args: {
    placeholder: '请选择水果',
    options: fruitOptions,
    defaultValue: 'apple',
  },
  render: args => (
    <div style={{ width: '200px' }}>
      <Select {...args} />
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

// 大数据量示例
export const LargeData: Story = {
  render: () => {
    const largeOptions: Option[] = Array.from({ length: 100 }, (_, index) => ({
      value: `item${index + 1}`,
      label: `选项 ${index + 1}`,
    }));

    return (
      <div style={{ width: '200px' }}>
        <Select placeholder='大数据量测试' options={largeOptions} showSearch listHeight={200} />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>共 {largeOptions.length} 个选项</div>
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

// 企业级应用场景
export const EnterpriseScenarios: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '20px', width: '600px' }}>
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>表单场景</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
              所在城市
            </label>
            <Select placeholder='请选择城市' options={cityOptions.slice(0, 6)} style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
              兴趣爱好（多选）
            </label>
            <Select
              placeholder='选择您的兴趣'
              options={[
                { value: 'reading', label: '阅读' },
                { value: 'sports', label: '运动' },
                { value: 'music', label: '音乐' },
                { value: 'travel', label: '旅行' },
                { value: 'coding', label: '编程' },
                { value: 'photography', label: '摄影' },
              ]}
              multiple
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>筛选场景</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
              状态筛选
            </label>
            <Select
              placeholder='选择状态'
              options={[
                { value: 'all', label: '全部' },
                { value: 'pending', label: '待处理' },
                { value: 'processing', label: '处理中' },
                { value: 'completed', label: '已完成' },
                { value: 'cancelled', label: '已取消' },
              ]}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>优先级</label>
            <Select
              placeholder='选择优先级'
              options={[
                { value: 'high', label: '高' },
                { value: 'medium', label: '中' },
                { value: 'low', label: '低' },
              ]}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
              创建时间
            </label>
            <Select
              placeholder='选择时间范围'
              options={[
                { value: 'today', label: '今天' },
                { value: 'week', label: '近一周' },
                { value: 'month', label: '近一月' },
                { value: 'quarter', label: '近一季' },
                { value: 'year', label: '近一年' },
              ]}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>配置场景</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
              主题设置
            </label>
            <Select
              placeholder='选择主题'
              options={[
                { value: 'light', label: '🌞 浅色主题' },
                { value: 'dark', label: '🌙 深色主题' },
                { value: 'auto', label: '🔄 跟随系统' },
              ]}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
              语言设置
            </label>
            <Select
              placeholder='选择语言'
              options={[
                { value: 'zh-CN', label: '简体中文' },
                { value: 'zh-TW', label: '繁體中文' },
                { value: 'en-US', label: 'English' },
                { value: 'ja-JP', label: '日本語' },
                { value: 'ko-KR', label: '한국어' },
              ]}
              showSearch
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

// 回调事件演示
export const WithCallbacks: Story = {
  render: () => {
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
      setLogs(prev => [...prev.slice(-6), `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    return (
      <div style={{ width: '500px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Select
            placeholder='测试各种回调事件'
            options={fruitOptions}
            showSearch
            onChange={(value, options) => {
              addLog(`onChange: ${JSON.stringify(value)}, options: ${JSON.stringify(options)}`);
            }}
            onSearch={searchValue => {
              addLog(`onSearch: "${searchValue}"`);
            }}
          />
        </div>

        <div
          style={{
            padding: '12px',
            background: '#f5f5f5',
            borderRadius: '4px',
            maxHeight: '180px',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>事件日志:</div>
          {logs.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#999' }}>暂无事件</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ fontSize: '11px', color: '#666', lineHeight: '1.4', marginBottom: '2px' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    );
  },
};
