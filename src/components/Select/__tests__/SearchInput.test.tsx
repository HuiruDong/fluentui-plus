import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchInput from '../SearchInput';

// Mock the Input component from InputTag
jest.mock('../../InputTag/Input', () => {
  const MockInput = React.forwardRef<
    HTMLInputElement,
    {
      inputRef?: React.RefObject<HTMLInputElement>;
      [key: string]: unknown;
    }
  >(({ inputRef, ...props }, ref) => (
    <input ref={(inputRef || ref) as React.LegacyRef<HTMLInputElement>} data-testid='search-input' {...props} />
  ));
  MockInput.displayName = 'MockInput';
  return MockInput;
});

describe('SearchInput', () => {
  const defaultProps = {
    value: '',
    placeholder: 'Search...',
  };

  it('should render input with correct value and placeholder', () => {
    render(<SearchInput {...defaultProps} value='test value' />);

    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('test value');
    expect(input).toHaveAttribute('placeholder', 'Search...');
  });

  it('should call onChange when input value changes', () => {
    const mockOnChange = jest.fn();

    render(<SearchInput {...defaultProps} onChange={mockOnChange} />);

    const input = screen.getByTestId('search-input');

    // 使用 userEvent 或更简单的方式验证
    fireEvent.change(input, { target: { value: 'new value' } });

    // 验证 onChange 被调用
    expect(mockOnChange).toHaveBeenCalled();

    // 验证调用的参数是一个事件对象
    const callArgs = mockOnChange.mock.calls[0];
    expect(callArgs).toHaveLength(1);
    expect(callArgs[0]).toHaveProperty('target');
  });

  it('should call onFocus when input is focused', () => {
    const mockOnFocus = jest.fn();

    render(<SearchInput {...defaultProps} onFocus={mockOnFocus} />);

    const input = screen.getByTestId('search-input');
    fireEvent.focus(input);

    expect(mockOnFocus).toHaveBeenCalled();
  });

  it('should call onBlur when input loses focus', () => {
    const mockOnBlur = jest.fn();

    render(<SearchInput {...defaultProps} onBlur={mockOnBlur} />);

    const input = screen.getByTestId('search-input');
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.any(HTMLInputElement),
      })
    );
  });

  it('should be disabled when disabled prop is true', () => {
    render(<SearchInput {...defaultProps} disabled={true} />);

    const input = screen.getByTestId('search-input');
    expect(input).toBeDisabled();
  });

  it('should not be disabled when disabled prop is false', () => {
    render(<SearchInput {...defaultProps} disabled={false} />);

    const input = screen.getByTestId('search-input');
    expect(input).not.toBeDisabled();
  });

  it('should use provided inputRef', () => {
    const mockRef = React.createRef<HTMLInputElement>();

    render(<SearchInput {...defaultProps} inputRef={mockRef} />);

    expect(mockRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should use local ref when inputRef is not provided', () => {
    render(<SearchInput {...defaultProps} />);

    const input = screen.getByTestId('search-input');
    expect(input).toBeInTheDocument();
  });

  it('should handle missing onChange gracefully', () => {
    expect(() => {
      render(<SearchInput {...defaultProps} />);

      const input = screen.getByTestId('search-input');
      fireEvent.change(input, { target: { value: 'test' } });
    }).not.toThrow();
  });

  it('should handle missing onFocus gracefully', () => {
    expect(() => {
      render(<SearchInput {...defaultProps} />);

      const input = screen.getByTestId('search-input');
      fireEvent.focus(input);
    }).not.toThrow();
  });

  it('should handle missing onBlur gracefully', () => {
    expect(() => {
      render(<SearchInput {...defaultProps} />);

      const input = screen.getByTestId('search-input');
      fireEvent.blur(input);
    }).not.toThrow();
  });

  it('should pass all required props to Input component', () => {
    const mockRef = React.createRef<HTMLInputElement>();
    const mockOnChange = jest.fn();
    const mockOnFocus = jest.fn();
    const mockOnBlur = jest.fn();

    render(
      <SearchInput
        value='test value'
        placeholder='Type here...'
        disabled={true}
        inputRef={mockRef}
        onChange={mockOnChange}
        onFocus={mockOnFocus}
        onBlur={mockOnBlur}
      />
    );

    // The Input component should receive the correct props
    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('test value');
    expect(input).toHaveAttribute('placeholder', 'Type here...');
    expect(input).toBeDisabled();
  });

  it('should pass fixed props to Input component', () => {
    render(<SearchInput {...defaultProps} />);

    const input = screen.getByTestId('search-input');

    // These props should always be passed with fixed values
    expect(input).toHaveStyle({ margin: '0' });
  });

  it('should handle empty value', () => {
    render(<SearchInput {...defaultProps} value='' />);

    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('');
  });

  it('should handle undefined value', () => {
    // Cast to bypass TypeScript check for testing edge case
    const props = { placeholder: 'Search...', value: undefined as unknown as string };
    render(<SearchInput {...props} />);

    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('');
  });

  it('should handle empty placeholder', () => {
    render(<SearchInput value='' placeholder='' />);

    const input = screen.getByTestId('search-input');
    expect(input).toHaveAttribute('placeholder', '');
  });
});
