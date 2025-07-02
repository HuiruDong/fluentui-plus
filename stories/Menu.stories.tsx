import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

// 占位组件，用于展示菜单概念
interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
  disabled?: boolean;
}

interface MenuProps {
  items?: MenuItem[];
  mode?: 'vertical' | 'horizontal' | 'inline';
  theme?: 'light' | 'dark';
  selectedKeys?: string[];
  defaultSelectedKeys?: string[];
  onSelect?: (keys: string[]) => void;
  inlineCollapsed?: boolean;
}

const Menu: React.FC<MenuProps> = ({ 
  items = [],
  mode = 'vertical',
  theme = 'light',
  selectedKeys = [],
  onSelect,
  inlineCollapsed = false
}) => {
  const [selected, setSelected] = useState<string[]>(selectedKeys);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const defaultItems: MenuItem[] = [
    { key: 'home', label: '首页', icon: '🏠' },
    { 
      key: 'products', 
      label: '产品', 
      icon: '📦',
      children: [
        { key: 'product1', label: '产品1' },
        { key: 'product2', label: '产品2' }
      ]
    },
    { key: 'solutions', label: '解决方案', icon: '💡' },
    { key: 'about', label: '关于我们', icon: 'ℹ️' }
  ];

  const menuItems = items.length > 0 ? items : defaultItems;

  const handleClick = (key: string) => {
    const newSelected = [key];
    setSelected(newSelected);
    onSelect?.(newSelected);
  };

  const handleSubmenuClick = (key: string) => {
    setOpenKeys(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const isHorizontal = mode === 'horizontal';
  const isDark = theme === 'dark';

  const containerStyle: React.CSSProperties = {
    width: isHorizontal ? 'auto' : '240px',
    border: `1px solid ${isDark ? '#434343' : '#d9d9d9'}`,
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: isDark ? '#001529' : '#ffffff',
    display: isHorizontal ? 'flex' : 'block'
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isSelected = selected.includes(item.key);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openKeys.includes(item.key);

    const itemStyle: React.CSSProperties = {
      padding: '12px 16px',
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      borderBottom: !isHorizontal && level === 0 ? `1px solid ${isDark ? '#434343' : '#f0f0f0'}` : 'none',
      backgroundColor: isSelected 
        ? (isDark ? '#1890ff' : '#e6f7ff') 
        : 'transparent',
      color: item.disabled 
        ? (isDark ? '#666' : '#ccc')
        : isSelected 
          ? (isDark ? '#fff' : '#1890ff')
          : (isDark ? '#fff' : '#000'),
      paddingLeft: `${16 + level * 24}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      opacity: item.disabled ? 0.5 : 1
    };

    return (
      <div key={item.key}>
        <div
          style={itemStyle}
          onClick={() => {
            if (item.disabled) return;
            if (hasChildren) {
              handleSubmenuClick(item.key);
            } else {
              handleClick(item.key);
            }
          }}
        >
          <span>
            {item.icon && <span style={{ marginRight: '8px' }}>{item.icon}</span>}
            {inlineCollapsed && level === 0 ? '' : item.label}
          </span>
          {hasChildren && !inlineCollapsed && (
            <span style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              ▶
            </span>
          )}
        </div>
        {hasChildren && isOpen && !inlineCollapsed && (
          <div>
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      {menuItems.map(item => renderMenuItem(item))}
    </div>
  );
};

const meta: Meta<typeof Menu> = {
  title: '导航组件/Menu 菜单',
  component: Menu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '菜单组件用于网站导航，为用户提供层级化的信息架构。（开发中）'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['vertical', 'horizontal', 'inline'],
      description: '菜单模式'
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '主题'
    },
    inlineCollapsed: {
      control: 'boolean',
      description: '内联菜单是否收起'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Basic: Story = {
  args: {
    mode: 'vertical',
    theme: 'light'
  }
};

// 水平菜单
export const Horizontal: Story = {
  args: {
    mode: 'horizontal',
    theme: 'light'
  },
  render: (args) => <Menu {...args} />
};

// 深色主题
export const Dark: Story = {
  args: {
    mode: 'vertical',
    theme: 'dark'
  }
};

// 自定义菜单项
export const CustomItems: Story = {
  render: () => {
    const customItems = [
      { key: 'dashboard', label: '仪表盘', icon: '📊' },
      { 
        key: 'user', 
        label: '用户管理', 
        icon: '👥',
        children: [
          { key: 'user-list', label: '用户列表' },
          { key: 'user-roles', label: '角色管理' },
          { key: 'user-permissions', label: '权限设置' }
        ]
      },
      { 
        key: 'content', 
        label: '内容管理', 
        icon: '📝',
        children: [
          { key: 'articles', label: '文章管理' },
          { key: 'categories', label: '分类管理' }
        ]
      },
      { key: 'settings', label: '系统设置', icon: '⚙️' },
      { key: 'disabled', label: '禁用项', icon: '🚫', disabled: true }
    ];

    return <Menu items={customItems} />;
  }
};

// 收起状态
export const Collapsed: Story = {
  args: {
    inlineCollapsed: true
  },
  render: (args) => <Menu {...args} />
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
      <h3>Menu 菜单组件</h3>
      <p>该组件正在开发中，敬请期待...</p>
      <div style={{ marginTop: '20px' }}>
        <strong>预期功能：</strong>
        <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '10px' }}>
          <li>垂直和水平菜单</li>
          <li>多级子菜单</li>
          <li>菜单项图标支持</li>
          <li>收缩展开动画</li>
          <li>主题自定义</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px' }}>
        <Menu />
      </div>
    </div>
  )
};
