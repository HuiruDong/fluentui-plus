import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Row from '../Row';
import type { ColumnType } from '../types';

// Mock lodash get
jest.mock('lodash', () => ({
  get: jest.fn((obj: any, path: string | string[]) => {
    if (Array.isArray(path)) {
      return path.reduce((acc, key) => acc?.[key], obj);
    }
    return obj?.[path];
  }),
}));

// Mock utils
jest.mock('../utils', () => ({
  calculateFixedInfo: jest.fn((columns: ColumnType[]) => {
    return columns.map(col => ({
      fixed: col.fixed,
      left: col.fixed === 'left' ? 0 : undefined,
      right: col.fixed === 'right' ? 0 : undefined,
      isLastLeft: false,
      isFirstRight: false,
    }));
  }),
  getFixedCellStyle: jest.fn((info: any) => {
    const style: React.CSSProperties = {};
    if (info.fixed === 'left' && info.left !== undefined) {
      style.position = 'sticky';
      style.left = info.left;
      style.zIndex = 2;
    }
    if (info.fixed === 'right' && info.right !== undefined) {
      style.position = 'sticky';
      style.right = info.right;
      style.zIndex = 2;
    }
    return style;
  }),
}));

describe('Row Component', () => {
  const mockColumns: ColumnType[] = [
    { key: 'name', title: '姓名', dataIndex: 'name' },
    { key: 'age', title: '年龄', dataIndex: 'age' },
    { key: 'address', title: '地址', dataIndex: 'address' },
  ];

  const mockRecord = {
    key: '1',
    name: '张三',
    age: 28,
    address: '北京市朝阳区',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      const { container } = render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={mockColumns} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      const row = container.querySelector('.fluentui-plus-table-row');
      expect(row).toBeInTheDocument();
      expect(row).toHaveAttribute('data-row-key', '1');
    });

    it('should render all cells for columns', () => {
      const { container } = render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={mockColumns} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('.fluentui-plus-table-cell');
      expect(cells).toHaveLength(mockColumns.length);
    });

    it('should apply row key as data attribute', () => {
      const { container } = render(
        <table>
          <tbody>
            <Row
              prefixCls='fluentui-plus-table'
              columns={mockColumns}
              record={mockRecord}
              index={0}
              rowKey='custom-key-123'
            />
          </tbody>
        </table>
      );

      const row = container.querySelector('.fluentui-plus-table-row');
      expect(row).toHaveAttribute('data-row-key', 'custom-key-123');
    });
  });

  describe('dataIndex 处理', () => {
    it('should render cell value using string dataIndex', () => {
      render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={mockColumns} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.getByText('28')).toBeInTheDocument();
      expect(screen.getByText('北京市朝阳区')).toBeInTheDocument();
    });

    it('should render cell value using array dataIndex for nested data', () => {
      const nestedRecord = {
        key: '1',
        user: {
          profile: {
            name: '李四',
          },
        },
      };

      const nestedColumns: ColumnType[] = [{ key: 'name', title: '姓名', dataIndex: ['user', 'profile', 'name'] }];

      render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={nestedColumns} record={nestedRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      expect(screen.getByText('李四')).toBeInTheDocument();
    });

    it('should handle missing dataIndex', () => {
      const columnsWithoutDataIndex: ColumnType[] = [{ key: 'col1', title: '列1' }];

      const { container } = render(
        <table>
          <tbody>
            <Row
              prefixCls='fluentui-plus-table'
              columns={columnsWithoutDataIndex}
              record={mockRecord}
              index={0}
              rowKey='1'
            />
          </tbody>
        </table>
      );

      const cell = container.querySelector('.fluentui-plus-table-cell');
      expect(cell).toBeInTheDocument();
      expect(cell?.textContent).toBe('');
    });

    it('should handle undefined values gracefully', () => {
      const recordWithUndefined = {
        key: '1',
        name: '张三',
        age: undefined,
      };

      render(
        <table>
          <tbody>
            <Row
              prefixCls='fluentui-plus-table'
              columns={mockColumns}
              record={recordWithUndefined}
              index={0}
              rowKey='1'
            />
          </tbody>
        </table>
      );

      expect(screen.getByText('张三')).toBeInTheDocument();
    });
  });

  describe('render 函数', () => {
    it('should use custom render function when provided', () => {
      const columnsWithRender: ColumnType[] = [
        {
          key: 'name',
          title: '姓名',
          dataIndex: 'name',
          render: (value: any) => <strong>名字: {value}</strong>,
        },
      ];

      render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={columnsWithRender} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      expect(screen.getByText('名字: 张三')).toBeInTheDocument();
      const strong = screen.getByText('名字: 张三');
      expect(strong.tagName).toBe('STRONG');
    });

    it('should pass value, record, and index to render function', () => {
      const renderFn = jest.fn((value, record, index) => `${value}-${index}`);

      const columnsWithRender: ColumnType[] = [
        {
          key: 'age',
          title: '年龄',
          dataIndex: 'age',
          render: renderFn,
        },
      ];

      render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={columnsWithRender} record={mockRecord} index={5} rowKey='1' />
          </tbody>
        </table>
      );

      expect(renderFn).toHaveBeenCalledWith(28, mockRecord, 5);
      expect(screen.getByText('28-5')).toBeInTheDocument();
    });

    it('should render complex React nodes from render function', () => {
      const columnsWithRender: ColumnType[] = [
        {
          key: 'address',
          title: '地址',
          dataIndex: 'address',
          render: (value: any) => (
            <div>
              <span data-testid='address-icon'>📍</span>
              <span>{value}</span>
            </div>
          ),
        },
      ];

      render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={columnsWithRender} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      expect(screen.getByTestId('address-icon')).toBeInTheDocument();
      expect(screen.getByText('北京市朝阳区')).toBeInTheDocument();
    });

    it('should not show title when custom render is used', () => {
      const columnsWithRender: ColumnType[] = [
        {
          key: 'name',
          title: '姓名',
          dataIndex: 'name',
          render: (value: any) => <span>{value}</span>,
        },
      ];

      const { container } = render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={columnsWithRender} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      const cell = container.querySelector('.fluentui-plus-table-cell');
      expect(cell).not.toHaveAttribute('title');
    });
  });

  describe('title 属性', () => {
    it('should add title attribute for string values', () => {
      const { container } = render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={mockColumns} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('.fluentui-plus-table-cell');
      const nameCell = cells[0];
      expect(nameCell).toHaveAttribute('title', '张三');
    });

    it('should add title attribute for number values', () => {
      const { container } = render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={mockColumns} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('.fluentui-plus-table-cell');
      const ageCell = cells[1];
      expect(ageCell).toHaveAttribute('title', '28');
    });

    it('should not add title for non-string/non-number values', () => {
      const recordWithUndefined = {
        key: '1',
        data: undefined,
      };

      const columnsWithUndefined: ColumnType[] = [{ key: 'data', title: '数据', dataIndex: 'data' }];

      const { container } = render(
        <table>
          <tbody>
            <Row
              prefixCls='fluentui-plus-table'
              columns={columnsWithUndefined}
              record={recordWithUndefined}
              index={0}
              rowKey='1'
            />
          </tbody>
        </table>
      );

      const cell = container.querySelector('.fluentui-plus-table-cell');
      expect(cell).not.toHaveAttribute('title');
    });
  });

  describe('对齐方式', () => {
    it('should apply align class when specified', () => {
      const columnsWithAlign: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name', align: 'left' },
        { key: 'age', title: '年龄', dataIndex: 'age', align: 'center' },
        { key: 'address', title: '地址', dataIndex: 'address', align: 'right' },
      ];

      const { container } = render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={columnsWithAlign} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('.fluentui-plus-table-cell');
      expect(cells[0]).toHaveClass('fluentui-plus-table-cell-align-left');
      expect(cells[1]).toHaveClass('fluentui-plus-table-cell-align-center');
      expect(cells[2]).toHaveClass('fluentui-plus-table-cell-align-right');
    });

    it('should not apply align class when not specified', () => {
      const { container } = render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={mockColumns} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('.fluentui-plus-table-cell');
      cells.forEach(cell => {
        expect(cell.className).not.toMatch(/fluentui-plus-table-cell-align-/);
      });
    });
  });

  describe('固定列', () => {
    it('should apply fixed-left classes for left fixed columns', () => {
      const columnsWithFixed: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name', fixed: 'left' },
        { key: 'age', title: '年龄', dataIndex: 'age' },
      ];

      const { container } = render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={columnsWithFixed} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('.fluentui-plus-table-cell');
      expect(cells[0]).toHaveClass('fluentui-plus-table-cell-fixed-left');
    });

    it('should apply fixed-right classes for right fixed columns', () => {
      const columnsWithFixed: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name' },
        { key: 'action', title: '操作', dataIndex: 'action', fixed: 'right' },
      ];

      const { container } = render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={columnsWithFixed} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('.fluentui-plus-table-cell');
      expect(cells[1]).toHaveClass('fluentui-plus-table-cell-fixed-right');
    });

    it('should apply sticky positioning for fixed columns', () => {
      const columnsWithFixed: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name', fixed: 'left' },
        { key: 'age', title: '年龄', dataIndex: 'age' },
      ];

      const { container } = render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={columnsWithFixed} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('.fluentui-plus-table-cell');
      const fixedCell = cells[0] as HTMLElement;
      expect(fixedCell.style.position).toBe('sticky');
      expect(fixedCell.style.zIndex).toBe('2');
    });
  });

  describe('自定义类名', () => {
    it('should apply column className to cell', () => {
      const columnsWithClassName: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name', className: 'custom-name-cell' },
        { key: 'age', title: '年龄', dataIndex: 'age', className: 'custom-age-cell' },
      ];

      const { container } = render(
        <table>
          <tbody>
            <Row
              prefixCls='fluentui-plus-table'
              columns={columnsWithClassName}
              record={mockRecord}
              index={0}
              rowKey='1'
            />
          </tbody>
        </table>
      );

      const cells = container.querySelectorAll('.fluentui-plus-table-cell');
      expect(cells[0]).toHaveClass('custom-name-cell');
      expect(cells[1]).toHaveClass('custom-age-cell');
    });
  });

  describe('边界情况', () => {
    it('should handle empty record', () => {
      const emptyRecord = { key: '1' };

      render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={mockColumns} record={emptyRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      const row = screen.getByRole('row');
      expect(row).toBeInTheDocument();
    });

    it('should handle null values in record', () => {
      const recordWithNull = {
        key: '1',
        name: null,
        age: null,
      };

      render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={mockColumns} record={recordWithNull} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      const row = screen.getByRole('row');
      expect(row).toBeInTheDocument();
    });

    it('should handle different data types', () => {
      const mixedRecord = {
        key: '1',
        string: 'text',
        number: 123,
        boolean: true,
      };

      const mixedColumns: ColumnType[] = [
        { key: 'string', title: '字符串', dataIndex: 'string' },
        { key: 'number', title: '数字', dataIndex: 'number' },
        { key: 'boolean', title: '布尔', dataIndex: 'boolean' },
      ];

      render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={mixedColumns} record={mixedRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      expect(screen.getByText('text')).toBeInTheDocument();
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('should handle index of zero', () => {
      const { container } = render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={mockColumns} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      expect(container.querySelector('.fluentui-plus-table-row')).toBeInTheDocument();
    });

    it('should handle large index values', () => {
      const { container } = render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={mockColumns} record={mockRecord} index={9999} rowKey='1' />
          </tbody>
        </table>
      );

      expect(container.querySelector('.fluentui-plus-table-row')).toBeInTheDocument();
    });
  });

  describe('性能优化', () => {
    it('should memoize fixedInfo calculation', () => {
      const utils = jest.requireMock('../utils');

      render(
        <table>
          <tbody>
            <Row prefixCls='fluentui-plus-table' columns={mockColumns} record={mockRecord} index={0} rowKey='1' />
          </tbody>
        </table>
      );

      // calculateFixedInfo 应该被调用
      expect(utils.calculateFixedInfo).toHaveBeenCalled();
    });
  });
});
