import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from '../src/components';

const meta: Meta<typeof Tag> = {
  title: '数据展示/Tag 标签',
  component: Tag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '标签用于标记和分类，常用于显示状态、属性等信息。'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    closeIcon: {
      control: 'boolean',
      description: '是否显示关闭图标'
    },
    color: {
      control: 'color',
      description: '标签颜色'
    },
    bordered: {
      control: 'boolean',
      description: '是否显示边框'
    },
    children: {
      control: 'text',
      description: '标签内容'
    }
  },
  args: {
    children: '标签'
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Default: Story = {
  args: {
    children: '默认标签'
  }
};

export const WithClose: Story = {
  args: {
    children: '可关闭标签',
    closeIcon: true,
    onClose: () => alert('标签被关闭')
  }
};

export const Borderless: Story = {
  args: {
    children: '无边框标签',
    bordered: false
  }
};

// 颜色变体
export const ColorVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <Tag>默认</Tag>
      <Tag color="#1890ff">蓝色</Tag>
      <Tag color="#52c41a">绿色</Tag>
      <Tag color="#faad14">橙色</Tag>
      <Tag color="#f5222d">红色</Tag>
      <Tag color="#722ed1">紫色</Tag>
      <Tag color="#13c2c2">青色</Tag>
      <Tag color="#eb2f96">洋红</Tag>
    </div>
  )
};

// 可关闭标签组
export const ClosableTags: Story = {
  render: () => {
    const [tags, setTags] = React.useState(['标签1', '标签2', '标签3', '标签4']);
    
    const handleClose = (tagToRemove: string) => {
      setTags(tags.filter(tag => tag !== tagToRemove));
    };
    
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <Tag
            key={tag}
            closeIcon
            onClose={() => handleClose(tag)}
          >
            {tag}
          </Tag>
        ))}
      </div>
    );
  }
};

// 可选择标签
export const CheckableTags: Story = {
  render: () => {
    const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
    
    const tagsData = ['电影', '书籍', '音乐', '体育', '旅行'];
    
    const handleChange = (tag: string, checked: boolean) => {
      if (checked) {
        setSelectedTags([...selectedTags, tag]);
      } else {
        setSelectedTags(selectedTags.filter(t => t !== tag));
      }
    };
    
    return (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {tagsData.map(tag => (
          <Tag.CheckableTag
            key={tag}
            checked={selectedTags.includes(tag)}
            onChange={(checked) => handleChange(tag, checked)}
          >
            {tag}
          </Tag.CheckableTag>
        ))}
      </div>
    );
  }
};

// 不同尺寸（如果有的话，根据实际实现调整）
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Tag style={{ fontSize: '12px', padding: '2px 6px' }}>小标签</Tag>
      <Tag>默认标签</Tag>
      <Tag style={{ fontSize: '16px', padding: '6px 12px' }}>大标签</Tag>
    </div>
  )
};

// 企业级应用场景
export const EnterpriseScenarios: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px' }}>
      <div>
        <h3>用户状态标签</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Tag color="#52c41a">在线</Tag>
          <Tag color="#faad14">忙碌</Tag>
          <Tag color="#f5222d">离线</Tag>
          <Tag color="#d9d9d9">暂离</Tag>
        </div>
      </div>
      
      <div>
        <h3>任务优先级</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Tag color="#f5222d">紧急</Tag>
          <Tag color="#fa8c16">高</Tag>
          <Tag color="#1890ff">中</Tag>
          <Tag color="#52c41a">低</Tag>
        </div>
      </div>
      
      <div>
        <h3>项目标签</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Tag closeIcon>前端开发</Tag>
          <Tag closeIcon>后端开发</Tag>
          <Tag closeIcon>UI设计</Tag>
          <Tag closeIcon>测试</Tag>
          <Tag closeIcon>运维</Tag>
        </div>
      </div>
      
      <div>
        <h3>审批状态</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Tag color="#faad14">待审批</Tag>
          <Tag color="#1890ff">审批中</Tag>
          <Tag color="#52c41a">已通过</Tag>
          <Tag color="#f5222d">已拒绝</Tag>
          <Tag color="#d9d9d9">已撤回</Tag>
        </div>
      </div>
      
      <div>
        <h3>部门标签</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Tag bordered={false}>技术部</Tag>
          <Tag bordered={false}>产品部</Tag>
          <Tag bordered={false}>设计部</Tag>
          <Tag bordered={false}>运营部</Tag>
          <Tag bordered={false}>市场部</Tag>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen'
  }
};

// 标签输入场景
export const TagInput: Story = {
  render: () => {
    const [tags, setTags] = React.useState(['React', 'TypeScript', 'Storybook']);
    const [inputValue, setInputValue] = React.useState('');
    
    const handleClose = (tagToRemove: string) => {
      setTags(tags.filter(tag => tag !== tagToRemove));
    };
    
    const handleInputConfirm = () => {
      if (inputValue && !tags.includes(inputValue)) {
        setTags([...tags, inputValue]);
      }
      setInputValue('');
    };
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tags.map(tag => (
            <Tag
              key={tag}
              closeIcon
              onClose={() => handleClose(tag)}
            >
              {tag}
            </Tag>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInputConfirm()}
            placeholder="输入标签名"
            style={{ 
              padding: '4px 8px', 
              border: '1px solid #d9d9d9', 
              borderRadius: '4px',
              flex: 1
            }}
          />
          <button onClick={handleInputConfirm} style={{ padding: '4px 12px' }}>
            添加
          </button>
        </div>
      </div>
    );
  }
};
