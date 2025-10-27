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

// Mock clsx
jest.mock('clsx', () => {
  return jest.fn((...classes: (string | undefined | false | Record<string, boolean>)[]) => {
    return classes
      .map(cls => {
        if (typeof cls === 'string') return cls;
        if (typeof cls === 'object' && cls !== null) {
          return Object.keys(cls)
            .filter(key => cls[key])
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  });
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

      const tableContainer = container.querySelector('.fluentui-plus-table');
      expect(tableContainer).toHaveClass('custom-table');
    });

    it('should apply custom styles', () => {
      const customStyle = { width: '800px', height: '400px' };
      const { container } = render(<Table dataSource={mockData} columns={mockColumns} style={customStyle} />);

      const tableContainer = container.querySelector('.fluentui-plus-table');
      expect(tableContainer).toHaveStyle('width: 800px');
      expect(tableContainer).toHaveStyle('height: 400px');
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
});
