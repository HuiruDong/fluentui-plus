import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { InputTag } from '../index';

describe('InputTag Integration', () => {
  it('exports InputTag as default export', () => {
    expect(InputTag).toBeDefined();
    expect(typeof InputTag).toBe('function');
  });

  it('renders complete InputTag component correctly', () => {
    render(<InputTag placeholder='Add tags' />);

    const container = document.querySelector('.mm-input-tag');
    const input = screen.getByPlaceholderText('Add tags');

    expect(container).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('handles complete tag lifecycle - add, display, remove', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<InputTag onChange={handleChange} placeholder='Type tags' />);

    const input = screen.getByPlaceholderText('Type tags');

    // Add first tag
    await user.type(input, 'first tag');
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledWith(['first tag']);
    expect(screen.getByText('first tag')).toBeInTheDocument();

    // Add second tag
    await user.type(input, 'second tag');
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledWith(['first tag', 'second tag']);

    // Remove first tag by clicking close icon
    const closeIcons = document.querySelectorAll('.mm-tag__close');
    await user.click(closeIcons[0]);

    expect(handleChange).toHaveBeenCalledWith(['second tag']);
  });

  it('handles complex user interaction scenarios', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    const handleInputChange = jest.fn();
    const handleTagRemove = jest.fn();

    render(
      <InputTag
        onChange={handleChange}
        onInputChange={handleInputChange}
        onTagRemove={handleTagRemove}
        delimiter=','
        maxTags={3}
        allowDuplicates={false}
        placeholder='Complex scenario'
      />
    );

    const input = screen.getByPlaceholderText('Complex scenario');

    // Add tags via paste with delimiter
    await user.click(input);

    // Use userEvent.paste to simulate paste action more realistically
    await user.paste('tag1,tag2,tag3');

    expect(handleChange).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);

    // Try to add duplicate (should fail)
    await user.type(input, 'tag1');
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledTimes(1); // No new call

    // Try to add fourth tag (should fail due to maxTags)
    await user.type(input, 'tag4');
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledTimes(1); // No new call

    // Remove a tag and verify callbacks
    const closeIcon = document.querySelector('.mm-tag__close');
    await user.click(closeIcon!);

    expect(handleTagRemove).toHaveBeenCalledWith('tag1', 0);
  });

  it('supports controlled mode properly', () => {
    const tags = ['controlled1', 'controlled2'];
    const { rerender } = render(<InputTag value={tags} />);

    // Initial render
    expect(screen.getByText('controlled1')).toBeInTheDocument();
    expect(screen.getByText('controlled2')).toBeInTheDocument();

    // Update controlled value
    const newTags = ['updated1', 'updated2', 'updated3'];
    rerender(<InputTag value={newTags} />);

    expect(screen.getByText('updated1')).toBeInTheDocument();
    expect(screen.getByText('updated2')).toBeInTheDocument();
    expect(screen.getByText('updated3')).toBeInTheDocument();
    expect(screen.queryByText('controlled1')).not.toBeInTheDocument();
  });

  it('handles disabled state across all child components', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<InputTag disabled defaultValue={['disabled-tag']} onChange={handleChange} />);

    const container = document.querySelector('.mm-input-tag');
    const input = document.querySelector('.mm-input-tag__input') as HTMLInputElement;

    // Check visual state
    expect(container).toHaveClass('mm-input-tag--disabled');
    expect(input).toBeDisabled();

    // No close icons should be present
    const closeIcon = document.querySelector('.mm-tag__close');
    expect(closeIcon).not.toBeInTheDocument();

    // Try to interact (should not work)
    await user.type(input, 'should not work');
    await user.keyboard('{Enter}');

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('handles custom renderTag function', () => {
    const customRenderTag = (tag: string, index: number, onClose: () => void) => (
      <div key={index} data-testid={`custom-${index}`} onClick={onClose}>
        🏷️ {tag}
      </div>
    );

    render(<InputTag defaultValue={['custom1', 'custom2']} renderTag={customRenderTag} />);

    expect(screen.getByTestId('custom-0')).toBeInTheDocument();
    expect(screen.getByTestId('custom-1')).toBeInTheDocument();
    expect(screen.getByText('🏷️ custom1')).toBeInTheDocument();
    expect(screen.getByText('🏷️ custom2')).toBeInTheDocument();
  });

  it('maintains focus state correctly during interactions', async () => {
    const user = userEvent.setup();

    render(<InputTag placeholder='Focus test' />);

    const container = document.querySelector('.mm-input-tag');
    const input = screen.getByPlaceholderText('Focus test');

    // Initially unfocused
    expect(container).not.toHaveClass('mm-input-tag--focused');

    // Focus input
    await user.click(input);
    expect(container).toHaveClass('mm-input-tag--focused');

    // Add a tag (should remain focused)
    await user.type(input, 'focus tag');
    await user.keyboard('{Enter}');
    expect(container).toHaveClass('mm-input-tag--focused');

    // Blur by clicking outside
    await user.click(document.body);
    expect(container).not.toHaveClass('mm-input-tag--focused');
  });

  it('handles edge cases gracefully', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<InputTag onChange={handleChange} placeholder='Edge cases' />);

    const input = screen.getByPlaceholderText('Edge cases');

    // Empty string should not be added
    await user.type(input, '   ');
    await user.keyboard('{Enter}');
    expect(handleChange).not.toHaveBeenCalled();

    // Only whitespace should not be added
    await user.clear(input);
    await user.type(input, '\t\n ');
    await user.keyboard('{Enter}');
    expect(handleChange).not.toHaveBeenCalled();

    // Special characters should work
    await user.clear(input);
    await user.type(input, '!@#$%^&*()');
    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledWith(['!@#$%^&*()']);

    // Unicode characters should work
    handleChange.mockClear();
    await user.type(input, '你好世界🌍');
    await user.keyboard('{Enter}');
    expect(handleChange).toHaveBeenCalledWith(['!@#$%^&*()', '你好世界🌍']);
  });

  it('performs well with many tags', () => {
    const manyTags = Array.from({ length: 100 }, (_, i) => `tag${i}`);

    const startTime = performance.now();
    render(<InputTag value={manyTags} />);
    const endTime = performance.now();

    // Should render quickly (less than 100ms for 100 tags)
    expect(endTime - startTime).toBeLessThan(100);

    // All tags should be present
    manyTags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('cleans up event listeners properly', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<InputTag />);

    // Should have added resize listener
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    // Should have removed resize listener
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
