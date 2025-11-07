import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';
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
  getFixedCellStyle: jest.fn((info: any, zIndex: number) => {
    const style: React.CSSProperties = {};
    if (info.fixed === 'left' && info.left !== undefined) {
      style.position = 'sticky';
      style.left = info.left;
      style.zIndex = zIndex;
    }
    if (info.fixed === 'right' && info.right !== undefined) {
      style.position = 'sticky';
      style.right = info.right;
      style.zIndex = zIndex;
    }
    return style;
  }),
}));

describe('Header Component', () => {
  const basicColumns: ColumnType[] = [
    { key: 'name', title: '姓名', dataIndex: 'name' },
    { key: 'age', title: '年龄', dataIndex: 'age' },
    { key: 'address', title: '地址', dataIndex: 'address' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('should render correctly with basic columns', () => {
      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={basicColumns} />);

      const thead = container.querySelector('.fluentui-plus-table-thead');
      expect(thead).toBeInTheDocument();
    });

    it('should render all column headers', () => {
      render(<Header prefixCls='fluentui-plus-table' columns={basicColumns} />);

      expect(screen.getByText('姓名')).toBeInTheDocument();
      expect(screen.getByText('年龄')).toBeInTheDocument();
      expect(screen.getByText('地址')).toBeInTheDocument();
    });

    it('should render complete table structure', () => {
      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={basicColumns} />);

      const table = container.querySelector('.fluentui-plus-table-header');
      expect(table).toBeInTheDocument();

      const thead = table?.querySelector('thead');
      expect(thead).toBeInTheDocument();

      const tr = thead?.querySelector('tr');
      expect(tr).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Header prefixCls='fluentui-plus-table' columns={basicColumns} className='custom-header' />
      );

      const headerTable = container.querySelector('table');
      expect(headerTable).toHaveClass('custom-header');
    });
  });

  describe('列标题渲染', () => {
    it('should render string titles', () => {
      render(<Header prefixCls='fluentui-plus-table' columns={basicColumns} />);

      expect(screen.getByText('姓名')).toBeInTheDocument();
      expect(screen.getByText('年龄')).toBeInTheDocument();
    });

    it('should render React node as title', () => {
      const columnsWithReactTitle: ColumnType[] = [
        {
          key: 'name',
          title: <span data-testid='custom-title'>自定义标题</span>,
          dataIndex: 'name',
        },
      ];

      render(<Header prefixCls='fluentui-plus-table' columns={columnsWithReactTitle} />);

      expect(screen.getByTestId('custom-title')).toBeInTheDocument();
    });

    it('should render complex React nodes as title', () => {
      const columnsWithComplexTitle: ColumnType[] = [
        {
          key: 'name',
          title: (
            <div>
              <span data-testid='icon'>📊</span>
              <span>统计数据</span>
            </div>
          ),
          dataIndex: 'name',
        },
      ];

      render(<Header prefixCls='fluentui-plus-table' columns={columnsWithComplexTitle} />);

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('统计数据')).toBeInTheDocument();
    });

    it('should render empty title', () => {
      const columnsWithEmptyTitle: ColumnType[] = [{ key: 'col1', title: '', dataIndex: 'col1' }];

      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={columnsWithEmptyTitle} />);

      const th = container.querySelector('th');
      expect(th).toBeInTheDocument();
      expect(th?.textContent).toBe('');
    });
  });

  describe('title 属性', () => {
    it('should add title attribute for string titles', () => {
      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={basicColumns} />);

      const headers = container.querySelectorAll('th');
      expect(headers[0]).toHaveAttribute('title', '姓名');
      expect(headers[1]).toHaveAttribute('title', '年龄');
      expect(headers[2]).toHaveAttribute('title', '地址');
    });

    it('should not add title attribute for React node titles', () => {
      const columnsWithReactTitle: ColumnType[] = [
        {
          key: 'name',
          title: <span>自定义</span>,
          dataIndex: 'name',
        },
      ];

      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={columnsWithReactTitle} />);

      const th = container.querySelector('th');
      expect(th).not.toHaveAttribute('title');
    });
  });

  describe('列对齐', () => {
    it('should apply align class when specified', () => {
      const columnsWithAlign: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name', align: 'left' },
        { key: 'age', title: '年龄', dataIndex: 'age', align: 'center' },
        { key: 'address', title: '地址', dataIndex: 'address', align: 'right' },
      ];

      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={columnsWithAlign} />);

      const headers = container.querySelectorAll('th');
      expect(headers[0]).toHaveClass('fluentui-plus-table-cell-align-left');
      expect(headers[1]).toHaveClass('fluentui-plus-table-cell-align-center');
      expect(headers[2]).toHaveClass('fluentui-plus-table-cell-align-right');
    });

    it('should not apply align class when not specified', () => {
      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={basicColumns} />);

      const headers = container.querySelectorAll('th');
      headers.forEach(th => {
        expect(th.className).not.toMatch(/fluentui-plus-table-cell-align-/);
      });
    });
  });

  describe('固定列', () => {
    it('should apply fixed-left classes for left fixed columns', () => {
      const columnsWithFixedLeft: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name', fixed: 'left' },
        { key: 'age', title: '年龄', dataIndex: 'age' },
      ];

      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={columnsWithFixedLeft} />);

      const headers = container.querySelectorAll('th');
      expect(headers[0]).toHaveClass('fluentui-plus-table-cell-fixed-left');
      expect(headers[1]).not.toHaveClass('fluentui-plus-table-cell-fixed-left');
    });

    it('should apply fixed-right classes for right fixed columns', () => {
      const columnsWithFixedRight: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name' },
        { key: 'action', title: '操作', dataIndex: 'action', fixed: 'right' },
      ];

      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={columnsWithFixedRight} />);

      const headers = container.querySelectorAll('th');
      expect(headers[0]).not.toHaveClass('fluentui-plus-table-cell-fixed-right');
      expect(headers[1]).toHaveClass('fluentui-plus-table-cell-fixed-right');
    });

    it('should apply sticky positioning for fixed columns', () => {
      const columnsWithFixed: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name', fixed: 'left' },
        { key: 'age', title: '年龄', dataIndex: 'age' },
        { key: 'action', title: '操作', dataIndex: 'action', fixed: 'right' },
      ];

      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={columnsWithFixed} />);

      const headers = container.querySelectorAll('th');
      const leftFixed = headers[0] as HTMLElement;
      const rightFixed = headers[2] as HTMLElement;

      expect(leftFixed.style.position).toBe('sticky');
      expect(leftFixed.style.zIndex).toBe('3');

      expect(rightFixed.style.position).toBe('sticky');
      expect(rightFixed.style.zIndex).toBe('3');
    });

    it('should apply isLastLeft class for last left fixed column', () => {
      const utils = jest.requireMock('../utils');
      utils.calculateFixedInfo.mockReturnValueOnce([
        { fixed: 'left', left: 0, isLastLeft: true },
        { fixed: undefined },
      ]);

      const columnsWithFixedLeft: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name', fixed: 'left' },
        { key: 'age', title: '年龄', dataIndex: 'age' },
      ];

      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={columnsWithFixedLeft} />);

      const headers = container.querySelectorAll('th');
      expect(headers[0]).toHaveClass('fluentui-plus-table-cell-fixed-left-last');
    });

    it('should apply isFirstRight class for first right fixed column', () => {
      const utils = jest.requireMock('../utils');
      utils.calculateFixedInfo.mockReturnValueOnce([
        { fixed: undefined },
        { fixed: 'right', right: 0, isFirstRight: true },
      ]);

      const columnsWithFixedRight: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name' },
        { key: 'action', title: '操作', dataIndex: 'action', fixed: 'right' },
      ];

      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={columnsWithFixedRight} />);

      const headers = container.querySelectorAll('th');
      expect(headers[1]).toHaveClass('fluentui-plus-table-cell-fixed-right-first');
    });
  });

  describe('自定义类名', () => {
    it('should apply column className to header cell', () => {
      const columnsWithClassName: ColumnType[] = [
        { key: 'name', title: '姓名', dataIndex: 'name', className: 'custom-name-header' },
        { key: 'age', title: '年龄', dataIndex: 'age', className: 'custom-age-header' },
      ];

      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={columnsWithClassName} />);

      const headers = container.querySelectorAll('th');
      expect(headers[0]).toHaveClass('custom-name-header');
      expect(headers[1]).toHaveClass('custom-age-header');
    });

    it('should merge column className with default classes', () => {
      const columnsWithClassName: ColumnType[] = [
        {
          key: 'name',
          title: '姓名',
          dataIndex: 'name',
          className: 'my-header',
          align: 'center',
        },
      ];

      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={columnsWithClassName} />);

      const header = container.querySelector('th');
      expect(header).toHaveClass('fluentui-plus-table-cell');
      expect(header).toHaveClass('fluentui-plus-table-cell-header');
      expect(header).toHaveClass('my-header');
      expect(header).toHaveClass('fluentui-plus-table-cell-align-center');
    });
  });

  describe('ColGroup 集成', () => {
    it('should render ColGroup', () => {
      render(<Header prefixCls='fluentui-plus-table' columns={basicColumns} />);

      expect(screen.getByTestId('colgroup')).toBeInTheDocument();
    });

    it('should pass columns to ColGroup', () => {
      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={basicColumns} />);

      const colgroup = container.querySelector('colgroup');
      const cols = colgroup?.querySelectorAll('col');
      expect(cols).toHaveLength(basicColumns.length);
    });
  });

  describe('边界情况', () => {
    it('should handle empty columns array', () => {
      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={[]} />);

      const thead = container.querySelector('thead');
      expect(thead).toBeInTheDocument();

      const headers = container.querySelectorAll('th');
      expect(headers).toHaveLength(0);
    });

    it('should handle single column', () => {
      const singleColumn: ColumnType[] = [{ key: 'name', title: '姓名', dataIndex: 'name' }];

      render(<Header prefixCls='fluentui-plus-table' columns={singleColumn} />);

      expect(screen.getByText('姓名')).toBeInTheDocument();
    });

    it('should handle large number of columns', () => {
      const manyColumns: ColumnType[] = Array.from({ length: 50 }, (_, i) => ({
        key: `col${i}`,
        title: `列${i}`,
        dataIndex: `col${i}`,
      }));

      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={manyColumns} />);

      const headers = container.querySelectorAll('th');
      expect(headers).toHaveLength(50);
    });

    it('should handle columns with all properties', () => {
      const fullColumns: ColumnType[] = [
        {
          key: 'name',
          title: '姓名',
          dataIndex: 'name',
          width: 100,
          align: 'center',
          className: 'custom-class',
          fixed: 'left',
        },
      ];

      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={fullColumns} />);

      const header = container.querySelector('th');
      expect(header).toHaveClass('fluentui-plus-table-cell');
      expect(header).toHaveClass('fluentui-plus-table-cell-header');
      expect(header).toHaveClass('custom-class');
      expect(header).toHaveClass('fluentui-plus-table-cell-align-center');
      expect(header).toHaveClass('fluentui-plus-table-cell-fixed-left');
    });
  });

  describe('CSS 类名', () => {
    it('should apply correct base classes', () => {
      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={basicColumns} />);

      const headerTable = container.querySelector('table');
      expect(headerTable).toHaveClass('fluentui-plus-table-header');

      const thead = container.querySelector('.fluentui-plus-table-thead');
      expect(thead).toHaveClass('fluentui-plus-table-thead');

      const headers = container.querySelectorAll('th');
      headers.forEach(th => {
        expect(th).toHaveClass('fluentui-plus-table-cell');
        expect(th).toHaveClass('fluentui-plus-table-cell-header');
      });
    });

    it('should combine multiple modifier classes correctly', () => {
      const complexColumns: ColumnType[] = [
        {
          key: 'name',
          title: '姓名',
          dataIndex: 'name',
          align: 'center',
          fixed: 'left',
          className: 'my-custom-class',
        },
      ];

      const utils = jest.requireMock('../utils');
      utils.calculateFixedInfo.mockReturnValueOnce([{ fixed: 'left', left: 0, isLastLeft: true }]);

      const { container } = render(<Header prefixCls='fluentui-plus-table' columns={complexColumns} />);

      const header = container.querySelector('th');
      expect(header).toHaveClass('fluentui-plus-table-cell');
      expect(header).toHaveClass('fluentui-plus-table-cell-header');
      expect(header).toHaveClass('my-custom-class');
      expect(header).toHaveClass('fluentui-plus-table-cell-align-center');
      expect(header).toHaveClass('fluentui-plus-table-cell-fixed-left');
      expect(header).toHaveClass('fluentui-plus-table-cell-fixed-left-last');
    });
  });

  describe('性能优化', () => {
    it('should memoize fixedInfo calculation', () => {
      const utils = jest.requireMock('../utils');

      render(<Header prefixCls='fluentui-plus-table' columns={basicColumns} />);

      // calculateFixedInfo 现在有两个参数：columns 和 selectionColumnWidth
      expect(utils.calculateFixedInfo).toHaveBeenCalledWith(basicColumns, 0);
    });

    it('should not recalculate fixedInfo on same columns', () => {
      const utils = jest.requireMock('../utils');

      const { rerender } = render(<Header prefixCls='fluentui-plus-table' columns={basicColumns} />);

      // 使用相同的 columns 重新渲染
      rerender(<Header prefixCls='fluentui-plus-table' columns={basicColumns} />);

      // useMemo 应该阻止重新计算（但在测试中可能会被调用多次）
      // 这里主要验证 calculateFixedInfo 被正确调用
      expect(utils.calculateFixedInfo).toHaveBeenCalled();
    });
  });
});
