import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TagList from '../TagList';

// Mock Tag component
jest.mock('../../Tag', () => {
  return {
    Tag: ({
      children,
      closeIcon,
      onClose,
      ...props
    }: {
      children: React.ReactNode;
      closeIcon?: React.ReactNode;
      onClose?: () => void;
      [key: string]: unknown;
    }) => (
      <span className='mm-tag' {...props}>
        <span className='mm-tag__content'>{children}</span>
        {closeIcon && (
          <span className='mm-tag__close' onClick={onClose}>
            ×
          </span>
        )}
      </span>
    ),
  };
});

describe('TagList Component', () => {
  const defaultProps = {
    tags: [],
    onTagRemove: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('should render empty list correctly', () => {
      render(<TagList {...defaultProps} />);

      const tags = document.querySelectorAll('.mm-tag');
      expect(tags).toHaveLength(0);
    });

    it('should render tag list correctly', () => {
      const tags = ['tag1', 'tag2', 'tag3'];
      render(<TagList {...defaultProps} tags={tags} />);

      tags.forEach(tag => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });

      // 查找实际渲染的标签元素
      const tagElements = screen.getAllByText(/tag\d+/);
      expect(tagElements).toHaveLength(3);
    });

    it('should render tags with close icons by default', () => {
      const tags = ['closable'];
      render(<TagList {...defaultProps} tags={tags} />);

      const closeIcons = document.querySelectorAll('.mm-tag__close');
      expect(closeIcons).toHaveLength(1);
    });

    it('should render tags without close icons when tagClosable is false', () => {
      const tags = ['not-closable'];
      render(<TagList {...defaultProps} tags={tags} tagClosable={false} />);

      const closeIcons = document.querySelectorAll('.mm-tag__close');
      expect(closeIcons).toHaveLength(0);
    });

    it('should render tags without close icons when disabled', () => {
      const tags = ['disabled-tag'];
      render(<TagList {...defaultProps} tags={tags} disabled />);

      const closeIcons = document.querySelectorAll('.mm-tag__close');
      expect(closeIcons).toHaveLength(0);
    });
  });

  describe('交互功能', () => {
    it('should call onTagRemove when tag close icon is clicked', async () => {
      const user = userEvent.setup();
      const onTagRemove = jest.fn();
      const tags = ['removable'];

      render(<TagList {...defaultProps} tags={tags} onTagRemove={onTagRemove} />);

      const closeIcon = document.querySelector('.mm-tag__close');
      await user.click(closeIcon!);

      expect(onTagRemove).toHaveBeenCalledWith('removable', 0);
    });

    it('should not call onTagRemove when disabled', async () => {
      const onTagRemove = jest.fn();
      const tags = ['disabled-tag'];

      render(<TagList {...defaultProps} tags={tags} disabled onTagRemove={onTagRemove} />);

      // Close icon should not be present when disabled
      const closeIcon = document.querySelector('.mm-tag__close');
      expect(closeIcon).not.toBeInTheDocument();
    });

    it('should not call onTagRemove when tagClosable is false', async () => {
      const onTagRemove = jest.fn();
      const tags = ['non-closable'];

      render(<TagList {...defaultProps} tags={tags} tagClosable={false} onTagRemove={onTagRemove} />);

      // Close icon should not be present when tagClosable is false
      const closeIcon = document.querySelector('.mm-tag__close');
      expect(closeIcon).not.toBeInTheDocument();
    });
  });

  describe('自定义渲染', () => {
    it('should use custom renderTag when provided', () => {
      const customRenderTag = jest.fn((_tag, _index, _onClose) => (
        <div key={_index} data-testid={`custom-tag-${_index}`} onClick={_onClose}>
          Custom: {_tag}
        </div>
      ));
      const tags = ['custom'];

      render(<TagList {...defaultProps} tags={tags} renderTag={customRenderTag} />);

      expect(customRenderTag).toHaveBeenCalledWith('custom', 0, expect.any(Function));
      expect(screen.getByTestId('custom-tag-0')).toBeInTheDocument();
      expect(screen.getByText('Custom: custom')).toBeInTheDocument();
    });

    it('should pass correct parameters to custom renderTag', () => {
      const customRenderTag = jest.fn((_tag, _index, _onClose) => (
        <div key={_index} data-testid={`tag-${_index}`}>
          {_tag}
        </div>
      ));
      const tags = ['tag1', 'tag2'];

      render(<TagList {...defaultProps} tags={tags} renderTag={customRenderTag} />);

      expect(customRenderTag).toHaveBeenCalledTimes(2);
      expect(customRenderTag).toHaveBeenNthCalledWith(1, 'tag1', 0, expect.any(Function));
      expect(customRenderTag).toHaveBeenNthCalledWith(2, 'tag2', 1, expect.any(Function));
    });

    it('should call onTagRemove when custom rendered tag close function is called', async () => {
      const user = userEvent.setup();
      const onTagRemove = jest.fn();
      const customRenderTag = jest.fn((tag, index, onClose) => (
        <div key={index} data-testid={`custom-tag-${index}`} onClick={onClose}>
          {tag}
        </div>
      ));
      const tags = ['custom'];

      render(<TagList {...defaultProps} tags={tags} renderTag={customRenderTag} onTagRemove={onTagRemove} />);

      const customTag = screen.getByTestId('custom-tag-0');
      await user.click(customTag);

      expect(onTagRemove).toHaveBeenCalledWith('custom', 0);
    });

    it('should not call onTagRemove from custom render when disabled', async () => {
      const user = userEvent.setup();
      const onTagRemove = jest.fn();
      const customRenderTag = jest.fn((tag, index, onClose) => (
        <div key={index} data-testid={`custom-tag-${index}`} onClick={onClose}>
          {tag}
        </div>
      ));
      const tags = ['custom'];

      render(<TagList {...defaultProps} tags={tags} disabled renderTag={customRenderTag} onTagRemove={onTagRemove} />);

      const customTag = screen.getByTestId('custom-tag-0');
      await user.click(customTag);

      expect(onTagRemove).not.toHaveBeenCalled();
    });
  });

  describe('标签键值生成', () => {
    it('should generate unique keys for tags', () => {
      const tags = ['tag1', 'tag1', 'tag2']; // Duplicate tags
      render(<TagList {...defaultProps} tags={tags} />);

      // 查找实际渲染的标签元素
      const tagElements = screen.getAllByText(/tag\d+/);
      expect(tagElements).toHaveLength(3);

      // All tags should be rendered even if they have the same content
      expect(screen.getAllByText('tag1')).toHaveLength(2);
      expect(screen.getByText('tag2')).toBeInTheDocument();
    });
  });
});
