import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TagList from '../TagList';

describe('TagList', () => {
  it('renders empty list correctly', () => {
    render(<TagList tags={[]} />);

    // Should not render any tags
    const tags = document.querySelectorAll('.mm-input-tag__item');
    expect(tags).toHaveLength(0);
  });

  it('renders tag list correctly', () => {
    const tags = ['tag1', 'tag2', 'tag3'];
    render(<TagList tags={tags} />);

    tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });

    const tagElements = document.querySelectorAll('.mm-input-tag__item');
    expect(tagElements).toHaveLength(3);
  });

  it('renders tags with close icons by default', () => {
    const tags = ['closable'];
    render(<TagList tags={tags} />);

    const closeIcon = document.querySelector('.mm-tag__close');
    expect(closeIcon).toBeInTheDocument();
  });

  it('renders tags without close icons when tagClosable is false', () => {
    const tags = ['not-closable'];
    render(<TagList tags={tags} tagClosable={false} />);

    const closeIcon = document.querySelector('.mm-tag__close');
    expect(closeIcon).not.toBeInTheDocument();
  });

  it('renders tags without close icons when disabled', () => {
    const tags = ['disabled-tag'];
    render(<TagList tags={tags} disabled />);

    const closeIcon = document.querySelector('.mm-tag__close');
    expect(closeIcon).not.toBeInTheDocument();
  });

  it('calls onTagRemove when close icon is clicked', async () => {
    const user = userEvent.setup();
    const handleTagRemove = jest.fn();
    const tags = ['removable'];

    render(<TagList tags={tags} onTagRemove={handleTagRemove} />);

    const closeIcon = document.querySelector('.mm-tag__close');
    expect(closeIcon).toBeInTheDocument();

    await user.click(closeIcon!);

    expect(handleTagRemove).toHaveBeenCalledTimes(1);
    expect(handleTagRemove).toHaveBeenCalledWith('removable', 0);
  });

  it('does not call onTagRemove when disabled', async () => {
    const handleTagRemove = jest.fn();
    const tags = ['disabled-tag'];

    render(<TagList tags={tags} disabled onTagRemove={handleTagRemove} />);

    // There should be no close icon when disabled
    const closeIcon = document.querySelector('.mm-tag__close');
    expect(closeIcon).not.toBeInTheDocument();

    expect(handleTagRemove).not.toHaveBeenCalled();
  });

  it('stops propagation when clicking close icon', async () => {
    const user = userEvent.setup();
    const handleTagRemove = jest.fn();
    const handleParentClick = jest.fn();
    const tags = ['test-tag'];

    render(
      <div onClick={handleParentClick}>
        <TagList tags={tags} onTagRemove={handleTagRemove} />
      </div>
    );

    const closeIcon = document.querySelector('.mm-tag__close');
    await user.click(closeIcon!);

    expect(handleTagRemove).toHaveBeenCalledTimes(1);
    expect(handleParentClick).not.toHaveBeenCalled();
  });

  it('uses custom renderTag when provided', () => {
    const customRenderTag = jest.fn((tag, index, onClose) => (
      <div key={index} data-testid={`custom-tag-${index}`} onClick={onClose}>
        Custom: {tag}
      </div>
    ));

    const tags = ['custom-tag'];
    render(<TagList tags={tags} renderTag={customRenderTag} />);

    expect(customRenderTag).toHaveBeenCalledTimes(1);
    expect(customRenderTag).toHaveBeenCalledWith('custom-tag', 0, expect.any(Function));

    expect(screen.getByTestId('custom-tag-0')).toBeInTheDocument();
    expect(screen.getByText('Custom: custom-tag')).toBeInTheDocument();
  });

  it('calls onClose callback from custom renderTag', async () => {
    const user = userEvent.setup();
    const handleTagRemove = jest.fn();
    const customRenderTag = (tag: string, index: number, onClose: () => void) => (
      <div key={index} data-testid={`custom-tag-${index}`} onClick={onClose}>
        {tag}
      </div>
    );

    const tags = ['custom-tag'];
    render(<TagList tags={tags} renderTag={customRenderTag} onTagRemove={handleTagRemove} />);

    const customTag = screen.getByTestId('custom-tag-0');
    await user.click(customTag);

    expect(handleTagRemove).toHaveBeenCalledWith('custom-tag', 0);
  });

  it('does not call onClose from custom renderTag when disabled', async () => {
    const user = userEvent.setup();
    const handleTagRemove = jest.fn();
    const customRenderTag = (tag: string, index: number, onClose: () => void) => (
      <div key={index} data-testid={`custom-tag-${index}`} onClick={onClose}>
        {tag}
      </div>
    );

    const tags = ['custom-tag'];
    render(<TagList tags={tags} disabled renderTag={customRenderTag} onTagRemove={handleTagRemove} />);

    const customTag = screen.getByTestId('custom-tag-0');
    await user.click(customTag);

    expect(handleTagRemove).not.toHaveBeenCalled();
  });

  it('renders multiple tags with unique keys', () => {
    const tags = ['tag1', 'tag2', 'tag1']; // Duplicate tag
    render(<TagList tags={tags} />);

    const tagElements = document.querySelectorAll('.mm-input-tag__item');
    expect(tagElements).toHaveLength(3);

    // All tags should be rendered including duplicates
    const tag1Elements = screen.getAllByText('tag1');
    expect(tag1Elements).toHaveLength(2);
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  it('handles tag removal at different indices', async () => {
    const user = userEvent.setup();
    const handleTagRemove = jest.fn();
    const tags = ['first', 'second', 'third'];

    render(<TagList tags={tags} onTagRemove={handleTagRemove} />);

    const closeIcons = document.querySelectorAll('.mm-tag__close');
    expect(closeIcons).toHaveLength(3);

    // Remove middle tag
    await user.click(closeIcons[1]);
    expect(handleTagRemove).toHaveBeenCalledWith('second', 1);

    handleTagRemove.mockClear();

    // Remove first tag
    await user.click(closeIcons[0]);
    expect(handleTagRemove).toHaveBeenCalledWith('first', 0);

    handleTagRemove.mockClear();

    // Remove last tag
    await user.click(closeIcons[2]);
    expect(handleTagRemove).toHaveBeenCalledWith('third', 2);
  });

  it('applies correct CSS classes to tags', () => {
    const tags = ['styled-tag'];
    render(<TagList tags={tags} />);

    const tagElement = document.querySelector('.mm-input-tag__item');
    expect(tagElement).toHaveClass('mm-tag');
    expect(tagElement).toHaveClass('mm-input-tag__item');
  });
});
