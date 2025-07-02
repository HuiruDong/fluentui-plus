import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

// 占位组件，用于展示级联选择概念
interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
}

interface CascaderProps {
  options?: CascaderOption[];
  placeholder?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  expandTrigger?: 'click' | 'hover';
  changeOnSelect?: boolean;
}

const Cascader: React.FC<CascaderProps> = ({ 
  placeholder = '请选择',
  value = [],
  onChange,
  options = [],
  expandTrigger,
  changeOnSelect,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const displayValue = value.length > 0 ? value.join(' / ') : placeholder;
  
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div 
        style={{ 
          padding: '8px 12px',
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          minWidth: '200px',
          cursor: 'pointer',
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ color: value.length > 0 ? '#000' : '#999' }}>
          {displayValue}
        </span>
        <span style={{ marginLeft: '8px' }}>▼</span>
      </div>
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          border: '1px solid #d9d9d9',
          borderRadius: '4px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
          padding: '4px 0'
        }}>
          <div style={{ padding: '8px 12px', color: '#999' }}>
            开发中...
          </div>
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof Cascader> = {
  title: '数据录入/Cascader 级联选择',
  component: Cascader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '级联选择器用于选择具有层级关系的数据，如省市区、部门组织等。（开发中）'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: '占位文本'
    },
    expandTrigger: {
      control: 'select',
      options: ['click', 'hover'],
      description: '展开触发方式'
    },
    changeOnSelect: {
      control: 'boolean',
      description: '选择即改变'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Basic: Story = {
  args: {
    placeholder: '请选择地区'
  },
  render: (args) => <Cascader {...args} />
};

// 预设数据示例
export const WithOptions: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    
    const options = [
      {
        value: 'beijing',
        label: '北京',
        children: [
          { value: 'haidian', label: '海淀区' },
          { value: 'chaoyang', label: '朝阳区' }
        ]
      },
      {
        value: 'shanghai',
        label: '上海',
        children: [
          { value: 'huangpu', label: '黄浦区' },
          { value: 'xuhui', label: '徐汇区' }
        ]
      }
    ];
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Cascader
          placeholder="请选择省市区"
          value={value}
          onChange={setValue}
          options={options}
        />
        <div style={{ color: '#666' }}>
          选中值: {value.length > 0 ? JSON.stringify(value) : '无'}
        </div>
      </div>
    );
  }
};

export const ComingSoon: Story = {
  render: () => (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      border: '2px dashed #d9d9d9',
      borderRadius: '8px',
      color: '#8c8c8c'
    }}>
      <h3>Cascader 级联选择器</h3>
      <p>该组件正在开发中，敬请期待...</p>
      <div style={{ marginTop: '20px' }}>
        <strong>预期功能：</strong>
        <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '10px' }}>
          <li>多级数据选择</li>
          <li>支持搜索功能</li>
          <li>异步数据加载</li>
          <li>自定义显示格式</li>
          <li>省市区选择场景</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Cascader placeholder="省市区选择器预览" />
      </div>
    </div>
  )
};
