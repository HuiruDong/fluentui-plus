import { renderHook } from '@testing-library/react';
import { usePaginationCalculations } from '../../hooks/usePaginationCalculations';
import { PaginationItemType } from '../../utils';

// Mock the utils
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  generatePaginationItems: jest.fn(),
}));

describe('usePaginationCalculations', () => {
  let mockGeneratePaginationItems: jest.Mock;

  beforeEach(() => {
    const utils = jest.requireMock('../../utils');
    mockGeneratePaginationItems = utils.generatePaginationItems;
    mockGeneratePaginationItems.mockReturnValue([]);
    jest.clearAllMocks();
  });

  describe('总页数计算', () => {
    it('should calculate total pages correctly', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 100, 10, false));

      expect(result.current.totalPages).toBe(10);
    });

    it('should round up for incomplete pages', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 95, 10, false));

      expect(result.current.totalPages).toBe(10);
    });

    it('should return 1 for zero total', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 0, 10, false));

      expect(result.current.totalPages).toBe(1);
    });

    it('should return 1 when total is less than pageSize', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 5, 10, false));

      expect(result.current.totalPages).toBe(1);
    });

    it('should handle large numbers', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 1000000, 10, false));

      expect(result.current.totalPages).toBe(100000);
    });
  });

  describe('隐藏分页器', () => {
    it('should hide when hideOnSinglePage is true and totalPages is 1', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 5, 10, true));

      expect(result.current.shouldHide).toBe(true);
    });

    it('should not hide when hideOnSinglePage is false', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 5, 10, false));

      expect(result.current.shouldHide).toBe(false);
    });

    it('should not hide when totalPages is greater than 1', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 20, 10, true));

      expect(result.current.shouldHide).toBe(false);
    });

    it('should not hide when hideOnSinglePage is true but totalPages > 1', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 100, 10, true));

      expect(result.current.shouldHide).toBe(false);
    });
  });

  describe('页码列表生成', () => {
    it('should call generatePaginationItems with correct parameters', () => {
      renderHook(() => usePaginationCalculations(5, 100, 10, false));

      expect(mockGeneratePaginationItems).toHaveBeenCalledWith(5, 10);
    });

    it('should return pagination items from generatePaginationItems', () => {
      const mockItems = [
        { type: PaginationItemType.Page, value: 1 },
        { type: PaginationItemType.Page, value: 2 },
      ];
      mockGeneratePaginationItems.mockReturnValue(mockItems);

      const { result } = renderHook(() => usePaginationCalculations(1, 100, 10, false));

      expect(result.current.paginationItems).toEqual(mockItems);
    });

    it('should update pagination items when current changes', () => {
      const { rerender } = renderHook(({ current }) => usePaginationCalculations(current, 100, 10, false), {
        initialProps: { current: 1 },
      });

      expect(mockGeneratePaginationItems).toHaveBeenCalledWith(1, 10);

      rerender({ current: 5 });

      expect(mockGeneratePaginationItems).toHaveBeenCalledWith(5, 10);
    });
  });

  describe('当前范围计算', () => {
    it('should calculate current range correctly', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 100, 10, false));

      expect(result.current.currentRange).toEqual([1, 10]);
    });

    it('should calculate range for middle page', () => {
      const { result } = renderHook(() => usePaginationCalculations(5, 100, 10, false));

      expect(result.current.currentRange).toEqual([41, 50]);
    });

    it('should calculate range for last page', () => {
      const { result } = renderHook(() => usePaginationCalculations(10, 100, 10, false));

      expect(result.current.currentRange).toEqual([91, 100]);
    });

    it('should handle incomplete last page', () => {
      const { result } = renderHook(() => usePaginationCalculations(10, 95, 10, false));

      expect(result.current.currentRange).toEqual([91, 95]);
    });

    it('should handle single item page', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 1, 10, false));

      expect(result.current.currentRange).toEqual([1, 1]);
    });

    it('should handle zero total', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 0, 10, false));

      expect(result.current.currentRange).toEqual([1, 0]);
    });
  });

  describe('参数变化响应', () => {
    it('should recalculate when current changes', () => {
      const { result, rerender } = renderHook(({ current }) => usePaginationCalculations(current, 100, 10, false), {
        initialProps: { current: 1 },
      });

      expect(result.current.currentRange).toEqual([1, 10]);

      rerender({ current: 2 });

      expect(result.current.currentRange).toEqual([11, 20]);
    });

    it('should recalculate when total changes', () => {
      const { result, rerender } = renderHook(({ total }) => usePaginationCalculations(1, total, 10, false), {
        initialProps: { total: 100 },
      });

      expect(result.current.totalPages).toBe(10);

      rerender({ total: 200 });

      expect(result.current.totalPages).toBe(20);
    });

    it('should recalculate when pageSize changes', () => {
      const { result, rerender } = renderHook(({ pageSize }) => usePaginationCalculations(1, 100, pageSize, false), {
        initialProps: { pageSize: 10 },
      });

      expect(result.current.totalPages).toBe(10);
      expect(result.current.currentRange).toEqual([1, 10]);

      rerender({ pageSize: 20 });

      expect(result.current.totalPages).toBe(5);
      expect(result.current.currentRange).toEqual([1, 20]);
    });

    it('should recalculate when hideOnSinglePage changes', () => {
      const { result, rerender } = renderHook(
        ({ hideOnSinglePage }) => usePaginationCalculations(1, 5, 10, hideOnSinglePage),
        {
          initialProps: { hideOnSinglePage: false },
        }
      );

      expect(result.current.shouldHide).toBe(false);

      rerender({ hideOnSinglePage: true });

      expect(result.current.shouldHide).toBe(true);
    });
  });

  describe('边界情况', () => {
    it('should handle very large pageSize', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 100, 1000, false));

      expect(result.current.totalPages).toBe(1);
      expect(result.current.currentRange).toEqual([1, 100]);
    });

    it('should handle pageSize of 1', () => {
      const { result } = renderHook(() => usePaginationCalculations(5, 100, 1, false));

      expect(result.current.totalPages).toBe(100);
      expect(result.current.currentRange).toEqual([5, 5]);
    });

    it('should handle negative current (edge case)', () => {
      const { result } = renderHook(() => usePaginationCalculations(-1, 100, 10, false));

      // (-1 - 1) * 10 + 1 = -19, min(-1 * 10, 100) = -10
      expect(result.current.currentRange).toEqual([-19, -10]);
    });

    it('should handle current beyond total pages', () => {
      const { result } = renderHook(() => usePaginationCalculations(20, 100, 10, false));

      // Should still calculate, even though it's out of range
      // (20 - 1) * 10 + 1 = 191, min(20 * 10, 100) = 100
      expect(result.current.currentRange).toEqual([191, 100]);
    });

    it('should handle very large total', () => {
      const { result } = renderHook(() => usePaginationCalculations(1, 10000000, 10, false));

      expect(result.current.totalPages).toBe(1000000);
      expect(result.current.currentRange).toEqual([1, 10]);
    });
  });

  describe('性能优化 (useMemo)', () => {
    it('should not recalculate when unrelated props change', () => {
      const { rerender } = renderHook(
        ({ current, total, pageSize, hideOnSinglePage }) =>
          usePaginationCalculations(current, total, pageSize, hideOnSinglePage),
        {
          initialProps: { current: 1, total: 100, pageSize: 10, hideOnSinglePage: false },
        }
      );

      const callCount = mockGeneratePaginationItems.mock.calls.length;

      // Rerender with same props
      rerender({ current: 1, total: 100, pageSize: 10, hideOnSinglePage: false });

      // Should not call again if properly memoized
      expect(mockGeneratePaginationItems.mock.calls.length).toBe(callCount);
    });

    it('should recalculate totalPages only when total or pageSize changes', () => {
      const { result, rerender } = renderHook(
        ({ current, total, pageSize }) => usePaginationCalculations(current, total, pageSize, false),
        {
          initialProps: { current: 1, total: 100, pageSize: 10 },
        }
      );

      const firstTotalPages = result.current.totalPages;

      // Change current (should not affect totalPages)
      rerender({ current: 2, total: 100, pageSize: 10 });

      expect(result.current.totalPages).toBe(firstTotalPages);

      // Change total (should recalculate totalPages)
      rerender({ current: 2, total: 200, pageSize: 10 });

      expect(result.current.totalPages).not.toBe(firstTotalPages);
      expect(result.current.totalPages).toBe(20);
    });
  });
});
