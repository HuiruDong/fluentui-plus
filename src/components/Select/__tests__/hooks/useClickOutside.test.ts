import { renderHook, act } from '@testing-library/react';
import { useClickOutside } from '../../hooks/useClickOutside';

describe('useClickOutside', () => {
  let triggerRef: React.RefObject<HTMLElement>;
  let floatingRef: React.RefObject<HTMLElement>;
  let mockOnClickOutside: jest.Mock;
  let triggerElement: HTMLElement;
  let floatingElement: HTMLElement;

  beforeEach(() => {
    // 创建 mock DOM 元素
    triggerElement = document.createElement('div');
    floatingElement = document.createElement('div');

    // 创建 refs
    triggerRef = { current: triggerElement };
    floatingRef = { current: floatingElement };

    // 创建 mock 函数
    mockOnClickOutside = jest.fn();

    // 添加元素到 DOM
    document.body.appendChild(triggerElement);
    document.body.appendChild(floatingElement);
  });

  afterEach(() => {
    // 清理 DOM
    if (triggerElement.parentNode) {
      triggerElement.parentNode.removeChild(triggerElement);
    }
    if (floatingElement.parentNode) {
      floatingElement.parentNode.removeChild(floatingElement);
    }

    // 重置 mock
    mockOnClickOutside.mockClear();
  });

  it('should not add event listener when isActive is false', () => {
    const triggerRef = { current: document.createElement('div') };
    const floatingRef = { current: document.createElement('div') };
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    renderHook(() =>
      useClickOutside({
        isActive: false,
        onClickOutside: mockOnClickOutside,
        triggerRef,
        floatingRef,
      })
    );

    // 检查我们的点击事件监听器是否没有被添加
    // 忽略React可能添加的其他事件监听器（如selectionchange）
    const clickEvents = addEventListenerSpy.mock.calls.filter(call => call[0] === 'click');
    expect(clickEvents).toHaveLength(0);

    addEventListenerSpy.mockRestore();
  });
  it('should add event listener when isActive is true', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

    renderHook(() =>
      useClickOutside({
        isActive: true,
        triggerRef,
        floatingRef,
        onClickOutside: mockOnClickOutside,
      })
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    addEventListenerSpy.mockRestore();
  });

  it('should remove event listener on cleanup', () => {
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useClickOutside({
        isActive: true,
        triggerRef,
        floatingRef,
        onClickOutside: mockOnClickOutside,
      })
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('should call onClickOutside when clicking outside both elements', () => {
    renderHook(() =>
      useClickOutside({
        isActive: true,
        triggerRef,
        floatingRef,
        onClickOutside: mockOnClickOutside,
      })
    );

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement });
      document.dispatchEvent(event);
    });

    expect(mockOnClickOutside).toHaveBeenCalledTimes(1);

    document.body.removeChild(outsideElement);
  });

  it('should not call onClickOutside when clicking on trigger element', () => {
    renderHook(() =>
      useClickOutside({
        isActive: true,
        triggerRef,
        floatingRef,
        onClickOutside: mockOnClickOutside,
      })
    );

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: triggerElement });
      document.dispatchEvent(event);
    });

    expect(mockOnClickOutside).not.toHaveBeenCalled();
  });

  it('should not call onClickOutside when clicking on floating element', () => {
    renderHook(() =>
      useClickOutside({
        isActive: true,
        triggerRef,
        floatingRef,
        onClickOutside: mockOnClickOutside,
      })
    );

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: floatingElement });
      document.dispatchEvent(event);
    });

    expect(mockOnClickOutside).not.toHaveBeenCalled();
  });

  it('should not call onClickOutside when clicking on child of trigger element', () => {
    const childElement = document.createElement('span');
    triggerElement.appendChild(childElement);

    renderHook(() =>
      useClickOutside({
        isActive: true,
        triggerRef,
        floatingRef,
        onClickOutside: mockOnClickOutside,
      })
    );

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: childElement });
      document.dispatchEvent(event);
    });

    expect(mockOnClickOutside).not.toHaveBeenCalled();
  });

  it('should not call onClickOutside when clicking on child of floating element', () => {
    const childElement = document.createElement('span');
    floatingElement.appendChild(childElement);

    renderHook(() =>
      useClickOutside({
        isActive: true,
        triggerRef,
        floatingRef,
        onClickOutside: mockOnClickOutside,
      })
    );

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: childElement });
      document.dispatchEvent(event);
    });

    expect(mockOnClickOutside).not.toHaveBeenCalled();
  });

  it('should handle missing onClickOutside callback gracefully', () => {
    renderHook(() =>
      useClickOutside({
        isActive: true,
        triggerRef,
        floatingRef,
      })
    );

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    expect(() => {
      act(() => {
        const event = new MouseEvent('mousedown', { bubbles: true });
        Object.defineProperty(event, 'target', { value: outsideElement });
        document.dispatchEvent(event);
      });
    }).not.toThrow();

    document.body.removeChild(outsideElement);
  });

  it('should handle null refs gracefully', () => {
    const nullTriggerRef = { current: null };
    const nullFloatingRef = { current: null };

    renderHook(() =>
      useClickOutside({
        isActive: true,
        triggerRef: nullTriggerRef,
        floatingRef: nullFloatingRef,
        onClickOutside: mockOnClickOutside,
      })
    );

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true });
      Object.defineProperty(event, 'target', { value: outsideElement });
      document.dispatchEvent(event);
    });

    expect(mockOnClickOutside).not.toHaveBeenCalled();

    document.body.removeChild(outsideElement);
  });
});
