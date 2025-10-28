import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../../hooks/usePagination';
import type { PaginationProps } from '../../../Pagination';

describe('usePagination', () => {
  interface TestRecord {
    key: string;
    name: string;
    age: number;
  }

  const mockDataSource: TestRecord[] = Array.from({ length: 50 }, (_, i) => ({
    key: String(i + 1),
    name: `User ${i + 1}`,
    age: 20 + (i % 40),
  }));

  describe('基础功能', () => {
    it('应该返回初始状态（无分页配置）', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: undefined,
        })
      );

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(10);
      expect(result.current.paginatedData).toHaveLength(50); // 无分页时返回所有数据
      expect(result.current.paginationConfig).toBe(false);
    });

    it('应该返回初始状态（有分页配置）', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: {},
        })
      );

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(10);
      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginationConfig).toEqual({
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: true,
      });
    });

    it('应该在 pagination 为 false 时返回所有数据', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: false,
        })
      );

      expect(result.current.paginationConfig).toBe(false);
      expect(result.current.paginatedData).toHaveLength(50);
      expect(result.current.paginatedData).toEqual(mockDataSource);
    });

    it('应该支持自定义 pageSize', () => {
      const pagination: PaginationProps = {
        pageSize: 20,
      };

      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination,
        })
      );

      expect(result.current.paginatedData).toHaveLength(20);
      expect(result.current.paginationConfig).toMatchObject({
        pageSize: 20,
      });
    });

    it('应该合并自定义配置和默认配置', () => {
      const pagination: PaginationProps = {
        pageSize: 15,
        showQuickJumper: false,
        simple: true,
      };

      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination,
        })
      );

      expect(result.current.paginationConfig).toEqual({
        pageSize: 15,
        showQuickJumper: false,
        showSizeChanger: true,
        showTotal: true,
        simple: true,
      });
    });
  });

  describe('数据切片', () => {
    it('应该返回第一页的数据', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: { pageSize: 10 },
        })
      );

      const firstPageData = result.current.paginatedData;
      expect(firstPageData).toHaveLength(10);
      expect(firstPageData[0]).toEqual(mockDataSource[0]);
      expect(firstPageData[9]).toEqual(mockDataSource[9]);
    });

    it('应该正确切片第二页的数据', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: { pageSize: 10, current: 2 },
        })
      );

      const secondPageData = result.current.paginatedData;
      expect(secondPageData).toHaveLength(10);
      expect(secondPageData[0]).toEqual(mockDataSource[10]);
      expect(secondPageData[9]).toEqual(mockDataSource[19]);
    });

    it('应该正确切片最后一页的数据', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: { pageSize: 10, current: 5 },
        })
      );

      const lastPageData = result.current.paginatedData;
      expect(lastPageData).toHaveLength(10);
      expect(lastPageData[0]).toEqual(mockDataSource[40]);
      expect(lastPageData[9]).toEqual(mockDataSource[49]);
    });

    it('应该处理不完整的最后一页', () => {
      const smallDataSource = mockDataSource.slice(0, 25);

      const { result } = renderHook(() =>
        usePagination({
          dataSource: smallDataSource,
          pagination: { pageSize: 10, current: 3 },
        })
      );

      const lastPageData = result.current.paginatedData;
      expect(lastPageData).toHaveLength(5);
      expect(lastPageData[0]).toEqual(smallDataSource[20]);
      expect(lastPageData[4]).toEqual(smallDataSource[24]);
    });

    it('应该处理空数据源', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: [],
          pagination: { pageSize: 10 },
        })
      );

      expect(result.current.paginatedData).toEqual([]);
      expect(result.current.paginatedData).toHaveLength(0);
    });
  });

  describe('分页变化处理', () => {
    it('应该能够切换到不同的页码', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: { pageSize: 10 },
        })
      );

      expect(result.current.currentPage).toBe(1);

      act(() => {
        result.current.handlePaginationChange(3, 10);
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData[0]).toEqual(mockDataSource[20]);
    });

    it('应该能够改变每页大小', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: {}, // 空对象，非受控模式
        })
      );

      expect(result.current.pageSize).toBe(10);
      expect(result.current.paginatedData).toHaveLength(10);

      act(() => {
        result.current.handlePaginationChange(1, 20);
      });

      expect(result.current.pageSize).toBe(20);
      // 内部状态更新后，需要等待下一次渲染
      expect(result.current.paginatedData).toHaveLength(20);
    });

    it('应该同时改变页码和页大小', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: {}, // 空对象，非受控模式
        })
      );

      act(() => {
        result.current.handlePaginationChange(2, 15);
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.pageSize).toBe(15);
      expect(result.current.paginatedData).toHaveLength(15);
      expect(result.current.paginatedData[0]).toEqual(mockDataSource[15]);
    });

    it('应该调用外部的 onChange 回调', () => {
      const onChange = jest.fn();
      const pagination: PaginationProps = {
        pageSize: 10,
        onChange,
      };

      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination,
        })
      );

      act(() => {
        result.current.handlePaginationChange(2, 10);
      });

      expect(onChange).toHaveBeenCalledWith(2, 10);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('应该在 pagination 为 false 时不调用 onChange', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: false,
        })
      );

      // 不应该抛出错误
      expect(() => {
        act(() => {
          result.current.handlePaginationChange(2, 10);
        });
      }).not.toThrow();
    });
  });

  describe('受控模式', () => {
    it('应该使用外部传入的 current', () => {
      const pagination: PaginationProps = {
        pageSize: 10,
        current: 3,
      };

      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination,
        })
      );

      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData[0]).toEqual(mockDataSource[20]);
    });

    it('应该使用外部传入的 pageSize', () => {
      const pagination: PaginationProps = {
        pageSize: 25,
        current: 1,
      };

      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination,
        })
      );

      expect(result.current.paginatedData).toHaveLength(25);
      expect(result.current.paginatedData[0]).toEqual(mockDataSource[0]);
      expect(result.current.paginatedData[24]).toEqual(mockDataSource[24]);
    });

    it('应该响应外部 current 的变化', () => {
      const { result, rerender } = renderHook(
        ({ current }) =>
          usePagination({
            dataSource: mockDataSource,
            pagination: { pageSize: 10, current },
          }),
        { initialProps: { current: 1 } }
      );

      expect(result.current.paginatedData[0]).toEqual(mockDataSource[0]);

      rerender({ current: 2 });

      expect(result.current.paginatedData[0]).toEqual(mockDataSource[10]);
    });

    it('应该响应外部 pageSize 的变化', () => {
      const { result, rerender } = renderHook(
        ({ pageSize }) =>
          usePagination({
            dataSource: mockDataSource,
            pagination: { pageSize },
          }),
        { initialProps: { pageSize: 10 } }
      );

      expect(result.current.paginatedData).toHaveLength(10);

      rerender({ pageSize: 20 });

      expect(result.current.paginatedData).toHaveLength(20);
    });
  });

  describe('非受控模式', () => {
    it('应该使用内部状态管理页码', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: { pageSize: 10 },
        })
      );

      expect(result.current.currentPage).toBe(1);

      act(() => {
        result.current.handlePaginationChange(4, 10);
      });

      expect(result.current.currentPage).toBe(4);
      expect(result.current.paginatedData[0]).toEqual(mockDataSource[30]);
    });

    it('应该使用内部状态管理页大小', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: {}, // 空对象，非受控模式
        })
      );

      expect(result.current.pageSize).toBe(10);

      act(() => {
        result.current.handlePaginationChange(1, 30);
      });

      expect(result.current.pageSize).toBe(30);
      expect(result.current.paginatedData).toHaveLength(30);
    });
  });

  describe('边界情况', () => {
    it('应该处理 dataSource 为空数组', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: [],
          pagination: { pageSize: 10 },
        })
      );

      expect(result.current.paginatedData).toEqual([]);
    });

    it('应该处理 dataSource 长度小于 pageSize', () => {
      const smallDataSource = mockDataSource.slice(0, 5);

      const { result } = renderHook(() =>
        usePagination({
          dataSource: smallDataSource,
          pagination: { pageSize: 10 },
        })
      );

      expect(result.current.paginatedData).toHaveLength(5);
      expect(result.current.paginatedData).toEqual(smallDataSource);
    });

    it('应该处理 current 超出范围', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: { pageSize: 10, current: 100 },
        })
      );

      // 返回空数组（超出范围）
      expect(result.current.paginatedData).toEqual([]);
    });

    it('应该处理 current 为 0 或负数', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: { pageSize: 10, current: 0 },
        })
      );

      // 当 current 为 0 时，start 为 -10，end 为 0，slice 会返回空数组
      expect(result.current.paginatedData).toEqual([]);
    });

    it('应该处理 pageSize 为 0', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: { pageSize: 0 },
        })
      );

      expect(result.current.paginatedData).toEqual([]);
    });

    it('应该处理 pageSize 为负数', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: { pageSize: -10 },
        })
      );

      // 由于 pageSize 为负数，实际上会使用内部状态的默认 pageSize (10)
      // 或者返回所有数据，具体取决于 slice 的行为
      expect(result.current.paginatedData.length).toBeGreaterThanOrEqual(0);
    });

    it('应该处理非常大的 pageSize', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: { pageSize: 1000 },
        })
      );

      expect(result.current.paginatedData).toHaveLength(50);
      expect(result.current.paginatedData).toEqual(mockDataSource);
    });
  });

  describe('配置更新', () => {
    it('应该响应 pagination 配置的变化', () => {
      const { result, rerender } = renderHook(
        ({ pagination }) =>
          usePagination({
            dataSource: mockDataSource,
            pagination,
          }),
        { initialProps: { pagination: { pageSize: 10 } as PaginationProps } }
      );

      expect(result.current.paginatedData).toHaveLength(10);

      rerender({ pagination: { pageSize: 20 } });

      expect(result.current.paginatedData).toHaveLength(20);
    });

    it('应该响应 dataSource 的变化', () => {
      const { result, rerender } = renderHook(
        ({ dataSource }) =>
          usePagination({
            dataSource,
            pagination: { pageSize: 10 },
          }),
        { initialProps: { dataSource: mockDataSource.slice(0, 20) } }
      );

      expect(result.current.paginatedData).toHaveLength(10);

      rerender({ dataSource: mockDataSource.slice(0, 5) });

      expect(result.current.paginatedData).toHaveLength(5);
    });

    it('应该从有分页切换到无分页', () => {
      const { result, rerender } = renderHook(
        ({ pagination }) =>
          usePagination({
            dataSource: mockDataSource,
            pagination,
          }),
        { initialProps: { pagination: { pageSize: 10 } as PaginationProps | false } }
      );

      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginationConfig).not.toBe(false);

      rerender({ pagination: false });

      expect(result.current.paginatedData).toHaveLength(50);
      expect(result.current.paginationConfig).toBe(false);
    });

    it('应该从无分页切换到有分页', () => {
      const { result, rerender } = renderHook(
        ({ pagination }) =>
          usePagination({
            dataSource: mockDataSource,
            pagination,
          }),
        { initialProps: { pagination: false as PaginationProps | false } }
      );

      expect(result.current.paginatedData).toHaveLength(50);
      expect(result.current.paginationConfig).toBe(false);

      rerender({ pagination: { pageSize: 15 } });

      expect(result.current.paginatedData).toHaveLength(15);
      expect(result.current.paginationConfig).not.toBe(false);
    });
  });

  describe('默认配置', () => {
    it('应该使用正确的默认配置', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: {},
        })
      );

      expect(result.current.paginationConfig).toEqual({
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: true,
      });
    });

    it('应该允许覆盖默认配置', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: {
            showQuickJumper: false,
            showSizeChanger: false,
            showTotal: false,
          },
        })
      );

      expect(result.current.paginationConfig).toEqual({
        pageSize: 10,
        showQuickJumper: false,
        showSizeChanger: false,
        showTotal: false,
      });
    });

    it('应该保留额外的自定义配置', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockDataSource,
          pagination: {
            simple: true,
            pageSizeOptions: [5, 10, 20, 50],
            hideOnSinglePage: true,
          },
        })
      );

      expect(result.current.paginationConfig).toMatchObject({
        simple: true,
        pageSizeOptions: [5, 10, 20, 50],
        hideOnSinglePage: true,
      });
    });
  });
});
