import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Image } from '../src/components';

const meta: Meta<typeof Image> = {
  title: '数据展示/Image 图片',
  component: Image,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '图片组件，用于展示图片，支持懒加载、加载失败容错、点击预览放大、相册模式等功能。基于 FluentUI 设计系统，提供流畅的图片浏览体验。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: '图片地址',
    },
    alt: {
      control: 'text',
      description: '图片描述',
    },
    width: {
      control: 'number',
      description: '图片宽度',
    },
    height: {
      control: 'number',
      description: '图片高度',
    },
    lazy: {
      control: 'boolean',
      description: '是否启用懒加载',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    preview: {
      control: 'boolean',
      description: '是否开启预览',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    previewSrc: {
      control: 'text',
      description: '自定义预览图地址（默认使用 src）',
    },
    placeholder: {
      description: '加载占位内容',
    },
    fallback: {
      description: '加载失败时的容错内容',
    },
    onLoad: {
      action: 'onLoad',
      description: '图片加载完成回调',
    },
    onError: {
      action: 'onError',
      description: '图片加载失败回调',
    },
  },
  args: {
    src: 'https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=300&auto=format&fit=crop',
    alt: '示例图片',
    width: 300,
    height: 200,
    preview: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 示例图片
const sampleImages = [
  'https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1765873360326-54d50adefc15?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=300&auto=format&fit=crop',
];

// 高清大图
const hdImages = [
  'https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1765873360326-54d50adefc15?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop',
];

// 基础用法
export const Basic: Story = {
  name: '基础用法',
  args: {
    src: 'https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=300&auto=format&fit=crop',
    alt: '示例图片',
    width: 300,
    height: 200,
  },
  parameters: {
    docs: {
      description: {
        story: '最基本的图片展示，点击可预览大图。',
      },
    },
  },
};

// 加载失败容错 - 默认样式
export const ErrorDefault: Story = {
  name: '加载失败 - 默认样式',
  args: {
    src: 'https://invalid-url.com/not-found.jpg',
    alt: '加载失败',
    width: 200,
    height: 150,
  },
  parameters: {
    docs: {
      description: {
        story: '当图片加载失败时，会显示默认的错误占位内容。',
      },
    },
  },
};

// 加载失败容错 - 自定义内容
export const ErrorCustom: Story = {
  name: '加载失败 - 自定义内容',
  args: {
    src: 'https://invalid-url.com/not-found.jpg',
    alt: '加载失败',
    width: 200,
    height: 150,
    fallback: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#f5f5f5',
          color: '#999',
        }}
      >
        图片不存在
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '通过 fallback 属性自定义加载失败时的显示内容。',
      },
    },
  },
};

// 自定义占位内容
export const CustomPlaceholder: Story = {
  name: '自定义占位内容',
  args: {
    src: 'https://images.unsplash.com/photo-1765873360326-54d50adefc15?q=80&w=300&auto=format&fit=crop',
    alt: '带占位图片',
    width: 300,
    height: 200,
    placeholder: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
        }}
      >
        加载中...
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: '加载过程中显示的占位内容，可通过 placeholder 属性自定义。',
      },
    },
  },
};

// 禁用预览
export const DisablePreview: Story = {
  name: '禁用预览',
  args: {
    src: 'https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=300&auto=format&fit=crop',
    alt: '禁用预览',
    width: 300,
    height: 200,
    preview: false,
  },
  parameters: {
    docs: {
      description: {
        story: '设置 preview={false} 可禁用点击预览功能。',
      },
    },
  },
};

// 自定义预览图
export const CustomPreviewSrc: Story = {
  name: '自定义预览图',
  args: {
    src: 'https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=300&auto=format&fit=crop',
    previewSrc: 'https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=1200&auto=format&fit=crop',
    alt: '自定义预览图',
    width: 300,
    height: 200,
  },
  parameters: {
    docs: {
      description: {
        story: '通过 previewSrc 属性指定预览时使用的大图地址，适用于缩略图和原图分离的场景。',
      },
    },
  },
};

// 懒加载
export const LazyLoad: Story = {
  name: '懒加载',
  render: () => (
    <div style={{ height: 300, overflow: 'auto', padding: 16, border: '1px solid #e0e0e0', borderRadius: 4 }}>
      <div style={{ height: 350, display: 'flex', alignItems: 'flex-end' }}>
        <p style={{ color: '#999' }}>↓ 向下滚动加载图片</p>
      </div>
      <Image
        src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=300&auto=format&fit=crop'
        alt='懒加载图片1'
        width={300}
        height={200}
        lazy
      />
      <div style={{ height: 100 }} />
      <Image
        src='https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=300&auto=format&fit=crop'
        alt='懒加载图片2'
        width={300}
        height={200}
        lazy
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '设置 lazy 属性开启懒加载，图片进入可视区域后才会加载。向下滚动查看效果。',
      },
    },
  },
};

// 相册模式
export const PreviewGroup: Story = {
  name: '相册模式',
  render: () => (
    <Image.PreviewGroup>
      {sampleImages.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`相册图片 ${index + 1}`}
          width={150}
          height={100}
          style={{ marginRight: 8 }}
        />
      ))}
    </Image.PreviewGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: '使用 Image.PreviewGroup 包裹多张图片，点击任意图片可预览并支持左右切换。',
      },
    },
  },
};

// 相册模式 - 自定义预览图
export const PreviewGroupCustomSrc: Story = {
  name: '相册模式 - 自定义预览图',
  render: () => (
    <Image.PreviewGroup>
      {sampleImages.map((src, index) => (
        <Image
          key={index}
          src={src}
          previewSrc={hdImages[index]}
          alt={`自定义预览图 ${index + 1}`}
          width={150}
          height={100}
          style={{ marginRight: 8 }}
        />
      ))}
    </Image.PreviewGroup>
  ),
  parameters: {
    docs: {
      description: {
        story: '在相册模式下，每张图片都可以通过 previewSrc 指定独立的预览大图。',
      },
    },
  },
};

// 相册模式 - 预览数组
export const PreviewGroupWithImages: Story = {
  name: '相册模式 - 预览数组',
  render: () => (
    <Image.PreviewGroup images={hdImages}>
      <Image src={sampleImages[0]} alt='点击预览全部图片' width={200} height={150} />
    </Image.PreviewGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '通过 Image.PreviewGroup 的 images 属性指定预览图片数组，点击任意子 Image 都会预览这个数组。适用于只显示一张封面图但需要预览多张的场景。',
      },
    },
  },
};

// 不同尺寸
export const DifferentSizes: Story = {
  name: '不同尺寸',
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      <div>
        <p style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>小尺寸 100x75</p>
        <Image
          src='https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=100&auto=format&fit=crop'
          alt='小尺寸'
          width={100}
          height={75}
        />
      </div>
      <div>
        <p style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>中尺寸 200x150</p>
        <Image
          src='https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=200&auto=format&fit=crop'
          alt='中尺寸'
          width={200}
          height={150}
        />
      </div>
      <div>
        <p style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>大尺寸 300x225</p>
        <Image
          src='https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=300&auto=format&fit=crop'
          alt='大尺寸'
          width={300}
          height={225}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '通过 width 和 height 属性设置不同的图片尺寸。',
      },
    },
  },
};

// 事件回调
export const WithCallbacks: Story = {
  name: '事件回调',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <div>
        <p style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>加载成功（查看控制台）</p>
        <Image
          src='https://images.unsplash.com/photo-1766498019113-133d6eb646b7?q=80&w=200&auto=format&fit=crop'
          alt='加载成功'
          width={200}
          height={150}
          onLoad={() => console.log('图片加载成功')}
        />
      </div>
      <div>
        <p style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>加载失败（查看控制台）</p>
        <Image
          src='https://invalid-url.com/not-found.jpg'
          alt='加载失败'
          width={200}
          height={150}
          onError={() => console.log('图片加载失败')}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '通过 onLoad 和 onError 回调监听图片加载状态。',
      },
    },
  },
};
