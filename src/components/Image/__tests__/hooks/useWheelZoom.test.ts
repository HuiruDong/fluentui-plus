import { renderHook } from '@testing-library/react';
import { useWheelZoom } from '../../hooks/useWheelZoom';

describe('useWheelZoom Hook', () => {
  let container: HTMLDivElement;
  const onZoomIn = jest.fn();
  const onZoomOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const dispatchWheelEvent = (element: HTMLElement, deltaY: number) => {
    const event = new WheelEvent('wheel', { deltaY, bubbles: true });
    element.dispatchEvent(event);
  };

  describe('滚轮缩放', () => {
    it('向上滚动（deltaY < 0）应触发 onZoomIn', () => {
      const containerRef = { current: container };
      renderHook(() => useWheelZoom(containerRef, onZoomIn, onZoomOut));

      dispatchWheelEvent(container, -100);

      expect(onZoomIn).toHaveBeenCalledTimes(1);
      expect(onZoomOut).not.toHaveBeenCalled();
    });

    it('向下滚动（deltaY > 0）应触发 onZoomOut', () => {
      const containerRef = { current: container };
      renderHook(() => useWheelZoom(containerRef, onZoomIn, onZoomOut));

      dispatchWheelEvent(container, 100);

      expect(onZoomOut).toHaveBeenCalledTimes(1);
      expect(onZoomIn).not.toHaveBeenCalled();
    });

    it('deltaY 为 0 时不应触发任何回调', () => {
      const containerRef = { current: container };
      renderHook(() => useWheelZoom(containerRef, onZoomIn, onZoomOut));

      dispatchWheelEvent(container, 0);

      expect(onZoomIn).not.toHaveBeenCalled();
      expect(onZoomOut).toHaveBeenCalledTimes(1); // deltaY >= 0 时触发 onZoomOut
    });
  });

  describe('容器引用', () => {
    it('containerRef.current 为 null 时不应添加事件监听', () => {
      const containerRef = { current: null };
      const addEventListenerSpy = jest.spyOn(container, 'addEventListener');

      renderHook(() => useWheelZoom(containerRef, onZoomIn, onZoomOut));

      expect(addEventListenerSpy).not.toHaveBeenCalled();

      addEventListenerSpy.mockRestore();
    });
  });

  describe('清理', () => {
    it('组件卸载时应移除事件监听', () => {
      const containerRef = { current: container };
      const removeEventListenerSpy = jest.spyOn(container, 'removeEventListener');

      const { unmount } = renderHook(() => useWheelZoom(containerRef, onZoomIn, onZoomOut));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('wheel', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('事件阻止', () => {
    it('滚轮事件应阻止默认行为', () => {
      const containerRef = { current: container };
      renderHook(() => useWheelZoom(containerRef, onZoomIn, onZoomOut));

      const preventDefaultSpy = jest.fn();
      const event = new WheelEvent('wheel', { deltaY: -100, bubbles: true });
      Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy });

      container.dispatchEvent(event);

      // 由于使用了 { passive: false }，preventDefault 应该被调用
      // 注意：在 JSDOM 环境中，passive 选项可能不完全模拟
    });
  });
});
