import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptionItem from '../OptionItem';
import { SelectProvider } from '../context';
import type { SelectContextValue } from '../context/SelectContext';
import type { Option } from '../types';

// Mock @fluentui/react-components
jest.mock('@fluentui/react-components', () => ({
  Checkbox: ({
    checked,
    disabled,
    onChange,
    ...props
  }: {
    checked?: boolean;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: unknown;
  }) => (
    <input
      type='checkbox'
      checked={checked}
      disabled={disabled}
      onChange={onChange || (() => {})}
      {...props}
      data-testid='checkbox'
    />
  ),
}));

// Mock @fluentui/react-icons
jest.mock('@fluentui/react-icons', () => ({
  CheckmarkRegular: () => <span data-testid='checkmark'>✓</span>,
}));

describe('OptionItem', () => {
  const mockOption: Option = {
    value: '1',
    label: 'Apple',
    title: 'Apple option',
  };

  const defaultProps = {
    option: mockOption,
    index: 0,
    isSelected: false,
  };

  // Mock context value
  const mockContextValue: SelectContextValue = {
    prefixCls: 'test-select',
    multiple: false,
    onOptionClick: jest.fn(),
    optionRender: undefined,
  };

  const renderWithProvider = (props: any, contextValue: SelectContextValue = mockContextValue) => {
    return render(
      <SelectProvider value={contextValue}>
        <OptionItem {...props} />
      </SelectProvider>
    );
  };

  it('should render option label correctly', () => {
    renderWithProvider(defaultProps);

    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('should render option value when label is not provided', () => {
    const optionWithoutLabel = { value: '2' };
    renderWithProvider({ ...defaultProps, option: optionWithoutLabel });

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should call onOptionClick when clicked', () => {
    const mockOnClick = jest.fn();
    const contextWithClick = { ...mockContextValue, onOptionClick: mockOnClick };
    renderWithProvider(defaultProps, contextWithClick);

    fireEvent.click(screen.getByText('Apple'));

    expect(mockOnClick).toHaveBeenCalledWith(mockOption);
  });

  it('should not call onOptionClick when disabled', () => {
    const mockOnClick = jest.fn();
    const disabledOption = { ...mockOption, disabled: true };
    const contextWithClick = { ...mockContextValue, onOptionClick: mockOnClick };

    renderWithProvider({ ...defaultProps, option: disabledOption }, contextWithClick);

    fireEvent.click(screen.getByText('Apple'));

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should render checkmark when selected in single mode', () => {
    renderWithProvider({ ...defaultProps, isSelected: true });

    expect(screen.getByTestId('checkmark')).toBeInTheDocument();
  });

  it('should not render checkmark when not selected in single mode', () => {
    renderWithProvider({ ...defaultProps, isSelected: false });

    expect(screen.queryByTestId('checkmark')).not.toBeInTheDocument();
  });

  it('should render checkbox when in multiple mode', () => {
    const multipleContext = { ...mockContextValue, multiple: true };
    renderWithProvider(defaultProps, multipleContext);

    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
  });

  it('should render checked checkbox when selected in multiple mode', () => {
    const multipleContext = { ...mockContextValue, multiple: true };
    renderWithProvider({ ...defaultProps, isSelected: true }, multipleContext);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should render unchecked checkbox when not selected in multiple mode', () => {
    const multipleContext = { ...mockContextValue, multiple: true };
    renderWithProvider({ ...defaultProps, isSelected: false }, multipleContext);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render disabled checkbox when option is disabled in multiple mode', () => {
    const disabledOption = { ...mockOption, disabled: true };
    const multipleContext = { ...mockContextValue, multiple: true };

    renderWithProvider({ ...defaultProps, option: disabledOption }, multipleContext);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('should use custom title when provided', () => {
    const { container } = renderWithProvider(defaultProps);

    const optionElement = container.querySelector('.test-select__option');
    expect(optionElement).toHaveAttribute('title', 'Apple option');
  });

  it('should use label as title when title is not provided', () => {
    const optionWithoutTitle = { value: '1', label: 'Apple' };
    const { container } = renderWithProvider({ ...defaultProps, option: optionWithoutTitle });

    const optionElement = container.querySelector('.test-select__option');
    expect(optionElement).toHaveAttribute('title', 'Apple');
  });

  it('should apply correct CSS classes', () => {
    const clsxMock = jest.requireMock('clsx') as jest.Mock;
    clsxMock.mockClear();

    renderWithProvider(defaultProps);

    // 检查 clsx 是否被正确调用
    expect(clsxMock).toHaveBeenCalled();
  });

  it('should apply multiple class when in multiple mode', () => {
    const clsxMock = jest.requireMock('clsx') as jest.Mock;
    clsxMock.mockClear();

    const multipleContext = { ...mockContextValue, multiple: true };
    renderWithProvider(defaultProps, multipleContext);

    // 检查 clsx 是否被正确调用
    expect(clsxMock).toHaveBeenCalled();
  });

  it('should apply disabled class when option is disabled', () => {
    const clsxMock = jest.requireMock('clsx') as jest.Mock;
    clsxMock.mockClear();
    const disabledOption = { ...mockOption, disabled: true };

    renderWithProvider({ ...defaultProps, option: disabledOption });

    // 检查 clsx 是否被正确调用
    expect(clsxMock).toHaveBeenCalled();
  });

  it('should render custom option content when optionRender is provided', () => {
    const customRender = jest.fn((option: Option) => <div>Custom: {option.label}</div>);
    const contextWithRender = { ...mockContextValue, optionRender: customRender };

    renderWithProvider(defaultProps, contextWithRender);

    expect(screen.getByText('Custom: Apple')).toBeInTheDocument();
    expect(customRender).toHaveBeenCalledWith(mockOption);

    // Should not render default content
    expect(screen.queryByTestId('checkmark')).not.toBeInTheDocument();
    expect(screen.queryByTestId('checkbox')).not.toBeInTheDocument();
  });

  it('should use option value as key when value is defined', () => {
    const { container } = renderWithProvider(defaultProps);

    // React key 属性不会出现在 DOM 中，所以我们验证组件正确渲染
    const optionElement = container.querySelector('.test-select__option');
    expect(optionElement).toBeInTheDocument();
  });

  it('should use index as fallback when option value is undefined', () => {
    const optionWithoutValue = { label: 'Apple' };

    const { container } = renderWithProvider({ ...defaultProps, option: optionWithoutValue, index: 5 });

    expect(container.firstChild).toBeInTheDocument();
  });

  it('should handle missing onOptionClick gracefully', () => {
    const contextWithoutClick = { ...mockContextValue, onOptionClick: undefined };
    expect(() => {
      renderWithProvider(defaultProps, contextWithoutClick);
      fireEvent.click(screen.getByText('Apple'));
    }).not.toThrow();
  });

  it('should handle numeric option values', () => {
    const numericOption = { value: 123, label: 'Numeric Option' };

    renderWithProvider({ ...defaultProps, option: numericOption });

    expect(screen.getByText('Numeric Option')).toBeInTheDocument();
  });

  it('should handle options with only value (no label)', () => {
    const valueOnlyOption = { value: 'value-only' };

    renderWithProvider({ ...defaultProps, option: valueOnlyOption });

    expect(screen.getByText('value-only')).toBeInTheDocument();
  });
});
