import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import InputTag from '../InputTag';

// Mock子组件
jest.mock('../Input', () => {
  return function MockInput({
    inputRef,
    onChange,
    onKeyDown,
    onFocus,
    onBlur,
    onPaste,
    ...props
  }: {
    inputRef?: React.RefObject<HTMLInputElement>;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    [key: string]: unknown;
  }) {
    return (
      <input
        ref={inputRef}
        className='fluentui-plus-input-tag__input'
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        onPaste={onPaste}
        {...props}
      />
    );
  };
});

jest.mock('../TagList', () => {
  return function MockTagList({
    tags,
    onTagRemove,
    renderTag,
    tagClosable = true,
  }: {
    tags: string[];
    onTagRemove?: (tag: string, index: number) => void;
    renderTag?: (tag: string, index: number, onClose: () => void) => React.ReactNode;
    tagClosable?: boolean;
  }) {
    return (
      <div className='fluentui-plus-input-tag__tags'>
        {tags.map((tag: string, index: number) => {
          if (renderTag) {
            return renderTag(tag, index, () => onTagRemove?.(tag, index));
          }
          return (
            <span key={index} className='fluentui-plus-tag'>
              {tag}
              {tagClosable && (
                <span className='fluentui-plus-tag__close' onClick={() => onTagRemove?.(tag, index)}>
                  ×
                </span>
              )}
            </span>
          );
        })}
      </div>
    );
  };
});

describe('InputTag Component', () => {
  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<InputTag />);
      const container = document.querySelector('.fluentui-plus-input-tag');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('fluentui-plus-input-tag');
    });

    it('should apply custom className', () => {
      render(<InputTag className='custom-class' />);
      const container = document.querySelector('.fluentui-plus-input-tag');
      expect(container).toHaveClass('custom-class');
    });

    it('should apply custom styles', () => {
      const customStyle = { width: '300px', margin: '10px' };
      render(<InputTag style={customStyle} />);
      const container = document.querySelector('.fluentui-plus-input-tag');
      expect(container).toHaveStyle('width: 300px');
      expect(container).toHaveStyle('margin: 10px');
    });

    it('should render as disabled when disabled prop is true', () => {
      render(<InputTag disabled placeholder='Disabled input' />);
      const container = document.querySelector('.fluentui-plus-input-tag');
      const input = screen.getByPlaceholderText('Disabled input');

      expect(container).toHaveClass('fluentui-plus-input-tag--disabled');
      expect(input).toBeDisabled();
    });
  });

  describe('标签渲染', () => {
    it('should render default tags correctly', () => {
      const defaultTags = ['tag1', 'tag2', 'tag3'];
      render(<InputTag defaultValue={defaultTags} />);

      defaultTags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('should render controlled tags correctly', () => {
      const tags = ['controlled1', 'controlled2'];
      render(<InputTag value={tags} />);

      tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it('should use custom renderTag when provided', () => {
      const customRenderTag = jest.fn((_tag, _index, _onClose) => (
        <div key={_index} data-testid={`custom-tag-${_index}`} onClick={_onClose}>
          Custom: {_tag}
        </div>
      ));

      render(<InputTag defaultValue={['tag1']} renderTag={customRenderTag} />);

      expect(customRenderTag).toHaveBeenCalledWith('tag1', 0, expect.any(Function));
      expect(screen.getByTestId('custom-tag-0')).toBeInTheDocument();
      expect(screen.getByText('Custom: tag1')).toBeInTheDocument();
    });
  });

  describe('交互功能', () => {
    it('should call onChange when tags are added', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<InputTag onChange={handleChange} placeholder='Type here' />);

      const input = screen.getByPlaceholderText('Type here');
      await user.type(input, 'new tag');
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenCalledWith(['new tag']);
    });

    it('should call onChange when tags are removed', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<InputTag defaultValue={['removable']} onChange={handleChange} />);

      const closeIcon = document.querySelector('.fluentui-plus-tag__close');
      await user.click(closeIcon!);

      expect(handleChange).toHaveBeenCalledWith([]);
    });

    it('should call onTagRemove when tag is removed', async () => {
      const user = userEvent.setup();
      const handleTagRemove = jest.fn();
      render(<InputTag defaultValue={['removable']} onTagRemove={handleTagRemove} />);

      const closeIcon = document.querySelector('.fluentui-plus-tag__close');
      await user.click(closeIcon!);

      expect(handleTagRemove).toHaveBeenCalledWith('removable', 0);
    });

    it('should not add tags when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<InputTag disabled defaultValue={['tag1']} onChange={handleChange} />);

      const input = document.querySelector('.fluentui-plus-input-tag__input');
      await user.type(input!, 'new tag');
      await user.keyboard('{Enter}');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('状态管理', () => {
    it('should show focused state when input is focused', async () => {
      const user = userEvent.setup();
      render(<InputTag placeholder='Type here' />);

      const container = document.querySelector('.fluentui-plus-input-tag');
      const input = screen.getByPlaceholderText('Type here');

      expect(container).not.toHaveClass('fluentui-plus-input-tag--focused');

      await user.click(input);
      expect(container).toHaveClass('fluentui-plus-input-tag--focused');
    });

    it('should handle blur events correctly', async () => {
      const user = userEvent.setup();
      render(<InputTag placeholder='Type here' />);

      const container = document.querySelector('.fluentui-plus-input-tag');
      const input = screen.getByPlaceholderText('Type here');

      await user.click(input);
      expect(container).toHaveClass('fluentui-plus-input-tag--focused');

      await user.click(document.body);
      expect(container).not.toHaveClass('fluentui-plus-input-tag--focused');
    });
  });

  describe('属性传递', () => {
    it('should pass placeholder to input correctly', () => {
      const placeholder = 'Enter tags';
      render(<InputTag placeholder={placeholder} />);
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toBeInTheDocument();
    });

    it('should pass tagClosable prop to TagList', () => {
      render(<InputTag defaultValue={['tag1']} tagClosable={false} />);

      // 确认标签存在
      expect(screen.getByText('tag1')).toBeInTheDocument();

      // 确认关闭图标不存在
      const closeIcon = document.querySelector('.fluentui-plus-tag__close');
      expect(closeIcon).not.toBeInTheDocument();
    });

    it('should pass renderTag prop to TagList', () => {
      const customRenderTag = jest.fn((_tag, _index, _onClose) => (
        <div key={_index} data-testid={`custom-${_index}`}>
          {_tag}
        </div>
      ));

      render(<InputTag defaultValue={['tag1']} renderTag={customRenderTag} />);
      expect(customRenderTag).toHaveBeenCalled();
    });
  });
});
