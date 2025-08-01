import { renderHook, act } from '@testing-library/react';
import { useSelectState } from '../../hooks/useSelectState';

describe('useSelectState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useSelectState());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.focusedIndex).toBe(-1);
  });

  it('should use controlled open state when provided', () => {
    const { result } = renderHook(() => useSelectState({ open: true }));

    expect(result.current.isOpen).toBe(true);
  });

  it('should toggle internal open state in uncontrolled mode', () => {
    const { result } = renderHook(() => useSelectState());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggleOpen();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggleOpen();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should not toggle when in controlled mode', () => {
    const { result } = renderHook(() => useSelectState({ open: false }));

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggleOpen();
    });

    // Should remain false since it's controlled
    expect(result.current.isOpen).toBe(false);
  });

  it('should open dropdown in uncontrolled mode', () => {
    const { result } = renderHook(() => useSelectState());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.openDropdown();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('should not open dropdown when in controlled mode', () => {
    const { result } = renderHook(() => useSelectState({ open: false }));

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.openDropdown();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should close dropdown in uncontrolled mode', () => {
    const { result } = renderHook(() => useSelectState());

    // First open it
    act(() => {
      result.current.openDropdown();
    });

    expect(result.current.isOpen).toBe(true);

    // Then close it
    act(() => {
      result.current.closeDropdown();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('should not close dropdown when in controlled mode', () => {
    const { result } = renderHook(() => useSelectState({ open: true }));

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.closeDropdown();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('should manage focused index', () => {
    const { result } = renderHook(() => useSelectState());

    expect(result.current.focusedIndex).toBe(-1);

    act(() => {
      result.current.setFocusedIndex(2);
    });

    expect(result.current.focusedIndex).toBe(2);

    act(() => {
      result.current.setFocusedIndex(5);
    });

    expect(result.current.focusedIndex).toBe(5);
  });

  it('should reset focused index', () => {
    const { result } = renderHook(() => useSelectState());

    // Set some focused index
    act(() => {
      result.current.setFocusedIndex(3);
    });

    expect(result.current.focusedIndex).toBe(3);

    // Reset it
    act(() => {
      result.current.resetFocusedIndex();
    });

    expect(result.current.focusedIndex).toBe(-1);
  });

  it('should update controlled state when open prop changes', () => {
    const { result, rerender } = renderHook(({ open }) => useSelectState({ open }), { initialProps: { open: false } });

    expect(result.current.isOpen).toBe(false);

    // Change the prop
    rerender({ open: true });

    expect(result.current.isOpen).toBe(true);

    // Change back
    rerender({ open: false });

    expect(result.current.isOpen).toBe(false);
  });

  it('should maintain stable function references', () => {
    const { result, rerender } = renderHook(() => useSelectState());

    const initialFunctions = {
      toggleOpen: result.current.toggleOpen,
      openDropdown: result.current.openDropdown,
      closeDropdown: result.current.closeDropdown,
      setFocusedIndex: result.current.setFocusedIndex,
      resetFocusedIndex: result.current.resetFocusedIndex,
    };

    rerender();

    // Functions should be the same reference
    expect(result.current.toggleOpen).toBe(initialFunctions.toggleOpen);
    expect(result.current.openDropdown).toBe(initialFunctions.openDropdown);
    expect(result.current.closeDropdown).toBe(initialFunctions.closeDropdown);
    expect(result.current.setFocusedIndex).toBe(initialFunctions.setFocusedIndex);
    expect(result.current.resetFocusedIndex).toBe(initialFunctions.resetFocusedIndex);
  });
});
