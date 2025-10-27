import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spin } from '../src/components';
import { Button } from '@fluentui/react-components';

const meta: Meta<typeof Spin> = {
  title: '反馈/Spin 加载中',
  component: Spin,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '用于页面和区块的加载中状态，提供直观的用户反馈。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    spinning: {
      control: 'boolean',
      description: '是否为加载中状态',
      defaultValue: true,
    },
    size: {
      control: 'select',
      options: ['tiny', 'extra-small', 'small', 'medium', 'large', 'extra-large', 'huge'],
      description: '组件大小',
      defaultValue: 'medium',
    },
    tip: {
      control: 'text',
      description: '自定义描述文案',
    },
    delay: {
      control: 'number',
      description: '延迟显示加载效果的时间（毫秒）',
      defaultValue: 0,
    },
    fullscreen: {
      control: 'boolean',
      description: '是否全屏展示',
      defaultValue: false,
    },
  },
  args: {
    spinning: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Default: Story = {
  args: {
    spinning: true,
  },
};

// 不同尺寸
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ textAlign: 'center' }}>
        <Spin size='tiny' />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>tiny</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spin size='extra-small' />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>extra-small</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spin size='small' />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>small</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spin size='medium' />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>medium</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spin size='large' />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>large</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spin size='extra-large' />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>extra-large</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Spin size='huge' />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>huge</div>
      </div>
    </div>
  ),
};

// 自定义提示文案
export const WithTip: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        minHeight: '200px',
      }}
    >
      <Spin tip='加载中...' size='large' />
    </div>
  ),
};

// 嵌套模式
export const Nested: Story = {
  render: () => {
    const [spinning, setSpinning] = useState(false);

    return (
      <div style={{ width: '400px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Button onClick={() => setSpinning(!spinning)}>{spinning ? '停止加载' : '开始加载'}</Button>
        </div>
        <Spin spinning={spinning} tip='加载中...'>
          <div
            style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          >
            <h3 style={{ marginBottom: '12px', color: '#1f2937' }}>卡片内容</h3>
            <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
              这是一段示例内容。当加载状态开启时，会显示半透明遮罩层和加载图标。
            </p>
            <p style={{ color: '#6b7280', lineHeight: '1.6', marginTop: '8px' }}>
              用户可以看到内容，但无法与之交互，直到加载完成。
            </p>
          </div>
        </Spin>
      </div>
    );
  },
};

// 延迟显示
export const WithDelay: Story = {
  render: () => {
    const [spinning, setSpinning] = useState(false);

    const handleClick = () => {
      setSpinning(true);
      // 模拟快速完成的操作
      setTimeout(() => {
        setSpinning(false);
      }, 300);
    };

    return (
      <div style={{ width: '400px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Button onClick={handleClick}>触发加载（300ms 自动结束）</Button>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            minHeight: '200px',
          }}
        >
          <Spin spinning={spinning} delay={500} tip='延迟 500ms 显示' size='large' />
        </div>
        <p style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
          设置 delay=500，如果加载在 500ms 内完成则不会显示加载状态，避免闪烁。
        </p>
      </div>
    );
  },
};

// 全屏加载
export const Fullscreen: Story = {
  render: () => {
    const [spinning, setSpinning] = useState(false);

    return (
      <div>
        <Button appearance='primary' onClick={() => setSpinning(true)}>
          显示全屏加载
        </Button>
        <Spin fullscreen spinning={spinning} tip='正在加载...' size='extra-large' />
        {spinning && (
          <Button
            appearance='primary'
            onClick={() => setSpinning(false)}
            style={{ marginLeft: '12px', position: 'relative', zIndex: 1001 }}
          >
            关闭加载
          </Button>
        )}
      </div>
    );
  },
};

// 控制加载状态
export const Controlled: Story = {
  render: () => {
    const [spinning, setSpinning] = useState(true);

    return (
      <div style={{ width: '400px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
          <Button onClick={() => setSpinning(true)}>开始加载</Button>
          <Button onClick={() => setSpinning(false)}>停止加载</Button>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            minHeight: '200px',
          }}
        >
          <Spin spinning={spinning} tip='受控模式' size='large' />
        </div>
      </div>
    );
  },
};

// 企业级应用场景
export const EnterpriseScenarios: Story = {
  render: () => {
    const [dataLoading, setDataLoading] = useState(false);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);

    const handleDataLoad = () => {
      setDataLoading(true);
      setTimeout(() => setDataLoading(false), 2000);
    };

    const handleFormSubmit = () => {
      setFormSubmitting(true);
      setTimeout(() => setFormSubmitting(false), 1500);
    };

    const handlePageLoad = () => {
      setPageLoading(true);
      setTimeout(() => setPageLoading(false), 3000);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '20px', width: '600px' }}>
        {/* 数据加载场景 */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>数据加载场景</h3>
          <Button onClick={handleDataLoad} style={{ marginBottom: '12px' }}>
            加载数据
          </Button>
          <Spin spinning={dataLoading} tip='正在加载数据...'>
            <div
              style={{
                padding: '24px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ marginBottom: '8px' }}>数据表格</h4>
              <div style={{ color: '#6b7280' }}>
                <div>用户列表数据</div>
                <div>订单统计信息</div>
                <div>销售报表</div>
              </div>
            </div>
          </Spin>
        </div>

        {/* 表单提交场景 */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>表单提交场景</h3>
          <Spin spinning={formSubmitting} tip='正在提交表单...'>
            <div
              style={{
                padding: '24px',
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
            >
              <h4 style={{ marginBottom: '12px' }}>用户信息表单</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  placeholder='姓名'
                  style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
                <input
                  placeholder='邮箱'
                  style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
                <Button appearance='primary' onClick={handleFormSubmit} disabled={formSubmitting}>
                  提交
                </Button>
              </div>
            </div>
          </Spin>
        </div>

        {/* 页面级加载 */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>页面级加载</h3>
          <Button appearance='primary' onClick={handlePageLoad}>
            触发页面加载
          </Button>
          <Spin fullscreen spinning={pageLoading} tip='正在加载页面...' size='extra-large' />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

// 与其他组件组合
export const WithOtherComponents: Story = {
  render: () => {
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);

    return (
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        {/* 卡片加载 */}
        <div style={{ width: '280px' }}>
          <Spin spinning={loading1} tip='加载中...'>
            <div
              style={{
                padding: '20px',
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <h4 style={{ marginBottom: '12px' }}>统计卡片</h4>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0078d4', marginBottom: '8px' }}>8,234</div>
              <div style={{ color: '#6b7280' }}>总访问量</div>
              <Button onClick={() => setLoading1(!loading1)} style={{ marginTop: '16px' }}>
                {loading1 ? '停止' : '刷新数据'}
              </Button>
            </div>
          </Spin>
        </div>

        {/* 列表加载 */}
        <div style={{ width: '280px' }}>
          <Spin spinning={loading2} size='small'>
            <div
              style={{
                padding: '20px',
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <h4 style={{ marginBottom: '12px' }}>消息列表</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['消息1', '消息2', '消息3'].map((msg, i) => (
                  <div key={i} style={{ padding: '8px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                    {msg}
                  </div>
                ))}
              </div>
              <Button onClick={() => setLoading2(!loading2)} style={{ marginTop: '16px' }}>
                {loading2 ? '停止' : '加载更多'}
              </Button>
            </div>
          </Spin>
        </div>
      </div>
    );
  },
};
