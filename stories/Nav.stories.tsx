import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Nav } from '../src/components';
import type { NavItemType } from '../src/components';

const meta: Meta<typeof Nav> = {
  title: '导航/Nav 导航菜单',
  component: Nav,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '为页面和功能提供导航的菜单列表。支持多级嵌套、展开收起、选中状态等功能。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['inline'],
      description: '菜单模式',
      defaultValue: 'inline',
    },
    collapsed: {
      control: 'boolean',
      description: '是否收起菜单',
    },
    selectedKeys: {
      control: 'object',
      description: '当前选中的菜单项',
    },
    defaultSelectedKeys: {
      control: 'object',
      description: '默认选中的菜单项',
    },
    openKeys: {
      control: 'object',
      description: '当前展开的子菜单',
    },
    defaultOpenKeys: {
      control: 'object',
      description: '默认展开的子菜单',
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '256px', height: '400px', border: '1px solid #e8e8e8' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础导航数据
const basicItems: NavItemType[] = [
  {
    key: '1',
    label: '首页',
    icon: '🏠',
    title: '首页',
  },
  {
    key: '2',
    label: '工作台',
    icon: '💼',
    title: '工作台',
  },
  {
    key: '3',
    label: '数据统计',
    icon: '📊',
    title: '数据统计',
  },
  {
    key: '4',
    label: '设置',
    icon: '⚙️',
    title: '设置',
  },
];

// 带子菜单的导航数据
const nestedItems: NavItemType[] = [
  {
    key: '1',
    label: '首页',
    icon: '🏠',
    title: '首页',
  },
  {
    key: 'sub1',
    label: '产品管理',
    icon: '📦',
    title: '产品管理',
    children: [
      {
        key: '2',
        label: '产品列表',
        icon: '📋',
        title: '产品列表',
      },
      {
        key: '3',
        label: '添加产品',
        icon: '➕',
        title: '添加产品',
      },
      {
        key: '4',
        label: '产品分类',
        icon: '🏷️',
        title: '产品分类',
      },
    ],
  },
  {
    key: 'sub2',
    label: '用户管理',
    icon: '👥',
    title: '用户管理',
    children: [
      {
        key: '5',
        label: '用户列表',
        icon: '👤',
        title: '用户列表',
      },
      {
        key: '6',
        label: '权限设置',
        icon: '🔒',
        title: '权限设置',
      },
    ],
  },
  {
    key: '7',
    label: '系统设置',
    icon: '⚙️',
    title: '系统设置',
  },
];

// 带分组的导航数据
const groupedItems: NavItemType[] = [
  {
    key: 'group1',
    type: 'group',
    label: '常用功能',
    children: [
      {
        key: '1',
        label: '首页',
        icon: '🏠',
        title: '首页',
      },
      {
        key: '2',
        label: '工作台',
        icon: '💼',
        title: '工作台',
      },
    ],
  },
  {
    key: 'divider1',
    type: 'divider',
  },
  {
    key: 'group2',
    type: 'group',
    label: '管理功能',
    children: [
      {
        key: 'sub1',
        label: '产品管理',
        icon: '📦',
        title: '产品管理',
        children: [
          {
            key: '3',
            label: '产品列表',
            icon: '📋',
            title: '产品列表',
          },
          {
            key: '4',
            label: '添加产品',
            icon: '➕',
            title: '添加产品',
          },
        ],
      },
      {
        key: '5',
        label: '用户管理',
        icon: '👥',
        title: '用户管理',
      },
    ],
  },
  {
    key: 'divider2',
    type: 'divider',
  },
  {
    key: 'group3',
    type: 'group',
    label: '系统设置',
    children: [
      {
        key: '6',
        label: '系统配置',
        icon: '⚙️',
        title: '系统配置',
      },
      {
        key: '7',
        label: '关于',
        icon: 'ℹ️',
        title: '关于',
      },
    ],
  },
];

// 基础示例
export const Default: Story = {
  args: {
    items: basicItems,
    defaultSelectedKeys: ['1'],
  },
};

// 带子菜单
export const WithSubmenu: Story = {
  args: {
    items: nestedItems,
    defaultSelectedKeys: ['2'],
    defaultOpenKeys: ['sub1'],
  },
};

// 收起状态
export const Collapsed: Story = {
  args: {
    items: nestedItems,
    collapsed: true,
    defaultSelectedKeys: ['2'],
    defaultOpenKeys: ['sub1'],
  },
};

// 带分组和分割线
export const WithGroups: Story = {
  args: {
    items: groupedItems,
    defaultSelectedKeys: ['1'],
    defaultOpenKeys: ['sub1'],
  },
};

// 禁用状态
export const WithDisabled: Story = {
  args: {
    items: [
      ...basicItems.slice(0, 2),
      {
        ...basicItems[2],
        disabled: true,
      },
      ...basicItems.slice(3),
    ],
    defaultSelectedKeys: ['1'],
  },
};

// 受控模式
export const Controlled: Story = {
  render: () => {
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);
    const [openKeys, setOpenKeys] = useState<string[]>(['sub1']);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '4px' }}>
          <div>当前选中: {selectedKeys.join(', ')}</div>
          <div>当前展开: {openKeys.join(', ')}</div>
        </div>
        <Nav
          items={nestedItems}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onSelect={info => {
            console.log('选中菜单:', info);
            setSelectedKeys(info.selectedKeys);
          }}
          onOpenChange={keys => {
            console.log('展开变化:', keys);
            setOpenKeys(keys);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '展示如何通过受控模式来管理菜单的选中和展开状态。',
      },
    },
  },
};

// 交互式收起展开
export const Interactive: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);
    const [openKeys, setOpenKeys] = useState<string[]>(['sub1']);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '4px' }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              background: '#fff',
              cursor: 'pointer',
            }}
          >
            {collapsed ? '展开' : '收起'} 菜单
          </button>
          <div style={{ marginTop: '8px' }}>
            状态: {collapsed ? '收起' : '展开'} | 选中: {selectedKeys.join(', ')}
          </div>
        </div>
        <Nav
          items={nestedItems}
          collapsed={collapsed}
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onSelect={info => {
            setSelectedKeys(info.selectedKeys);
          }}
          onOpenChange={keys => {
            setOpenKeys(keys);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '展示菜单的收起展开交互效果。收起状态下，子菜单会以浮层形式显示。',
      },
    },
  },
};

// 深层嵌套菜单
export const DeepNesting: Story = {
  args: {
    items: [
      {
        key: '1',
        label: '首页',
        icon: '🏠',
        title: '首页',
      },
      {
        key: 'level1',
        label: '一级菜单',
        icon: '📁',
        title: '一级菜单',
        children: [
          {
            key: '2',
            label: '二级菜单项',
            icon: '📄',
            title: '二级菜单项',
          },
          {
            key: 'level2',
            label: '二级菜单',
            icon: '📁',
            title: '二级菜单',
            children: [
              {
                key: '3',
                label: '三级菜单项1',
                icon: '📄',
                title: '三级菜单项1',
              },
              {
                key: '4',
                label: '三级菜单项2',
                icon: '📄',
                title: '三级菜单项2',
              },
              {
                key: 'level3',
                label: '三级菜单',
                icon: '📁',
                title: '三级菜单',
                children: [
                  {
                    key: '5',
                    label: '四级菜单项1',
                    icon: '📄',
                    title: '四级菜单项1',
                  },
                  {
                    key: '6',
                    label: '四级菜单项2',
                    icon: '📄',
                    title: '四级菜单项2',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    defaultSelectedKeys: ['3'],
    defaultOpenKeys: ['level1', 'level2'],
  },
  parameters: {
    docs: {
      description: {
        story: '展示多层嵌套菜单的支持能力。',
      },
    },
  },
};

// 自定义图标
export const CustomIcon: Story = {
  args: {
    items: [
      {
        key: '1',
        label: '首页',
        icon: <span style={{ color: '#1890ff' }}>🏠</span>,
        title: '首页',
      },
      {
        key: '2',
        label: '工作台',
        icon: <span style={{ color: '#52c41a' }}>💼</span>,
        title: '工作台',
      },
      {
        key: 'sub1',
        label: '管理中心',
        icon: <span style={{ color: '#fa8c16' }}>⚙️</span>,
        title: '管理中心',
        children: [
          {
            key: '3',
            label: '用户管理',
            icon: <span style={{ color: '#722ed1' }}>👥</span>,
            title: '用户管理',
          },
          {
            key: '4',
            label: '权限管理',
            icon: <span style={{ color: '#eb2f96' }}>🔒</span>,
            title: '权限管理',
          },
        ],
      },
    ],
    defaultSelectedKeys: ['1'],
    defaultOpenKeys: ['sub1'],
    expandIcon: <span style={{ color: '#1890ff' }}>▶</span>,
  },
  parameters: {
    docs: {
      description: {
        story: '展示如何使用自定义图标和展开图标。',
      },
    },
  },
};
