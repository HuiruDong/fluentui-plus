import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '../src/components';

const meta: Meta<typeof Pagination> = {
  title: '导航/Pagination 分页',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '分页组件用于在内容过多时进行分页加载处理，提供了标准模式和简洁模式，支持快速跳转、每页条数切换、总数显示等功能。基于 FluentUI 设计系统，提供企业级的用户体验。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    current: {
      control: 'number',
      description: '当前页码（受控模式）',
    },
    defaultCurrent: {
      control: 'number',
      description: '默认的当前页码（非受控模式）',
    },
    total: {
      control: 'number',
      description: '数据总数',
    },
    pageSize: {
      control: 'number',
      description: '每页条数',
    },
    onChange: {
      action: 'onChange',
      description: '页码或每页条数改变的回调，参数为 (page, pageSize)',
    },
    showQuickJumper: {
      control: 'boolean',
      description: '是否显示快速跳转输入框',
    },
    showTotal: {
      control: 'boolean',
      description: '是否显示总数和当前范围',
    },
    hideOnSinglePage: {
      control: 'boolean',
      description: '只有一页时是否隐藏分页器',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用分页器',
    },
    showSizeChanger: {
      control: 'boolean',
      description: '是否显示每页条数切换器',
    },
    pageSizeOptions: {
      control: 'object',
      description: '指定每页可以显示多少条',
    },
    simple: {
      control: 'boolean',
      description: '是否使用简洁模式',
    },
    itemRender: {
      description: '自定义页码、上一页、下一页的渲染函数',
    },
  },
  args: {
    total: 100,
    pageSize: 10,
    defaultCurrent: 1,
    disabled: false,
    showQuickJumper: false,
    showTotal: false,
    hideOnSinglePage: false,
    showSizeChanger: false,
    simple: false,
    pageSizeOptions: [10, 20, 50, 100],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基础示例
export const Default: Story = {
  args: {
    total: 100,
    defaultCurrent: 1,
  },
  render: args => (
    <div>
      <Pagination {...args} />
    </div>
  ),
};

// 更多数据页
export const MorePages: Story = {
  args: {
    total: 500,
    defaultCurrent: 1,
    pageSize: 10,
  },
  render: args => (
    <div>
      <Pagination {...args} />
    </div>
  ),
};

// 显示总数
export const ShowTotal: Story = {
  args: {
    total: 250,
    defaultCurrent: 1,
    showTotal: true,
  },
  render: args => (
    <div>
      <Pagination {...args} />
    </div>
  ),
};

// 自定义总数显示
export const CustomShowTotal: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>基础总数显示</div>
        <Pagination total={250} showTotal />
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>自定义总数文本</div>
        <Pagination total={250} showTotal={(total, range) => `${range[0]}-${range[1]} 共 ${total} 条记录`} />
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>丰富样式</div>
        <Pagination
          total={250}
          pageSize={20}
          showTotal={(total, range) => (
            <span style={{ color: '#1890ff', fontWeight: '500' }}>
              显示第 {range[0]} - {range[1]} 条，总计 {total} 条数据
            </span>
          )}
        />
      </div>
    </div>
  ),
};

// 快速跳转
export const QuickJumper: Story = {
  args: {
    total: 500,
    defaultCurrent: 1,
    showQuickJumper: true,
  },
  render: args => (
    <div>
      <Pagination {...args} />
    </div>
  ),
};

// 每页条数切换
export const SizeChanger: Story = {
  args: {
    total: 500,
    defaultCurrent: 1,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
  },
  render: args => (
    <div>
      <Pagination {...args} />
    </div>
  ),
};

// 完整功能
export const Complete: Story = {
  args: {
    total: 500,
    defaultCurrent: 1,
    showTotal: true,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
  },
  render: args => (
    <div>
      <Pagination {...args} />
    </div>
  ),
};

// 简洁模式
export const Simple: Story = {
  args: {
    total: 100,
    defaultCurrent: 1,
    simple: true,
  },
  render: args => (
    <div>
      <Pagination {...args} />
    </div>
  ),
};

// 简洁模式 + 快速跳转
export const SimpleWithJumper: Story = {
  args: {
    total: 500,
    defaultCurrent: 1,
    simple: true,
    showQuickJumper: true,
  },
  render: args => (
    <div>
      <Pagination {...args} />
    </div>
  ),
};

// 禁用状态
export const Disabled: Story = {
  args: {
    total: 100,
    defaultCurrent: 5,
    disabled: true,
  },
  render: args => (
    <div>
      <Pagination {...args} />
    </div>
  ),
};

// 禁用状态 + 完整功能
export const DisabledComplete: Story = {
  args: {
    total: 500,
    defaultCurrent: 5,
    disabled: true,
    showTotal: true,
    showQuickJumper: true,
    showSizeChanger: true,
  },
  render: args => (
    <div>
      <Pagination {...args} />
    </div>
  ),
};

// 单页隐藏
export const HideOnSinglePage: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>多页显示（总数 50）</div>
        <Pagination total={50} pageSize={10} hideOnSinglePage />
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>单页隐藏（总数 5）</div>
        <Pagination total={5} pageSize={10} hideOnSinglePage />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>只有一页时，分页器会自动隐藏</div>
      </div>
    </div>
  ),
};

// 受控模式
export const Controlled: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handleChange = (page: number, newPageSize: number) => {
      setCurrent(page);
      setPageSize(newPageSize);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Pagination
          current={current}
          pageSize={pageSize}
          total={500}
          onChange={handleChange}
          showTotal
          showSizeChanger
          showQuickJumper
        />
        <div style={{ fontSize: '12px', color: '#666' }}>
          当前页: {current}，每页条数: {pageSize}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCurrent(1)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            跳转到第一页
          </button>
          <button
            onClick={() => setCurrent(10)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: '#52c41a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            跳转到第10页
          </button>
          <button
            onClick={() => setPageSize(20)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: '#722ed1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            设置每页20条
          </button>
        </div>
      </div>
    );
  },
};

// 不同页码大小
export const DifferentPageSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>每页 10 条</div>
        <Pagination total={100} pageSize={10} showTotal />
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>每页 20 条</div>
        <Pagination total={100} pageSize={20} showTotal />
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>每页 50 条</div>
        <Pagination total={100} pageSize={50} showTotal />
      </div>
    </div>
  ),
};

// 自定义渲染
export const CustomRender: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>自定义页码文本</div>
        <Pagination
          total={100}
          defaultCurrent={1}
          itemRender={(page, type, element) => {
            if (type === 'page') {
              return <span style={{ color: '#1890ff', fontWeight: '600' }}>P{page}</span>;
            }
            if (type === 'prev') {
              return <span>⬅️ 上一页</span>;
            }
            if (type === 'next') {
              return <span>下一页 ➡️</span>;
            }
            return element;
          }}
        />
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>emoji 风格</div>
        <Pagination
          total={100}
          defaultCurrent={3}
          itemRender={(page, type, element) => {
            if (type === 'page') {
              return <span>📄 {page}</span>;
            }
            if (type === 'prev') {
              return <span>◀️</span>;
            }
            if (type === 'next') {
              return <span>▶️</span>;
            }
            if (type === 'jump-prev') {
              return <span>⏪</span>;
            }
            if (type === 'jump-next') {
              return <span>⏩</span>;
            }
            return element;
          }}
        />
      </div>
    </div>
  ),
};

// 边界情况
export const EdgeCases: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>总数为 0</div>
        <Pagination total={0} showTotal />
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>没有数据时，分页器仍然显示</div>
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>总数为 1</div>
        <Pagination total={1} showTotal />
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>总数为 10（正好一页）</div>
        <Pagination total={10} pageSize={10} showTotal />
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>总数为 11（两页）</div>
        <Pagination total={11} pageSize={10} showTotal />
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>超大数据量（10000 条）</div>
        <Pagination total={10000} pageSize={10} showTotal showQuickJumper />
      </div>
    </div>
  ),
};

// 企业级应用场景
export const Enterprise: Story = {
  render: () => {
    const [tableData, setTableData] = useState({
      current: 1,
      pageSize: 10,
      total: 238,
    });

    const handleTableChange = (page: number, pageSize: number) => {
      console.log('加载数据:', { page, pageSize });
      setTableData({
        ...tableData,
        current: page,
        pageSize: pageSize,
      });
    };

    return (
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <div
          style={{
            marginBottom: '16px',
            padding: '16px',
            background: '#f5f5f5',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>员工管理系统 - 数据列表</h3>
          <div style={{ fontSize: '12px', color: '#666' }}>模拟企业级表格分页场景，展示分页组件在实际业务中的应用</div>
        </div>

        {/* 模拟表格 */}
        <div
          style={{
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>员工编号</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>姓名</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>部门</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>职位</th>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600' }}>状态</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: tableData.pageSize }).map((_, index) => {
                const rowIndex = (tableData.current - 1) * tableData.pageSize + index + 1;
                if (rowIndex > tableData.total) return null;

                return (
                  <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px', fontSize: '13px' }}>EMP{String(rowIndex).padStart(5, '0')}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>员工 {rowIndex}</td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>
                      {['技术部', '产品部', '市场部', '人力资源部', '财务部'][rowIndex % 5]}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>
                      {['工程师', '产品经理', '设计师', '运营专员', '销售'][rowIndex % 5]}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          background: rowIndex % 3 === 0 ? '#e6f7ff' : '#f6ffed',
                          color: rowIndex % 3 === 0 ? '#1890ff' : '#52c41a',
                        }}
                      >
                        {rowIndex % 3 === 0 ? '在职' : '休假'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 分页器 */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination
            current={tableData.current}
            pageSize={tableData.pageSize}
            total={tableData.total}
            onChange={handleTableChange}
            showTotal={(total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条记录`}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={[10, 20, 50, 100]}
          />
        </div>

        {/* 状态信息 */}
        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#f0f5ff',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#666',
          }}
        >
          <div>当前页码: {tableData.current}</div>
          <div>每页条数: {tableData.pageSize}</div>
          <div>数据总数: {tableData.total}</div>
          <div>
            当前显示: 第 {(tableData.current - 1) * tableData.pageSize + 1} - 第{' '}
            {Math.min(tableData.current * tableData.pageSize, tableData.total)} 条
          </div>
        </div>
      </div>
    );
  },
};

// 响应式布局
export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>大屏幕 - 完整功能</div>
        <div style={{ width: '100%' }}>
          <Pagination total={500} defaultCurrent={1} showTotal showSizeChanger showQuickJumper />
        </div>
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>中等屏幕 - 基础功能 + 跳转</div>
        <div style={{ width: '600px', margin: '0 auto' }}>
          <Pagination total={500} defaultCurrent={1} showQuickJumper />
        </div>
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>小屏幕 - 简洁模式</div>
        <div style={{ width: '300px', margin: '0 auto' }}>
          <Pagination total={500} defaultCurrent={1} simple />
        </div>
      </div>
    </div>
  ),
};

// 不同位置
export const DifferentPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>左对齐</div>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Pagination total={100} showTotal />
        </div>
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>居中</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination total={100} showTotal />
        </div>
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>右对齐</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination total={100} showTotal />
        </div>
      </div>

      <div>
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>两端对齐</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>共 100 条数据</div>
          <Pagination total={100} />
        </div>
      </div>
    </div>
  ),
};
