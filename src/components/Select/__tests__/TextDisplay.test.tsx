import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextDisplay from '../TextDisplay';

// Mock @fluentui/react-components
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
}));

// Mock @fluentui/react-icons
jest.mock('@fluentui/react-icons', () => ({
  ChevronDownRegular: ({ className, ...props }: { className?: string; [key: string]: unknown }) => (
    <span className={className} data-testid='chevron-down' {...props}>
      ▼
    </span>
  ),
}));

describe('TextDisplay', () => {
  const defaultProps = {
    displayText: 'Selected option',
    isPlaceholder: false,
    prefixCls: 'test-select',
  };

  it('should render display text correctly', () => {
    render(<TextDisplay {...defaultProps} />);

    expect(screen.getByText('Selected option')).toBeInTheDocument();
  });

  it('should render chevron down icon', () => {
    render(<TextDisplay {...defaultProps} />);

    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const mockOnClick = jest.fn();

    render(<TextDisplay {...defaultProps} onClick={mockOnClick} />);

    fireEvent.click(screen.getByText('Selected option'));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should apply placeholder class when isPlaceholder is true', () => {
    const fluentuiModule = jest.requireMock('@fluentui/react-components');
    const { mergeClasses } = fluentuiModule;

    render(<TextDisplay {...defaultProps} isPlaceholder={true} />);

    expect(mergeClasses).toHaveBeenCalledWith('test-select__selector-text', 'test-select__selector-text--placeholder');
  });

  it('should not apply placeholder class when isPlaceholder is false', () => {
    const fluentuiModule = jest.requireMock('@fluentui/react-components');
    const { mergeClasses } = fluentuiModule;

    render(<TextDisplay {...defaultProps} isPlaceholder={false} />);

    expect(mergeClasses).toHaveBeenCalledWith('test-select__selector-text', false);
  });

  it('should apply correct CSS classes to elements', () => {
    const fluentuiModule = jest.requireMock('@fluentui/react-components');
    const { mergeClasses } = fluentuiModule;

    render(<TextDisplay {...defaultProps} />);

    expect(mergeClasses).toHaveBeenCalledWith('test-select__selector-inner');
    expect(mergeClasses).toHaveBeenCalledWith('test-select__selector-arrow');
  });

  it('should set title attribute when selectedOption is provided', () => {
    const selectedOption = {
      value: '1',
      label: 'Apple',
      title: 'Apple option title',
    };

    render(<TextDisplay {...defaultProps} selectedOption={selectedOption} />);

    const innerElement = screen.getByText('Selected option').closest('div');
    expect(innerElement).toHaveAttribute('title', 'Apple option title');
  });

  it('should not set title attribute when selectedOption is not provided', () => {
    const mockOnClick = jest.fn();

    render(
      <TextDisplay displayText='Selected option' isPlaceholder={false} onClick={mockOnClick} prefixCls='test-select' />
    );

    const innerElement = screen.getByText('Selected option').closest('div');
    expect(innerElement).not.toHaveAttribute('title');
  });
  it('should handle missing onClick gracefully', () => {
    expect(() => {
      render(<TextDisplay {...defaultProps} />);
      fireEvent.click(screen.getByText('Selected option'));
    }).not.toThrow();
  });

  it('should render placeholder text correctly', () => {
    render(<TextDisplay {...defaultProps} displayText='Please select...' isPlaceholder={true} />);

    expect(screen.getByText('Please select...')).toBeInTheDocument();
  });

  it('should render empty display text', () => {
    render(<TextDisplay {...defaultProps} displayText='' />);

    // The text element should still exist even if empty
    const chevronParent = screen.getByTestId('chevron-down').parentElement;
    const textElement = chevronParent?.parentElement?.querySelector('.test-select__selector-text');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveTextContent('');
  });

  it('should handle selectedOption without title', () => {
    const mockOnClick = jest.fn();
    const optionWithoutTitle = { value: 'selected', label: 'Selected option' };

    render(
      <TextDisplay
        displayText='Selected option'
        isPlaceholder={false}
        onClick={mockOnClick}
        selectedOption={optionWithoutTitle}
        prefixCls='test-select'
      />
    );

    const innerElement = screen.getByText('Selected option').closest('div');
    expect(innerElement).not.toHaveAttribute('title');
  });

  it('should apply correct prefix classes with different prefixCls', () => {
    const fluentuiModule = jest.requireMock('@fluentui/react-components');
    const { mergeClasses } = fluentuiModule;

    render(<TextDisplay {...defaultProps} prefixCls='custom-select' />);

    expect(mergeClasses).toHaveBeenCalledWith('custom-select__selector-inner');
    expect(mergeClasses).toHaveBeenCalledWith('custom-select__selector-text', false);
    expect(mergeClasses).toHaveBeenCalledWith('custom-select__selector-arrow');
  });

  it('should propagate className from mergeClasses to chevron', () => {
    render(<TextDisplay {...defaultProps} />);

    const chevron = screen.getByTestId('chevron-down');
    expect(chevron).toHaveClass('test-select__selector-arrow');
  });
});
