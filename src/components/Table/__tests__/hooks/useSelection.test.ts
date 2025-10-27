import { renderHook, act } from '@testing-library/react';
import { useSelection } from '../../hooks/useSelection';
import type { RowSelection } from '../../types';

describe('useSelection', () => {
  interface TestRecord {
    key: string;
    name: string;
    age: number;
  }

  const mockDataSource: TestRecord[] = [
    { key: '1', name: 'Alice', age: 25 },
    { key: '2', name: 'Bob', age: 30 },
    { key: '3', name: 'Charlie', age: 35 },
    { key: '4', name: 'David', age: 40 },
  ];

  describe('基础功能', () => {
    it('应该返回初始状态', () => {
      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection: {},
        })
      );

      expect(result.current.selectedRowKeys).toEqual([]);
      expect(result.current.isAllSelected).toBe(false);
      expect(result.current.isIndeterminate).toBe(false);
    });

    it('应该支持受控模式', () => {
      const rowSelection: RowSelection<TestRecord> = {
        selectedRowKeys: ['1', '2'],
      };

      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection,
        })
      );

      expect(result.current.selectedRowKeys).toEqual(['1', '2']);
    });

    it('应该正确计算可选择的行', () => {
      const rowSelection: RowSelection<TestRecord> = {
        getCheckboxProps: record => ({
          disabled: record.age > 30,
        }),
      };

      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection,
        })
      );

      // 只有 age <= 30 的行可选择（Alice 和 Bob）
      act(() => {
        result.current.handleSelectAll(true);
      });

      // 应该只选中未禁用的行
      expect(result.current.selectedRowKeys).toEqual(['1', '2']);
    });
  });

  describe('单行选择', () => {
    it('应该能够选中单行', () => {
      const onChange = jest.fn();
      const rowSelection: RowSelection<TestRecord> = {
        onChange,
      };

      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection,
        })
      );

      act(() => {
        result.current.handleSelect('1', true);
      });

      expect(result.current.selectedRowKeys).toEqual(['1']);
      expect(onChange).toHaveBeenCalledWith(['1'], [mockDataSource[0]]);
    });

    it('应该能够取消选中单行', () => {
      const onChange = jest.fn();
      const rowSelection: RowSelection<TestRecord> = {
        selectedRowKeys: ['1', '2'],
        onChange,
      };

      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection,
        })
      );

      act(() => {
        result.current.handleSelect('1', false);
      });

      expect(onChange).toHaveBeenCalledWith(['2'], [mockDataSource[1]]);
    });

    it('应该支持非受控模式的单行选择', () => {
      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection: {},
        })
      );

      act(() => {
        result.current.handleSelect('1', true);
      });

      expect(result.current.selectedRowKeys).toEqual(['1']);

      act(() => {
        result.current.handleSelect('2', true);
      });

      expect(result.current.selectedRowKeys).toEqual(['1', '2']);
    });
  });

  describe('全选功能', () => {
    it('应该能够全选所有行', () => {
      const onChange = jest.fn();
      const rowSelection: RowSelection<TestRecord> = {
        onChange,
      };

      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection,
        })
      );

      act(() => {
        result.current.handleSelectAll(true);
      });

      expect(result.current.selectedRowKeys).toEqual(['1', '2', '3', '4']);
      expect(result.current.isAllSelected).toBe(true);
      expect(result.current.isIndeterminate).toBe(false);
      expect(onChange).toHaveBeenCalledWith(['1', '2', '3', '4'], mockDataSource);
    });

    it('应该能够取消全选', () => {
      const onChange = jest.fn();
      const rowSelection: RowSelection<TestRecord> = {
        selectedRowKeys: ['1', '2', '3', '4'],
        onChange,
      };

      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection,
        })
      );

      act(() => {
        result.current.handleSelectAll(false);
      });

      expect(onChange).toHaveBeenCalledWith([], []);
    });

    it('应该正确计算全选状态', () => {
      const rowSelection: RowSelection<TestRecord> = {
        selectedRowKeys: ['1', '2', '3', '4'],
      };

      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection,
        })
      );

      expect(result.current.isAllSelected).toBe(true);
      expect(result.current.isIndeterminate).toBe(false);
    });

    it('应该正确计算半选状态', () => {
      const rowSelection: RowSelection<TestRecord> = {
        selectedRowKeys: ['1', '2'],
      };

      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection,
        })
      );

      expect(result.current.isAllSelected).toBe(false);
      expect(result.current.isIndeterminate).toBe(true);
    });

    it('应该在没有可选行时返回 false', () => {
      const rowSelection: RowSelection<TestRecord> = {
        getCheckboxProps: () => ({ disabled: true }),
      };

      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection,
        })
      );

      expect(result.current.isAllSelected).toBe(false);
      expect(result.current.isIndeterminate).toBe(false);
    });
  });

  describe('禁用行处理', () => {
    it('应该排除禁用行在全选时', () => {
      const onChange = jest.fn();
      const rowSelection: RowSelection<TestRecord> = {
        onChange,
        getCheckboxProps: record => ({
          disabled: record.age > 30, // Charlie 和 David 被禁用
        }),
      };

      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection,
        })
      );

      act(() => {
        result.current.handleSelectAll(true);
      });

      // 只应该选中 Alice 和 Bob
      expect(result.current.selectedRowKeys).toEqual(['1', '2']);
      expect(onChange).toHaveBeenCalledWith(['1', '2'], [mockDataSource[0], mockDataSource[1]]);
    });

    it('应该在计算全选状态时排除禁用行', () => {
      const rowSelection: RowSelection<TestRecord> = {
        selectedRowKeys: ['1', '2'], // Alice 和 Bob 被选中
        getCheckboxProps: record => ({
          disabled: record.age > 30, // Charlie 和 David 被禁用
        }),
      };

      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection,
        })
      );

      // 因为所有可选择的行都被选中了，应该显示为全选
      expect(result.current.isAllSelected).toBe(true);
      expect(result.current.isIndeterminate).toBe(false);
    });
  });

  describe('rowKey 支持', () => {
    it('应该支持字符串类型的 rowKey', () => {
      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection: {},
        })
      );

      act(() => {
        result.current.handleSelect('1', true);
      });

      expect(result.current.selectedRowKeys).toEqual(['1']);
    });

    it('应该支持函数类型的 rowKey', () => {
      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: record => `custom-${record.key}`,
          rowSelection: {},
        })
      );

      act(() => {
        result.current.handleSelect('custom-1', true);
      });

      expect(result.current.selectedRowKeys).toEqual(['custom-1']);
    });
  });

  describe('空数据处理', () => {
    it('应该正确处理空数据源', () => {
      const { result } = renderHook(() =>
        useSelection({
          dataSource: [],
          rowKey: 'key',
          rowSelection: {},
        })
      );

      expect(result.current.selectedRowKeys).toEqual([]);
      expect(result.current.isAllSelected).toBe(false);
      expect(result.current.isIndeterminate).toBe(false);
    });

    it('应该在空数据源时全选不产生错误', () => {
      const onChange = jest.fn();

      const { result } = renderHook(() =>
        useSelection({
          dataSource: [],
          rowKey: 'key',
          rowSelection: { onChange },
        })
      );

      act(() => {
        result.current.handleSelectAll(true);
      });

      expect(onChange).toHaveBeenCalledWith([], []);
    });
  });

  describe('getRowKey 函数', () => {
    it('应该返回正确的 getRowKey 函数', () => {
      const { result } = renderHook(() =>
        useSelection({
          dataSource: mockDataSource,
          rowKey: 'key',
          rowSelection: {},
        })
      );

      expect(result.current.getRowKey(mockDataSource[0], 0)).toBe('1');
      expect(result.current.getRowKey(mockDataSource[1], 1)).toBe('2');
    });

    it('应该在记录缺少 key 时使用索引作为后备', () => {
      const dataWithoutKey = [{ name: 'Test', age: 25 }] as any[];

      const { result } = renderHook(() =>
        useSelection({
          dataSource: dataWithoutKey,
          rowKey: 'key',
          rowSelection: {},
        })
      );

      expect(result.current.getRowKey(dataWithoutKey[0], 0)).toBe('0');
    });
  });
});
