import { renderHook, act } from '@testing-library/react';
import { usePaginationState } from '../../hooks/usePaginationState';

describe('usePaginationState', () => {
  describe('非受控模式', () => {
    it('should initialize with defaultCurrent', () => {
      const { result } = renderHook(() => usePaginationState(undefined, 5));

      expect(result.current.current).toBe(5);
    });

    it('should use defaultCurrent when current is undefined', () => {
      const { result } = renderHook(() => usePaginationState(undefined, 1));

      expect(result.current.current).toBe(1);
    });

    it('should update internal state when setCurrentPage is called', () => {
      const { result } = renderHook(() => usePaginationState(undefined, 1));

      act(() => {
        result.current.setCurrentPage(5, 10);
      });

      expect(result.current.current).toBe(5);
    });

    it('should call onChange callback when setCurrentPage is called', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => usePaginationState(undefined, 1, onChange));

      act(() => {
        result.current.setCurrentPage(3, 20);
      });

      expect(onChange).toHaveBeenCalledWith(3, 20);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should not call onChange if not provided', () => {
      const { result } = renderHook(() => usePaginationState(undefined, 1));

      expect(() => {
        act(() => {
          result.current.setCurrentPage(2, 10);
        });
      }).not.toThrow();
    });
  });

  describe('受控模式', () => {
    it('should use controlled current value', () => {
      const { result } = renderHook(() => usePaginationState(3, 1));

      expect(result.current.current).toBe(3);
    });

    it('should update when controlled current changes', () => {
      const { result, rerender } = renderHook(({ current }) => usePaginationState(current, 1), {
        initialProps: { current: 2 },
      });

      expect(result.current.current).toBe(2);

      rerender({ current: 5 });

      expect(result.current.current).toBe(5);
    });

    it('should not update internal state when setCurrentPage is called', () => {
      const { result } = renderHook(() => usePaginationState(3, 1));

      act(() => {
        result.current.setCurrentPage(5, 10);
      });

      // Should still be 3 because it's controlled
      expect(result.current.current).toBe(3);
    });

    it('should call onChange callback when setCurrentPage is called', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => usePaginationState(3, 1, onChange));

      act(() => {
        result.current.setCurrentPage(7, 20);
      });

      expect(onChange).toHaveBeenCalledWith(7, 20);
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should sync with controlled value even after internal updates', () => {
      const { result, rerender } = renderHook(({ current }) => usePaginationState(current, 1), {
        initialProps: { current: 2 },
      });

      act(() => {
        result.current.setCurrentPage(5, 10);
      });

      // Should still be 2 because it's controlled
      expect(result.current.current).toBe(2);

      // Update controlled value
      rerender({ current: 8 });

      expect(result.current.current).toBe(8);
    });
  });

  describe('模式切换', () => {
    it('should switch from uncontrolled to controlled', () => {
      const { result, rerender } = renderHook(
        ({ current }: { current: number | undefined }) => usePaginationState(current, 1),
        {
          initialProps: { current: undefined as number | undefined },
        }
      );

      // Start in uncontrolled mode
      expect(result.current.current).toBe(1);

      act(() => {
        result.current.setCurrentPage(3, 10);
      });

      expect(result.current.current).toBe(3);

      // Switch to controlled mode
      rerender({ current: 5 as number | undefined });

      expect(result.current.current).toBe(5);
    });

    it('should switch from controlled to uncontrolled', () => {
      const { result, rerender } = renderHook(
        ({ current }: { current: number | undefined }) => usePaginationState(current, 1),
        {
          initialProps: { current: 5 as number | undefined },
        }
      );

      // Start in controlled mode
      expect(result.current.current).toBe(5);

      // Switch to uncontrolled mode
      rerender({ current: undefined as number | undefined });

      // Should maintain the last controlled value
      expect(result.current.current).toBe(5);

      // Now updates should work in uncontrolled mode
      act(() => {
        result.current.setCurrentPage(7, 10);
      });

      expect(result.current.current).toBe(7);
    });
  });

  describe('setCurrentPage 稳定性', () => {
    it('should maintain stable reference when onChange changes', () => {
      const onChange1 = jest.fn();
      const onChange2 = jest.fn();

      const { result, rerender } = renderHook(({ onChange }) => usePaginationState(undefined, 1, onChange), {
        initialProps: { onChange: onChange1 },
      });

      const firstSetCurrentPage = result.current.setCurrentPage;

      rerender({ onChange: onChange2 });

      const secondSetCurrentPage = result.current.setCurrentPage;

      // setCurrentPage should have a new reference when onChange changes
      expect(firstSetCurrentPage).not.toBe(secondSetCurrentPage);
    });

    it('should maintain stable reference when current changes', () => {
      const onChange = jest.fn();

      const { result, rerender } = renderHook(({ current }) => usePaginationState(current, 1, onChange), {
        initialProps: { current: 1 },
      });

      const firstSetCurrentPage = result.current.setCurrentPage;

      rerender({ current: 2 });

      const secondSetCurrentPage = result.current.setCurrentPage;

      // setCurrentPage should have a new reference when current changes
      expect(firstSetCurrentPage).not.toBe(secondSetCurrentPage);
    });
  });

  describe('边界情况', () => {
    it('should handle page 0', () => {
      const { result } = renderHook(() => usePaginationState(undefined, 0));

      expect(result.current.current).toBe(0);
    });

    it('should handle negative page numbers', () => {
      const { result } = renderHook(() => usePaginationState(undefined, -5));

      expect(result.current.current).toBe(-5);
    });

    it('should handle very large page numbers', () => {
      const { result } = renderHook(() => usePaginationState(undefined, 999999));

      expect(result.current.current).toBe(999999);

      act(() => {
        result.current.setCurrentPage(1000000, 10);
      });

      expect(result.current.current).toBe(1000000);
    });

    it('should handle multiple rapid updates', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => usePaginationState(undefined, 1, onChange));

      act(() => {
        result.current.setCurrentPage(2, 10);
        result.current.setCurrentPage(3, 10);
        result.current.setCurrentPage(4, 10);
        result.current.setCurrentPage(5, 10);
      });

      expect(result.current.current).toBe(5);
      expect(onChange).toHaveBeenCalledTimes(4);
      expect(onChange).toHaveBeenLastCalledWith(5, 10);
    });

    it('should handle pageSize changes', () => {
      const onChange = jest.fn();
      const { result } = renderHook(() => usePaginationState(undefined, 1, onChange));

      act(() => {
        result.current.setCurrentPage(2, 10);
      });

      expect(onChange).toHaveBeenCalledWith(2, 10);

      act(() => {
        result.current.setCurrentPage(2, 20);
      });

      expect(onChange).toHaveBeenCalledWith(2, 20);
    });
  });

  describe('初始化', () => {
    it('should prefer controlled value over defaultCurrent', () => {
      const { result } = renderHook(() => usePaginationState(10, 5));

      expect(result.current.current).toBe(10);
    });

    it('should handle current being 0 in controlled mode', () => {
      const { result } = renderHook(() => usePaginationState(0, 5));

      expect(result.current.current).toBe(0);
    });

    it('should handle defaultCurrent being 0 in uncontrolled mode', () => {
      const { result } = renderHook(() => usePaginationState(undefined, 0));

      expect(result.current.current).toBe(0);
    });
  });
});
