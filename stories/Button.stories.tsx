import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// 创建一个占位 Button 组件，因为真实组件尚未实现
const Button: React.FC<{
  variant?: 'primary' | 'default' | 'secondary' | 'outline' | 'text' | 'link';
  size?: 'small' | 'medium' | 'large';
  block?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}> = ({
  variant = 'default',
  size = 'medium',
  block = false,
  loading = false,
  disabled = false,
  children,
  icon,
}) => {
  // 基于不同的变体设置不同的样式
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { background: '#0078d4', color: 'white' };
      case 'secondary':
        return { background: '#f0f0f0', color: '#333' };
      case 'outline':
        return { background: 'transparent', color: '#0078d4', border: '1px solid #0078d4' };
      case 'text':
        return { background: 'transparent', color: '#0078d4', border: 'none' };
      case 'link':
        return { background: 'transparent', color: '#0078d4', border: 'none', textDecoration: 'underline' };
      default:
        return { background: '#fff', color: '#333', border: '1px solid #d9d9d9' };
    }
  };

  // 基于不同的尺寸设置不同的样式
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { padding: '4px 12px', fontSize: '12px' };
      case 'large':
        return { padding: '10px 24px', fontSize: '16px' };
      default:
        return { padding: '6px 16px', fontSize: '14px' };
    }
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '2px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s',
    fontWeight: 500,
    width: block ? '100%' : 'auto',
    ...getVariantStyles(),
    ...getSizeStyles(),
  };

  return (
    <button style={baseStyles} disabled={disabled || loading}>
      {loading && <span style={{ marginRight: '8px' }}>⟳</span>}
      {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
      {children}
    </button>
  );
};

const meta: Meta<typeof Button> = {
  title: '基础组件/Button 按钮',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '按钮用于触发一个操作，如提交表单、打开对话框等。'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'default', 'secondary', 'outline', 'text', 'link'],
      description: '按钮类型'
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '按钮尺寸'
    },
    block: {
      control: 'boolean',
      description: '是否为块级按钮（占满父容器宽度）'
    },
    loading: {
      control: 'boolean',
      description: '是否显示加载状态'
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用'
    },
    children: {
      control: 'text',
      description: '按钮内容'
    }
  },
  args: {
    children: '按钮'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Default: Story = {
  args: {
    variant: 'default',
    children: '默认按钮'
  }
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '主要按钮'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '次要按钮'
  }
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: '轮廓按钮'
  }
};

export const Text: Story = {
  args: {
    variant: 'text',
    children: '文本按钮'
  }
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: '链接按钮'
  }
};

// 尺寸变体
export const Small: Story = {
  args: {
    size: 'small',
    children: '小尺寸按钮'
  }
};

export const Medium: Story = {
  args: {
    size: 'medium',
    children: '中等尺寸按钮'
  }
};

export const Large: Story = {
  args: {
    size: 'large',
    children: '大尺寸按钮'
  }
};

// 状态
export const Loading: Story = {
  args: {
    loading: true,
    children: '加载中'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: '禁用按钮'
  }
};

export const Block: Story = {
  args: {
    block: true,
    children: '块级按钮'
  },
  parameters: {
    layout: 'padded'
  }
};

// 带图标
export const WithIcon: Story = {
  args: {
    icon: '🚀',
    children: '带图标按钮'
  }
};

// 组合示例
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button variant="primary">主要按钮</Button>
        <Button variant="default">默认按钮</Button>
        <Button variant="secondary">次要按钮</Button>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button variant="outline">轮廓按钮</Button>
        <Button variant="text">文本按钮</Button>
        <Button variant="link">链接按钮</Button>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button size="small">小按钮</Button>
        <Button size="medium">中按钮</Button>
        <Button size="large">大按钮</Button>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button loading>加载中</Button>
        <Button disabled>禁用</Button>
        <Button icon="🎉">带图标</Button>
      </div>
      <Button block>块级按钮</Button>
    </div>
  ),
  parameters: {
    layout: 'padded'
  }
};

// 中国企业级应用场景
export const EnterpriseScenarios: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px' }}>
      <div>
        <h3>表单操作</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary">提交</Button>
          <Button variant="default">保存草稿</Button>
          <Button variant="outline">取消</Button>
        </div>
      </div>
      
      <div>
        <h3>数据操作</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary" size="small">新建</Button>
          <Button variant="default" size="small">编辑</Button>
          <Button variant="secondary" size="small">复制</Button>
          <Button variant="text" size="small">删除</Button>
        </div>
      </div>
      
      <div>
        <h3>导航操作</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="link">返回列表</Button>
          <Button variant="link">查看详情</Button>
          <Button variant="link">下载报告</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};
