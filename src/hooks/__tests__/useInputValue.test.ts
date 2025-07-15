import { renderHook, act } from '@testing-library/react';
import { useInputValue } from '../useInputValue';

describe('useInputValue', () => {
  it('should manage input value correctly', () => {
    const onInputChange = jest.fn();
    const { result } = renderHook(() =>
      useInputValue({
        initialValue: 'initial',
        onInputChange,
      })
    );

    // 初始状态
    expect(result.current.inputValue).toBe('initial');
    expect(result.current.isFocused).toBe(false);

    // 设置输入值（不会自动触发 onInputChange）
    act(() => {
      result.current.setInputValue('new value');
    });

    expect(result.current.inputValue).toBe('new value');
    expect(onInputChange).not.toHaveBeenCalled();

    // 设置焦点状态
    act(() => {
      result.current.setIsFocused(true);
    });

    expect(result.current.isFocused).toBe(true);

    // 清除输入（会触发 onInputChange）
    act(() => {
      result.current.clearInput();
    });

    expect(result.current.inputValue).toBe('');
    expect(onInputChange).toHaveBeenCalledWith('');
  });

  it('should handle input change events', () => {
    const onInputChange = jest.fn();
    const { result } = renderHook(() =>
      useInputValue({
        onInputChange,
      })
    );

    // 模拟输入事件
    const mockEvent = {
      target: { value: 'test input' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleInputChange(mockEvent);
    });

    expect(result.current.inputValue).toBe('test input');
    expect(onInputChange).toHaveBeenCalledWith('test input');
  });
});
