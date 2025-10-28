import { renderHook, act } from '@testing-library/react';
import { usePaginationHandlers } from '../../hooks/usePaginationHandlers';
import { PaginationItemType } from '../../utils';
import type { PageItem } from '../../types';

// Mock the utils
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  calculateTargetPage: jest.fn(),
}));

describe('usePaginationHandlers', () => {
  let mockCalculateTargetPage: jest.Mock;
  let mockSetCurrentPage: jest.Mock;

  beforeEach(() => {
    const utils = jest.requireMock('../../utils');
    mockCalculateTargetPage = utils.calculateTargetPage;
    mockSetCurrentPage = jest.fn();
    jest.clearAllMocks();
  });

  describe('handlePageItemClick', () => {
    it('should call calculateTargetPage and setCurrentPage', () => {
      mockCalculateTargetPage.mockReturnValue(5);

      const { result } = renderHook(() => usePaginationHandlers(1, 10, 10, 100, false, mockSetCurrentPage));

      const pageItem: PageItem = { type: PaginationItemType.Page, value: 5 };

      act(() => {
        result.current.handlePageItemClick(pageItem);
      });

      expect(mockCalculateTargetPage).toHaveBeenCalledWith(pageItem, 1, 10);
      expect(mockSetCurrentPage).toHaveBeenCalledWith(5, 10);
    });

    it('should not call setCurrentPage when disabled', () => {
      const { result } = renderHook(() => usePaginationHandlers(1, 10, 10, 100, true, mockSetCurrentPage));

      const pageItem: PageItem = { type: PaginationItemType.Page, value: 5 };

      act(() => {
        result.current.handlePageItemClick(pageItem);
      });

      expect(mockSetCurrentPage).not.toHaveBeenCalled();
    });

    it('should not call setCurrentPage when clicking current page', () => {
      const { result } = renderHook(() => usePaginationHandlers(5, 10, 10, 100, false, mockSetCurrentPage));

      const pageItem: PageItem = { type: PaginationItemType.Page, value: 5 };

      act(() => {
        result.current.handlePageItemClick(pageItem);
      });

      expect(mockSetCurrentPage).not.toHaveBeenCalled();
    });

    it('should handle jump prev item', () => {
      mockCalculateTargetPage.mockReturnValue(3);

      const { result } = renderHook(() => usePaginationHandlers(8, 10, 10, 100, false, mockSetCurrentPage));

      const pageItem: PageItem = { type: PaginationItemType.Prev, value: '...' };

      act(() => {
        result.current.handlePageItemClick(pageItem);
      });

      expect(mockCalculateTargetPage).toHaveBeenCalledWith(pageItem, 8, 10);
      expect(mockSetCurrentPage).toHaveBeenCalledWith(3, 10);
    });

    it('should handle jump next item', () => {
      mockCalculateTargetPage.mockReturnValue(8);

      const { result } = renderHook(() => usePaginationHandlers(3, 10, 10, 100, false, mockSetCurrentPage));

      const pageItem: PageItem = { type: PaginationItemType.Next, value: '...' };

      act(() => {
        result.current.handlePageItemClick(pageItem);
      });

      expect(mockCalculateTargetPage).toHaveBeenCalledWith(pageItem, 3, 10);
      expect(mockSetCurrentPage).toHaveBeenCalledWith(8, 10);
    });
  });

  describe('handlePrevClick', () => {
    it('should go to previous page', () => {
      const { result } = renderHook(() => usePaginationHandlers(5, 10, 10, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handlePrevClick();
      });

      expect(mockSetCurrentPage).toHaveBeenCalledWith(4, 10);
    });

    it('should not go to previous page when on first page', () => {
      const { result } = renderHook(() => usePaginationHandlers(1, 10, 10, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handlePrevClick();
      });

      expect(mockSetCurrentPage).not.toHaveBeenCalled();
    });

    it('should not go to previous page when disabled', () => {
      const { result } = renderHook(() => usePaginationHandlers(5, 10, 10, 100, true, mockSetCurrentPage));

      act(() => {
        result.current.handlePrevClick();
      });

      expect(mockSetCurrentPage).not.toHaveBeenCalled();
    });

    it('should work from any page', () => {
      const { result } = renderHook(() => usePaginationHandlers(10, 10, 10, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handlePrevClick();
      });

      expect(mockSetCurrentPage).toHaveBeenCalledWith(9, 10);
    });
  });

  describe('handleNextClick', () => {
    it('should go to next page', () => {
      const { result } = renderHook(() => usePaginationHandlers(5, 10, 10, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handleNextClick();
      });

      expect(mockSetCurrentPage).toHaveBeenCalledWith(6, 10);
    });

    it('should not go to next page when on last page', () => {
      const { result } = renderHook(() => usePaginationHandlers(10, 10, 10, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handleNextClick();
      });

      expect(mockSetCurrentPage).not.toHaveBeenCalled();
    });

    it('should not go to next page when disabled', () => {
      const { result } = renderHook(() => usePaginationHandlers(5, 10, 10, 100, true, mockSetCurrentPage));

      act(() => {
        result.current.handleNextClick();
      });

      expect(mockSetCurrentPage).not.toHaveBeenCalled();
    });

    it('should work from any page', () => {
      const { result } = renderHook(() => usePaginationHandlers(1, 10, 10, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handleNextClick();
      });

      expect(mockSetCurrentPage).toHaveBeenCalledWith(2, 10);
    });
  });

  describe('handlePageSizeChange', () => {
    it('should change page size and keep current page if possible', () => {
      const { result } = renderHook(() => usePaginationHandlers(3, 10, 10, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handlePageSizeChange(20);
      });

      // Total pages with new size: 100 / 20 = 5
      // Current page 3 is still valid
      expect(mockSetCurrentPage).toHaveBeenCalledWith(3, 20);
    });

    it('should adjust current page when it exceeds new total pages', () => {
      const { result } = renderHook(() => usePaginationHandlers(8, 10, 10, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handlePageSizeChange(20);
      });

      // Total pages with new size: 100 / 20 = 5
      // Current page 8 exceeds 5, should adjust to 5
      expect(mockSetCurrentPage).toHaveBeenCalledWith(5, 20);
    });

    it('should handle increasing page size', () => {
      const { result } = renderHook(() => usePaginationHandlers(5, 10, 10, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handlePageSizeChange(50);
      });

      // Total pages with new size: 100 / 50 = 2
      // Current page 5 exceeds 2, should adjust to 2
      expect(mockSetCurrentPage).toHaveBeenCalledWith(2, 50);
    });

    it('should handle decreasing page size', () => {
      const { result } = renderHook(() => usePaginationHandlers(2, 5, 20, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handlePageSizeChange(10);
      });

      // Total pages with new size: 100 / 10 = 10
      // Current page 2 is still valid
      expect(mockSetCurrentPage).toHaveBeenCalledWith(2, 10);
    });

    it('should handle edge case when current is at last page', () => {
      const { result } = renderHook(() => usePaginationHandlers(10, 10, 10, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handlePageSizeChange(50);
      });

      // Total pages with new size: 100 / 50 = 2
      expect(mockSetCurrentPage).toHaveBeenCalledWith(2, 50);
    });

    it('should handle when new page size results in single page', () => {
      const { result } = renderHook(() => usePaginationHandlers(5, 10, 10, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handlePageSizeChange(200);
      });

      // Total pages with new size: 100 / 200 = 1
      expect(mockSetCurrentPage).toHaveBeenCalledWith(1, 200);
    });
  });

  describe('函数稳定性', () => {
    it('should maintain stable reference when dependencies do not change', () => {
      const { result, rerender } = renderHook(
        ({ current, totalPages, pageSize, total, disabled, setCurrentPage }) =>
          usePaginationHandlers(current, totalPages, pageSize, total, disabled, setCurrentPage),
        {
          initialProps: {
            current: 5,
            totalPages: 10,
            pageSize: 10,
            total: 100,
            disabled: false,
            setCurrentPage: mockSetCurrentPage,
          },
        }
      );

      const firstHandlers = {
        handlePageItemClick: result.current.handlePageItemClick,
        handlePrevClick: result.current.handlePrevClick,
        handleNextClick: result.current.handleNextClick,
        handlePageSizeChange: result.current.handlePageSizeChange,
      };

      // Rerender with same props
      rerender({
        current: 5,
        totalPages: 10,
        pageSize: 10,
        total: 100,
        disabled: false,
        setCurrentPage: mockSetCurrentPage,
      });

      const secondHandlers = {
        handlePageItemClick: result.current.handlePageItemClick,
        handlePrevClick: result.current.handlePrevClick,
        handleNextClick: result.current.handleNextClick,
        handlePageSizeChange: result.current.handlePageSizeChange,
      };

      // References should be the same
      expect(firstHandlers.handlePageItemClick).toBe(secondHandlers.handlePageItemClick);
      expect(firstHandlers.handlePrevClick).toBe(secondHandlers.handlePrevClick);
      expect(firstHandlers.handleNextClick).toBe(secondHandlers.handleNextClick);
      expect(firstHandlers.handlePageSizeChange).toBe(secondHandlers.handlePageSizeChange);
    });

    it('should update reference when dependencies change', () => {
      const { result, rerender } = renderHook(
        ({ current }) => usePaginationHandlers(current, 10, 10, 100, false, mockSetCurrentPage),
        {
          initialProps: { current: 5 },
        }
      );

      const firstHandlePageItemClick = result.current.handlePageItemClick;

      rerender({ current: 6 });

      const secondHandlePageItemClick = result.current.handlePageItemClick;

      // Reference should change when current changes
      expect(firstHandlePageItemClick).not.toBe(secondHandlePageItemClick);
    });
  });

  describe('边界情况', () => {
    it('should handle page 0', () => {
      const { result } = renderHook(() => usePaginationHandlers(0, 10, 10, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handlePrevClick();
      });

      // When current is 0, handlePrevClick checks current <= 1, which is true, so it won't call setCurrentPage
      expect(mockSetCurrentPage).not.toHaveBeenCalled();
    });

    it('should handle very large page numbers', () => {
      const { result } = renderHook(() =>
        usePaginationHandlers(999999, 1000000, 10, 10000000, false, mockSetCurrentPage)
      );

      act(() => {
        result.current.handleNextClick();
      });

      expect(mockSetCurrentPage).toHaveBeenCalledWith(1000000, 10);
    });

    it('should handle page size change with total 0', () => {
      const { result } = renderHook(() => usePaginationHandlers(1, 1, 10, 0, false, mockSetCurrentPage));

      act(() => {
        result.current.handlePageSizeChange(20);
      });

      // ceil(0 / 20) = 0, min(1, 0) = 0
      expect(mockSetCurrentPage).toHaveBeenCalledWith(0, 20);
    });

    it('should handle multiple rapid clicks', () => {
      const { result } = renderHook(() => usePaginationHandlers(5, 10, 10, 100, false, mockSetCurrentPage));

      act(() => {
        result.current.handlePrevClick();
        result.current.handleNextClick();
        result.current.handlePrevClick();
      });

      expect(mockSetCurrentPage).toHaveBeenCalledTimes(3);
      expect(mockSetCurrentPage).toHaveBeenNthCalledWith(1, 4, 10);
      expect(mockSetCurrentPage).toHaveBeenNthCalledWith(2, 6, 10);
      expect(mockSetCurrentPage).toHaveBeenNthCalledWith(3, 4, 10);
    });
  });

  describe('集成测试', () => {
    it('should handle complete navigation flow', () => {
      const { result } = renderHook(() => usePaginationHandlers(1, 10, 10, 100, false, mockSetCurrentPage));

      // Go to next page
      act(() => {
        result.current.handleNextClick();
      });
      expect(mockSetCurrentPage).toHaveBeenLastCalledWith(2, 10);

      // Change page size
      act(() => {
        result.current.handlePageSizeChange(20);
      });
      expect(mockSetCurrentPage).toHaveBeenLastCalledWith(1, 20);

      // Click specific page
      mockCalculateTargetPage.mockReturnValue(5);
      const pageItem: PageItem = { type: PaginationItemType.Page, value: 5 };
      act(() => {
        result.current.handlePageItemClick(pageItem);
      });
      expect(mockSetCurrentPage).toHaveBeenLastCalledWith(5, 10);
    });
  });
});
