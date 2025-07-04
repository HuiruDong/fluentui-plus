import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tag from '../Tag';

describe('Tag', () => {
  it('renders correctly with default props', () => {
    render(<Tag>Test Tag</Tag>);
    const content = screen.getByText('Test Tag');
    expect(content).toBeInTheDocument();
    const tag = content.closest('span')?.parentElement;
    expect(tag).toHaveClass('mm-tag');
    expect(tag).toHaveClass('mm-tag--bordered');
  });

  it('renders content correctly', () => {
    render(<Tag>Tag Content</Tag>);
    expect(screen.getByText('Tag Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Tag className='custom-class'>Test Tag</Tag>);
    const content = screen.getByText('Test Tag');
    const tag = content.closest('span')?.parentElement;
    expect(tag).toHaveClass('custom-class');
  });

  it('applies custom styles', () => {
    const customStyle = { fontSize: '16px', padding: '8px' };
    render(<Tag style={customStyle}>Test Tag</Tag>);
    const content = screen.getByText('Test Tag');
    const tag = content.closest('span')?.parentElement;
    expect(tag).toHaveStyle('font-size: 16px');
    expect(tag).toHaveStyle('padding: 8px');
  });

  it('renders as borderless when bordered is false', () => {
    render(<Tag bordered={false}>Test Tag</Tag>);
    const content = screen.getByText('Test Tag');
    const tag = content.closest('span')?.parentElement;
    expect(tag).toHaveClass('mm-tag--borderless');
    expect(tag).not.toHaveClass('mm-tag--bordered');
  });

  it('applies custom color correctly', () => {
    render(<Tag color='#ff0000'>Red Tag</Tag>);
    const content = screen.getByText('Red Tag');
    const tag = content.closest('span')?.parentElement;
    expect(tag).toHaveStyle('background-color: #ff0000');
    expect(tag).toHaveStyle('color: #fff');
  });

  it('handles onClick event', () => {
    const handleClick = jest.fn();
    render(<Tag onClick={handleClick}>Clickable Tag</Tag>);

    const content = screen.getByText('Clickable Tag');
    const tag = content.closest('span')?.parentElement;
    fireEvent.click(tag!);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
      })
    );
  });

  it('renders close icon when closeIcon is true', () => {
    render(<Tag closeIcon>Closable Tag</Tag>);
    const closeIcon = document.querySelector('.mm-tag__close');
    expect(closeIcon).toBeInTheDocument();
  });

  it('renders custom close icon', () => {
    const customCloseIcon = <span data-testid='custom-close'>×</span>;
    render(<Tag closeIcon={customCloseIcon}>Closable Tag</Tag>);

    expect(screen.getByTestId('custom-close')).toBeInTheDocument();
    expect(screen.getByText('×')).toBeInTheDocument();
  });

  it('handles onClose event', () => {
    const handleClose = jest.fn();
    render(
      <Tag closeIcon onClose={handleClose}>
        Closable Tag
      </Tag>
    );

    const closeIcon = document.querySelector('.mm-tag__close');
    fireEvent.click(closeIcon!);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
      })
    );
  });

  it('stops propagation when clicking close icon', () => {
    const handleClick = jest.fn();
    const handleClose = jest.fn();

    render(
      <Tag onClick={handleClick} closeIcon onClose={handleClose}>
        Closable Tag
      </Tag>
    );

    const closeIcon = document.querySelector('.mm-tag__close');
    fireEvent.click(closeIcon!);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('stops propagation when clicking the tag itself', () => {
    const handleClick = jest.fn();
    const parentHandleClick = jest.fn();

    render(
      <div onClick={parentHandleClick}>
        <Tag onClick={handleClick}>Test Tag</Tag>
      </div>
    );

    const content = screen.getByText('Test Tag');
    const tag = content.closest('span')?.parentElement;
    fireEvent.click(tag!);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(parentHandleClick).not.toHaveBeenCalled();
  });

  it('does not render close icon when closeIcon is false', () => {
    render(<Tag closeIcon={false}>Tag without close</Tag>);
    const closeIcon = document.querySelector('.mm-tag__close');
    expect(closeIcon).not.toBeInTheDocument();
  });

  it('merges custom background color with style prop', () => {
    render(
      <Tag color='#ff0000' style={{ backgroundColor: '#00ff00', margin: '10px' }}>
        Test Tag
      </Tag>
    );

    const content = screen.getByText('Test Tag');
    const tag = content.closest('span')?.parentElement;
    expect(tag).toHaveStyle('background-color: #ff0000'); // color prop takes precedence
    expect(tag).toHaveStyle('margin: 10px'); // style prop is preserved
  });

  it('renders content wrapper with correct class', () => {
    render(<Tag>Content</Tag>);
    const contentWrapper = document.querySelector('.mm-tag__content');
    expect(contentWrapper).toBeInTheDocument();
    expect(contentWrapper).toHaveTextContent('Content');
  });

  it('has CheckableTag as static property', () => {
    expect(Tag.CheckableTag).toBeDefined();
    expect(typeof Tag.CheckableTag).toBe('function');
  });
});
