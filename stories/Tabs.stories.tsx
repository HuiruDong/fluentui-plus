import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '../src/components';
import type { TabItem } from '../src/components/Tabs/types';
import {
  DocumentRegular,
  FolderRegular,
  EditRegular,
  SettingsRegular,
  PersonRegular,
  HomeRegular,
  CalendarRegular,
  MailRegular,
} from '@fluentui/react-icons';

const meta: Meta<typeof Tabs> = {
  title: '导航/Tabs 标签页',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '选项卡切换组件，用于在不同的内容区域之间进行切换。支持溢出菜单、图标、禁用状态等功能。基于 FluentUI TabList 组件封装，提供更便捷的使用方式。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: 'object',
      description: '标签页选项列表',
    },
    vertical: {
      control: 'boolean',
      description: '是否垂直排列',
    },
    appearance: {
      control: 'select',
      options: ['transparent', 'subtle', 'subtle-circular', 'filled-circular'],
      description: '标签页外观样式',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '标签页尺寸',
    },
    onTabSelect: {
      action: 'onTabSelect',
      description: '标签页选择事件回调',
    },
    menuMaxHeight: {
      control: 'text',
      description: '溢出菜单下拉框的最大高度',
    },
    overflowProps: {
      control: 'object',
      description: '溢出组件的属性配置',
    },
    menuTriggerButtonProps: {
      control: 'object',
      description: '溢出菜单触发按钮的属性配置',
    },
  },
  args: {
    vertical: false,
    appearance: 'transparent',
    size: 'medium',
    menuMaxHeight: '256px',
    items: [
      { key: 'tab1', label: '标签一' },
      { key: 'tab2', label: '标签二' },
      { key: 'tab3', label: '标签三' },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础标签页数据
const basicItems: TabItem[] = [
  { key: 'tab1', label: '标签一' },
  { key: 'tab2', label: '标签二' },
  { key: 'tab3', label: '标签三' },
];

// 带图标的标签页数据
const iconItems: TabItem[] = [
  { key: 'home', label: '首页', icon: <HomeRegular /> },
  { key: 'documents', label: '文档', icon: <DocumentRegular /> },
  { key: 'folder', label: '文件夹', icon: <FolderRegular /> },
  { key: 'settings', label: '设置', icon: <SettingsRegular /> },
];

// 更多标签页数据（用于溢出演示）
const overflowItems: TabItem[] = [
  { key: 'home', label: '首页', icon: <HomeRegular /> },
  { key: 'documents', label: '文档', icon: <DocumentRegular /> },
  { key: 'folder', label: '文件夹', icon: <FolderRegular /> },
  { key: 'edit', label: '编辑', icon: <EditRegular /> },
  { key: 'person', label: '个人中心', icon: <PersonRegular /> },
  { key: 'calendar', label: '日历', icon: <CalendarRegular /> },
  { key: 'mail', label: '邮件', icon: <MailRegular /> },
  { key: 'settings', label: '设置', icon: <SettingsRegular /> },
];

// 禁用项标签页数据
const disabledItems: TabItem[] = [
  { key: 'tab1', label: '可用标签' },
  { key: 'tab2', label: '禁用标签', disabled: true },
  { key: 'tab3', label: '可用标签' },
];

// 基础示例
export const Default: Story = {
  args: {
    items: basicItems,
    overflowProps: { minimumVisible: 4 },
  },
  render: args => <Tabs {...args} />,
};

// 带图标的标签页
export const WithIcon: Story = {
  args: {
    items: iconItems,
    overflowProps: { minimumVisible: 4 },
  },
  render: args => <Tabs {...args} />,
};

// 溢出菜单
export const Overflow: Story = {
  args: {
    items: overflowItems,
    menuMaxHeight: '200px',
    overflowProps: { minimumVisible: 4 },
  },
  render: args => (
    <div
      style={{
        width: '400px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <Tabs {...args} />
    </div>
  ),
};

// 垂直布局
export const Vertical: Story = {
  args: {
    items: iconItems,
    vertical: true,
    overflowProps: { minimumVisible: 4 },
  },
  render: args => (
    <div
      style={{
        height: '200px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      <Tabs {...args} />
    </div>
  ),
};

// 禁用状态
export const Disabled: Story = {
  args: {
    items: disabledItems,
    overflowProps: { minimumVisible: 4 },
  },
  render: args => <Tabs {...args} />,
};

// 不同外观样式
export const Appearances: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>transparent（默认）</div>
        <Tabs appearance='transparent' items={basicItems} overflowProps={{ minimumVisible: 4 }} />
      </div>
      <div>
        <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>subtle</div>
        <Tabs appearance='subtle' items={basicItems} overflowProps={{ minimumVisible: 4 }} />
      </div>
      <div>
        <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>subtle-circular</div>
        <Tabs appearance='subtle-circular' items={basicItems} overflowProps={{ minimumVisible: 4 }} />
      </div>
      <div>
        <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>filled-circular</div>
        <Tabs appearance='filled-circular' items={basicItems} overflowProps={{ minimumVisible: 4 }} />
      </div>
    </div>
  ),
};

// 不同尺寸
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>small</div>
        <Tabs size='small' items={basicItems} overflowProps={{ minimumVisible: 4 }} />
      </div>
      <div>
        <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>medium（默认）</div>
        <Tabs size='medium' items={basicItems} overflowProps={{ minimumVisible: 4 }} />
      </div>
      <div>
        <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>large</div>
        <Tabs size='large' items={basicItems} overflowProps={{ minimumVisible: 4 }} />
      </div>
    </div>
  ),
};

// 事件回调示例
export const EventCallback: Story = {
  render: function EventCallbackComponent() {
    const [selectedTab, setSelectedTab] = useState<string>('');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Tabs items={basicItems} onTabSelect={key => setSelectedTab(key)} overflowProps={{ minimumVisible: 4 }} />
        <div
          style={{
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
          }}
        >
          当前选中: <strong>{selectedTab || '未选中'}</strong>
        </div>
      </div>
    );
  },
};

// 完整功能演示
export const FullFeature: Story = {
  render: function FullFeatureComponent() {
    const [selectedTab, setSelectedTab] = useState<string>('home');

    const contentMap: Record<string, string> = {
      home: '这是首页的内容区域',
      documents: '这是文档的内容区域',
      folder: '这是文件夹的内容区域',
      settings: '这是设置的内容区域',
    };

    return (
      <div style={{ width: '500px' }}>
        <Tabs items={iconItems} onTabSelect={key => setSelectedTab(key)} overflowProps={{ minimumVisible: 4 }} />
        <div
          style={{
            padding: '24px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            marginTop: '8px',
            minHeight: '100px',
          }}
        >
          {contentMap[selectedTab] || '请选择一个标签页'}
        </div>
      </div>
    );
  },
};
