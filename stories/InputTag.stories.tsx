import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InputTag } from '../src/components';

const meta: Meta<typeof InputTag> = {
  title: '数据录入/InputTag 输入标签',
  component: InputTag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '输入标签组件，支持用户输入文本并转换为标签形式展示，常用于标签管理、关键词输入等场景。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'object',
      description: '受控模式的标签值',
    },
    defaultValue: {
      control: 'object',
      description: '非受控模式的默认标签值',
    },
    onChange: {
      action: 'onChange',
      description: '标签列表变化时的回调',
    },
    onInputChange: {
      action: 'onInputChange',
      description: '输入内容变化时的回调',
    },
    placeholder: {
      control: 'text',
      description: '输入框占位符',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    maxTags: {
      control: 'number',
      description: '最大标签数量',
    },
    allowDuplicates: {
      control: 'boolean',
      description: '是否允许重复标签',
    },
    delimiter: {
      control: 'text',
      description: '分隔符，支持多个字符',
    },
    tagClosable: {
      control: 'boolean',
      description: '标签是否可关闭',
    },
    onTagRemove: {
      action: 'onTagRemove',
      description: '标签被移除时的回调',
    },
  },
  args: {
    placeholder: '请输入标签',
    disabled: false,
    allowDuplicates: true,
    tagClosable: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Default: Story = {
  args: {
    defaultValue: ['React', 'TypeScript'],
    placeholder: '请输入标签后按 Enter 键',
  },
};

// 受控模式
export const Controlled: Story = {
  render: args => {
    const [tags, setTags] = useState<string[]>(['受控标签1', '受控标签2']);

    return (
      <div style={{ width: '400px' }}>
        <InputTag {...args} value={tags} onChange={setTags} />
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>当前标签: {JSON.stringify(tags)}</div>
      </div>
    );
  },
  args: {
    placeholder: '受控模式示例',
  },
};

// 禁用状态
export const Disabled: Story = {
  args: {
    defaultValue: ['禁用状态', '不可编辑'],
    disabled: true,
    placeholder: '禁用状态',
  },
};

// 限制最大标签数量
export const MaxTags: Story = {
  render: args => {
    const [tags, setTags] = useState<string[]>(['Tag1', 'Tag2']);

    return (
      <div style={{ width: '400px' }}>
        <InputTag {...args} value={tags} onChange={setTags} maxTags={3} />
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
          最多只能添加 3 个标签，当前: {tags.length}/3
        </div>
      </div>
    );
  },
  args: {
    placeholder: '最多只能添加3个标签',
  },
};

// 不允许重复标签
export const NoDuplicates: Story = {
  render: args => {
    const [tags, setTags] = useState<string[]>(['唯一标签']);

    return (
      <div style={{ width: '400px' }}>
        <InputTag {...args} value={tags} onChange={setTags} allowDuplicates={false} />
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>不允许重复标签，尝试输入已存在的标签</div>
      </div>
    );
  },
  args: {
    placeholder: '不允许重复标签',
  },
};

// 自定义分隔符
export const CustomDelimiter: Story = {
  render: args => {
    const [tags, setTags] = useState<string[]>([]);

    return (
      <div style={{ width: '400px' }}>
        <InputTag {...args} value={tags} onChange={setTags} delimiter=',' />
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
          使用逗号分隔符，输入 &quot;tag1,tag2,tag3&quot; 可以批量添加标签
        </div>
      </div>
    );
  },
  args: {
    placeholder: '使用逗号分隔，如: tag1,tag2,tag3',
  },
};

// 标签不可关闭
export const NonClosable: Story = {
  args: {
    defaultValue: ['不可删除1', '不可删除2', '不可删除3'],
    tagClosable: false,
    placeholder: '标签不可删除',
  },
};

// 自定义标签渲染
export const CustomRender: Story = {
  render: args => {
    const [tags, setTags] = useState<string[]>(['自定义1', '自定义2']);

    const customRenderTag = (tag: string, index: number, onClose: () => void) => (
      <span
        key={index}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '4px 8px',
          margin: '2px 4px 2px 0',
          background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          color: 'white',
          borderRadius: '16px',
          fontSize: '12px',
          fontWeight: '500',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        🏷️ {tag}
        <button
          onClick={onClose}
          style={{
            marginLeft: '6px',
            background: 'rgba(255,255,255,0.3)',
            border: 'none',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            cursor: 'pointer',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          ✕
        </button>
      </span>
    );

    return (
      <div style={{ width: '400px' }}>
        <InputTag {...args} value={tags} onChange={setTags} renderTag={customRenderTag} />
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>自定义标签样式，带有渐变背景和表情符号</div>
      </div>
    );
  },
  args: {
    placeholder: '自定义标签渲染',
  },
};

// 回调事件展示
export const WithCallbacks: Story = {
  render: args => {
    const [tags, setTags] = useState<string[]>(['示例标签']);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
      setLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const handleChange = (newTags: string[]) => {
      setTags(newTags);
      addLog(`标签列表变化: ${JSON.stringify(newTags)}`);
    };

    const handleInputChange = (value: string) => {
      addLog(`输入内容变化: "${value}"`);
    };

    const handleTagRemove = (tag: string, index: number) => {
      addLog(`标签移除: "${tag}" (索引: ${index})`);
    };

    return (
      <div style={{ width: '500px' }}>
        <InputTag
          {...args}
          value={tags}
          onChange={handleChange}
          onInputChange={handleInputChange}
          onTagRemove={handleTagRemove}
        />
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#f5f5f5',
            borderRadius: '4px',
            maxHeight: '120px',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>事件日志:</div>
          {logs.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#999' }}>暂无事件</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ fontSize: '11px', color: '#666', lineHeight: '1.4' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    );
  },
  args: {
    placeholder: '测试各种事件回调',
  },
};

// 复杂场景示例
export const ComplexExample: Story = {
  render: args => {
    const [tags, setTags] = useState<string[]>(['JavaScript', 'React']);

    return (
      <div style={{ width: '500px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>技能标签管理</h4>
        <InputTag
          {...args}
          value={tags}
          onChange={setTags}
          maxTags={10}
          allowDuplicates={false}
          placeholder='添加您的技能标签（最多10个）'
        />
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>当前技能数量: {tags.length}/10</div>
          <div style={{ fontSize: '12px', color: '#999' }}>建议添加: TypeScript, Vue, Node.js, Python, HTML, CSS</div>
        </div>
      </div>
    );
  },
};

// 多行布局示例
export const MultiLine: Story = {
  render: args => {
    const [tags, setTags] = useState<string[]>([
      'JavaScript',
      'TypeScript',
      'React',
      'Vue',
      'Angular',
      'Node.js',
      'Express',
      'MongoDB',
      'MySQL',
      'Redis',
      'Docker',
      'Kubernetes',
      'AWS',
      'Git',
      'Webpack',
    ]);

    return (
      <div style={{ width: '600px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>多标签展示（自动换行）</h4>
        <InputTag {...args} value={tags} onChange={setTags} placeholder='继续添加更多标签' />
        <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
          当前有 {tags.length} 个标签，组件会自动处理换行布局
        </div>
      </div>
    );
  },
};
