import { useEffect, RefObject } from 'react';

/**
 * useWheelZoom - 滚轮缩放 Hook
 * @description 监听容器内的鼠标滚轮事件，向上滚动放大，向下滚动缩小
 * @param containerRef - 容器 DOM 引用
 * @param onZoomIn - 放大回调
 * @param onZoomOut - 缩小回调
 */
export const useWheelZoom = (containerRef: RefObject<HTMLDivElement>, onZoomIn: () => void, onZoomOut: () => void) => {
  useEffect(() => {
    // 处理滚轮事件
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) {
        onZoomIn();
      } else {
        onZoomOut();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [containerRef, onZoomIn, onZoomOut]);
};
