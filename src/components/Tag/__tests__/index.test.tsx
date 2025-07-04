import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tag from '../Tag';

describe('Tag Integration', () => {
  it('exports CheckableTag as static property', () => {
    expect(Tag.CheckableTag).toBeDefined();
    expect(typeof Tag.CheckableTag).toBe('function');
  });

  it('can use CheckableTag through Tag.CheckableTag', () => {
    const handleChange = jest.fn();

    render(
      <Tag.CheckableTag checked={false} onChange={handleChange}>
        Static CheckableTag
      </Tag.CheckableTag>
    );

    const content = screen.getByText('Static CheckableTag');
    expect(content).toBeInTheDocument();
    const tag = content.closest('span')?.parentElement;
    expect(tag).toHaveClass('mm-checkable-tag');

    fireEvent.click(tag!);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('renders multiple tags correctly', () => {
    render(
      <div>
        <Tag>Regular Tag 1</Tag>
        <Tag.CheckableTag checked={false}>Checkable Tag 1</Tag.CheckableTag>
        <Tag closeIcon>Closable Tag</Tag>
        <Tag.CheckableTag checked={true}>Checkable Tag 2</Tag.CheckableTag>
      </div>
    );

    expect(screen.getByText('Regular Tag 1')).toBeInTheDocument();
    expect(screen.getByText('Checkable Tag 1')).toBeInTheDocument();
    expect(screen.getByText('Closable Tag')).toBeInTheDocument();
    expect(screen.getByText('Checkable Tag 2')).toBeInTheDocument();

    // Check classes
    expect(screen.getByText('Regular Tag 1').closest('span')?.parentElement).toHaveClass('mm-tag');
    expect(screen.getByText('Checkable Tag 1').closest('span')?.parentElement).toHaveClass('mm-checkable-tag');
    expect(screen.getByText('Checkable Tag 2').closest('span')?.parentElement).toHaveClass('mm-checkable-tag--checked');

    // Check close icon
    expect(document.querySelector('.mm-tag__close')).toBeInTheDocument();
  });

  it('handles complex interaction scenarios', () => {
    const handleTagClick = jest.fn();
    const handleTagClose = jest.fn();
    const handleCheckableChange = jest.fn();

    render(
      <div>
        <Tag onClick={handleTagClick} closeIcon onClose={handleTagClose}>
          Complex Tag
        </Tag>
        <Tag.CheckableTag checked={false} onChange={handleCheckableChange}>
          Complex Checkable
        </Tag.CheckableTag>
      </div>
    );

    // Test regular tag click
    const regularContent = screen.getByText('Complex Tag');
    const regularTag = regularContent.closest('span')?.parentElement;
    fireEvent.click(regularTag!);
    expect(handleTagClick).toHaveBeenCalledTimes(1);

    // Test close icon click
    const closeIcon = document.querySelector('.mm-tag__close');
    fireEvent.click(closeIcon!);
    expect(handleTagClose).toHaveBeenCalledTimes(1);
    expect(handleTagClick).toHaveBeenCalledTimes(1); // Should not increment due to stopPropagation

    // Test checkable tag click
    const checkableContent = screen.getByText('Complex Checkable');
    const checkableTag = checkableContent.closest('span')?.parentElement;
    fireEvent.click(checkableTag!);
    expect(handleCheckableChange).toHaveBeenCalledWith(true);
  });

  it('supports nested content in both tag types', () => {
    render(
      <div>
        <Tag>
          <span data-testid='nested-regular'>
            <strong>Bold</strong> Regular Content
          </span>
        </Tag>
        <Tag.CheckableTag checked={true}>
          <span data-testid='nested-checkable'>
            <em>Italic</em> Checkable Content
          </span>
        </Tag.CheckableTag>
      </div>
    );

    expect(screen.getByTestId('nested-regular')).toBeInTheDocument();
    expect(screen.getByTestId('nested-checkable')).toBeInTheDocument();
    expect(screen.getByText('Bold')).toBeInTheDocument();
    expect(screen.getByText('Italic')).toBeInTheDocument();
  });

  it('maintains correct styling hierarchy', () => {
    render(
      <div>
        <Tag color='#ff0000' className='custom-tag'>
          Styled Regular Tag
        </Tag>
        <Tag.CheckableTag checked={true} color='#00ff00' className='custom-checkable'>
          Styled Checkable Tag
        </Tag.CheckableTag>
      </div>
    );

    const regularContent = screen.getByText('Styled Regular Tag');
    const regularTag = regularContent.closest('span')?.parentElement;
    const checkableContent = screen.getByText('Styled Checkable Tag');
    const checkableTag = checkableContent.closest('span')?.parentElement;

    // Regular tag should have base tag classes + custom class
    expect(regularTag).toHaveClass('mm-tag', 'custom-tag');
    expect(regularTag).toHaveStyle('background-color: #ff0000');

    // Checkable tag should have checkable classes + custom class
    expect(checkableTag).toHaveClass('mm-checkable-tag', 'mm-checkable-tag--checked', 'custom-checkable');
    expect(checkableTag).toHaveStyle('background-color: #00ff00');
  });
});
