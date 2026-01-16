import { renderHook, act } from '@testing-library/react';
import { useTransform } from '../../hooks/useTransform';
import { MIN_SCALE, MAX_SCALE, SCALE_STEP } from '../../constants';

describe('useTransform Hook', () => {
  describe('初始状态', () => {
    it('初始缩放比例应为 1', () => {
      const { result } = renderHook(() => useTransform());
      expect(result.current.scale).toBe(1);
    });

    it('初始旋转角度应为 0', () => {
      const { result } = renderHook(() => useTransform());
      expect(result.current.rotate).toBe(0);
    });
  });

  describe('缩放功能', () => {
    it('handleZoomIn 应增加缩放比例', () => {
      const { result } = renderHook(() => useTransform());

      act(() => {
        result.current.handleZoomIn();
      });

      expect(result.current.scale).toBe(1 + SCALE_STEP);
    });

    it('handleZoomOut 应减少缩放比例', () => {
      const { result } = renderHook(() => useTransform());

      act(() => {
        result.current.handleZoomOut();
      });

      expect(result.current.scale).toBe(1 - SCALE_STEP);
    });

    it('缩放比例不应超过最大值', () => {
      const { result } = renderHook(() => useTransform());

      // 连续放大直到超过最大值
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.handleZoomIn();
        }
      });

      expect(result.current.scale).toBe(MAX_SCALE);
    });

    it('缩放比例不应低于最小值', () => {
      const { result } = renderHook(() => useTransform());

      // 连续缩小直到低于最小值
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.handleZoomOut();
        }
      });

      expect(result.current.scale).toBe(MIN_SCALE);
    });
  });

  describe('旋转功能', () => {
    it('handleRotateRight 应顺时针旋转 90 度', () => {
      const { result } = renderHook(() => useTransform());

      act(() => {
        result.current.handleRotateRight();
      });

      expect(result.current.rotate).toBe(90);
    });

    it('handleRotateLeft 应逆时针旋转 90 度', () => {
      const { result } = renderHook(() => useTransform());

      act(() => {
        result.current.handleRotateLeft();
      });

      expect(result.current.rotate).toBe(-90);
    });

    it('连续旋转应累加角度', () => {
      const { result } = renderHook(() => useTransform());

      act(() => {
        result.current.handleRotateRight();
        result.current.handleRotateRight();
      });

      expect(result.current.rotate).toBe(180);
    });

    it('旋转一圈后角度应为 360', () => {
      const { result } = renderHook(() => useTransform());

      act(() => {
        for (let i = 0; i < 4; i++) {
          result.current.handleRotateRight();
        }
      });

      expect(result.current.rotate).toBe(360);
    });
  });

  describe('重置功能', () => {
    it('resetTransform 应重置缩放比例为 1', () => {
      const { result } = renderHook(() => useTransform());

      act(() => {
        result.current.handleZoomIn();
        result.current.handleZoomIn();
      });

      expect(result.current.scale).not.toBe(1);

      act(() => {
        result.current.resetTransform();
      });

      expect(result.current.scale).toBe(1);
    });

    it('resetTransform 应重置旋转角度为 0', () => {
      const { result } = renderHook(() => useTransform());

      act(() => {
        result.current.handleRotateRight();
        result.current.handleRotateRight();
      });

      expect(result.current.rotate).not.toBe(0);

      act(() => {
        result.current.resetTransform();
      });

      expect(result.current.rotate).toBe(0);
    });

    it('resetTransform 应同时重置缩放和旋转', () => {
      const { result } = renderHook(() => useTransform());

      act(() => {
        result.current.handleZoomIn();
        result.current.handleRotateRight();
      });

      act(() => {
        result.current.resetTransform();
      });

      expect(result.current.scale).toBe(1);
      expect(result.current.rotate).toBe(0);
    });
  });
});
