import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

describe('useKeyboardShortcuts Hook', () => {
  const defaultOptions = {
    onClose: jest.fn(),
    onPrev: jest.fn(),
    onNext: jest.fn(),
    onZoomIn: jest.fn(),
    onZoomOut: jest.fn(),
    showNavigation: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // 清理事件监听
    document.removeEventListener('keydown', () => {});
  });

  const dispatchKeyEvent = (key: string) => {
    const event = new KeyboardEvent('keydown', { key });
    document.dispatchEvent(event);
  };

  describe('关闭快捷键', () => {
    it('按 Escape 应触发 onClose', () => {
      renderHook(() => useKeyboardShortcuts(defaultOptions));

      dispatchKeyEvent('Escape');

      expect(defaultOptions.onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('导航快捷键', () => {
    it('按左箭头应触发 onPrev', () => {
      renderHook(() => useKeyboardShortcuts(defaultOptions));

      dispatchKeyEvent('ArrowLeft');

      expect(defaultOptions.onPrev).toHaveBeenCalledTimes(1);
    });

    it('按右箭头应触发 onNext', () => {
      renderHook(() => useKeyboardShortcuts(defaultOptions));

      dispatchKeyEvent('ArrowRight');

      expect(defaultOptions.onNext).toHaveBeenCalledTimes(1);
    });

    it('showNavigation 为 false 时左箭头不应触发 onPrev', () => {
      renderHook(() => useKeyboardShortcuts({ ...defaultOptions, showNavigation: false }));

      dispatchKeyEvent('ArrowLeft');

      expect(defaultOptions.onPrev).not.toHaveBeenCalled();
    });

    it('showNavigation 为 false 时右箭头不应触发 onNext', () => {
      renderHook(() => useKeyboardShortcuts({ ...defaultOptions, showNavigation: false }));

      dispatchKeyEvent('ArrowRight');

      expect(defaultOptions.onNext).not.toHaveBeenCalled();
    });
  });

  describe('缩放快捷键', () => {
    it('按 + 应触发 onZoomIn', () => {
      renderHook(() => useKeyboardShortcuts(defaultOptions));

      dispatchKeyEvent('+');

      expect(defaultOptions.onZoomIn).toHaveBeenCalledTimes(1);
    });

    it('按 = 应触发 onZoomIn', () => {
      renderHook(() => useKeyboardShortcuts(defaultOptions));

      dispatchKeyEvent('=');

      expect(defaultOptions.onZoomIn).toHaveBeenCalledTimes(1);
    });

    it('按 - 应触发 onZoomOut', () => {
      renderHook(() => useKeyboardShortcuts(defaultOptions));

      dispatchKeyEvent('-');

      expect(defaultOptions.onZoomOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('其他按键', () => {
    it('按其他键不应触发任何回调', () => {
      renderHook(() => useKeyboardShortcuts(defaultOptions));

      dispatchKeyEvent('a');
      dispatchKeyEvent('Enter');
      dispatchKeyEvent('Tab');

      expect(defaultOptions.onClose).not.toHaveBeenCalled();
      expect(defaultOptions.onPrev).not.toHaveBeenCalled();
      expect(defaultOptions.onNext).not.toHaveBeenCalled();
      expect(defaultOptions.onZoomIn).not.toHaveBeenCalled();
      expect(defaultOptions.onZoomOut).not.toHaveBeenCalled();
    });
  });

  describe('清理', () => {
    it('组件卸载时应移除事件监听', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useKeyboardShortcuts(defaultOptions));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });
  });
});
