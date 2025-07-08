import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import InputTag from '../InputTag';

describe('InputTag', () => {
  it('renders correctly with default props', () => {
    render(<InputTag />);
    const container = document.querySelector('.mm-input-tag');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('mm-input-tag');
  });

  it('renders with placeholder', () => {
    const placeholder = 'Enter tags';
    render(<InputTag placeholder={placeholder} />);
    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<InputTag className='custom-class' />);
    const container = document.querySelector('.mm-input-tag');
    expect(container).toHaveClass('custom-class');
  });

  it('applies custom styles', () => {
    const customStyle = { width: '300px', margin: '10px' };
    render(<InputTag style={customStyle} />);
    const container = document.querySelector('.mm-input-tag');
    expect(container).toHaveStyle('width: 300px');
    expect(container).toHaveStyle('margin: 10px');
  });

  it('renders as disabled when disabled prop is true', () => {
    render(<InputTag disabled placeholder='Disabled input' />);
    const container = document.querySelector('.mm-input-tag');
    const input = screen.getByPlaceholderText('Disabled input');

    expect(container).toHaveClass('mm-input-tag--disabled');
    expect(input).toBeDisabled();
  });

  it('renders default tags correctly', () => {
    const defaultTags = ['tag1', 'tag2', 'tag3'];
    render(<InputTag defaultValue={defaultTags} />);

    defaultTags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('renders controlled tags correctly', () => {
    const tags = ['controlled1', 'controlled2'];
    render(<InputTag value={tags} />);

    tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('adds tag when Enter is pressed', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag onChange={handleChange} placeholder='Type here' />);

    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'new tag');
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledWith(['new tag']);
  });

  it('adds tag when Tab is pressed', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag onChange={handleChange} placeholder='Type here' />);

    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'tab tag');
    await user.keyboard('{Tab}');

    expect(handleChange).toHaveBeenCalledWith(['tab tag']);
  });

  it('removes tag when backspace is pressed on empty input', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag defaultValue={['tag1', 'tag2']} onChange={handleChange} />);

    const input = document.querySelector('.mm-input-tag__input') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    await user.click(input);
    await user.keyboard('{Backspace}');

    expect(handleChange).toHaveBeenCalledWith(['tag1']);
  });

  it('removes tag when close icon is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag defaultValue={['removable']} onChange={handleChange} />);

    const closeIcon = document.querySelector('.mm-tag__close');
    expect(closeIcon).toBeInTheDocument();

    await user.click(closeIcon!);
    expect(handleChange).toHaveBeenCalledWith([]);
  });

  it('calls onInputChange when input value changes', async () => {
    const user = userEvent.setup();
    const handleInputChange = jest.fn();
    render(<InputTag onInputChange={handleInputChange} placeholder='Type here' />);

    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'test');

    expect(handleInputChange).toHaveBeenCalledTimes(4); // 't', 'e', 's', 't'
    expect(handleInputChange).toHaveBeenLastCalledWith('test');
  });

  it('calls onTagRemove when tag is removed', async () => {
    const user = userEvent.setup();
    const handleTagRemove = jest.fn();
    render(<InputTag defaultValue={['removable']} onTagRemove={handleTagRemove} />);

    const closeIcon = document.querySelector('.mm-tag__close');
    await user.click(closeIcon!);

    expect(handleTagRemove).toHaveBeenCalledWith('removable', 0);
  });

  it('respects maxTags limit', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag maxTags={2} defaultValue={['tag1', 'tag2']} onChange={handleChange} />);

    const input = document.querySelector('.mm-input-tag__input') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    await user.type(input, 'tag3');
    await user.keyboard('{Enter}');

    // Should not add the third tag
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('prevents duplicate tags when allowDuplicates is false', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag allowDuplicates={false} defaultValue={['existing']} onChange={handleChange} />);

    const input = document.querySelector('.mm-input-tag__input') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    await user.type(input, 'existing');
    await user.keyboard('{Enter}');

    // Should not add duplicate tag
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('allows duplicate tags when allowDuplicates is true', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag allowDuplicates={true} defaultValue={['existing']} onChange={handleChange} />);

    const input = document.querySelector('.mm-input-tag__input') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    await user.type(input, 'existing');
    await user.keyboard('{Enter}');

    expect(handleChange).toHaveBeenCalledWith(['existing', 'existing']);
  });

  it('handles paste with delimiter', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag delimiter=',' onChange={handleChange} placeholder='Type here' />);

    const input = screen.getByPlaceholderText('Type here');
    await user.click(input);

    // Use userEvent.paste to simulate paste action more realistically
    await user.paste('tag1,tag2,tag3');

    expect(handleChange).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);
  });

  it('shows focused state when input is focused', async () => {
    const user = userEvent.setup();
    render(<InputTag placeholder='Type here' />);

    const container = document.querySelector('.mm-input-tag');
    const input = screen.getByPlaceholderText('Type here');

    expect(container).not.toHaveClass('mm-input-tag--focused');

    await user.click(input);
    expect(container).toHaveClass('mm-input-tag--focused');
  });

  it('hides placeholder when tags exist', () => {
    render(<InputTag defaultValue={['tag1']} placeholder='Type here' />);

    // Input should not show placeholder when tags exist
    const input = document.querySelector('.mm-input-tag__input');
    expect(input).toHaveAttribute('placeholder', '');
  });

  it('shows placeholder when no tags exist', () => {
    const placeholder = 'Type here';
    render(<InputTag placeholder={placeholder} />);

    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toHaveAttribute('placeholder', placeholder);
  });

  it('renders tags without close icon when tagClosable is false', () => {
    render(<InputTag defaultValue={['tag1']} tagClosable={false} />);

    const closeIcon = document.querySelector('.mm-tag__close');
    expect(closeIcon).not.toBeInTheDocument();
  });

  it('does not remove tags when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag disabled defaultValue={['tag1']} onChange={handleChange} />);

    // Try to remove tag via backspace
    const input = document.querySelector('.mm-input-tag__input');
    await user.click(input!);
    await user.keyboard('{Backspace}');

    expect(handleChange).not.toHaveBeenCalled();

    // Close icons should not be present when disabled
    const closeIcon = document.querySelector('.mm-tag__close');
    expect(closeIcon).not.toBeInTheDocument();
  });

  it('uses custom renderTag when provided', () => {
    const customRenderTag = jest.fn((tag, index, onClose) => (
      <div key={index} data-testid={`custom-tag-${index}`} onClick={onClose}>
        Custom: {tag}
      </div>
    ));

    render(<InputTag defaultValue={['tag1']} renderTag={customRenderTag} />);

    expect(customRenderTag).toHaveBeenCalledWith('tag1', 0, expect.any(Function));
    expect(screen.getByTestId('custom-tag-0')).toBeInTheDocument();
    expect(screen.getByText('Custom: tag1')).toBeInTheDocument();
  });

  it('handles blur events correctly', async () => {
    const user = userEvent.setup();
    render(<InputTag placeholder='Type here' />);

    const container = document.querySelector('.mm-input-tag');
    const input = screen.getByPlaceholderText('Type here');

    // Focus first
    await user.click(input);
    expect(container).toHaveClass('mm-input-tag--focused');

    // Blur
    await user.click(document.body);
    expect(container).not.toHaveClass('mm-input-tag--focused');
  });

  it('clears input value after adding tag', async () => {
    const user = userEvent.setup();
    render(<InputTag placeholder='Type here' />);

    const input = screen.getByPlaceholderText('Type here') as HTMLInputElement;
    await user.type(input, 'new tag');

    expect(input.value).toBe('new tag');

    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('handles regex delimiter correctly', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<InputTag delimiter={/[,;]/} onChange={handleChange} placeholder='Type here' />);

    const input = screen.getByPlaceholderText('Type here');
    await user.click(input);

    // Use userEvent.paste to simulate paste action more realistically
    await user.paste('tag1,tag2;tag3');

    expect(handleChange).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3']);
  });
});
