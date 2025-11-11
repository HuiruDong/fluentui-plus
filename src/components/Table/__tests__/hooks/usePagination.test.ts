import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../../hooks/usePagination';
import type { PaginationProps } from '../../../Pagination';

describe('usePagination', () => {
  interface TestRecord {
    key: string;
    name: string;
    age: number;
  }

  // 模拟服务端分页：每次只传入当前页的数据
  const mockCurrentPageData: TestRecord[] = Array.from({ length: 10 }, (_, i) => ({
    key: String(i + 1),
    name: `User -Force{i + 1}`,
    age: 20 + (i % 40),
  }));

  describe('基础功能', () => {
    it('应该返回初始状态（无分页配置）', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination: undefined,
        })
      );

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(10);
      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData).toEqual(mockCurrentPageData);
      expect(result.current.paginationConfig).toBe(false);
    });

    it('应该返回初始状态（有分页配置）', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination: {},
        })
      );

      expect(result.current.currentPage).toBe(1);
      expect(result.current.pageSize).toBe(10);
      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData).toEqual(mockCurrentPageData);
      expect(result.current.paginationConfig).toEqual({
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: true,
      });
    });

    it('应该在 pagination 为 false 时直接返回 dataSource', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination: false,
        })
      );

      expect(result.current.paginationConfig).toBe(false);
      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData).toEqual(mockCurrentPageData);
    });

    it('应该支持自定义 pageSize', () => {
      const pagination: PaginationProps = {
        pageSize: 20,
      };

      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination,
        })
      );

      // 服务端分页：直接返回 dataSource，不管 pageSize 是多少
      expect(result.current.paginatedData).toHaveLength(10);
      expect(result.current.paginatedData).toEqual(mockCurrentPageData);
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
          dataSource: mockCurrentPageData,
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

  describe('服务端分页模式', () => {
    it('应该直接返回 dataSource，不做切片', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination: { pageSize: 10 },
        })
      );

      expect(result.current.paginatedData).toEqual(mockCurrentPageData);
      expect(result.current.paginatedData).toHaveLength(10);
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

    it('应该在 dataSource 变化时更新数据', () => {
      const firstPageData: TestRecord[] = Array.from({ length: 10 }, (_, i) => ({
        key: String(i + 1),
        name: `User -Force{i + 1}`,
        age: 20 + i,
      }));

      const secondPageData: TestRecord[] = Array.from({ length: 10 }, (_, i) => ({
        key: String(i + 11),
        name: `User -Force{i + 11}`,
        age: 30 + i,
      }));

      const { result, rerender } = renderHook(
        ({ dataSource }) =>
          usePagination({
            dataSource,
            pagination: { pageSize: 10 },
          }),
        { initialProps: { dataSource: firstPageData } }
      );

      expect(result.current.paginatedData).toEqual(firstPageData);

      // 模拟翻页：服务端返回新数据
      rerender({ dataSource: secondPageData });

      expect(result.current.paginatedData).toEqual(secondPageData);
    });

    it('应该处理不同长度的数据源', () => {
      const shortPageData: TestRecord[] = Array.from({ length: 3 }, (_, i) => ({
        key: String(i + 1),
        name: `User -Force{i + 1}`,
        age: 25 + i,
      }));

      const { result } = renderHook(() =>
        usePagination({
          dataSource: shortPageData,
          pagination: { pageSize: 10 },
        })
      );

      // 最后一页可能不满 pageSize
      expect(result.current.paginatedData).toEqual(shortPageData);
      expect(result.current.paginatedData).toHaveLength(3);
    });
  });

  describe('分页变化处理', () => {
    it('应该能够更新页码状态', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination: { pageSize: 10 },
        })
      );

      expect(result.current.currentPage).toBe(1);

      act(() => {
        result.current.handlePaginationChange(3, 10);
      });

      expect(result.current.currentPage).toBe(3);
    });

    it('应该能够改变每页大小', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination: {},
        })
      );

      expect(result.current.pageSize).toBe(10);

      act(() => {
        result.current.handlePaginationChange(1, 20);
      });

      expect(result.current.pageSize).toBe(20);
    });

    it('应该同时改变页码和页大小', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination: {},
        })
      );

      act(() => {
        result.current.handlePaginationChange(2, 15);
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.pageSize).toBe(15);
    });

    it('应该调用外部的 onChange 回调', () => {
      const onChange = jest.fn();
      const pagination: PaginationProps = {
        pageSize: 10,
        onChange,
      };

      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination,
        })
      );

      act(() => {
        result.current.handlePaginationChange(2, 10);
      });

      expect(onChange).toHaveBeenCalledWith(2, 10);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('应该在修改 pageSize 时触发 onChange', () => {
      const onChange = jest.fn();
      const pagination: PaginationProps = {
        pageSize: 10,
        onChange,
      };

      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination,
        })
      );

      act(() => {
        result.current.handlePaginationChange(1, 20);
      });

      expect(onChange).toHaveBeenCalledWith(1, 20);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('应该在 pagination 为 false 时不调用 onChange', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
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

  describe('配置更新', () => {
    it('应该响应 pagination 配置的变化', () => {
      const { result, rerender } = renderHook(
        ({ pagination }) =>
          usePagination({
            dataSource: mockCurrentPageData,
            pagination,
          }),
        { initialProps: { pagination: { pageSize: 10 } as PaginationProps } }
      );

      expect(result.current.paginationConfig).toMatchObject({ pageSize: 10 });

      rerender({ pagination: { pageSize: 20 } });

      expect(result.current.paginationConfig).toMatchObject({ pageSize: 20 });
    });

    it('应该响应 dataSource 的变化', () => {
      const newData: TestRecord[] = Array.from({ length: 5 }, (_, i) => ({
        key: String(i + 1),
        name: `User -Force{i + 1}`,
        age: 25 + i,
      }));

      const { result, rerender } = renderHook(
        ({ dataSource }) =>
          usePagination({
            dataSource,
            pagination: { pageSize: 10 },
          }),
        { initialProps: { dataSource: mockCurrentPageData } }
      );

      expect(result.current.paginatedData).toHaveLength(10);

      rerender({ dataSource: newData });

      expect(result.current.paginatedData).toHaveLength(5);
      expect(result.current.paginatedData).toEqual(newData);
    });

    it('应该从有分页切换到无分页', () => {
      const { result, rerender } = renderHook(
        ({ pagination }) =>
          usePagination({
            dataSource: mockCurrentPageData,
            pagination,
          }),
        { initialProps: { pagination: { pageSize: 10 } as PaginationProps | false } }
      );

      expect(result.current.paginationConfig).not.toBe(false);

      rerender({ pagination: false });

      expect(result.current.paginationConfig).toBe(false);
      expect(result.current.paginatedData).toEqual(mockCurrentPageData);
    });

    it('应该从无分页切换到有分页', () => {
      const { result, rerender } = renderHook(
        ({ pagination }) =>
          usePagination({
            dataSource: mockCurrentPageData,
            pagination,
          }),
        { initialProps: { pagination: false as PaginationProps | false } }
      );

      expect(result.current.paginationConfig).toBe(false);

      rerender({ pagination: { pageSize: 15 } });

      expect(result.current.paginationConfig).not.toBe(false);
      expect(result.current.paginatedData).toEqual(mockCurrentPageData);
    });
  });

  describe('默认配置', () => {
    it('应该使用正确的默认配置', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
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
          dataSource: mockCurrentPageData,
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
          dataSource: mockCurrentPageData,
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

  describe('边界情况', () => {
    it('应该处理 undefined pagination 配置', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination: undefined,
        })
      );

      expect(result.current.paginationConfig).toBe(false);
      expect(result.current.paginatedData).toEqual(mockCurrentPageData);
    });

    it('应该处理空对象 pagination 配置', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination: {},
        })
      );

      expect(result.current.paginationConfig).not.toBe(false);
      expect(result.current.paginationConfig).toHaveProperty('pageSize', 10);
    });

    it('应该处理没有 pageSize 的配置', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination: {
            showQuickJumper: true,
          },
        })
      );

      expect(result.current.paginationConfig).toMatchObject({
        pageSize: 10, // 应该使用默认值
        showQuickJumper: true,
      });
    });
  });

  describe('内部状态管理', () => {
    it('应该正确管理内部的 currentPage 状态', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination: {},
        })
      );

      expect(result.current.currentPage).toBe(1);

      act(() => {
        result.current.handlePaginationChange(5, 10);
      });

      expect(result.current.currentPage).toBe(5);

      act(() => {
        result.current.handlePaginationChange(1, 10);
      });

      expect(result.current.currentPage).toBe(1);
    });

    it('应该正确管理内部的 pageSize 状态', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination: {},
        })
      );

      expect(result.current.pageSize).toBe(10);

      act(() => {
        result.current.handlePaginationChange(1, 20);
      });

      expect(result.current.pageSize).toBe(20);

      act(() => {
        result.current.handlePaginationChange(1, 50);
      });

      expect(result.current.pageSize).toBe(50);
    });

    it('应该独立管理页码和页大小', () => {
      const { result } = renderHook(() =>
        usePagination({
          dataSource: mockCurrentPageData,
          pagination: {},
        })
      );

      act(() => {
        result.current.handlePaginationChange(3, 10);
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.pageSize).toBe(10);

      act(() => {
        result.current.handlePaginationChange(3, 20);
      });

      expect(result.current.currentPage).toBe(3);
      expect(result.current.pageSize).toBe(20);
    });
  });
});
