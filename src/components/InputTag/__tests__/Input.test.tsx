import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Input from '../Input';

describe('Input', () => {
  it('renders correctly with default props', () => {
    const inputRef = createRef<HTMLInputElement>();
    const mockFn = jest.fn();

    render(
      <Input
        value=''
        inputRef={inputRef}
        onChange={mockFn}
        onKeyDown={mockFn}
        onFocus={mockFn}
        onBlur={mockFn}
        onPaste={mockFn}
      />
    );

    const input = document.querySelector('.mm-input-tag__input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('renders with placeholder', () => {
    const inputRef = createRef<HTMLInputElement>();
    const mockFn = jest.fn();
    const placeholder = 'Enter text here';

    render(
      <Input
        value=''
        placeholder={placeholder}
        inputRef={inputRef}
        onChange={mockFn}
        onKeyDown={mockFn}
        onFocus={mockFn}
        onBlur={mockFn}
        onPaste={mockFn}
      />
    );

    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toBeInTheDocument();
  });

  it('renders with value', () => {
    const inputRef = createRef<HTMLInputElement>();
    const mockFn = jest.fn();
    const value = 'test value';

    render(
      <Input
        value={value}
        inputRef={inputRef}
        onChange={mockFn}
        onKeyDown={mockFn}
        onFocus={mockFn}
        onBlur={mockFn}
        onPaste={mockFn}
      />
    );

    const input = document.querySelector('.mm-input-tag__input') as HTMLInputElement;
    expect(input.value).toBe(value);
  });

  it('renders as disabled when disabled prop is true', () => {
    const inputRef = createRef<HTMLInputElement>();
    const mockFn = jest.fn();

    render(
      <Input
        value=''
        disabled
        placeholder='Disabled input'
        inputRef={inputRef}
        onChange={mockFn}
        onKeyDown={mockFn}
        onFocus={mockFn}
        onBlur={mockFn}
        onPaste={mockFn}
      />
    );

    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
  });

  it('calls onChange when input value changes', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    const handleChange = jest.fn();
    const mockFn = jest.fn();

    render(
      <Input
        value=''
        placeholder='Type here'
        inputRef={inputRef}
        onChange={handleChange}
        onKeyDown={mockFn}
        onFocus={mockFn}
        onBlur={mockFn}
        onPaste={mockFn}
      />
    );

    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'test');

    expect(handleChange).toHaveBeenCalledTimes(4); // 't', 'e', 's', 't'
  });

  it('calls onKeyDown when key is pressed', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    const handleKeyDown = jest.fn();
    const mockFn = jest.fn();

    render(
      <Input
        value=''
        placeholder='Type here'
        inputRef={inputRef}
        onChange={mockFn}
        onKeyDown={handleKeyDown}
        onFocus={mockFn}
        onBlur={mockFn}
        onPaste={mockFn}
      />
    );

    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, '{Enter}');

    expect(handleKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'Enter',
      })
    );
  });

  it('calls onFocus when input is focused', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    const handleFocus = jest.fn();
    const mockFn = jest.fn();

    render(
      <Input
        value=''
        placeholder='Type here'
        inputRef={inputRef}
        onChange={mockFn}
        onKeyDown={mockFn}
        onFocus={handleFocus}
        onBlur={mockFn}
        onPaste={mockFn}
      />
    );

    const input = screen.getByPlaceholderText('Type here');
    await user.click(input);

    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it('calls onBlur when input loses focus', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    const handleBlur = jest.fn();
    const mockFn = jest.fn();

    render(
      <Input
        value=''
        placeholder='Type here'
        inputRef={inputRef}
        onChange={mockFn}
        onKeyDown={mockFn}
        onFocus={mockFn}
        onBlur={handleBlur}
        onPaste={mockFn}
      />
    );

    const input = screen.getByPlaceholderText('Type here');
    await user.click(input);
    await user.click(document.body);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('calls onPaste when content is pasted', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    const handlePaste = jest.fn();
    const mockFn = jest.fn();

    render(
      <Input
        value=''
        placeholder='Type here'
        inputRef={inputRef}
        onChange={mockFn}
        onKeyDown={mockFn}
        onFocus={mockFn}
        onBlur={mockFn}
        onPaste={handlePaste}
      />
    );

    const input = screen.getByPlaceholderText('Type here');

    // Use userEvent.paste to simulate paste action more realistically
    await user.click(input);
    await user.paste('pasted content');

    expect(handlePaste).toHaveBeenCalledTimes(1);
    expect(handlePaste).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'paste',
      })
    );
  });

  it('applies correct CSS class', () => {
    const inputRef = createRef<HTMLInputElement>();
    const mockFn = jest.fn();

    render(
      <Input
        value=''
        inputRef={inputRef}
        onChange={mockFn}
        onKeyDown={mockFn}
        onFocus={mockFn}
        onBlur={mockFn}
        onPaste={mockFn}
      />
    );

    const input = document.querySelector('.mm-input-tag__input');
    expect(input).toHaveClass('mm-input-tag__input');
  });

  it('properly sets input ref', () => {
    const inputRef = createRef<HTMLInputElement>();
    const mockFn = jest.fn();

    render(
      <Input
        value=''
        inputRef={inputRef}
        onChange={mockFn}
        onKeyDown={mockFn}
        onFocus={mockFn}
        onBlur={mockFn}
        onPaste={mockFn}
      />
    );

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
    expect(inputRef.current).toHaveClass('mm-input-tag__input');
  });

  it('handles different keyboard events', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    const handleKeyDown = jest.fn();
    const mockFn = jest.fn();

    render(
      <Input
        value=''
        placeholder='Type here'
        inputRef={inputRef}
        onChange={mockFn}
        onKeyDown={handleKeyDown}
        onFocus={mockFn}
        onBlur={mockFn}
        onPaste={mockFn}
      />
    );

    const input = screen.getByPlaceholderText('Type here');

    // Test different keys
    await user.type(input, '{Enter}');
    expect(handleKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter' }));

    handleKeyDown.mockClear();

    await user.type(input, '{Tab}');
    expect(handleKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Tab' }));

    handleKeyDown.mockClear();

    await user.type(input, '{Backspace}');
    expect(handleKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Backspace' }));
  });

  it('does not call event handlers when disabled', async () => {
    const user = userEvent.setup();
    const inputRef = createRef<HTMLInputElement>();
    const handleChange = jest.fn();
    const handleKeyDown = jest.fn();
    const handleFocus = jest.fn();

    render(
      <Input
        value=''
        disabled
        placeholder='Disabled input'
        inputRef={inputRef}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={jest.fn()}
        onPaste={jest.fn()}
      />
    );

    const input = screen.getByPlaceholderText('Disabled input');

    // Try to interact with disabled input
    await user.click(input);
    await user.type(input, 'test');

    expect(handleFocus).not.toHaveBeenCalled();
    expect(handleChange).not.toHaveBeenCalled();
    expect(handleKeyDown).not.toHaveBeenCalled();
  });
});
