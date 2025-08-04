import React, { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Input from '../Input';

describe('Input Component', () => {
  const defaultProps = {
    value: '',
    inputRef: createRef<HTMLInputElement>(),
    onChange: jest.fn(),
    onKeyDown: jest.fn(),
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    onPaste: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<Input {...defaultProps} />);

      const input = document.querySelector('.fluentui-plus-input-tag__input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('should render with placeholder', () => {
      const placeholder = 'Enter text here';
      render(<Input {...defaultProps} placeholder={placeholder} />);

      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toBeInTheDocument();
    });

    it('should render with value', () => {
      render(<Input {...defaultProps} value='test value' />);

      const input = screen.getByDisplayValue('test value');
      expect(input).toBeInTheDocument();
    });

    it('should render as disabled when disabled is true', () => {
      render(<Input {...defaultProps} disabled />);

      const input = document.querySelector('.fluentui-plus-input-tag__input');
      expect(input).toBeDisabled();
    });
  });

  describe('事件处理', () => {
    it('should call onChange when input value changes', async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();

      render(<Input {...defaultProps} onChange={onChange} />);
      const input = document.querySelector('.fluentui-plus-input-tag__input') as HTMLInputElement;

      await user.type(input, 'test');

      expect(onChange).toHaveBeenCalledTimes(4);
    });

    it('should call onKeyDown when key is pressed', async () => {
      const user = userEvent.setup();
      const onKeyDown = jest.fn();

      render(<Input {...defaultProps} onKeyDown={onKeyDown} />);
      const input = document.querySelector('.fluentui-plus-input-tag__input') as HTMLInputElement;

      await user.type(input, '{Enter}');

      expect(onKeyDown).toHaveBeenCalled();
    });

    it('should call onFocus when input is focused', async () => {
      const user = userEvent.setup();
      const onFocus = jest.fn();

      render(<Input {...defaultProps} onFocus={onFocus} />);
      const input = document.querySelector('.fluentui-plus-input-tag__input') as HTMLInputElement;

      await user.click(input);

      expect(onFocus).toHaveBeenCalled();
    });

    it('should call onBlur when input loses focus', async () => {
      const user = userEvent.setup();
      const onBlur = jest.fn();

      render(<Input {...defaultProps} onBlur={onBlur} />);
      const input = document.querySelector('.fluentui-plus-input-tag__input') as HTMLInputElement;

      await user.click(input);
      await user.tab();

      expect(onBlur).toHaveBeenCalled();
    });

    it('should call onPaste when content is pasted', async () => {
      const user = userEvent.setup();
      const onPaste = jest.fn();

      render(<Input {...defaultProps} onPaste={onPaste} />);
      const input = document.querySelector('.fluentui-plus-input-tag__input') as HTMLInputElement;

      await user.click(input);
      await user.paste('pasted content');

      expect(onPaste).toHaveBeenCalled();
    });
  });

  describe('引用处理', () => {
    it('should pass ref to input element', () => {
      const inputRef = createRef<HTMLInputElement>();
      render(<Input {...defaultProps} inputRef={inputRef} />);

      expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
      expect(inputRef.current).toHaveClass('fluentui-plus-input-tag__input');
    });
  });
});
