import { renderHook, act } from '@testing-library/react';
import { useNavigation } from '../../hooks/useNavigation';

describe('useNavigation Hook', () => {
  describe('初始状态', () => {
    it('internalIndex 应与传入的 currentIndex 相同', () => {
      const { result } = renderHook(() => useNavigation(2, 5));
      expect(result.current.internalIndex).toBe(2);
    });

    it('currentIndex 为 0 时 internalIndex 应为 0', () => {
      const { result } = renderHook(() => useNavigation(0, 5));
      expect(result.current.internalIndex).toBe(0);
    });
  });

  describe('导航功能', () => {
    it('handleNext 应增加索引', () => {
      const { result } = renderHook(() => useNavigation(0, 5));

      act(() => {
        result.current.handleNext();
      });

      expect(result.current.internalIndex).toBe(1);
    });

    it('handlePrev 应减少索引', () => {
      const { result } = renderHook(() => useNavigation(2, 5));

      act(() => {
        result.current.handlePrev();
      });

      expect(result.current.internalIndex).toBe(1);
    });

    it('在最后一张时 handleNext 不应改变索引', () => {
      const { result } = renderHook(() => useNavigation(4, 5));

      act(() => {
        result.current.handleNext();
      });

      expect(result.current.internalIndex).toBe(4);
    });

    it('在第一张时 handlePrev 不应改变索引', () => {
      const { result } = renderHook(() => useNavigation(0, 5));

      act(() => {
        result.current.handlePrev();
      });

      expect(result.current.internalIndex).toBe(0);
    });
  });

  describe('回调触发', () => {
    it('handleNext 应触发 onIndexChange 回调', () => {
      const onIndexChange = jest.fn();
      const { result } = renderHook(() => useNavigation(0, 5, onIndexChange));

      act(() => {
        result.current.handleNext();
      });

      expect(onIndexChange).toHaveBeenCalledWith(1);
    });

    it('handlePrev 应触发 onIndexChange 回调', () => {
      const onIndexChange = jest.fn();
      const { result } = renderHook(() => useNavigation(2, 5, onIndexChange));

      act(() => {
        result.current.handlePrev();
      });

      expect(onIndexChange).toHaveBeenCalledWith(1);
    });

    it('边界处不应触发 onIndexChange 回调', () => {
      const onIndexChange = jest.fn();
      const { result } = renderHook(() => useNavigation(0, 5, onIndexChange));

      act(() => {
        result.current.handlePrev();
      });

      expect(onIndexChange).not.toHaveBeenCalled();
    });

    it('没有传入 onIndexChange 时不应报错', () => {
      const { result } = renderHook(() => useNavigation(0, 5));

      expect(() => {
        act(() => {
          result.current.handleNext();
        });
      }).not.toThrow();
    });
  });

  describe('外部索引同步', () => {
    it('currentIndex 变化时应同步 internalIndex', () => {
      const { result, rerender } = renderHook(({ currentIndex, total }) => useNavigation(currentIndex, total), {
        initialProps: { currentIndex: 0, total: 5 },
      });

      expect(result.current.internalIndex).toBe(0);

      rerender({ currentIndex: 3, total: 5 });

      expect(result.current.internalIndex).toBe(3);
    });
  });

  describe('边界情况', () => {
    it('只有一张图片时导航不应改变索引', () => {
      const { result } = renderHook(() => useNavigation(0, 1));

      act(() => {
        result.current.handleNext();
      });
      expect(result.current.internalIndex).toBe(0);

      act(() => {
        result.current.handlePrev();
      });
      expect(result.current.internalIndex).toBe(0);
    });
  });
});
