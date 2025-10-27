import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table } from '../src/components';
import type { ColumnType } from '../src/components/Table/types';

const meta: Meta<typeof Table> = {
  title: '数据展示/Table 表格',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '用于展示行列数据的表格组件。基于 rc-table 实现逻辑，支持数据渲染、固定列、横向和纵向滚动等功能。适用于展示大量结构化数据的场景。',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础数据类型
interface BasicDataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

// 基础数据
const basicDataSource: BasicDataType[] = [
  { key: '1', name: '张三', age: 32, address: '北京市朝阳区' },
  { key: '2', name: '李四', age: 42, address: '上海市浦东新区' },
  { key: '3', name: '王五', age: 28, address: '广州市天河区' },
  { key: '4', name: '赵六', age: 35, address: '深圳市南山区' },
];

// 基础列配置
const basicColumns: ColumnType<BasicDataType>[] = [
  {
    key: 'name',
    title: '姓名',
    dataIndex: 'name',
    width: 120,
  },
  {
    key: 'age',
    title: '年龄',
    dataIndex: 'age',
    width: 100,
  },
  {
    key: 'address',
    title: '地址',
    dataIndex: 'address',
  },
];

// 基础示例
export const Default: Story = {
  render: () => <Table dataSource={basicDataSource} columns={basicColumns} />,
  parameters: {
    docs: {
      source: {
        code: `const dataSource = [
  { key: '1', name: '张三', age: 32, address: '北京市朝阳区' },
  { key: '2', name: '李四', age: 42, address: '上海市浦东新区' },
  { key: '3', name: '王五', age: 28, address: '广州市天河区' },
  { key: '4', name: '赵六', age: 35, address: '深圳市南山区' },
];

const columns = [
  { key: 'name', title: '姓名', dataIndex: 'name', width: 120 },
  { key: 'age', title: '年龄', dataIndex: 'age', width: 100 },
  { key: 'address', title: '地址', dataIndex: 'address' },
];

<Table dataSource={dataSource} columns={columns} />`,
      },
    },
  },
};

// 带边框
export const Bordered: Story = {
  render: () => <Table dataSource={basicDataSource} columns={basicColumns} bordered />,
  parameters: {
    docs: {
      source: {
        code: `<Table dataSource={dataSource} columns={columns} bordered />`,
      },
    },
  },
};

// 隐藏表头
export const HideHeader: Story = {
  render: () => <Table dataSource={basicDataSource} columns={basicColumns} showHeader={false} />,
  parameters: {
    docs: {
      source: {
        code: `<Table dataSource={dataSource} columns={columns} showHeader={false} />`,
      },
    },
  },
};

// 空数据
export const Empty: Story = {
  render: () => <Table dataSource={[]} columns={basicColumns} />,
  parameters: {
    docs: {
      source: {
        code: `<Table dataSource={[]} columns={columns} />`,
      },
    },
  },
};

// 自定义空状态
export const CustomEmpty: Story = {
  render: () => (
    <Table
      dataSource={[]}
      columns={basicColumns}
      emptyText={
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>暂无数据</div>
          <div style={{ fontSize: '14px', marginTop: '8px' }}>请添加数据后查看</div>
        </div>
      }
    />
  ),
  parameters: {
    docs: {
      source: {
        code: `<Table
  dataSource={[]}
  columns={columns}
  emptyText={
    <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
      <div style={{ fontSize: '16px', fontWeight: '500' }}>暂无数据</div>
      <div style={{ fontSize: '14px', marginTop: '8px' }}>请添加数据后查看</div>
    </div>
  }
/>`,
      },
    },
  },
};

// 列对齐方式
export const ColumnAlign: Story = {
  render: () => {
    const columns: ColumnType<BasicDataType>[] = [
      {
        key: 'name',
        title: '姓名（左对齐）',
        dataIndex: 'name',
        align: 'left',
        width: 150,
      },
      {
        key: 'age',
        title: '年龄（居中）',
        dataIndex: 'age',
        align: 'center',
        width: 120,
      },
      {
        key: 'address',
        title: '地址（右对齐）',
        dataIndex: 'address',
        align: 'right',
      },
    ];

    return <Table dataSource={basicDataSource} columns={columns} bordered />;
  },
  parameters: {
    docs: {
      source: {
        code: `const columns = [
  {
    key: 'name',
    title: '姓名（左对齐）',
    dataIndex: 'name',
    align: 'left',
    width: 150,
  },
  {
    key: 'age',
    title: '年龄（居中）',
    dataIndex: 'age',
    align: 'center',
    width: 120,
  },
  {
    key: 'address',
    title: '地址（右对齐）',
    dataIndex: 'address',
    align: 'right',
  },
];

<Table dataSource={dataSource} columns={columns} bordered />`,
      },
    },
  },
};

// 自定义渲染
export const CustomRender: Story = {
  render: () => {
    interface DataType {
      key: string;
      name: string;
      age: number;
      status: 'active' | 'inactive';
      score: number;
      tags: string[];
    }

    const dataSource: DataType[] = [
      { key: '1', name: '张三', age: 32, status: 'active', score: 85, tags: ['开发', '前端'] },
      { key: '2', name: '李四', age: 42, status: 'inactive', score: 92, tags: ['设计', 'UI'] },
      { key: '3', name: '王五', age: 28, status: 'active', score: 78, tags: ['测试', '自动化'] },
      { key: '4', name: '赵六', age: 35, status: 'active', score: 88, tags: ['后端', '架构'] },
    ];

    const columns: ColumnType<DataType>[] = [
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
        width: 100,
      },
      {
        key: 'age',
        title: '年龄',
        dataIndex: 'age',
        width: 80,
        render: (value: unknown) => {
          const age = value as number;
          const color = age > 30 ? '#ff6b6b' : '#51cf66';
          return <span style={{ color, fontWeight: '600' }}>{age} 岁</span>;
        },
      },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        width: 100,
        align: 'center',
        render: (value: unknown) => {
          const status = value as string;
          const isActive = status === 'active';
          return (
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                background: isActive ? '#e7f5ff' : '#f8f9fa',
                color: isActive ? '#1c7ed6' : '#868e96',
              }}
            >
              {isActive ? '在职' : '离职'}
            </span>
          );
        },
      },
      {
        key: 'score',
        title: '评分',
        dataIndex: 'score',
        width: 120,
        render: (value: unknown) => {
          const score = value as number;
          const percentage = score;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  flex: 1,
                  height: '6px',
                  background: '#e9ecef',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: score >= 90 ? '#51cf66' : score >= 80 ? '#ffd43b' : '#ff8787',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '500', minWidth: '30px' }}>{score}</span>
            </div>
          );
        },
      },
      {
        key: 'tags',
        title: '标签',
        dataIndex: 'tags',
        render: (value: unknown) => {
          const tags = value as string[];
          return (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    background: '#f1f3f5',
                    color: '#495057',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          );
        },
      },
    ];

    return <Table dataSource={dataSource} columns={columns} bordered />;
  },
  parameters: {
    docs: {
      source: {
        code: `// 自定义渲染单元格内容
const columns = [
  { key: 'name', title: '姓名', dataIndex: 'name' },
  {
    key: 'age',
    title: '年龄',
    dataIndex: 'age',
    render: (value) => {
      const age = value as number;
      const color = age > 30 ? '#ff6b6b' : '#51cf66';
      return <span style={{ color, fontWeight: '600' }}>{age} 岁</span>;
    },
  },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    render: (value) => {
      const isActive = value === 'active';
      return (
        <span style={{
          padding: '4px 12px',
          borderRadius: '12px',
          background: isActive ? '#e7f5ff' : '#f8f9fa',
          color: isActive ? '#1c7ed6' : '#868e96',
        }}>
          {isActive ? '在职' : '离职'}
        </span>
      );
    },
  },
  // ... 更多列配置
];

<Table dataSource={dataSource} columns={columns} bordered />`,
      },
    },
  },
};

// 固定列
export const FixedColumns: Story = {
  render: () => {
    interface DataType {
      key: string;
      name: string;
      age: number;
      address: string;
      email: string;
      phone: string;
      department: string;
    }

    const dataSource: DataType[] = [
      {
        key: '1',
        name: '张三',
        age: 32,
        address: '北京市朝阳区建国路123号',
        email: 'zhangsan@example.com',
        phone: '138-0000-0001',
        department: '技术部',
      },
      {
        key: '2',
        name: '李四',
        age: 42,
        address: '上海市浦东新区世纪大道456号',
        email: 'lisi@example.com',
        phone: '138-0000-0002',
        department: '产品部',
      },
      {
        key: '3',
        name: '王五',
        age: 28,
        address: '广州市天河区天河路789号',
        email: 'wangwu@example.com',
        phone: '138-0000-0003',
        department: '设计部',
      },
      {
        key: '4',
        name: '赵六',
        age: 35,
        address: '深圳市南山区科技园101号',
        email: 'zhaoliu@example.com',
        phone: '138-0000-0004',
        department: '运营部',
      },
    ];

    const columns: ColumnType<DataType>[] = [
      {
        key: 'name',
        title: '姓名',
        dataIndex: 'name',
        width: 100,
        fixed: 'left',
      },
      {
        key: 'age',
        title: '年龄',
        dataIndex: 'age',
        width: 80,
      },
      {
        key: 'address',
        title: '地址',
        dataIndex: 'address',
        width: 250,
      },
      {
        key: 'email',
        title: '邮箱',
        dataIndex: 'email',
        width: 200,
      },
      {
        key: 'phone',
        title: '电话',
        dataIndex: 'phone',
        width: 150,
      },
      {
        key: 'department',
        title: '部门',
        dataIndex: 'department',
        width: 120,
        fixed: 'right',
      },
    ];

    return (
      <div style={{ width: '100%' }}>
        <Table dataSource={dataSource} columns={columns} scroll={{ x: 1000 }} bordered />
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `// 固定列需要配合 scroll.x 使用
const columns = [
  {
    key: 'name',
    title: '姓名',
    dataIndex: 'name',
    width: 100,
    fixed: 'left',  // 固定在左侧
  },
  // ... 其他列
  {
    key: 'department',
    title: '部门',
    dataIndex: 'department',
    width: 120,
    fixed: 'right',  // 固定在右侧
  },
];

<Table
  dataSource={dataSource}
  columns={columns}
  scroll={{ x: 1000 }}  // 必须设置横向滚动宽度
  bordered
/>`,
      },
    },
  },
};

// 横向滚动
export const HorizontalScroll: Story = {
  render: () => {
    interface DataType {
      key: string;
      name: string;
      col1: string;
      col2: string;
      col3: string;
      col4: string;
      col5: string;
      col6: string;
      col7: string;
      col8: string;
    }

    const dataSource: DataType[] = [
      {
        key: '1',
        name: '张三',
        col1: '数据1',
        col2: '数据2',
        col3: '数据3',
        col4: '数据4',
        col5: '数据5',
        col6: '数据6',
        col7: '数据7',
        col8: '数据8',
      },
      {
        key: '2',
        name: '李四',
        col1: '数据1',
        col2: '数据2',
        col3: '数据3',
        col4: '数据4',
        col5: '数据5',
        col6: '数据6',
        col7: '数据7',
        col8: '数据8',
      },
      {
        key: '3',
        name: '王五',
        col1: '数据1',
        col2: '数据2',
        col3: '数据3',
        col4: '数据4',
        col5: '数据5',
        col6: '数据6',
        col7: '数据7',
        col8: '数据8',
      },
    ];

    const columns: ColumnType<DataType>[] = [
      { key: 'name', title: '姓名', dataIndex: 'name', width: 100 },
      { key: 'col1', title: '列1', dataIndex: 'col1', width: 150 },
      { key: 'col2', title: '列2', dataIndex: 'col2', width: 150 },
      { key: 'col3', title: '列3', dataIndex: 'col3', width: 150 },
      { key: 'col4', title: '列4', dataIndex: 'col4', width: 150 },
      { key: 'col5', title: '列5', dataIndex: 'col5', width: 150 },
      { key: 'col6', title: '列6', dataIndex: 'col6', width: 150 },
      { key: 'col7', title: '列7', dataIndex: 'col7', width: 150 },
      { key: 'col8', title: '列8', dataIndex: 'col8', width: 150 },
    ];

    return (
      <div style={{ width: '600px' }}>
        <div style={{ marginBottom: '12px', color: '#666' }}>容器宽度 600px，表格可横向滚动</div>
        <Table dataSource={dataSource} columns={columns} scroll={{ x: 1200 }} bordered />
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `// 当表格宽度超过容器宽度时，启用横向滚动
<Table
  dataSource={dataSource}
  columns={columns}
  scroll={{ x: 1200 }}  // 表格总宽度
  bordered
/>`,
      },
    },
  },
};

// 纵向滚动
export const VerticalScroll: Story = {
  render: () => {
    const dataSource: BasicDataType[] = Array.from({ length: 20 }, (_, index) => ({
      key: `${index + 1}`,
      name: `员工${index + 1}`,
      age: 20 + Math.floor(Math.random() * 30),
      address: ['北京', '上海', '广州', '深圳', '杭州'][Math.floor(Math.random() * 5)] + '市某区某路某号',
    }));

    return (
      <div>
        <div style={{ marginBottom: '12px', color: '#666' }}>表格高度限制为 300px，数据较多时可纵向滚动</div>
        <Table dataSource={dataSource} columns={basicColumns} scroll={{ y: 300 }} bordered />
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `// 固定表格体高度，数据超出时可纵向滚动
<Table
  dataSource={dataSource}
  columns={columns}
  scroll={{ y: 300 }}  // 表格体最大高度
  bordered
/>`,
      },
    },
  },
};

// 横向和纵向滚动
export const BothScroll: Story = {
  render: () => {
    interface DataType {
      key: string;
      name: string;
      age: number;
      address: string;
      email: string;
      phone: string;
      department: string;
      position: string;
    }

    const dataSource: DataType[] = Array.from({ length: 20 }, (_, index) => ({
      key: `${index + 1}`,
      name: `员工${index + 1}`,
      age: 20 + Math.floor(Math.random() * 30),
      address: ['北京', '上海', '广州', '深圳', '杭州'][Math.floor(Math.random() * 5)] + '市某区某路某号',
      email: `user${index + 1}@example.com`,
      phone: `138-0000-${String(index + 1).padStart(4, '0')}`,
      department: ['技术部', '产品部', '设计部', '运营部', '市场部'][Math.floor(Math.random() * 5)],
      position: ['工程师', '经理', '总监', '专员'][Math.floor(Math.random() * 4)],
    }));

    const columns: ColumnType<DataType>[] = [
      { key: 'name', title: '姓名', dataIndex: 'name', width: 100, fixed: 'left' },
      { key: 'age', title: '年龄', dataIndex: 'age', width: 80 },
      { key: 'address', title: '地址', dataIndex: 'address', width: 250 },
      { key: 'email', title: '邮箱', dataIndex: 'email', width: 200 },
      { key: 'phone', title: '电话', dataIndex: 'phone', width: 150 },
      { key: 'department', title: '部门', dataIndex: 'department', width: 120 },
      { key: 'position', title: '职位', dataIndex: 'position', width: 100, fixed: 'right' },
    ];

    return (
      <div style={{ width: '800px' }}>
        <div style={{ marginBottom: '12px', color: '#666' }}>容器宽度 800px，高度限制 400px，支持横向和纵向滚动</div>
        <Table dataSource={dataSource} columns={columns} scroll={{ x: 1200, y: 400 }} bordered />
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `// 同时支持横向和纵向滚动
<Table
  dataSource={dataSource}
  columns={columns}
  scroll={{ x: 1200, y: 400 }}  // 横向和纵向滚动
  bordered
/>`,
      },
    },
  },
};

// 复杂数据展示
export const ComplexData: Story = {
  render: () => {
    interface UserType {
      key: string;
      avatar: string;
      name: string;
      email: string;
      role: string;
      status: 'online' | 'offline' | 'busy';
      tasks: { total: number; completed: number };
      joinDate: string;
    }

    const dataSource: UserType[] = [
      {
        key: '1',
        avatar: '👨‍💼',
        name: '张三',
        email: 'zhangsan@company.com',
        role: '项目经理',
        status: 'online',
        tasks: { total: 25, completed: 18 },
        joinDate: '2020-01-15',
      },
      {
        key: '2',
        avatar: '👩‍💻',
        name: '李四',
        email: 'lisi@company.com',
        role: '前端工程师',
        status: 'busy',
        tasks: { total: 32, completed: 28 },
        joinDate: '2021-03-20',
      },
      {
        key: '3',
        avatar: '👨‍🎨',
        name: '王五',
        email: 'wangwu@company.com',
        role: 'UI设计师',
        status: 'online',
        tasks: { total: 18, completed: 15 },
        joinDate: '2021-06-10',
      },
      {
        key: '4',
        avatar: '👩‍💼',
        name: '赵六',
        email: 'zhaoliu@company.com',
        role: '产品经理',
        status: 'offline',
        tasks: { total: 20, completed: 12 },
        joinDate: '2022-02-08',
      },
      {
        key: '5',
        avatar: '👨‍🔬',
        name: '钱七',
        email: 'qianqi@company.com',
        role: '测试工程师',
        status: 'online',
        tasks: { total: 28, completed: 24 },
        joinDate: '2022-05-15',
      },
    ];

    const columns: ColumnType<UserType>[] = [
      {
        key: 'user',
        title: '用户信息',
        width: 280,
        render: (_, record) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#f1f3f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              {record.avatar}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{record.name}</div>
              <div style={{ fontSize: '12px', color: '#868e96' }}>{record.email}</div>
            </div>
          </div>
        ),
      },
      {
        key: 'role',
        title: '角色',
        dataIndex: 'role',
        width: 120,
        align: 'center',
      },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        width: 100,
        align: 'center',
        render: (value: unknown) => {
          const status = value as string;
          const statusConfig = {
            online: { text: '在线', color: '#51cf66', bg: '#d3f9d8' },
            offline: { text: '离线', color: '#868e96', bg: '#f1f3f5' },
            busy: { text: '忙碌', color: '#ff6b6b', bg: '#ffe3e3' },
          };
          const config = statusConfig[status as keyof typeof statusConfig];
          return (
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                background: config.bg,
                color: config.color,
              }}
            >
              {config.text}
            </span>
          );
        },
      },
      {
        key: 'tasks',
        title: '任务进度',
        dataIndex: 'tasks',
        width: 200,
        render: (value: unknown) => {
          const tasks = value as { total: number; completed: number };
          const percentage = Math.round((tasks.completed / tasks.total) * 100);
          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#495057' }}>
                  {tasks.completed}/{tasks.total}
                </span>
                <span style={{ fontWeight: '600', color: '#228be6' }}>{percentage}%</span>
              </div>
              <div
                style={{
                  height: '6px',
                  background: '#e9ecef',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: percentage >= 80 ? '#51cf66' : percentage >= 50 ? '#ffd43b' : '#ff8787',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          );
        },
      },
      {
        key: 'joinDate',
        title: '加入日期',
        dataIndex: 'joinDate',
        width: 120,
        align: 'center',
      },
    ];

    return <Table dataSource={dataSource} columns={columns} bordered />;
  },
};

// 企业级应用场景
export const EnterpriseScenario: Story = {
  render: () => {
    interface OrderType {
      key: string;
      orderNo: string;
      customer: { name: string; company: string };
      product: string;
      quantity: number;
      amount: number;
      status: 'pending' | 'processing' | 'completed' | 'cancelled';
      createTime: string;
      actions: string;
    }

    const dataSource: OrderType[] = [
      {
        key: '1',
        orderNo: 'ORD-2024-001',
        customer: { name: '张三', company: '阿里巴巴集团' },
        product: '企业版软件授权',
        quantity: 10,
        amount: 98000,
        status: 'completed',
        createTime: '2024-01-15 10:30:00',
        actions: '',
      },
      {
        key: '2',
        orderNo: 'ORD-2024-002',
        customer: { name: '李四', company: '腾讯科技' },
        product: '云服务套餐',
        quantity: 5,
        amount: 45000,
        status: 'processing',
        createTime: '2024-01-16 14:20:00',
        actions: '',
      },
      {
        key: '3',
        orderNo: 'ORD-2024-003',
        customer: { name: '王五', company: '字节跳动' },
        product: '数据分析服务',
        quantity: 3,
        amount: 28000,
        status: 'pending',
        createTime: '2024-01-17 09:15:00',
        actions: '',
      },
      {
        key: '4',
        orderNo: 'ORD-2024-004',
        customer: { name: '赵六', company: '百度在线' },
        product: 'AI模型训练',
        quantity: 2,
        amount: 56000,
        status: 'cancelled',
        createTime: '2024-01-18 16:45:00',
        actions: '',
      },
    ];

    const columns: ColumnType<OrderType>[] = [
      {
        key: 'orderNo',
        title: '订单编号',
        dataIndex: 'orderNo',
        width: 140,
        render: (value: unknown) => (
          <span style={{ fontFamily: 'monospace', fontWeight: '600', color: '#228be6' }}>{value as string}</span>
        ),
      },
      {
        key: 'customer',
        title: '客户信息',
        dataIndex: 'customer',
        width: 200,
        render: (value: unknown) => {
          const customer = value as { name: string; company: string };
          return (
            <div>
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>{customer.name}</div>
              <div style={{ fontSize: '12px', color: '#868e96' }}>{customer.company}</div>
            </div>
          );
        },
      },
      {
        key: 'product',
        title: '产品',
        dataIndex: 'product',
        width: 160,
      },
      {
        key: 'quantity',
        title: '数量',
        dataIndex: 'quantity',
        width: 80,
        align: 'center',
      },
      {
        key: 'amount',
        title: '金额',
        dataIndex: 'amount',
        width: 120,
        align: 'right',
        render: (value: unknown) => (
          <span style={{ fontWeight: '600', color: '#ff6b6b' }}>¥{(value as number).toLocaleString()}</span>
        ),
      },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        width: 100,
        align: 'center',
        render: (value: unknown) => {
          const status = value as string;
          const statusConfig = {
            pending: { text: '待处理', color: '#868e96', bg: '#f1f3f5' },
            processing: { text: '处理中', color: '#1c7ed6', bg: '#d0ebff' },
            completed: { text: '已完成', color: '#2b8a3e', bg: '#d3f9d8' },
            cancelled: { text: '已取消', color: '#c92a2a', bg: '#ffe3e3' },
          };
          const config = statusConfig[status as keyof typeof statusConfig];
          return (
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                background: config.bg,
                color: config.color,
              }}
            >
              {config.text}
            </span>
          );
        },
      },
      {
        key: 'createTime',
        title: '创建时间',
        dataIndex: 'createTime',
        width: 160,
        render: (value: unknown) => <span style={{ fontSize: '13px', color: '#495057' }}>{value as string}</span>,
      },
      {
        key: 'actions',
        title: '操作',
        width: 180,
        fixed: 'right',
        align: 'center',
        render: () => (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                border: '1px solid #228be6',
                color: '#228be6',
                background: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              查看
            </button>
            <button
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                border: '1px solid #40c057',
                color: '#40c057',
                background: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              编辑
            </button>
            <button
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                border: '1px solid #fa5252',
                color: '#fa5252',
                background: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              删除
            </button>
          </div>
        ),
      },
    ];

    return (
      <div>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>订单管理</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                border: '1px solid #dee2e6',
                color: '#495057',
                background: 'white',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              导出数据
            </button>
            <button
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                border: 'none',
                color: 'white',
                background: '#228be6',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              新建订单
            </button>
          </div>
        </div>
        <Table dataSource={dataSource} columns={columns} scroll={{ x: 1400 }} bordered />
      </div>
    );
  },
};

/**
 * 行选择功能
 * 通过 `rowSelection` 配置可以实现多选功能，支持全选、单选、禁用等特性
 */
export const RowSelection: Story = {
  render: () => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

    const dataSource = [
      { key: '1', name: '张三', age: 32, address: '北京市朝阳区', department: '技术部' },
      { key: '2', name: '李四', age: 42, address: '上海市浦东新区', department: '产品部' },
      { key: '3', name: '王五', age: 28, address: '广州市天河区', department: '设计部' },
      { key: '4', name: '赵六', age: 35, address: '深圳市南山区', department: '运营部' },
      { key: '5', name: '孙七', age: 26, address: '杭州市西湖区', department: '市场部' },
    ];

    const columns: ColumnType<(typeof dataSource)[0]>[] = [
      { key: 'name', title: '姓名', dataIndex: 'name', width: 120 },
      { key: 'age', title: '年龄', dataIndex: 'age', width: 80, align: 'center' },
      { key: 'address', title: '地址', dataIndex: 'address', width: 200 },
      { key: 'department', title: '部门', dataIndex: 'department', width: 120 },
    ];

    return (
      <div>
        <div style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
          <div style={{ fontSize: '14px', color: '#495057' }}>
            已选择 <strong style={{ color: '#228be6' }}>{selectedRowKeys.length}</strong> 项
          </div>
          {selectedRowKeys.length > 0 && (
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#868e96' }}>
              选中的 Keys: {selectedRowKeys.join(', ')}
            </div>
          )}
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          rowSelection={{
            selectedRowKeys,
            onChange: (keys, rows) => {
              console.log('Selected Keys:', keys);
              console.log('Selected Rows:', rows);
              setSelectedRowKeys(keys);
            },
          }}
        />
      </div>
    );
  },
};

/**
 * 默认选中某些行
 */
export const DefaultSelected: Story = {
  render: () => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>(['2', '4']);

    const dataSource = [
      { key: '1', name: '张三', age: 32, address: '北京市朝阳区', department: '技术部' },
      { key: '2', name: '李四', age: 42, address: '上海市浦东新区', department: '产品部' },
      { key: '3', name: '王五', age: 28, address: '广州市天河区', department: '设计部' },
      { key: '4', name: '赵六', age: 35, address: '深圳市南山区', department: '运营部' },
      { key: '5', name: '孙七', age: 26, address: '杭州市西湖区', department: '市场部' },
    ];

    const columns: ColumnType<(typeof dataSource)[0]>[] = [
      { key: 'name', title: '姓名', dataIndex: 'name', width: 120 },
      { key: 'age', title: '年龄', dataIndex: 'age', width: 80, align: 'center' },
      { key: 'address', title: '地址', dataIndex: 'address', width: 200 },
      { key: 'department', title: '部门', dataIndex: 'department', width: 120 },
    ];

    return (
      <div>
        <div style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
          <div style={{ fontSize: '14px', color: '#495057' }}>
            已选择 <strong style={{ color: '#228be6' }}>{selectedRowKeys.length}</strong> 项
          </div>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          rowSelection={{
            selectedRowKeys,
            onChange: keys => setSelectedRowKeys(keys),
          }}
        />
      </div>
    );
  },
};

/**
 * 禁用某些行的选择
 * 通过 `getCheckboxProps` 可以设置某些行的 checkbox 为禁用状态
 */
export const DisabledRows: Story = {
  render: () => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

    const dataSource = [
      { key: '1', name: '张三', age: 32, address: '北京市朝阳区', status: 'active' },
      { key: '2', name: '李四', age: 42, address: '上海市浦东新区', status: 'disabled' },
      { key: '3', name: '王五', age: 28, address: '广州市天河区', status: 'active' },
      { key: '4', name: '赵六', age: 35, address: '深圳市南山区', status: 'disabled' },
      { key: '5', name: '孙七', age: 26, address: '杭州市西湖区', status: 'active' },
    ];

    const columns: ColumnType<(typeof dataSource)[0]>[] = [
      { key: 'name', title: '姓名', dataIndex: 'name', width: 120 },
      { key: 'age', title: '年龄', dataIndex: 'age', width: 80, align: 'center' },
      { key: 'address', title: '地址', dataIndex: 'address', width: 200 },
      {
        key: 'status',
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: (value: unknown) => (
          <span style={{ color: value === 'active' ? '#40c057' : '#868e96' }}>
            {value === 'active' ? '可用' : '禁用'}
          </span>
        ),
      },
    ];

    return (
      <div>
        <div style={{ marginBottom: '16px', padding: '12px', background: '#fff3cd', borderRadius: '6px' }}>
          <div style={{ fontSize: '14px', color: '#856404' }}>💡 状态为"禁用"的行不可选择</div>
        </div>
        <div style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
          <div style={{ fontSize: '14px', color: '#495057' }}>
            已选择 <strong style={{ color: '#228be6' }}>{selectedRowKeys.length}</strong> 项
          </div>
        </div>
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          rowSelection={{
            selectedRowKeys,
            onChange: keys => setSelectedRowKeys(keys),
            getCheckboxProps: record => ({
              disabled: record.status === 'disabled',
            }),
          }}
        />
      </div>
    );
  },
};

/**
 * 固定选择列
 * 当表格横向滚动时，选择列可以固定在左侧
 */
export const FixedSelectionColumn: Story = {
  render: () => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);

    const dataSource = [
      { key: '1', name: '张三', age: 32, address: '北京市朝阳区', email: 'zhangsan@example.com', phone: '13800138000' },
      { key: '2', name: '李四', age: 42, address: '上海市浦东新区', email: 'lisi@example.com', phone: '13800138001' },
      { key: '3', name: '王五', age: 28, address: '广州市天河区', email: 'wangwu@example.com', phone: '13800138002' },
      { key: '4', name: '赵六', age: 35, address: '深圳市南山区', email: 'zhaoliu@example.com', phone: '13800138003' },
    ];

    const columns: ColumnType<(typeof dataSource)[0]>[] = [
      { key: 'name', title: '姓名', dataIndex: 'name', width: 120 },
      { key: 'age', title: '年龄', dataIndex: 'age', width: 80, align: 'center' },
      { key: 'address', title: '地址', dataIndex: 'address', width: 200 },
      { key: 'email', title: '邮箱', dataIndex: 'email', width: 220 },
      { key: 'phone', title: '电话', dataIndex: 'phone', width: 140 },
    ];

    return (
      <div>
        <div style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
          <div style={{ fontSize: '14px', color: '#495057' }}>
            已选择 <strong style={{ color: '#228be6' }}>{selectedRowKeys.length}</strong> 项
          </div>
        </div>
        <div style={{ width: '600px', border: '1px solid #dee2e6', borderRadius: '8px' }}>
          <Table
            dataSource={dataSource}
            columns={columns}
            scroll={{ x: 900 }}
            bordered
            rowSelection={{
              selectedRowKeys,
              onChange: keys => setSelectedRowKeys(keys),
              fixed: true,
            }}
          />
        </div>
      </div>
    );
  },
};
