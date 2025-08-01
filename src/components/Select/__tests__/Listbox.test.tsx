import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Listbox from '../Listbox';
import type { Option } from '../types';

// Mock child components
jest.mock('../OptionItem', () => {
  return function MockOptionItem({
    option,
    index,
    isSelected,
    onOptionClick,
    optionRender,
  }: {
    option: Option;
    index: number;
    isSelected: boolean;
    onOptionClick?: (option: Option) => void;
    optionRender?: (option: Option) => React.ReactNode;
  }) {
    return (
      <div data-testid={`option-item-${index}`} onClick={() => onOptionClick?.(option)}>
        {optionRender ? (
          optionRender(option)
        ) : (
          <span data-testid={`option-text-${index}`}>
            {option.label} {isSelected ? '(selected)' : ''}
          </span>
        )}
      </div>
    );
  };
});

// Mock hooks
jest.mock('../hooks', () => ({
  useFloatingPosition: jest.fn(() => ({
    floatingRef: { current: null },
  })),
  useOptionSelection: jest.fn(() => ({
    isOptionSelected: jest.fn(() => false),
  })),
}));

// Mock @fluentui/react-components
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: jest.fn((...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ')),
}));

describe('Listbox', () => {
  let mockUseFloatingPosition: jest.Mock;
  let mockUseOptionSelection: jest.Mock;
  let mockTriggerRef: React.RefObject<HTMLElement>;

  const mockOptions: Option[] = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' },
  ];

  const defaultProps = {
    isOpen: true,
    triggerRef: { current: null } as React.RefObject<HTMLElement>,
    onClose: jest.fn(),
    prefixCls: 'test-select',
  };

  beforeEach(() => {
    mockTriggerRef = { current: document.createElement('div') };

    // 引入 hooks 模块
    const hooksModule = jest.requireMock('../hooks');
    mockUseFloatingPosition = hooksModule.useFloatingPosition;
    mockUseOptionSelection = hooksModule.useOptionSelection;

    mockUseFloatingPosition.mockReturnValue({
      floatingRef: { current: null },
    });

    mockUseOptionSelection.mockReturnValue({
      isOptionSelected: jest.fn(() => false),
    });

    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(<Listbox {...defaultProps} isOpen={false} options={mockOptions} />);

    expect(screen.queryByTestId('option-item-0')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<Listbox {...defaultProps} options={mockOptions} />);

    expect(screen.getByTestId('option-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('option-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('option-item-2')).toBeInTheDocument();
  });

  it('should initialize hooks with correct parameters', () => {
    const mockOnClose = jest.fn();

    render(
      <Listbox
        {...defaultProps}
        triggerRef={mockTriggerRef}
        onClose={mockOnClose}
        value='1'
        multiple={true}
        options={mockOptions}
      />
    );

    expect(mockUseFloatingPosition).toHaveBeenCalledWith({
      isOpen: true,
      triggerRef: mockTriggerRef,
      onClickOutside: mockOnClose,
    });

    expect(mockUseOptionSelection).toHaveBeenCalledWith({
      value: '1',
      multiple: true,
    });
  });

  it('should render options correctly', () => {
    render(<Listbox {...defaultProps} options={mockOptions} />);

    expect(screen.getByTestId('option-text-0')).toHaveTextContent('Apple');
    expect(screen.getByTestId('option-text-1')).toHaveTextContent('Banana');
    expect(screen.getByTestId('option-text-2')).toHaveTextContent('Cherry');
  });

  it('should show selected state for options', () => {
    const mockIsOptionSelected = jest
      .fn()
      .mockReturnValueOnce(true) // First option selected
      .mockReturnValueOnce(false) // Second option not selected
      .mockReturnValueOnce(false); // Third option not selected

    mockUseOptionSelection.mockReturnValue({
      isOptionSelected: mockIsOptionSelected,
    });

    render(<Listbox {...defaultProps} options={mockOptions} />);

    expect(screen.getByTestId('option-text-0')).toHaveTextContent('Apple (selected)');
    expect(screen.getByTestId('option-text-1')).toHaveTextContent('Banana');
    expect(screen.getByTestId('option-text-2')).toHaveTextContent('Cherry');
  });

  it('should handle option click', () => {
    const mockOnOptionClick = jest.fn();

    render(<Listbox {...defaultProps} options={mockOptions} onOptionClick={mockOnOptionClick} />);

    fireEvent.click(screen.getByTestId('option-item-1'));

    expect(mockOnOptionClick).toHaveBeenCalledWith(mockOptions[1]);
  });

  it('should render empty state when no options', () => {
    render(<Listbox {...defaultProps} options={[]} />);

    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });

  it('should render custom empty state with correct classes', () => {
    const { mergeClasses } = jest.requireMock('@fluentui/react-components');

    render(<Listbox {...defaultProps} options={[]} />);

    expect(mergeClasses).toHaveBeenCalledWith('test-select__option', 'test-select__option--empty');
  });

  it('should use custom option render function', () => {
    const customRender = jest.fn((option: Option) => <span>Custom: {option.label}</span>);

    render(<Listbox {...defaultProps} options={mockOptions} optionRender={customRender} />);

    expect(customRender).toHaveBeenCalledTimes(3);
    expect(customRender).toHaveBeenCalledWith(mockOptions[0]);
    expect(customRender).toHaveBeenCalledWith(mockOptions[1]);
    expect(customRender).toHaveBeenCalledWith(mockOptions[2]);
  });

  it('should use custom popup render function', () => {
    const customPopupRender = jest.fn((node: React.ReactNode) => (
      <div data-testid='custom-popup'>Custom popup: {node}</div>
    ));

    render(<Listbox {...defaultProps} options={mockOptions} popupRender={customPopupRender} />);

    expect(screen.getByTestId('custom-popup')).toBeInTheDocument();
    expect(customPopupRender).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should apply correct styles to popup surface', () => {
    const { mergeClasses } = jest.requireMock('@fluentui/react-components');

    render(<Listbox {...defaultProps} options={mockOptions} />);

    expect(mergeClasses).toHaveBeenCalledWith('test-select__popover-surface');

    // Check inline styles
    const popupElement = screen.getByTestId('option-item-0').closest('div[style*="position: absolute"]');
    expect(popupElement).toHaveStyle({
      position: 'absolute',
      top: '0',
      left: '0',
      zIndex: '1000',
      visibility: 'visible',
    });
  });

  it('should apply correct styles to listbox', () => {
    const { mergeClasses } = jest.requireMock('@fluentui/react-components');

    render(<Listbox {...defaultProps} options={mockOptions} listHeight={300} />);

    expect(mergeClasses).toHaveBeenCalledWith('test-select__listbox');

    const listboxElement = screen.getByTestId('option-item-0').parentElement;
    expect(listboxElement).toHaveStyle({ maxHeight: '300px' });
  });

  it('should use default listHeight when not provided', () => {
    render(<Listbox {...defaultProps} options={mockOptions} />);

    const listboxElement = screen.getByTestId('option-item-0').parentElement;
    expect(listboxElement).toHaveStyle({ maxHeight: '256px' });
  });

  it('should pass correct props to OptionItem', () => {
    const mockIsOptionSelected = jest.fn(() => true);
    const mockOnOptionClick = jest.fn();
    const customRender = jest.fn();

    mockUseOptionSelection.mockReturnValue({
      isOptionSelected: mockIsOptionSelected,
    });

    render(
      <Listbox
        {...defaultProps}
        options={mockOptions}
        multiple={true}
        onOptionClick={mockOnOptionClick}
        optionRender={customRender}
      />
    );

    // Check that OptionItem received correct props through our mock
    expect(screen.getByTestId('option-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('option-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('option-item-2')).toBeInTheDocument();
  });

  describe('edge cases', () => {
    it('should handle undefined options', () => {
      render(<Listbox {...defaultProps} />);

      expect(screen.getByText('暂无数据')).toBeInTheDocument();
    });

    it('should handle missing onOptionClick gracefully', () => {
      expect(() => {
        render(<Listbox {...defaultProps} options={mockOptions} />);
        fireEvent.click(screen.getByTestId('option-item-0'));
      }).not.toThrow();
    });

    it('should handle options with undefined values', () => {
      const optionsWithUndefined: Option[] = [{ label: 'Option 1' } as Option, { value: '2', label: 'Option 2' }];

      render(<Listbox {...defaultProps} options={optionsWithUndefined} />);

      expect(screen.getByTestId('option-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('option-item-1')).toBeInTheDocument();
    });

    it('should handle numeric values in options', () => {
      const numericOptions: Option[] = [
        { value: 1, label: 'Option 1' } as Option,
        { value: 2, label: 'Option 2' } as Option,
      ];

      render(<Listbox {...defaultProps} options={numericOptions} />);

      expect(screen.getByTestId('option-text-0')).toHaveTextContent('Option 1');
      expect(screen.getByTestId('option-text-1')).toHaveTextContent('Option 2');
    });

    it('should use index as key for options without value', () => {
      const optionsWithoutValue: Option[] = [{ label: 'Option 1' } as Option, { label: 'Option 2' } as Option];

      expect(() => {
        render(<Listbox {...defaultProps} options={optionsWithoutValue} />);
      }).not.toThrow();

      expect(screen.getByTestId('option-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('option-item-1')).toBeInTheDocument();
    });
  });

  describe('accessibility and positioning', () => {
    it('should use floating position hook correctly', () => {
      const mockFloatingRef = { current: document.createElement('div') };
      mockUseFloatingPosition.mockReturnValue({
        floatingRef: mockFloatingRef,
      });

      render(<Listbox {...defaultProps} options={mockOptions} />);

      expect(mockUseFloatingPosition).toHaveBeenCalledWith({
        isOpen: true,
        triggerRef: defaultProps.triggerRef,
        onClickOutside: defaultProps.onClose,
      });
    });

    it('should set floating ref on popup element', () => {
      const mockFloatingRef = { current: null };
      mockUseFloatingPosition.mockReturnValue({
        floatingRef: mockFloatingRef,
      });

      render(<Listbox {...defaultProps} options={mockOptions} />);

      // The ref should be attached to the popup surface
      expect(screen.getByTestId('option-item-0').closest('[style*="position: absolute"]')).toBeInTheDocument();
    });
  });
});
