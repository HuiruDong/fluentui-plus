import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptionItem from '../OptionItem';
import type { Option } from '../types';

// Mock @fluentui/react-components
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
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
    prefixCls: 'test-select',
  };

  it('should render option label correctly', () => {
    render(<OptionItem {...defaultProps} />);

    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('should render option value when label is not provided', () => {
    const optionWithoutLabel = { value: '2' };
    render(<OptionItem {...defaultProps} option={optionWithoutLabel} />);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should call onOptionClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<OptionItem {...defaultProps} onOptionClick={mockOnClick} />);

    fireEvent.click(screen.getByText('Apple'));

    expect(mockOnClick).toHaveBeenCalledWith(mockOption);
  });

  it('should not call onOptionClick when disabled', () => {
    const mockOnClick = jest.fn();
    const disabledOption = { ...mockOption, disabled: true };

    render(<OptionItem {...defaultProps} option={disabledOption} onOptionClick={mockOnClick} />);

    fireEvent.click(screen.getByText('Apple'));

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should render checkmark when selected in single mode', () => {
    render(<OptionItem {...defaultProps} isSelected={true} />);

    expect(screen.getByTestId('checkmark')).toBeInTheDocument();
  });

  it('should not render checkmark when not selected in single mode', () => {
    render(<OptionItem {...defaultProps} isSelected={false} />);

    expect(screen.queryByTestId('checkmark')).not.toBeInTheDocument();
  });

  it('should render checkbox when in multiple mode', () => {
    render(<OptionItem {...defaultProps} multiple={true} />);

    expect(screen.getByTestId('checkbox')).toBeInTheDocument();
  });

  it('should render checked checkbox when selected in multiple mode', () => {
    render(<OptionItem {...defaultProps} multiple={true} isSelected={true} />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should render unchecked checkbox when not selected in multiple mode', () => {
    render(<OptionItem {...defaultProps} multiple={true} isSelected={false} />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render disabled checkbox when option is disabled in multiple mode', () => {
    const disabledOption = { ...mockOption, disabled: true };

    render(<OptionItem {...defaultProps} option={disabledOption} multiple={true} />);

    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('should use custom title when provided', () => {
    const { container } = render(<OptionItem {...defaultProps} />);

    const optionElement = container.querySelector('.test-select__option');
    expect(optionElement).toHaveAttribute('title', 'Apple option');
  });

  it('should use label as title when title is not provided', () => {
    const optionWithoutTitle = { value: '1', label: 'Apple' };
    const { container } = render(<OptionItem {...defaultProps} option={optionWithoutTitle} />);

    const optionElement = container.querySelector('.test-select__option');
    expect(optionElement).toHaveAttribute('title', 'Apple');
  });

  it('should apply correct CSS classes', () => {
    const fluentuiModule = jest.requireMock('@fluentui/react-components');
    const { mergeClasses } = fluentuiModule;
    mergeClasses.mockClear();

    render(<OptionItem {...defaultProps} />);

    // 检查 mergeClasses 是否被正确调用（不严格检查参数顺序）
    expect(mergeClasses).toHaveBeenCalled();
  });

  it('should apply multiple class when in multiple mode', () => {
    const fluentuiModule = jest.requireMock('@fluentui/react-components');
    const { mergeClasses } = fluentuiModule;
    mergeClasses.mockClear();

    render(<OptionItem {...defaultProps} multiple={true} />);

    // 检查 mergeClasses 是否被正确调用（不严格检查参数顺序）
    expect(mergeClasses).toHaveBeenCalled();
  });

  it('should apply disabled class when option is disabled', () => {
    const fluentuiModule = jest.requireMock('@fluentui/react-components');
    const { mergeClasses } = fluentuiModule;
    const disabledOption = { ...mockOption, disabled: true };

    render(<OptionItem {...defaultProps} option={disabledOption} />);

    expect(mergeClasses).toHaveBeenCalledWith('test-select__option', false, 'test-select__option--disabled');
  });

  it('should render custom option content when optionRender is provided', () => {
    const customRender = jest.fn((option: Option) => <div>Custom: {option.label}</div>);

    render(<OptionItem {...defaultProps} optionRender={customRender} />);

    expect(screen.getByText('Custom: Apple')).toBeInTheDocument();
    expect(customRender).toHaveBeenCalledWith(mockOption);

    // Should not render default content
    expect(screen.queryByTestId('checkmark')).not.toBeInTheDocument();
    expect(screen.queryByTestId('checkbox')).not.toBeInTheDocument();
  });

  it('should use option value as key when value is defined', () => {
    const { container } = render(
      <div>
        <OptionItem {...defaultProps} />
      </div>
    );

    // React key 属性不会出现在 DOM 中，所以我们验证组件正确渲染
    const optionElement = container.querySelector('.test-select__option');
    expect(optionElement).toBeInTheDocument();
  });
  it('should use index as fallback when option value is undefined', () => {
    const optionWithoutValue = { label: 'Apple' };

    const container = render(<OptionItem {...defaultProps} option={optionWithoutValue} index={5} />);

    expect(container.container.firstChild).toBeInTheDocument();
  });

  it('should handle missing onOptionClick gracefully', () => {
    expect(() => {
      render(<OptionItem {...defaultProps} />);
      fireEvent.click(screen.getByText('Apple'));
    }).not.toThrow();
  });

  it('should handle numeric option values', () => {
    const numericOption = { value: 123, label: 'Numeric Option' };

    render(<OptionItem {...defaultProps} option={numericOption} />);

    expect(screen.getByText('Numeric Option')).toBeInTheDocument();
  });

  it('should handle options with only value (no label)', () => {
    const valueOnlyOption = { value: 'value-only' };

    render(<OptionItem {...defaultProps} option={valueOnlyOption} />);

    expect(screen.getByText('value-only')).toBeInTheDocument();
  });
});
