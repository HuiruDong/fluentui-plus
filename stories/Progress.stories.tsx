import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';

// 占位组件，用于展示进度条概念
interface ProgressProps {
  percent?: number;
  status?: 'normal' | 'success' | 'error' | 'active';
  strokeWidth?: number;
  showInfo?: boolean;
  type?: 'line' | 'circle';
  strokeColor?: string;
  trailColor?: string;
  size?: 'small' | 'default' | 'large';
}

const Progress: React.FC<ProgressProps> = ({ 
  percent = 0,
  status = 'normal',
  strokeWidth = 8,
  showInfo = true,
  type = 'line',
  strokeColor,
  trailColor = '#f0f0f0',
  size = 'default'
}) => {
  const getColor = () => {
    if (strokeColor) return strokeColor;
    switch (status) {
      case 'success': return '#52c41a';
      case 'error': return '#ff4d4f';
      case 'active': return '#1890ff';
      default: return '#1890ff';
    }
  };

  const getWidth = () => {
    switch (size) {
      case 'small': return '160px';
      case 'large': return '320px';
      default: return '200px';
    }
  };

  if (type === 'circle') {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <svg width="120" height="120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={trailColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={getColor()}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s' }}
            transform="rotate(-90 60 60)"
          />
        </svg>
        {showInfo && (
          <span style={{ color: getColor(), fontWeight: 'bold' }}>
            {percent}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: getWidth() }}>
        <div style={{ 
          width: '100%', 
          height: `${strokeWidth}px`, 
          backgroundColor: trailColor, 
          borderRadius: `${strokeWidth / 2}px`,
          overflow: 'hidden'
        }}>
          <div 
            style={{ 
              width: `${Math.min(100, Math.max(0, percent))}%`, 
              height: '100%', 
              backgroundColor: getColor(),
              transition: 'width 0.3s ease',
              borderRadius: `${strokeWidth / 2}px`
            }} 
          />
        </div>
      </div>
      {showInfo && (
        <span style={{ color: getColor(), fontSize: '14px' }}>
          {percent}%
        </span>
      )}
    </div>
  );
};

const meta: Meta<typeof Progress> = {
  title: '反馈组件/Progress 进度条',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '进度条用于展示操作的当前进度，告知用户当前状态和预期等待时间。（开发中）'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    percent: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '进度百分比'
    },
    status: {
      control: 'select',
      options: ['normal', 'success', 'error', 'active'],
      description: '进度条状态'
    },
    type: {
      control: 'select',
      options: ['line', 'circle'],
      description: '进度条类型'
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: '进度条尺寸'
    },
    showInfo: {
      control: 'boolean',
      description: '是否显示进度信息'
    },
    strokeWidth: {
      control: { type: 'range', min: 4, max: 20, step: 2 },
      description: '进度条线宽'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Basic: Story = {
  args: {
    percent: 30
  }
};

// 不同状态
export const Status: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Progress percent={30} status="normal" />
      <Progress percent={50} status="active" />
      <Progress percent={100} status="success" />
      <Progress percent={70} status="error" />
    </div>
  )
};

// 不同尺寸
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Progress percent={30} size="small" />
      <Progress percent={50} size="default" />
      <Progress percent={70} size="large" />
    </div>
  )
};

// 圆形进度条
export const Circle: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
      <Progress percent={30} type="circle" />
      <Progress percent={75} type="circle" status="success" />
      <Progress percent={100} type="circle" status="success" />
    </div>
  )
};

// 动态进度
export const Dynamic: Story = {
  render: () => {
    const [percent, setPercent] = useState(0);
    
    useEffect(() => {
      const timer = setInterval(() => {
        setPercent(prev => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 1;
        });
      }, 100);
      
      return () => clearInterval(timer);
    }, []);
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Progress percent={percent} />
        <Progress percent={percent} type="circle" />
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
      <h3>Progress 进度条</h3>
      <p>该组件正在开发中，敬请期待...</p>
      <div style={{ marginTop: '20px' }}>
        <strong>预期功能：</strong>
        <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '10px' }}>
          <li>线形进度条</li>
          <li>环形进度条</li>
          <li>进度百分比显示</li>
          <li>多种状态颜色</li>
          <li>动画效果支持</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <Progress percent={30} />
        <Progress percent={60} />
        <Progress percent={90} />
      </div>
    </div>
  )
};
