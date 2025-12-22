import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Upload } from '../src';
import { Button } from '@fluentui/react-components';
import { ArrowUpload20Regular, DocumentArrowUp20Regular } from '@fluentui/react-icons';

const meta = {
  title: '数据录入/Upload 上传',
  component: Upload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Upload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: '基础用法',
  args: {
    children: <Button icon={<ArrowUpload20Regular />}>点击上传</Button>,
    onChange: (files: File[]) => {
      console.log('选择的文件:', files);
      alert(`已选择 ${files.length} 个文件`);
    },
  },
};

export const Multiple: Story = {
  name: '多文件上传',
  args: {
    multiple: true,
    children: <Button icon={<ArrowUpload20Regular />}>选择多个文件</Button>,
    onChange: (files: File[]) => {
      console.log('选择的文件:', files);
      alert(`已选择 ${files.length} 个文件`);
    },
  },
};

export const AcceptImage: Story = {
  name: '只接受图片',
  args: {
    accept: 'image/*',
    children: <Button icon={<ArrowUpload20Regular />}>只能上传图片</Button>,
    onChange: (files: File[]) => {
      console.log('选择的图片:', files);
      alert(`已选择 ${files.length} 张图片`);
    },
  },
};

export const WithValidation: Story = {
  name: '文件验证',
  args: {
    beforeUpload: (file: File) => {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        alert(`${file.name} 文件大小不能超过 5MB`);
        return false;
      }
      return true;
    },
    children: <Button icon={<ArrowUpload20Regular />}>上传（限制 5MB）</Button>,
    onChange: (files: File[]) => {
      console.log('验证通过的文件:', files);
      alert(`${files.length} 个文件通过验证`);
    },
  },
};

export const Disabled: Story = {
  name: '禁用状态',
  args: {
    disabled: true,
    children: (
      <Button disabled icon={<ArrowUpload20Regular />}>
        禁用上传
      </Button>
    ),
  },
};

export const DraggerBasic: Story = {
  name: '拖拽上传',
  render: () => (
    <Upload.Dragger
      onChange={(files: File[]) => {
        console.log('上传的文件:', files);
        alert(`已选择 ${files.length} 个文件`);
      }}
    >
      <div style={{ padding: '20px' }}>
        <DocumentArrowUp20Regular style={{ fontSize: '48px', color: '#0078d4' }} />
        <p style={{ margin: '16px 0 0', fontSize: '16px', fontWeight: 600 }}>点击或拖拽文件到此区域上传</p>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#666' }}>支持单个或批量上传</p>
      </div>
    </Upload.Dragger>
  ),
};

export const DraggerMultiple: Story = {
  name: '拖拽多文件上传',
  render: () => (
    <Upload.Dragger
      multiple
      accept='image/*'
      beforeUpload={(file: File) => {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          alert(`${file.name} 文件大小不能超过 5MB`);
          return false;
        }
        return true;
      }}
      onChange={(files: File[]) => {
        console.log('上传的图片:', files);
        alert(`已选择 ${files.length} 张图片`);
      }}
      onDrop={e => {
        console.log('拖拽事件:', e);
      }}
    >
      <div style={{ padding: '20px' }}>
        <DocumentArrowUp20Regular style={{ fontSize: '48px', color: '#0078d4' }} />
        <p style={{ margin: '16px 0 0', fontSize: '16px', fontWeight: 600 }}>拖拽图片到此处上传</p>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#666' }}>
          支持 JPG、PNG、GIF 格式，单个文件不超过 5MB
        </p>
      </div>
    </Upload.Dragger>
  ),
};

export const DraggerCustomHeight: Story = {
  name: '自定义高度',
  render: () => (
    <Upload.Dragger
      height={200}
      onChange={(files: File[]) => {
        console.log('上传的文件:', files);
        alert(`已选择 ${files.length} 个文件`);
      }}
    >
      <div>
        <p style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>拖拽文件到此处</p>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#666' }}>自定义高度的上传区域</p>
      </div>
    </Upload.Dragger>
  ),
};

export const DraggerDisabled: Story = {
  name: '禁用拖拽',
  render: () => (
    <Upload.Dragger disabled>
      <div>
        <p style={{ margin: 0, fontSize: '16px' }}>禁用的拖拽区域</p>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#999' }}>无法上传文件</p>
      </div>
    </Upload.Dragger>
  ),
};
