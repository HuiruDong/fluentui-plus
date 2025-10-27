import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Body from '../Body';
import type { ColumnType } from '../types';

// Mock ColGroup
jest.mock('../ColGroup', () => {
  return function MockColGroup({ columns }: { columns: ColumnType[] }) {
    return (
      <colgroup data-testid='colgroup'>
        {columns.map(col => (
          <col key={col.key} />
        ))}
      </colgroup>
    );
  };
});

// Mock Row
jest.mock('../Row', () => {
  return function MockRow({
    columns,
    record,
    index,
    rowKey,
  }: {
    columns: ColumnType[];
    record: any;
    index: number;
    rowKey: string;
  }) {
    return (
      <tr data-testid={`row-${rowKey}`} data-index={index}>
        {columns.map(col => (
          <td key={col.key}>{String(record[col.dataIndex as string] || '')}</td>
        ))}
      </tr>
    );
  };
});

// Mock clsx
jest.mock('clsx', () => {
  return jest.fn((...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
  });
});

describe('Body Component', () => {
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
    it('should render correctly with data', () => {
      render(<Body columns={mockColumns} dataSource={mockData} rowKey='key' />);

      expect(screen.getByTestId('colgroup')).toBeInTheDocument();
      expect(screen.getByTestId('row-1')).toBeInTheDocument();
      expect(screen.getByTestId('row-2')).toBeInTheDocument();
      expect(screen.getByTestId('row-3')).toBeInTheDocument();
    });

    it('should render correct table structure', () => {
      const { container } = render(<Body columns={mockColumns} dataSource={mockData} rowKey='key' />);

      const tbody = container.querySelector('tbody');
      expect(tbody).toHaveClass('fluentui-plus-table-tbody');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Body columns={mockColumns} dataSource={mockData} rowKey='key' className='custom-body' />
      );

      const bodyTable = container.querySelector('table');
      expect(bodyTable).toHaveClass('custom-body');
    });
  });

  describe('空数据处理', () => {
    it('should render empty state with default text', () => {
      render(<Body columns={mockColumns} dataSource={[]} rowKey='key' />);

      expect(screen.getByText('暂无数据')).toBeInTheDocument();
    });

    it('should render empty state with custom emptyText', () => {
      render(<Body columns={mockColumns} dataSource={[]} rowKey='key' emptyText='没有数据' />);

      expect(screen.getByText('没有数据')).toBeInTheDocument();
    });

    it('should render custom React node as emptyText', () => {
      const CustomEmpty = () => <div data-testid='custom-empty'>自定义空状态</div>;

      render(<Body columns={mockColumns} dataSource={[]} rowKey='key' emptyText={<CustomEmpty />} />);

      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
    });

    it('should span empty cell across all columns', () => {
      const { container } = render(<Body columns={mockColumns} dataSource={[]} rowKey='key' />);

      const emptyCell = container.querySelector('.fluentui-plus-table-empty');
      expect(emptyCell).toHaveAttribute('colSpan', String(mockColumns.length));
    });

    it('should render empty row with correct class', () => {
      const { container } = render(<Body columns={mockColumns} dataSource={[]} rowKey='key' />);

      const emptyRow = container.querySelector('.fluentui-plus-table-empty-row');
      expect(emptyRow).toBeInTheDocument();
    });
  });

  describe('rowKey 处理', () => {
    it('should use string rowKey to get key from record', () => {
      render(<Body columns={mockColumns} dataSource={mockData} rowKey='key' />);

      expect(screen.getByTestId('row-1')).toBeInTheDocument();
      expect(screen.getByTestId('row-2')).toBeInTheDocument();
      expect(screen.getByTestId('row-3')).toBeInTheDocument();
    });

    it('should use function rowKey to generate key', () => {
      const rowKeyFn = (record: any) => `custom-${record.key}`;

      render(<Body columns={mockColumns} dataSource={mockData} rowKey={rowKeyFn} />);

      expect(screen.getByTestId('row-custom-1')).toBeInTheDocument();
      expect(screen.getByTestId('row-custom-2')).toBeInTheDocument();
      expect(screen.getByTestId('row-custom-3')).toBeInTheDocument();
    });

    it('should use index as fallback when rowKey property is missing', () => {
      const dataWithoutKey = [
        { name: '张三', age: 28 },
        { name: '李四', age: 32 },
      ];

      render(<Body columns={mockColumns} dataSource={dataWithoutKey} rowKey='key' />);

      expect(screen.getByTestId('row-0')).toBeInTheDocument();
      expect(screen.getByTestId('row-1')).toBeInTheDocument();
    });

    it('should handle different rowKey property names', () => {
      const dataWithId = [
        { id: 'user-1', name: '张三', age: 28 },
        { id: 'user-2', name: '李四', age: 32 },
      ];

      render(<Body columns={mockColumns} dataSource={dataWithId} rowKey='id' />);

      expect(screen.getByTestId('row-user-1')).toBeInTheDocument();
      expect(screen.getByTestId('row-user-2')).toBeInTheDocument();
    });
  });

  describe('数据渲染', () => {
    it('should render all rows in order', () => {
      render(<Body columns={mockColumns} dataSource={mockData} rowKey='key' />);

      const row1 = screen.getByTestId('row-1');
      const row2 = screen.getByTestId('row-2');
      const row3 = screen.getByTestId('row-3');

      expect(row1).toHaveAttribute('data-index', '0');
      expect(row2).toHaveAttribute('data-index', '1');
      expect(row3).toHaveAttribute('data-index', '2');
    });

    it('should pass correct props to Row component', () => {
      render(<Body columns={mockColumns} dataSource={mockData} rowKey='key' />);

      // 验证所有行都被渲染
      mockData.forEach((_, index) => {
        expect(screen.getByTestId(`row-${mockData[index].key}`)).toBeInTheDocument();
      });
    });

    it('should handle single row', () => {
      const singleData = [mockData[0]];

      render(<Body columns={mockColumns} dataSource={singleData} rowKey='key' />);

      expect(screen.getByTestId('row-1')).toBeInTheDocument();
      expect(screen.queryByTestId('row-2')).not.toBeInTheDocument();
    });

    it('should handle large dataset', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        key: String(i),
        name: `用户${i}`,
        age: 20 + i,
        address: '地址',
      }));

      render(<Body columns={mockColumns} dataSource={largeData} rowKey='key' />);

      expect(screen.getByTestId('row-0')).toBeInTheDocument();
      expect(screen.getByTestId('row-99')).toBeInTheDocument();
    });
  });

  describe('ColGroup 集成', () => {
    it('should render ColGroup with columns', () => {
      render(<Body columns={mockColumns} dataSource={mockData} rowKey='key' />);

      expect(screen.getByTestId('colgroup')).toBeInTheDocument();
    });

    it('should pass columns to ColGroup', () => {
      const { container } = render(<Body columns={mockColumns} dataSource={mockData} rowKey='key' />);

      const colgroup = container.querySelector('colgroup');
      const cols = colgroup?.querySelectorAll('col');
      expect(cols).toHaveLength(mockColumns.length);
    });
  });

  describe('边界情况', () => {
    it('should handle empty columns array', () => {
      render(<Body columns={[]} dataSource={mockData} rowKey='key' />);

      expect(screen.getByTestId('colgroup')).toBeInTheDocument();
    });

    it('should handle dataSource with different properties', () => {
      const differentData = [
        { key: '1', x: 1, y: 2 },
        { key: '2', x: 3, y: 4 },
      ];

      render(<Body columns={mockColumns} dataSource={differentData} rowKey='key' />);

      expect(screen.getByTestId('row-1')).toBeInTheDocument();
      expect(screen.getByTestId('row-2')).toBeInTheDocument();
    });

    it('should handle numeric keys', () => {
      const numericKeyData = [
        { key: 1, name: '张三' },
        { key: 2, name: '李四' },
      ];

      render(<Body columns={mockColumns} dataSource={numericKeyData} rowKey='key' />);

      expect(screen.getByTestId('row-1')).toBeInTheDocument();
      expect(screen.getByTestId('row-2')).toBeInTheDocument();
    });

    it('should not crash with null or undefined values in data', () => {
      const dataWithNulls = [{ key: '1', name: null, age: undefined, address: '北京' }];

      expect(() => {
        render(<Body columns={mockColumns} dataSource={dataWithNulls} rowKey='key' />);
      }).not.toThrow();
    });
  });

  describe('类名和样式', () => {
    it('should apply correct CSS classes to table', () => {
      const { container } = render(<Body columns={mockColumns} dataSource={mockData} rowKey='key' />);

      const bodyTable = container.querySelector('table');
      expect(bodyTable).toHaveClass('fluentui-plus-table-body');
    });

    it('should apply correct CSS classes to tbody', () => {
      const { container } = render(<Body columns={mockColumns} dataSource={mockData} rowKey='key' />);

      const tbody = container.querySelector('tbody');
      expect(tbody).toHaveClass('fluentui-plus-table-tbody');
    });

    it('should merge custom className with default classes', () => {
      const { container } = render(
        <Body columns={mockColumns} dataSource={mockData} rowKey='key' className='custom-body-class' />
      );

      const bodyTable = container.querySelector('table');
      expect(bodyTable).toHaveClass('fluentui-plus-table-body');
      expect(bodyTable).toHaveClass('custom-body-class');
    });
  });
});
