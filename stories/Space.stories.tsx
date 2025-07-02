import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// 占位组件，用于展示布局间距概念
const Space: React.FC<{ 
  children: React.ReactNode; 
  size?: 'small' | 'medium' | 'large';
  direction?: 'horizontal' | 'vertical';
  align?: 'start' | 'center' | 'end';
  wrap?: boolean;
}> = ({ 
  children, 
  size = 'medium',
  direction = 'horizontal',
  align = 'start',
  wrap = false
}) => {
  const spacing = {
    small: '8px',
    medium: '16px',
    large: '24px'
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      gap: spacing[size], 
      alignItems: align,
      flexDirection: direction === 'vertical' ? 'column' : 'row',
      flexWrap: wrap ? 'wrap' : 'nowrap'
    }}>
      {children}
    </div>
  );
};

const meta: Meta<typeof Space> = {
  title: '布局组件/Space 间距',
  component: Space,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '间距组件用于设置组件之间的间距，让页面布局更加整齐美观。（开发中）'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '间距大小'
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: '排列方向'
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: '对齐方式'
    },
    wrap: {
      control: 'boolean',
      description: '是否换行'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Basic: Story = {
  args: {
    size: 'medium',
    direction: 'horizontal'
  },
  render: (args) => (
    <Space {...args}>
      <button>按钮1</button>
      <button>按钮2</button>
      <button>按钮3</button>
    </Space>
  )
};

// 不同尺寸
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h4>Small (8px)</h4>
        <Space size="small">
          <button>按钮1</button>
          <button>按钮2</button>
          <button>按钮3</button>
        </Space>
      </div>
      <div>
        <h4>Medium (16px)</h4>
        <Space size="medium">
          <button>按钮1</button>
          <button>按钮2</button>
          <button>按钮3</button>
        </Space>
      </div>
      <div>
        <h4>Large (24px)</h4>
        <Space size="large">
          <button>按钮1</button>
          <button>按钮2</button>
          <button>按钮3</button>
        </Space>
      </div>
    </div>
  )
};

// 垂直方向
export const Vertical: Story = {
  args: {
    direction: 'vertical',
    size: 'medium'
  },
  render: (args) => (
    <Space {...args}>
      <button>按钮1</button>
      <button>按钮2</button>
      <button>按钮3</button>
    </Space>
  )
};

// 开发中提示
export const ComingSoon: Story = {
  render: () => (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      border: '2px dashed #d9d9d9',
      borderRadius: '8px',
      color: '#8c8c8c'
    }}>
      <h3>Space 间距组件</h3>
      <p>该组件正在开发中，上述示例仅为演示效果...</p>
      <div style={{ marginTop: '20px' }}>
        <strong>预期功能：</strong>
        <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '10px' }}>
          <li>设置子组件间距</li>
          <li>支持水平和垂直方向</li>
          <li>灵活的间距配置</li>
          <li>自动换行支持</li>
        </ul>
      </div>
    </div>
  )
};
