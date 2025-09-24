import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextDisplay from '../TextDisplay';
import { SelectProvider } from '../context';
import type { SelectContextValue } from '../context/SelectContext';

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
  DismissCircleFilled: ({ className, ...props }: { className?: string; [key: string]: unknown }) => (
    <span className={className} data-testid='dismiss-circle' {...props}>
      ✕
    </span>
  ),
}));

describe('TextDisplay', () => {
  const defaultProps = {
    displayText: 'Selected option',
    isPlaceholder: false,
  };

  // Mock context value
  const mockContextValue: SelectContextValue = {
    prefixCls: 'test-select',
    showClear: false,
    onClear: jest.fn(),
    labelRender: undefined,
  };

  const renderWithProvider = (props: any, contextValue: SelectContextValue = mockContextValue) => {
    return render(
      <SelectProvider value={contextValue}>
        <TextDisplay {...props} />
      </SelectProvider>
    );
  };

  it('should render display text correctly', () => {
    renderWithProvider(defaultProps);

    expect(screen.getByText('Selected option')).toBeInTheDocument();
  });

  it('should render chevron down icon', () => {
    renderWithProvider(defaultProps);

    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const mockOnClick = jest.fn();

    renderWithProvider({ ...defaultProps, onClick: mockOnClick });

    fireEvent.click(screen.getByText('Selected option'));

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('should apply placeholder class when isPlaceholder is true', () => {
    const fluentuiModule = jest.requireMock('@fluentui/react-components');
    const { mergeClasses } = fluentuiModule;

    renderWithProvider({ ...defaultProps, isPlaceholder: true });

    expect(mergeClasses).toHaveBeenCalledWith('test-select__selector-text', 'test-select__selector-text--placeholder');
  });

  it('should not apply placeholder class when isPlaceholder is false', () => {
    const fluentuiModule = jest.requireMock('@fluentui/react-components');
    const { mergeClasses } = fluentuiModule;

    renderWithProvider({ ...defaultProps, isPlaceholder: false });

    expect(mergeClasses).toHaveBeenCalledWith('test-select__selector-text', false);
  });

  it('should apply correct CSS classes to elements', () => {
    const fluentuiModule = jest.requireMock('@fluentui/react-components');
    const { mergeClasses } = fluentuiModule;

    renderWithProvider(defaultProps);

    expect(mergeClasses).toHaveBeenCalledWith('test-select__selector-inner');
    expect(mergeClasses).toHaveBeenCalledWith('test-select__selector-suffix');
    expect(mergeClasses).toHaveBeenCalledWith('test-select__selector-arrow');
  });

  it('should set title attribute when selectedOption is provided', () => {
    const selectedOption = {
      value: '1',
      label: 'Apple',
      title: 'Apple option title',
    };

    renderWithProvider({ ...defaultProps, selectedOption });

    const innerElement = screen.getByText('Selected option').closest('div');
    expect(innerElement).toHaveAttribute('title', 'Apple option title');
  });

  it('should not set title attribute when selectedOption is not provided', () => {
    const mockOnClick = jest.fn();

    renderWithProvider({ displayText: 'Selected option', isPlaceholder: false, onClick: mockOnClick });

    const innerElement = screen.getByText('Selected option').closest('div');
    expect(innerElement).not.toHaveAttribute('title');
  });
  it('should handle missing onClick gracefully', () => {
    expect(() => {
      renderWithProvider(defaultProps);
      fireEvent.click(screen.getByText('Selected option'));
    }).not.toThrow();
  });

  it('should render placeholder text correctly', () => {
    renderWithProvider({ ...defaultProps, displayText: 'Please select...', isPlaceholder: true });

    expect(screen.getByText('Please select...')).toBeInTheDocument();
  });

  it('should render empty display text', () => {
    renderWithProvider({ ...defaultProps, displayText: '' });

    // The text element should still exist even if empty
    const chevronParent = screen.getByTestId('chevron-down').parentElement;
    const textElement = chevronParent?.parentElement?.querySelector('.test-select__selector-text');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveTextContent('');
  });

  it('should handle selectedOption without title', () => {
    const mockOnClick = jest.fn();
    const optionWithoutTitle = { value: 'selected', label: 'Selected option' };

    renderWithProvider({
      displayText: 'Selected option',
      isPlaceholder: false,
      onClick: mockOnClick,
      selectedOption: optionWithoutTitle,
    });

    const innerElement = screen.getByText('Selected option').closest('div');
    expect(innerElement).not.toHaveAttribute('title');
  });

  it('should apply correct prefix classes with different prefixCls', () => {
    const fluentuiModule = jest.requireMock('@fluentui/react-components');
    const { mergeClasses } = fluentuiModule;

    const customContextValue = { ...mockContextValue, prefixCls: 'custom-select' };
    renderWithProvider(defaultProps, customContextValue);

    expect(mergeClasses).toHaveBeenCalledWith('custom-select__selector-inner');
    expect(mergeClasses).toHaveBeenCalledWith('custom-select__selector-text', false);
    expect(mergeClasses).toHaveBeenCalledWith('custom-select__selector-suffix');
    expect(mergeClasses).toHaveBeenCalledWith('custom-select__selector-arrow');
  });

  it('should propagate className from mergeClasses to chevron', () => {
    renderWithProvider(defaultProps);

    const chevron = screen.getByTestId('chevron-down');
    expect(chevron).toHaveClass('test-select__selector-arrow');
  });

  it('should render clear button when showClear is true', () => {
    const mockOnClear = jest.fn();
    const contextWithClear = { ...mockContextValue, showClear: true, onClear: mockOnClear };
    renderWithProvider(defaultProps, contextWithClear);

    expect(screen.getByTestId('dismiss-circle')).toBeInTheDocument();
  });

  it('should call onClear when clear button is clicked', () => {
    const mockOnClear = jest.fn();
    const contextWithClear = { ...mockContextValue, showClear: true, onClear: mockOnClear };
    renderWithProvider(defaultProps, contextWithClear);

    fireEvent.click(screen.getByTestId('dismiss-circle'));
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('should use labelRender when provided and selectedOption exists', () => {
    const mockLabelRender = jest.fn().mockReturnValue('Custom Label');
    const selectedOption = { value: '1', label: 'Apple' };
    const contextWithLabelRender = {
      ...mockContextValue,
      labelRender: mockLabelRender,
    };

    renderWithProvider(
      {
        ...defaultProps,
        displayText: 'Original Text',
        selectedOption,
        isPlaceholder: false,
      },
      contextWithLabelRender
    );

    expect(mockLabelRender).toHaveBeenCalledWith(selectedOption);
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
    expect(screen.queryByText('Original Text')).not.toBeInTheDocument();
  });

  it('should not use labelRender when isPlaceholder is true', () => {
    const mockLabelRender = jest.fn().mockReturnValue('Custom Label');
    const selectedOption = { value: '1', label: 'Apple' };
    const contextWithLabelRender = {
      ...mockContextValue,
      labelRender: mockLabelRender,
    };

    renderWithProvider(
      {
        ...defaultProps,
        displayText: 'Placeholder Text',
        selectedOption,
        isPlaceholder: true,
      },
      contextWithLabelRender
    );

    expect(mockLabelRender).not.toHaveBeenCalled();
    expect(screen.getByText('Placeholder Text')).toBeInTheDocument();
  });
});
