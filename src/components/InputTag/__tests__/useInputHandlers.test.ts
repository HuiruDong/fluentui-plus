import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useInputHandlers } from '../hooks/useInputHandlers';

describe('useInputHandlers', () => {
  const mockProps = {
    addTag: jest.fn(() => true),
    removeTag: jest.fn(() => true),
    addMultipleTags: jest.fn(() => 2),
    getCurrentTags: jest.fn(() => ['existing']),
    isDeleting: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty input value and unfocused state', () => {
    const { result } = renderHook(() => useInputHandlers(mockProps));

    expect(result.current.inputValue).toBe('');
    expect(result.current.isFocused).toBe(false);
  });

  it('updates input value on change', () => {
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

  it('handles delimiter in input change - string delimiter', () => {
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

  it('handles delimiter in input change - regex delimiter', () => {
    const onInputChange = jest.fn();
    const { result } = renderHook(() => useInputHandlers({ ...mockProps, onInputChange, delimiter: /[,;]/ }));

    const mockEvent = {
      target: { value: 'tag1,tag2;tag3,remaining' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleInputChange(mockEvent);
    });

    expect(mockProps.addMultipleTags).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);
    expect(result.current.inputValue).toBe('remaining');
  });

  it('handles Enter key to add tag', () => {
    const { result } = renderHook(() => useInputHandlers(mockProps));

    // Set input value first
    const changeEvent = {
      target: { value: 'new tag' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleInputChange(changeEvent);
    });

    const keyEvent = {
      key: 'Enter',
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.handleKeyDown(keyEvent);
    });

    expect(keyEvent.preventDefault).toHaveBeenCalled();
    expect(mockProps.addTag).toHaveBeenCalledWith('new tag');
    expect(result.current.inputValue).toBe('');
  });

  it('handles Backspace key to remove last tag when input is empty', () => {
    const { result } = renderHook(() => useInputHandlers(mockProps));

    const keyEvent = {
      key: 'Backspace',
    } as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.handleKeyDown(keyEvent);
    });

    expect(mockProps.removeTag).toHaveBeenCalledWith(0); // removes last tag (index 0 for ['existing'])
  });

  it('does not remove tag on Backspace when input has value', () => {
    const { result } = renderHook(() => useInputHandlers(mockProps));

    // Set input value first
    const changeEvent = {
      target: { value: 'some text' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleInputChange(changeEvent);
    });

    const keyEvent = {
      key: 'Backspace',
    } as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.handleKeyDown(keyEvent);
    });

    expect(mockProps.removeTag).not.toHaveBeenCalled();
  });

  it('does not remove tag on Backspace when no tags exist', () => {
    const propsWithNoTags = {
      ...mockProps,
      getCurrentTags: jest.fn(() => []),
    };

    const { result } = renderHook(() => useInputHandlers(propsWithNoTags));

    const keyEvent = {
      key: 'Backspace',
    } as React.KeyboardEvent<HTMLInputElement>;

    act(() => {
      result.current.handleKeyDown(keyEvent);
    });

    expect(mockProps.removeTag).not.toHaveBeenCalled();
  });

  it('handles paste event with delimiter - string', () => {
    const { result } = renderHook(() => useInputHandlers({ ...mockProps, delimiter: ',' }));

    const pasteEvent = {
      clipboardData: {
        getData: jest.fn(() => 'tag1,tag2,tag3'),
      },
      preventDefault: jest.fn(),
    } as unknown as React.ClipboardEvent<HTMLInputElement>;

    act(() => {
      result.current.handlePaste(pasteEvent);
    });

    expect(pasteEvent.preventDefault).toHaveBeenCalled();
    expect(mockProps.addMultipleTags).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);
    expect(result.current.inputValue).toBe('');
  });

  it('handles paste event with delimiter - regex', () => {
    const { result } = renderHook(() => useInputHandlers({ ...mockProps, delimiter: /[,;]/ }));

    const pasteEvent = {
      clipboardData: {
        getData: jest.fn(() => 'tag1,tag2;tag3'),
      },
      preventDefault: jest.fn(),
    } as unknown as React.ClipboardEvent<HTMLInputElement>;

    act(() => {
      result.current.handlePaste(pasteEvent);
    });

    expect(pasteEvent.preventDefault).toHaveBeenCalled();
    expect(mockProps.addMultipleTags).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);
  });

  it('does not prevent default on paste when no delimiter', () => {
    const { result } = renderHook(() => useInputHandlers(mockProps));

    const pasteEvent = {
      clipboardData: {
        getData: jest.fn(() => 'tag1,tag2,tag3'),
      },
      preventDefault: jest.fn(),
    } as unknown as React.ClipboardEvent<HTMLInputElement>;

    act(() => {
      result.current.handlePaste(pasteEvent);
    });

    expect(pasteEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockProps.addMultipleTags).not.toHaveBeenCalled();
  });

  it('handles container blur to set unfocused state', () => {
    const { result } = renderHook(() => useInputHandlers(mockProps));

    // Set focused first
    act(() => {
      result.current.setIsFocused(true);
    });

    expect(result.current.isFocused).toBe(true);

    const blurEvent = {
      currentTarget: document.createElement('div'),
      relatedTarget: document.createElement('div'),
    } as unknown as React.FocusEvent<HTMLDivElement>;

    act(() => {
      result.current.handleContainerBlur(blurEvent);
    });

    expect(result.current.isFocused).toBe(false);
  });

  it('adds tag on container blur when input has value', () => {
    const { result } = renderHook(() => useInputHandlers(mockProps));

    // Set input value first
    const changeEvent = {
      target: { value: 'blur tag' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleInputChange(changeEvent);
    });

    const blurEvent = {
      currentTarget: document.createElement('div'),
      relatedTarget: document.createElement('div'),
    } as unknown as React.FocusEvent<HTMLDivElement>;

    act(() => {
      result.current.handleContainerBlur(blurEvent);
    });

    expect(mockProps.addTag).toHaveBeenCalledWith('blur tag');
    expect(result.current.inputValue).toBe('');
  });

  it('does not add tag on container blur when isDeleting is true', () => {
    const propsWithDeleting = {
      ...mockProps,
      isDeleting: true,
    };

    const { result } = renderHook(() => useInputHandlers(propsWithDeleting));

    // Set input value first
    const changeEvent = {
      target: { value: 'should not add' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleInputChange(changeEvent);
    });

    const blurEvent = {
      currentTarget: document.createElement('div'),
      relatedTarget: document.createElement('div'),
    } as unknown as React.FocusEvent<HTMLDivElement>;

    act(() => {
      result.current.handleContainerBlur(blurEvent);
    });

    expect(mockProps.addTag).not.toHaveBeenCalled();
  });

  it('does not blur when focus moves within container', () => {
    const { result } = renderHook(() => useInputHandlers(mockProps));

    act(() => {
      result.current.setIsFocused(true);
    });

    const container = document.createElement('div');
    const child = document.createElement('input');
    container.appendChild(child);

    const blurEvent = {
      currentTarget: container,
      relatedTarget: child,
    } as unknown as React.FocusEvent<HTMLDivElement>;

    act(() => {
      result.current.handleContainerBlur(blurEvent);
    });

    // Should remain focused since focus moved to child element
    expect(result.current.isFocused).toBe(true);
  });

  it('allows setting focused state manually', () => {
    const { result } = renderHook(() => useInputHandlers(mockProps));

    expect(result.current.isFocused).toBe(false);

    act(() => {
      result.current.setIsFocused(true);
    });

    expect(result.current.isFocused).toBe(true);

    act(() => {
      result.current.setIsFocused(false);
    });

    expect(result.current.isFocused).toBe(false);
  });

  it('handles empty paste content gracefully', () => {
    const { result } = renderHook(() => useInputHandlers({ ...mockProps, delimiter: ',' }));

    const pasteEvent = {
      clipboardData: {
        getData: jest.fn(() => ''),
      },
      preventDefault: jest.fn(),
    } as unknown as React.ClipboardEvent<HTMLInputElement>;

    act(() => {
      result.current.handlePaste(pasteEvent);
    });

    expect(pasteEvent.preventDefault).toHaveBeenCalled();
    expect(mockProps.addMultipleTags).toHaveBeenCalledWith([]);
  });

  it('trims whitespace in delimiter parsing', () => {
    const onInputChange = jest.fn();
    const { result } = renderHook(() => useInputHandlers({ ...mockProps, onInputChange, delimiter: ',' }));

    const mockEvent = {
      target: { value: '  tag1  ,  tag2  ,  ' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleInputChange(mockEvent);
    });

    expect(mockProps.addMultipleTags).toHaveBeenCalledWith(['tag1', 'tag2']);
    expect(result.current.inputValue).toBe('  ');
  });
});
