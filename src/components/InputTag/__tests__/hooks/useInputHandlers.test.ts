import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useInputHandlers } from '../../hooks/useInputHandlers';

describe('useInputHandlers Hook', () => {
  const mockProps = {
    addTag: jest.fn(() => true),
    removeTag: jest.fn(() => true),
    addMultipleTags: jest.fn(() => 2),
    getCurrentTags: jest.fn(() => ['existing']),
    isDeleting: false,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('初始状态', () => {
    it('should initialize with empty input value and unfocused state', () => {
      const { result } = renderHook(() => useInputHandlers(mockProps));

      expect(result.current.inputValue).toBe('');
      expect(result.current.isFocused).toBe(false);
    });
  });

  describe('输入处理', () => {
    it('should update input value on change', () => {
      const onInputChange = jest.fn();
      const { result } = renderHook(() => useInputHandlers({ ...mockProps, onInputChange }));

      const mockEvent = {
        target: { value: 'test input' },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleInputChange(mockEvent);
      });

      expect(result.current.inputValue).toBe('test input');
      expect(onInputChange).toHaveBeenCalledWith('test input');
    });

    it('should handle string delimiter in input change', () => {
      const onInputChange = jest.fn();
      const { result } = renderHook(() => useInputHandlers({ ...mockProps, onInputChange, delimiter: ',' }));

      const mockEvent = {
        target: { value: 'tag1,tag2,remaining' },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleInputChange(mockEvent);
      });

      expect(mockProps.addMultipleTags).toHaveBeenCalledWith(['tag1', 'tag2']);
      expect(result.current.inputValue).toBe('remaining');
      expect(onInputChange).toHaveBeenCalledWith('remaining');
    });

    it('should handle regex delimiter in input change', () => {
      const onInputChange = jest.fn();
      const { result } = renderHook(() => useInputHandlers({ ...mockProps, onInputChange, delimiter: /[,;]/ }));

      const mockEvent = {
        target: { value: 'tag1,tag2;remaining' },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleInputChange(mockEvent);
      });

      expect(mockProps.addMultipleTags).toHaveBeenCalledWith(['tag1', 'tag2']);
      expect(result.current.inputValue).toBe('remaining');
    });
  });

  describe('键盘事件处理', () => {
    it('should add tag on Enter key press', () => {
      const { result } = renderHook(() => useInputHandlers(mockProps));

      // Set input value first
      act(() => {
        result.current.handleInputChange({
          target: { value: 'new tag' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      const mockEvent = {
        key: 'Enter',
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockProps.addTag).toHaveBeenCalledWith('new tag');
      expect(result.current.inputValue).toBe('');
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should add tag on Tab key press (via blur)', () => {
      const { result } = renderHook(() => useInputHandlers(mockProps));

      // Set input value first
      act(() => {
        result.current.handleInputChange({
          target: { value: 'new tag' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      // 模拟 Tab 键引发的失焦行为
      const mockBlurEvent = {
        currentTarget: document.createElement('div'),
        relatedTarget: document.createElement('button'), // Tab 键会聚焦到其他元素
      } as unknown as React.FocusEvent<HTMLDivElement>;

      act(() => {
        result.current.handleContainerBlur(mockBlurEvent);
      });

      expect(mockProps.addTag).toHaveBeenCalledWith('new tag');
      expect(result.current.inputValue).toBe('');
      expect(result.current.isFocused).toBe(false);
    });

    it('should remove last tag on Backspace when input is empty', () => {
      const { result } = renderHook(() => useInputHandlers(mockProps));

      const mockEvent = {
        key: 'Backspace',
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockProps.removeTag).toHaveBeenCalledWith(0); // Remove last tag
    });

    it('should not remove tag on Backspace when input has value', () => {
      const { result } = renderHook(() => useInputHandlers(mockProps));

      // Set input value first
      act(() => {
        result.current.handleInputChange({
          target: { value: 'some text' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      const mockEvent = {
        key: 'Backspace',
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockProps.removeTag).not.toHaveBeenCalled();
    });

    it('should not add empty tag', () => {
      const { result } = renderHook(() => useInputHandlers(mockProps));

      const mockEvent = {
        key: 'Enter',
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockProps.addTag).not.toHaveBeenCalled();
    });
  });

  describe('焦点状态管理', () => {
    it('should set focused state manually', () => {
      const { result } = renderHook(() => useInputHandlers(mockProps));

      act(() => {
        result.current.setIsFocused(true);
      });

      expect(result.current.isFocused).toBe(true);
    });

    it('should clear focused state on container blur', () => {
      const { result } = renderHook(() => useInputHandlers(mockProps));

      // Set focused first
      act(() => {
        result.current.setIsFocused(true);
      });

      expect(result.current.isFocused).toBe(true);

      const mockEvent = {
        currentTarget: {
          contains: jest.fn().mockReturnValue(false),
        },
        relatedTarget: document.body,
      } as unknown as React.FocusEvent<HTMLDivElement>;

      act(() => {
        result.current.handleContainerBlur(mockEvent);
      });

      expect(result.current.isFocused).toBe(false);
    });

    it('should add tag on container blur if input has value', () => {
      const { result } = renderHook(() => useInputHandlers(mockProps));

      // Set input value first
      act(() => {
        result.current.handleInputChange({
          target: { value: 'tag on blur' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      const mockEvent = {
        currentTarget: {
          contains: jest.fn().mockReturnValue(false),
        },
        relatedTarget: document.body,
      } as unknown as React.FocusEvent<HTMLDivElement>;

      act(() => {
        result.current.handleContainerBlur(mockEvent);
      });

      expect(mockProps.addTag).toHaveBeenCalledWith('tag on blur');
      expect(result.current.inputValue).toBe('');
    });
  });

  describe('粘贴事件处理', () => {
    it('should handle paste with delimiter', () => {
      const { result } = renderHook(() => useInputHandlers({ ...mockProps, delimiter: ',' }));

      const mockEvent = {
        clipboardData: {
          getData: jest.fn().mockReturnValue('tag1,tag2,tag3'),
        },
        preventDefault: jest.fn(),
      } as unknown as React.ClipboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePaste(mockEvent);
      });

      expect(mockProps.addMultipleTags).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should not handle paste without delimiter', () => {
      const { result } = renderHook(() => useInputHandlers(mockProps));

      const mockEvent = {
        clipboardData: {
          getData: jest.fn().mockReturnValue('tag1,tag2,tag3'),
        },
        preventDefault: jest.fn(),
      } as unknown as React.ClipboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePaste(mockEvent);
      });

      expect(mockProps.addMultipleTags).not.toHaveBeenCalled();
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should handle paste with regex delimiter', () => {
      const { result } = renderHook(() => useInputHandlers({ ...mockProps, delimiter: /[,;]/ }));

      const mockEvent = {
        clipboardData: {
          getData: jest.fn().mockReturnValue('tag1,tag2;tag3'),
        },
        preventDefault: jest.fn(),
      } as unknown as React.ClipboardEvent<HTMLInputElement>;

      act(() => {
        result.current.handlePaste(mockEvent);
      });

      expect(mockProps.addMultipleTags).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });
});
