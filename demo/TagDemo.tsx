import React from 'react';
import { Tag } from '../src';

interface TagDemoProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const DemoSection: React.FC<TagDemoProps> = ({ title, description, children }) => (
  <section style={{ marginBottom: '30px' }}>
    <h3 style={{ marginBottom: '8px', color: '#1890ff', fontSize: '18px', fontWeight: '600' }}>{title}</h3>
    {description && (
      <p style={{ marginBottom: '12px', color: '#666', fontSize: '14px' }}>
        {description}
      </p>
    )}
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {children}
    </div>
  </section>
);

export const TagDemo: React.FC = () => {
  const [checkedTags, setCheckedTags] = React.useState({
    hobby1: false,
    hobby2: true,
    hobby3: false,
    skill1: true,
    skill2: false,
    skill3: true,
  });

  const [dynamicTags, setDynamicTags] = React.useState([
    '前端开发',
    'React',
    'TypeScript',
    'JavaScript'
  ]);

  const [inputValue, setInputValue] = React.useState('');
  const [showInput, setShowInput] = React.useState(false);

  const handleTagClose = (tagName: string) => {
    console.log(`关闭标签: ${tagName}`);
    // 演示动态标签的删除
    if (dynamicTags.includes(tagName)) {
      setDynamicTags(tags => tags.filter(tag => tag !== tagName));
    }
  };

  const handleCheckableTagChange = (tagKey: string, checked: boolean) => {
    setCheckedTags(prev => ({
      ...prev,
      [tagKey]: checked
    }));
  };

  const handleAddTag = () => {
    if (inputValue && !dynamicTags.includes(inputValue)) {
      setDynamicTags([...dynamicTags, inputValue]);
      setInputValue('');
      setShowInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center', fontSize: '32px', fontWeight: '600', color: '#262626' }}>
        Tag 组件完整功能演示
      </h1>

      <DemoSection 
        title="基础标签" 
        description="最基本的标签用法，支持点击事件和边框控制"
      >
        <Tag>默认标签</Tag>
        <Tag bordered={false}>无边框标签</Tag>
        <Tag onClick={() => alert('标签被点击!')}>可点击标签</Tag>
        <Tag 
          style={{ cursor: 'pointer' }}
          onClick={() => console.log('控制台输出')}
        >
          查看控制台
        </Tag>
      </DemoSection>

      <DemoSection 
        title="可关闭标签" 
        description="带有关闭按钮的标签，支持自定义关闭图标"
      >
        <Tag closeIcon onClose={() => handleTagClose('可关闭标签1')}>
          可关闭标签1
        </Tag>
        <Tag closeIcon onClose={() => handleTagClose('可关闭标签2')}>
          可关闭标签2
        </Tag>
        <Tag 
          closeIcon={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>✕</span>} 
          onClose={() => handleTagClose('自定义关闭图标')}
        >
          自定义关闭图标
        </Tag>
      </DemoSection>

      <DemoSection 
        title="预设颜色标签" 
        description="使用预设颜色的标签，适用于不同的场景分类"
      >
        <Tag color="#2db7f5">蓝色 (信息)</Tag>
        <Tag color="#87d068">绿色 (成功)</Tag>
        <Tag color="#f50">红色 (错误)</Tag>
        <Tag color="#fa8c16">橙色 (警告)</Tag>
        <Tag color="#722ed1">紫色 (特殊)</Tag>
        <Tag color="#13c2c2">青色 (辅助)</Tag>
        <Tag color="#eb2f96">洋红 (活跃)</Tag>
        <Tag color="#52c41a">亮绿 (正常)</Tag>
      </DemoSection>

      <DemoSection 
        title="彩色可关闭标签" 
        description="带颜色和关闭功能的标签组合"
      >
        <Tag color="#2db7f5" closeIcon onClose={() => handleTagClose('蓝色')}>
          蓝色标签
        </Tag>
        <Tag color="#87d068" closeIcon onClose={() => handleTagClose('绿色')}>
          绿色标签
        </Tag>
        <Tag color="#f50" closeIcon onClose={() => handleTagClose('红色')}>
          红色标签
        </Tag>
        <Tag color="#fa8c16" closeIcon onClose={() => handleTagClose('橙色')}>
          橙色标签
        </Tag>
      </DemoSection>

      <DemoSection 
        title="可选择标签 (CheckableTag)" 
        description="支持选中状态的标签，适用于筛选场景"
      >
        <Tag.CheckableTag
          checked={checkedTags.hobby1}
          onChange={(checked) => handleCheckableTagChange('hobby1', checked)}
        >
          阅读
        </Tag.CheckableTag>
        <Tag.CheckableTag
          checked={checkedTags.hobby2}
          onChange={(checked) => handleCheckableTagChange('hobby2', checked)}
        >
          运动
        </Tag.CheckableTag>
        <Tag.CheckableTag
          checked={checkedTags.hobby3}
          onChange={(checked) => handleCheckableTagChange('hobby3', checked)}
        >
          音乐
        </Tag.CheckableTag>
      </DemoSection>

      <DemoSection 
        title="技能标签选择" 
        description="专业技能的选择示例"
      >
        <Tag.CheckableTag
          checked={checkedTags.skill1}
          onChange={(checked) => handleCheckableTagChange('skill1', checked)}
        >
          React
        </Tag.CheckableTag>
        <Tag.CheckableTag
          checked={checkedTags.skill2}
          onChange={(checked) => handleCheckableTagChange('skill2', checked)}
        >
          Vue.js
        </Tag.CheckableTag>
        <Tag.CheckableTag
          checked={checkedTags.skill3}
          onChange={(checked) => handleCheckableTagChange('skill3', checked)}
        >
          Angular
        </Tag.CheckableTag>
      </DemoSection>

      <DemoSection 
        title="动态标签管理" 
        description="可以动态添加和删除的标签列表"
      >
        {dynamicTags.map(tag => (
          <Tag 
            key={tag}
            closeIcon 
            onClose={() => handleTagClose(tag)}
            color="#108ee9"
          >
            {tag}
          </Tag>
        ))}
        {showInput ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleAddTag}
            style={{
              width: '80px',
              padding: '4px 8px',
              border: '1px dashed #d9d9d9',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            placeholder="新标签"
            autoFocus
          />
        ) : (
          <Tag 
            style={{ 
              borderStyle: 'dashed',
              cursor: 'pointer',
              background: '#fafafa'
            }}
            onClick={() => setShowInput(true)}
          >
            + 添加标签
          </Tag>
        )}
      </DemoSection>

      <DemoSection 
        title="不同尺寸标签" 
        description="通过样式控制标签的大小"
      >
        <Tag style={{ fontSize: '12px', padding: '2px 6px', height: '20px' }}>
          小标签
        </Tag>
        <Tag>
          默认标签
        </Tag>
        <Tag style={{ fontSize: '14px', padding: '6px 12px', height: '32px' }}>
          中标签
        </Tag>
        <Tag style={{ fontSize: '16px', padding: '8px 16px', height: '40px' }}>
          大标签
        </Tag>
      </DemoSection>

      <DemoSection 
        title="状态标签" 
        description="表示不同状态的标签样式"
      >
        <Tag color="#52c41a">成功</Tag>
        <Tag color="#faad14">警告</Tag>
        <Tag color="#ff4d4f">错误</Tag>
        <Tag color="#1890ff">信息</Tag>
        <Tag color="#d9d9d9" style={{ color: '#666' }}>默认</Tag>
        <Tag color="#722ed1">特殊</Tag>
      </DemoSection>

      <DemoSection 
        title="自定义样式标签" 
        description="完全自定义样式的标签示例"
      >
        <Tag 
          style={{ 
            background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontWeight: 'bold'
          }}
        >
          渐变标签
        </Tag>
        <Tag 
          style={{ 
            background: '#fff',
            color: '#1890ff',
            border: '2px solid #1890ff',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          描边标签
        </Tag>
        <Tag 
          style={{ 
            background: '#001529',
            color: '#fff',
            border: '1px solid #40a9ff',
            borderRadius: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          深色主题
        </Tag>
        <Tag 
          style={{ 
            background: '#f6ffed',
            color: '#52c41a',
            border: '1px solid #b7eb8f',
            borderRadius: '10px'
          }}
        >
          柔和绿色
        </Tag>
      </DemoSection>

      <DemoSection 
        title="交互演示" 
        description="标签的各种交互行为"
      >
        <Tag 
          onClick={() => alert('这是一个普通点击事件')}
          style={{ cursor: 'pointer' }}
        >
          点击弹窗
        </Tag>
        <Tag 
          closeIcon 
          onClick={() => console.log('点击了标签内容')} 
          onClose={() => console.log('点击了关闭按钮')}
          style={{ cursor: 'pointer' }}
        >
          双重事件
        </Tag>
        <Tag 
          color="#52c41a"
          onClick={() => {
            const count = parseInt(localStorage.getItem('clickCount') || '0') + 1;
            localStorage.setItem('clickCount', count.toString());
            alert(`你已经点击了 ${count} 次`);
          }}
          style={{ cursor: 'pointer' }}
        >
          计数器标签
        </Tag>
      </DemoSection>

      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        background: '#f5f5f5', 
        borderRadius: '8px' 
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600', color: '#262626' }}>当前状态信息</h3>
        <p><strong>选中的爱好：</strong> 
          {Object.entries(checkedTags)
            .filter(([key, checked]) => key.startsWith('hobby') && checked)
            .map(([key]) => key.replace('hobby', '爱好'))
            .join(', ') || '无'}
        </p>
        <p><strong>选中的技能：</strong> 
          {Object.entries(checkedTags)
            .filter(([key, checked]) => key.startsWith('skill') && checked)
            .map(([key]) => key.replace('skill', '技能'))
            .join(', ') || '无'}
        </p>
        <p><strong>动态标签列表：</strong> {dynamicTags.join(', ')}</p>
      </div>
    </div>
  );
};

export default TagDemo;
