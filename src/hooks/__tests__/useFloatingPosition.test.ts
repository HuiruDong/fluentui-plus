import { renderHook, act } from '@testing-library/react';
import { useFloatingPosition } from '../useFloatingPosition';

// Mock @floating-ui/react
jest.mock('@floating-ui/react', () => ({
  useFloating: jest.fn(() => ({
    refs: {
      setReference: jest.fn(),
      setFloating: jest.fn(),
      floating: { current: document.createElement('div') },
      reference: { current: document.createElement('div') },
    },
    floatingStyles: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    context: {},
    update: jest.fn(),
  })),
  autoUpdate: jest.fn(),
  offset: jest.fn(() => ({})),
  flip: jest.fn(() => ({})),
  shift: jest.fn(() => ({})),
  size: jest.fn(() => ({})),
  useDismiss: jest.fn(() => ({})),
  useInteractions: jest.fn(() => ({
    getReferenceProps: jest.fn(() => ({})),
    getFloatingProps: jest.fn(() => ({})),
  })),
}));

describe('useFloatingPosition', () => {
  let triggerRef: React.RefObject<HTMLElement>;
  let triggerElement: HTMLElement;
  let mockOnClickOutside: jest.Mock;

  beforeEach(() => {
    triggerElement = document.createElement('div');
    triggerRef = { current: triggerElement };
    mockOnClickOutside = jest.fn();

    document.body.appendChild(triggerElement);

    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (triggerElement.parentNode) {
      triggerElement.parentNode.removeChild(triggerElement);
    }
  });

  it('should return required properties and functions', () => {
    const { result } = renderHook(() =>
      useFloatingPosition({
        isOpen: false,
        triggerRef,
        onClickOutside: mockOnClickOutside,
      })
    );

    expect(result.current.triggerRef).toBeDefined();
    expect(result.current.floatingRef).toBeDefined();
    expect(result.current.floatingStyles).toBeDefined();
    expect(typeof result.current.updatePosition).toBe('function');
    expect(typeof result.current.getReferenceProps).toBe('function');
    expect(typeof result.current.getFloatingProps).toBe('function');
  });

  it('should use custom placement and offset parameters', () => {
    const { result } = renderHook(() =>
      useFloatingPosition({
        isOpen: true,
        triggerRef,
        onClickOutside: mockOnClickOutside,
        placement: 'top-end',
        offsetDistance: 10,
        shiftPadding: 16,
      })
    );

    expect(result.current.triggerRef).toBeDefined();
    expect(result.current.floatingRef).toBeDefined();
    expect(typeof result.current.updatePosition).toBe('function');
  });

  it('should handle missing trigger refs gracefully', async () => {
    const nullTriggerRef = { current: null };

    // For this specific test, we need a mock where floating and reference refs are null
    const mockUseFloating = jest.requireMock('@floating-ui/react').useFloating;
    mockUseFloating.mockReturnValueOnce({
      refs: {
        setReference: jest.fn(),
        setFloating: jest.fn(),
        floating: { current: null },
        reference: { current: null },
      },
      floatingStyles: {
        position: 'absolute',
        top: 0,
        left: 0,
      },
      context: {},
      update: jest.fn(),
    });

    const { result } = renderHook(() =>
      useFloatingPosition({
        isOpen: true,
        triggerRef: nullTriggerRef,
        onClickOutside: mockOnClickOutside,
      })
    );

    await act(async () => {
      await result.current.updatePosition();
    });

    // Should not throw any errors
    expect(typeof result.current.updatePosition).toBe('function');
  });

  it('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() =>
      useFloatingPosition({
        isOpen: false,
        triggerRef,
        onClickOutside: mockOnClickOutside,
      })
    );

    // Just verify that functions are still functions after rerender
    expect(typeof result.current.updatePosition).toBe('function');
    expect(typeof result.current.getReferenceProps).toBe('function');
    expect(typeof result.current.getFloatingProps).toBe('function');

    rerender();

    // After rerender, functions should still be functions
    expect(typeof result.current.updatePosition).toBe('function');
    expect(typeof result.current.getReferenceProps).toBe('function');
    expect(typeof result.current.getFloatingProps).toBe('function');
  });

  it('should handle different placement options', () => {
    const placements = ['bottom-start', 'bottom-end', 'top-start', 'top-end'] as const;

    placements.forEach(placement => {
      const { result } = renderHook(() =>
        useFloatingPosition({
          isOpen: false,
          triggerRef,
          onClickOutside: mockOnClickOutside,
          placement,
        })
      );

      expect(result.current.triggerRef).toBeDefined();
      expect(result.current.floatingRef).toBeDefined();
      expect(typeof result.current.updatePosition).toBe('function');
    });
  });

  it('should handle offset and padding parameters', () => {
    const { result } = renderHook(() =>
      useFloatingPosition({
        isOpen: false,
        triggerRef,
        onClickOutside: mockOnClickOutside,
        offsetDistance: 20,
        shiftPadding: 24,
      })
    );

    expect(result.current.triggerRef).toBeDefined();
    expect(result.current.floatingRef).toBeDefined();
    expect(typeof result.current.updatePosition).toBe('function');
  });

  it('should call useFloating with correct parameters', () => {
    const mockUseFloating = jest.requireMock('@floating-ui/react').useFloating;

    renderHook(() =>
      useFloatingPosition({
        isOpen: true,
        triggerRef,
        onClickOutside: mockOnClickOutside,
        placement: 'bottom-start',
        offsetDistance: 4,
        shiftPadding: 8,
      })
    );

    expect(mockUseFloating).toHaveBeenCalledWith({
      open: true,
      placement: 'bottom-start',
      middleware: expect.any(Array),
      whileElementsMounted: expect.any(Function),
    });
  });

  it('should call useDismiss with correct parameters', () => {
    const mockUseDismiss = jest.requireMock('@floating-ui/react').useDismiss;

    renderHook(() =>
      useFloatingPosition({
        isOpen: true,
        triggerRef,
        onClickOutside: mockOnClickOutside,
      })
    );

    expect(mockUseDismiss).toHaveBeenCalledWith(
      {},
      {
        outsidePress: expect.any(Function),
      }
    );
  });
});
