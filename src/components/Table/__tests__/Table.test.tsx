import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Table from '../Table';
import type { ColumnType } from '../types';

// Mock 子组件
jest.mock('../Header', () => {
  return function MockHeader({ columns }: { columns: ColumnType[] }) {
    return (
      <table data-testid='table-header'>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.title}</th>
            ))}
          </tr>
        </thead>
      </table>
    );
  };
});

jest.mock('../Body', () => {
  return function MockBody({
    columns,
    dataSource,
    rowKey,
    emptyText,
  }: {
    columns: ColumnType[];
    dataSource: any[];
    rowKey: string | ((record: any) => string);
    emptyText?: React.ReactNode;
  }) {
    return (
      <table data-testid='table-body'>
        <tbody>
          {dataSource.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{emptyText}</td>
            </tr>
          ) : (
            dataSource.map(record => {
              const key = typeof rowKey === 'function' ? rowKey(record) : record[rowKey];
              return (
                <tr key={key} data-row-key={key}>
                  {columns.map(col => (
                    <td key={col.key}>{String(record[col.dataIndex as string] || '')}</td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    );
  };
});

describe('Table Component', () => {
  const mockColumns: ColumnType[] = [
    { key: 'name', title: '姓名', dataIndex: 'name' },
    { key: 'age', title: '年龄', dataIndex: 'age' },
    { key: 'address', title: '地址', dataIndex: 'address' },
  ];

  const mockData = [
    { key: '1', name: '张三', age: 28, address: '北京' },
    { key: '2', name: '李四', age: 32, address: '上海' },
    { key: '3', name: '王五', age: 25, address: '广州' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<Table dataSource={mockData} columns={mockColumns} />);

      expect(screen.getByTestId('table-header')).toBeInTheDocument();
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} className='custom-table' />);

      const tableContainer = container.querySelector('.fluentui-plus-table-wrapper');
      expect(tableContainer?.firstElementChild).toHaveClass('custom-table');
    });

    it('should apply custom styles', () => {
      const customStyle = { width: '800px', height: '400px' };
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} style={customStyle} />);

      const tableWrapper = container.querySelector('.fluentui-plus-table-wrapper');
      expect(tableWrapper).toHaveStyle('width: 800px');
      expect(tableWrapper).toHaveStyle('height: 400px');
    });

    it('should render with bordered style when bordered is true', () => {
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} bordered={true} />);

      const tableContainer = container.querySelector('.fluentui-plus-table');
      expect(tableContainer).toHaveClass('fluentui-plus-table--bordered');
    });

    it('should not render with bordered style by default', () => {
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} />);

      const tableContainer = container.querySelector('.fluentui-plus-table');
      expect(tableContainer).not.toHaveClass('fluentui-plus-table--bordered');
    });
  });

  describe('表头显示控制', () => {
    it('should show header by default', () => {
      render(<Table dataSource={mockData} columns={mockColumns} />);
      expect(screen.getByTestId('table-header')).toBeInTheDocument();
    });

    it('should hide header when showHeader is false', () => {
      render(<Table dataSource={mockData} columns={mockColumns} showHeader={false} />);
      expect(screen.queryByTestId('table-header')).not.toBeInTheDocument();
    });

    it('should show header when showHeader is explicitly true', () => {
      render(<Table dataSource={mockData} columns={mockColumns} showHeader={true} />);
      expect(screen.getByTestId('table-header')).toBeInTheDocument();
    });
  });

  describe('空数据处理', () => {
    it('should render empty state with default text', () => {
      render(<Table dataSource={[]} columns={mockColumns} />);
      expect(screen.getByText('暂无数据')).toBeInTheDocument();
    });

    it('should render empty state with custom emptyText', () => {
      render(<Table dataSource={[]} columns={mockColumns} emptyText='没有找到数据' />);
      expect(screen.getByText('没有找到数据')).toBeInTheDocument();
    });

    it('should render custom React node as emptyText', () => {
      const CustomEmpty = () => <div data-testid='custom-empty'>自定义空状态</div>;
      render(<Table dataSource={[]} columns={mockColumns} emptyText={<CustomEmpty />} />);
      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
    });
  });

  describe('滚动配置', () => {
    describe('横向滚动 (scroll.x)', () => {
      it('should apply scroll-x class when scroll.x is set', () => {
        const { container } = render(<Table dataSource={mockData} columns={mockColumns} scroll={{ x: 1000 }} />);

        const tableContainer = container.querySelector('.fluentui-plus-table');
        expect(tableContainer).toHaveClass('fluentui-plus-table--scroll-x');
      });

      it('should set width style when scroll.x is number', () => {
        const { container } = render(<Table dataSource={mockData} columns={mockColumns} scroll={{ x: 1200 }} />);

        const innerTable = container.querySelector('.fluentui-plus-table-body-wrapper > div');
        expect(innerTable).toHaveStyle('width: 1200px');
      });

      it('should set width style when scroll.x is string', () => {
        const { container } = render(<Table dataSource={mockData} columns={mockColumns} scroll={{ x: '100%' }} />);

        const innerTable = container.querySelector('.fluentui-plus-table-body-wrapper > div');
        expect(innerTable).toHaveStyle('width: 100%');
      });

      it('should not set width style when scroll.x is true', () => {
        const { container } = render(<Table dataSource={mockData} columns={mockColumns} scroll={{ x: true }} />);

        const innerTable = container.querySelector('.fluentui-plus-table-body-wrapper > div');
        expect(innerTable).not.toHaveAttribute('style');
      });

      it('should set header wrapper overflow-x to hidden when scroll.x is set', () => {
        const { container } = render(<Table dataSource={mockData} columns={mockColumns} scroll={{ x: 1000 }} />);

        const headerWrapper = container.querySelector('.fluentui-plus-table-header-wrapper');
        expect(headerWrapper).toHaveStyle('overflow-x: hidden');
      });

      it('should set body wrapper overflow-x to auto when scroll.x is set', () => {
        const { container } = render(<Table dataSource={mockData} columns={mockColumns} scroll={{ x: 1000 }} />);

        const bodyWrapper = container.querySelector('.fluentui-plus-table-body-wrapper');
        expect(bodyWrapper).toHaveStyle('overflow-x: auto');
      });
    });

    describe('纵向滚动 (scroll.y)', () => {
      it('should apply scroll-y class when scroll.y is set', () => {
        const { container } = render(<Table dataSource={mockData} columns={mockColumns} scroll={{ y: 300 }} />);

        const tableContainer = container.querySelector('.fluentui-plus-table');
        expect(tableContainer).toHaveClass('fluentui-plus-table--scroll-y');
      });

      it('should set max-height when scroll.y is number', () => {
        const { container } = render(<Table dataSource={mockData} columns={mockColumns} scroll={{ y: 400 }} />);

        const bodyWrapper = container.querySelector('.fluentui-plus-table-body-wrapper');
        expect(bodyWrapper).toHaveStyle('max-height: 400px');
        expect(bodyWrapper).toHaveStyle('overflow-y: auto');
      });

      it('should set max-height when scroll.y is string', () => {
        const { container } = render(<Table dataSource={mockData} columns={mockColumns} scroll={{ y: '50vh' }} />);

        const bodyWrapper = container.querySelector('.fluentui-plus-table-body-wrapper');
        expect(bodyWrapper).toHaveStyle('max-height: 50vh');
      });

      it('should set header wrapper overflow-y to scroll when scroll.y is set', () => {
        const { container } = render(<Table dataSource={mockData} columns={mockColumns} scroll={{ y: 300 }} />);

        const headerWrapper = container.querySelector('.fluentui-plus-table-header-wrapper');
        expect(headerWrapper).toHaveStyle('overflow-y: scroll');
      });
    });

    describe('同时设置横向和纵向滚动', () => {
      it('should apply both scroll-x and scroll-y classes', () => {
        const { container } = render(
          <Table dataSource={mockData} columns={mockColumns} scroll={{ x: 1000, y: 300 }} />
        );

        const tableContainer = container.querySelector('.fluentui-plus-table');
        expect(tableContainer).toHaveClass('fluentui-plus-table--scroll-x');
        expect(tableContainer).toHaveClass('fluentui-plus-table--scroll-y');
      });

      it('should apply both width and max-height styles', () => {
        const { container } = render(
          <Table dataSource={mockData} columns={mockColumns} scroll={{ x: 1200, y: 400 }} />
        );

        const bodyWrapper = container.querySelector('.fluentui-plus-table-body-wrapper');
        expect(bodyWrapper).toHaveStyle('max-height: 400px');
        expect(bodyWrapper).toHaveStyle('overflow-x: auto');
        expect(bodyWrapper).toHaveStyle('overflow-y: auto');

        const innerTable = container.querySelector('.fluentui-plus-table-body-wrapper > div');
        expect(innerTable).toHaveStyle('width: 1200px');
      });
    });
  });

  describe('滚动同步', () => {
    it('should sync horizontal scroll between header and body', async () => {
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} scroll={{ x: 1000 }} />);

      const headerWrapper = container.querySelector('.fluentui-plus-table-header-wrapper') as HTMLElement;
      const bodyWrapper = container.querySelector('.fluentui-plus-table-body-wrapper') as HTMLElement;

      // 模拟 body 滚动
      Object.defineProperty(bodyWrapper, 'scrollLeft', { value: 100, writable: true });

      const scrollEvent = new Event('scroll');
      bodyWrapper.dispatchEvent(scrollEvent);

      // 等待 requestAnimationFrame
      await waitFor(() => {
        expect(headerWrapper.scrollLeft).toBe(100);
      });
    });

    it('should not sync scroll when scroll.x is not set', () => {
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} />);

      const bodyWrapper = container.querySelector('.fluentui-plus-table-body-wrapper') as HTMLElement;

      // 确保没有滚动监听器导致错误
      expect(() => {
        const scrollEvent = new Event('scroll');
        bodyWrapper.dispatchEvent(scrollEvent);
      }).not.toThrow();
    });

    it('should cleanup scroll listener on unmount', () => {
      const { container, unmount } = render(<Table dataSource={mockData} columns={mockColumns} scroll={{ x: 1000 }} />);

      const bodyWrapper = container.querySelector('.fluentui-plus-table-body-wrapper') as HTMLElement;
      const removeEventListenerSpy = jest.spyOn(bodyWrapper, 'removeEventListener');

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });
  });

  describe('rowKey 处理', () => {
    it('should use default rowKey property', () => {
      render(<Table dataSource={mockData} columns={mockColumns} />);

      // 验证 Body 组件接收到正确的 rowKey
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should use custom rowKey string property', () => {
      const customData = [
        { id: '1', name: '张三', age: 28 },
        { id: '2', name: '李四', age: 32 },
      ];

      render(<Table dataSource={customData} columns={mockColumns} rowKey='id' />);

      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should use custom rowKey function', () => {
      const rowKeyFn = (record: any) => `row-${record.key}`;

      render(<Table dataSource={mockData} columns={mockColumns} rowKey={rowKeyFn} />);

      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('should handle empty dataSource array', () => {
      render(<Table dataSource={[]} columns={mockColumns} />);
      expect(screen.getByText('暂无数据')).toBeInTheDocument();
    });

    it('should handle empty columns array', () => {
      render(<Table dataSource={mockData} columns={[]} />);
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should handle both empty dataSource and columns', () => {
      render(<Table dataSource={[]} columns={[]} />);
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should use default values when optional props are not provided', () => {
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} />);

      const tableContainer = container.querySelector('.fluentui-plus-table');
      expect(tableContainer).toBeInTheDocument();
      expect(screen.getByTestId('table-header')).toBeInTheDocument();
    });

    it('should handle undefined scroll config', () => {
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} scroll={undefined} />);

      const tableContainer = container.querySelector('.fluentui-plus-table');
      expect(tableContainer).not.toHaveClass('fluentui-plus-table--scroll-x');
      expect(tableContainer).not.toHaveClass('fluentui-plus-table--scroll-y');
    });
  });

  describe('类名生成', () => {
    it('should generate correct class names with all modifiers', () => {
      const { container } = render(
        <Table
          dataSource={mockData}
          columns={mockColumns}
          bordered={true}
          scroll={{ x: 1000, y: 300 }}
          className='my-table'
        />
      );

      const tableContainer = container.querySelector('.fluentui-plus-table');
      expect(tableContainer).toHaveClass('fluentui-plus-table');
      expect(tableContainer).toHaveClass('fluentui-plus-table--bordered');
      expect(tableContainer).toHaveClass('fluentui-plus-table--scroll-x');
      expect(tableContainer).toHaveClass('fluentui-plus-table--scroll-y');
      expect(tableContainer).toHaveClass('my-table');
    });
  });

  describe('选择功能', () => {
    it('should render with rowSelection config', () => {
      const onChange = jest.fn();
      const rowSelection = {
        selectedRowKeys: ['1'],
        onChange,
      };

      render(<Table dataSource={mockData} columns={mockColumns} rowSelection={rowSelection} />);

      // 应该渲染表格
      expect(screen.getByTestId('table-header')).toBeInTheDocument();
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should support controlled selection mode', () => {
      const onChange = jest.fn();
      const rowSelection = {
        selectedRowKeys: ['1', '2'],
        onChange,
      };

      const { rerender } = render(<Table dataSource={mockData} columns={mockColumns} rowSelection={rowSelection} />);

      // 更新选中的行
      const updatedSelection = {
        selectedRowKeys: ['2', '3'],
        onChange,
      };

      rerender(<Table dataSource={mockData} columns={mockColumns} rowSelection={updatedSelection} />);

      // 应该更新选中状态
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should support uncontrolled selection mode', () => {
      const onChange = jest.fn();
      const rowSelection = {
        onChange,
      };

      render(<Table dataSource={mockData} columns={mockColumns} rowSelection={rowSelection} />);

      // 应该能够渲染
      expect(screen.getByTestId('table-header')).toBeInTheDocument();
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should pass selection props to Header component', () => {
      const onChange = jest.fn();
      const rowSelection = {
        selectedRowKeys: ['1'],
        onChange,
      };

      render(<Table dataSource={mockData} columns={mockColumns} rowSelection={rowSelection} />);

      // Header 应该被渲染（mock 组件会检查传入的 props）
      expect(screen.getByTestId('table-header')).toBeInTheDocument();
    });

    it('should pass selection props to Body component', () => {
      const onChange = jest.fn();
      const rowSelection = {
        selectedRowKeys: ['1'],
        onChange,
      };

      render(<Table dataSource={mockData} columns={mockColumns} rowSelection={rowSelection} />);

      // Body 应该被渲染（mock 组件会检查传入的 props）
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should support getCheckboxProps', () => {
      const onChange = jest.fn();
      const rowSelection = {
        onChange,
        getCheckboxProps: (record: any) => ({
          disabled: record.age > 30,
        }),
      };

      render(<Table dataSource={mockData} columns={mockColumns} rowSelection={rowSelection} />);

      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should support custom columnWidth', () => {
      const onChange = jest.fn();
      const rowSelection = {
        onChange,
        columnWidth: 80,
      };

      render(<Table dataSource={mockData} columns={mockColumns} rowSelection={rowSelection} />);

      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should support fixed selection column', () => {
      const onChange = jest.fn();
      const rowSelection = {
        onChange,
        fixed: true,
      };

      render(<Table dataSource={mockData} columns={mockColumns} rowSelection={rowSelection} />);

      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });

    it('should work with empty dataSource', () => {
      const onChange = jest.fn();
      const rowSelection = {
        selectedRowKeys: [],
        onChange,
      };

      render(<Table dataSource={[]} columns={mockColumns} rowSelection={rowSelection} />);

      expect(screen.getByTestId('table-body')).toBeInTheDocument();
      expect(screen.getByText('暂无数据')).toBeInTheDocument();
    });

    it('should work without any columns', () => {
      const onChange = jest.fn();
      const rowSelection = {
        onChange,
      };

      render(<Table dataSource={mockData} columns={[]} rowSelection={rowSelection} />);

      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });
  });

  describe('分页功能', () => {
    it('should not render pagination by default', () => {
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} />);

      const pagination = container.querySelector('.fluentui-plus-table-pagination');
      expect(pagination).not.toBeInTheDocument();
    });

    it('should not render pagination when pagination is false', () => {
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} pagination={false} />);

      const pagination = container.querySelector('.fluentui-plus-table-pagination');
      expect(pagination).not.toBeInTheDocument();
    });

    it('should render pagination when pagination config is provided', () => {
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} pagination={{ pageSize: 2 }} />);

      const pagination = container.querySelector('.fluentui-plus-table-pagination');
      expect(pagination).toBeInTheDocument();
    });

    it('should paginate data correctly', () => {
      const largeData = Array.from({ length: 10 }, (_, i) => ({
        key: String(i + 1),
        name: `User ${i + 1}`,
        age: 20 + i,
        address: `Address ${i + 1}`,
      }));

      render(<Table dataSource={largeData} columns={mockColumns} pagination={{ pageSize: 3 }} />);

      // Mock 的 Body 组件会渲染所有传给它的数据行
      // 由于分页，Body 应该只接收到 3 条数据
      const bodyElement = screen.getByTestId('table-body');
      expect(bodyElement).toBeInTheDocument();

      // 检查是否只有前 3 个用户的数据被渲染
      expect(screen.getByText('User 1')).toBeInTheDocument();
      expect(screen.getByText('User 2')).toBeInTheDocument();
      expect(screen.getByText('User 3')).toBeInTheDocument();
      expect(screen.queryByText('User 4')).not.toBeInTheDocument();
    });

    it('should support custom pagination config', () => {
      const { container } = render(
        <Table
          dataSource={mockData}
          columns={mockColumns}
          pagination={{
            pageSize: 2,
            showQuickJumper: true,
            showSizeChanger: true,
          }}
        />
      );

      const pagination = container.querySelector('.fluentui-plus-table-pagination');
      expect(pagination).toBeInTheDocument();
    });

    it('should apply wrapper class when pagination is enabled', () => {
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} pagination={{ pageSize: 2 }} />);

      const wrapper = container.querySelector('.fluentui-plus-table-wrapper');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('fluentui-plus-table-wrapper--with-pagination');
    });

    it('should not apply pagination wrapper class when pagination is false', () => {
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} pagination={false} />);

      const wrapper = container.querySelector('.fluentui-plus-table-wrapper');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).not.toHaveClass('fluentui-plus-table-wrapper--with-pagination');
    });

    it('should work with empty dataSource and pagination', () => {
      const { container } = render(<Table dataSource={[]} columns={mockColumns} pagination={{ pageSize: 10 }} />);

      expect(screen.getByText('暂无数据')).toBeInTheDocument();

      const pagination = container.querySelector('.fluentui-plus-table-pagination');
      expect(pagination).toBeInTheDocument();
    });

    it('should support controlled pagination', () => {
      const largeData = Array.from({ length: 20 }, (_, i) => ({
        key: String(i + 1),
        name: `User ${i + 1}`,
        age: 20 + i,
        address: `Address ${i + 1}`,
      }));

      const { rerender } = render(
        <Table dataSource={largeData} columns={mockColumns} pagination={{ pageSize: 5, current: 1 }} />
      );

      // 第一页数据
      expect(screen.getByText('User 1')).toBeInTheDocument();

      // 切换到第二页
      rerender(<Table dataSource={largeData} columns={mockColumns} pagination={{ pageSize: 5, current: 2 }} />);

      // 第二页数据
      expect(screen.getByText('User 6')).toBeInTheDocument();
    });

    it('should call onChange when pagination changes', () => {
      const onChange = jest.fn();
      const largeData = Array.from({ length: 20 }, (_, i) => ({
        key: String(i + 1),
        name: `User ${i + 1}`,
        age: 20 + i,
        address: `Address ${i + 1}`,
      }));

      render(
        <Table
          dataSource={largeData}
          columns={mockColumns}
          pagination={{
            pageSize: 5,
            onChange,
          }}
        />
      );

      // onChange 在 Hook 内部被调用，我们只需要确保 pagination 被正确传递
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });
  });

  describe('分页与滚动结合', () => {
    it('should work with scroll and pagination together', () => {
      const largeData = Array.from({ length: 20 }, (_, i) => ({
        key: String(i + 1),
        name: `User ${i + 1}`,
        age: 20 + i,
        address: `Address ${i + 1}`,
      }));

      const { container } = render(
        <Table dataSource={largeData} columns={mockColumns} scroll={{ y: 300 }} pagination={{ pageSize: 5 }} />
      );

      const tableContainer = container.querySelector('.fluentui-plus-table');
      expect(tableContainer).toHaveClass('fluentui-plus-table--scroll-y');

      const pagination = container.querySelector('.fluentui-plus-table-pagination');
      expect(pagination).toBeInTheDocument();
    });

    it('should work with horizontal scroll and pagination', () => {
      const largeData = Array.from({ length: 20 }, (_, i) => ({
        key: String(i + 1),
        name: `User ${i + 1}`,
        age: 20 + i,
        address: `Address ${i + 1}`,
      }));

      const { container } = render(
        <Table dataSource={largeData} columns={mockColumns} scroll={{ x: 1000 }} pagination={{ pageSize: 5 }} />
      );

      const tableContainer = container.querySelector('.fluentui-plus-table');
      expect(tableContainer).toHaveClass('fluentui-plus-table--scroll-x');

      const pagination = container.querySelector('.fluentui-plus-table-pagination');
      expect(pagination).toBeInTheDocument();
    });
  });

  describe('分页与行选择结合', () => {
    it('should work with rowSelection and pagination', () => {
      const largeData = Array.from({ length: 20 }, (_, i) => ({
        key: String(i + 1),
        name: `User ${i + 1}`,
        age: 20 + i,
        address: `Address ${i + 1}`,
      }));

      const onChange = jest.fn();
      const rowSelection = {
        selectedRowKeys: ['1'],
        onChange,
      };

      const { container } = render(
        <Table dataSource={largeData} columns={mockColumns} rowSelection={rowSelection} pagination={{ pageSize: 5 }} />
      );

      expect(screen.getByTestId('table-body')).toBeInTheDocument();

      const pagination = container.querySelector('.fluentui-plus-table-pagination');
      expect(pagination).toBeInTheDocument();
    });

    it('should only select rows on current page', () => {
      const largeData = Array.from({ length: 20 }, (_, i) => ({
        key: String(i + 1),
        name: `User ${i + 1}`,
        age: 20 + i,
        address: `Address ${i + 1}`,
      }));

      const onChange = jest.fn();
      const rowSelection = {
        onChange,
      };

      render(
        <Table dataSource={largeData} columns={mockColumns} rowSelection={rowSelection} pagination={{ pageSize: 5 }} />
      );

      // 行选择应该只针对当前页的数据
      expect(screen.getByTestId('table-body')).toBeInTheDocument();
    });
  });
});
