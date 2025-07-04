import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckableTag from '../CheckableTag';

describe('CheckableTag', () => {
  it('renders correctly with default props', () => {
    render(<CheckableTag>Checkable Tag</CheckableTag>);
    const content = screen.getByText('Checkable Tag');
    expect(content).toBeInTheDocument();
    const tag = content.closest('span')?.parentElement;
    expect(tag).toHaveClass('mm-checkable-tag');
  });

  it('renders content correctly', () => {
    render(<CheckableTag>Test Content</CheckableTag>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies checked class when checked is true', () => {
    render(<CheckableTag checked>Checked Tag</CheckableTag>);
    const content = screen.getByText('Checked Tag');
    const tag = content.closest('span')?.parentElement;
    expect(tag).toHaveClass('mm-checkable-tag');
    expect(tag).toHaveClass('mm-checkable-tag--checked');
  });

  it('does not apply checked class when checked is false', () => {
    render(<CheckableTag checked={false}>Unchecked Tag</CheckableTag>);
    const content = screen.getByText('Unchecked Tag');
    const tag = content.closest('span')?.parentElement;
    expect(tag).toHaveClass('mm-checkable-tag');
    expect(tag).not.toHaveClass('mm-checkable-tag--checked');
  });

  it('does not apply checked class when checked is undefined', () => {
    render(<CheckableTag>Default Tag</CheckableTag>);
    const content = screen.getByText('Default Tag');
    const tag = content.closest('span')?.parentElement;
    expect(tag).toHaveClass('mm-checkable-tag');
    expect(tag).not.toHaveClass('mm-checkable-tag--checked');
  });

  it('applies custom className along with default classes', () => {
    render(<CheckableTag className='custom-class'>Custom Tag</CheckableTag>);
    const content = screen.getByText('Custom Tag');
    const tag = content.closest('span')?.parentElement;
    expect(tag).toHaveClass('mm-checkable-tag');
    expect(tag).toHaveClass('custom-class');
  });

  it('applies custom className with checked state', () => {
    render(
      <CheckableTag checked className='custom-class'>
        Custom Checked Tag
      </CheckableTag>
    );
    const content = screen.getByText('Custom Checked Tag');
    const tag = content.closest('span')?.parentElement;
    expect(tag).toHaveClass('mm-checkable-tag');
    expect(tag).toHaveClass('mm-checkable-tag--checked');
    expect(tag).toHaveClass('custom-class');
  });

  it('calls onChange with correct value when clicked', () => {
    const handleChange = jest.fn();
    render(
      <CheckableTag checked={false} onChange={handleChange}>
        Click Me
      </CheckableTag>
    );

    const content = screen.getByText('Click Me');
    const tag = content.closest('span')?.parentElement;
    fireEvent.click(tag!);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with opposite value when checked is true', () => {
    const handleChange = jest.fn();
    render(
      <CheckableTag checked={true} onChange={handleChange}>
        Click Me
      </CheckableTag>
    );

    const content = screen.getByText('Click Me');
    const tag = content.closest('span')?.parentElement;
    fireEvent.click(tag!);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('calls onChange with true when checked is undefined', () => {
    const handleChange = jest.fn();
    render(<CheckableTag onChange={handleChange}>Click Me</CheckableTag>);

    const content = screen.getByText('Click Me');
    const tag = content.closest('span')?.parentElement;
    fireEvent.click(tag!);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('does not call onChange when onChange is not provided', () => {
    // This should not throw an error
    render(<CheckableTag checked={false}>Click Me</CheckableTag>);

    const content = screen.getByText('Click Me');
    const tag = content.closest('span')?.parentElement;
    expect(() => fireEvent.click(tag!)).not.toThrow();
  });

  it('forwards all other props to underlying Tag component', () => {
    render(
      <CheckableTag
        checked={true}
        closeIcon
        color='#ff0000'
        bordered={false}
        style={{ margin: '10px' }}
        data-testid='forwarded-props'
      >
        Forwarded Props
      </CheckableTag>
    );

    const content = screen.getByText('Forwarded Props');
    const tag = content.closest('span')?.parentElement;
    expect(tag).toBeInTheDocument();
    expect(tag).toHaveStyle('background-color: #ff0000');
    expect(tag).toHaveStyle('margin: 10px');
    expect(tag).toHaveClass('mm-tag--borderless');

    const closeIcon = document.querySelector('.mm-tag__close');
    expect(closeIcon).toBeInTheDocument();
  });

  it('updates className when checked state changes', () => {
    const { rerender } = render(<CheckableTag checked={false}>Toggle Tag</CheckableTag>);

    let content = screen.getByText('Toggle Tag');
    let tag = content.closest('span')?.parentElement;
    expect(tag).not.toHaveClass('mm-checkable-tag--checked');

    rerender(<CheckableTag checked={true}>Toggle Tag</CheckableTag>);

    content = screen.getByText('Toggle Tag');
    tag = content.closest('span')?.parentElement;
    expect(tag).toHaveClass('mm-checkable-tag--checked');
  });

  it('updates className when custom className changes', () => {
    const { rerender } = render(
      <CheckableTag className='class1' checked>
        Dynamic Class
      </CheckableTag>
    );

    let content = screen.getByText('Dynamic Class');
    let tag = content.closest('span')?.parentElement;
    expect(tag).toHaveClass('class1');
    expect(tag).not.toHaveClass('class2');

    rerender(
      <CheckableTag className='class2' checked>
        Dynamic Class
      </CheckableTag>
    );

    content = screen.getByText('Dynamic Class');
    tag = content.closest('span')?.parentElement;
    expect(tag).not.toHaveClass('class1');
    expect(tag).toHaveClass('class2');
  });

  it('excludes onClick prop from being passed to Tag component', () => {
    const mockOnClick = jest.fn();
    const mockOnChange = jest.fn();

    render(
      <CheckableTag
        // @ts-expect-error Testing that onClick is properly omitted
        onClick={mockOnClick}
        onChange={mockOnChange}
      >
        Test Tag
      </CheckableTag>
    );

    const tag = screen.getByText('Test Tag').closest('span');
    fireEvent.click(tag!);

    // onChange should be called, but not the original onClick
    expect(mockOnChange).toHaveBeenCalledWith(true);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('works in controlled mode', () => {
    const TestComponent = () => {
      const [checked, setChecked] = React.useState(false);

      return (
        <CheckableTag checked={checked} onChange={setChecked}>
          Controlled Tag
        </CheckableTag>
      );
    };

    render(<TestComponent />);

    const content = screen.getByText('Controlled Tag');
    const tag = content.closest('span')?.parentElement;
    expect(tag).not.toHaveClass('mm-checkable-tag--checked');

    fireEvent.click(tag!);
    expect(tag).toHaveClass('mm-checkable-tag--checked');

    fireEvent.click(tag!);
    expect(tag).not.toHaveClass('mm-checkable-tag--checked');
  });
});
