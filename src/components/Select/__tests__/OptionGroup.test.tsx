import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptionGroup from '../OptionGroup';
import type { OptionGroup as OptionGroupType, Option } from '../types';

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

describe('OptionGroup', () => {
  const mockGroup: OptionGroupType = {
    label: 'Fruits',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry', disabled: true },
    ],
  };

  const defaultProps = {
    group: mockGroup,
    prefixCls: 'test-select',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render group label correctly', () => {
    render(<OptionGroup {...defaultProps} />);

    expect(screen.getByText('Fruits')).toBeInTheDocument();
  });

  it('should render all options in the group', () => {
    render(<OptionGroup {...defaultProps} />);

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });

  it('should apply correct CSS classes to group elements', () => {
    const { container } = render(<OptionGroup {...defaultProps} />);

    const groupElement = container.querySelector('.test-select__group');
    const groupLabelElement = container.querySelector('.test-select__group-label');
    const groupOptionsElement = container.querySelector('.test-select__group-options');

    expect(groupElement).toBeInTheDocument();
    expect(groupLabelElement).toBeInTheDocument();
    expect(groupOptionsElement).toBeInTheDocument();
  });

  it('should set title attribute on group label', () => {
    const { container } = render(<OptionGroup {...defaultProps} />);

    const groupLabelElement = container.querySelector('.test-select__group-label');
    expect(groupLabelElement).toHaveAttribute('title', 'Fruits');
  });

  it('should pass correct props to OptionItem components', () => {
    const mockOnOptionClick = jest.fn();
    const selectedValues = ['apple', 'banana'];

    render(
      <OptionGroup
        {...defaultProps}
        multiple={true}
        selectedValues={selectedValues}
        onOptionClick={mockOnOptionClick}
      />
    );

    // 验证选中状态
    const checkboxes = screen.getAllByTestId('checkbox');
    expect(checkboxes[0]).toBeChecked(); // Apple
    expect(checkboxes[1]).toBeChecked(); // Banana
    expect(checkboxes[2]).not.toBeChecked(); // Cherry
  });

  it('should handle option clicks correctly', () => {
    const mockOnOptionClick = jest.fn();

    render(<OptionGroup {...defaultProps} onOptionClick={mockOnOptionClick} />);

    fireEvent.click(screen.getByText('Apple'));

    expect(mockOnOptionClick).toHaveBeenCalledWith(mockGroup.options[0]);
  });

  it('should not call onOptionClick for disabled options', () => {
    const mockOnOptionClick = jest.fn();

    render(<OptionGroup {...defaultProps} onOptionClick={mockOnOptionClick} />);

    fireEvent.click(screen.getByText('Cherry'));

    expect(mockOnOptionClick).not.toHaveBeenCalled();
  });

  it('should work in single selection mode', () => {
    const selectedValues = ['banana'];

    render(<OptionGroup {...defaultProps} multiple={false} selectedValues={selectedValues} />);

    // 在单选模式下，应该显示 checkmark 而不是 checkbox
    expect(screen.getByTestId('checkmark')).toBeInTheDocument();
    expect(screen.queryByTestId('checkbox')).not.toBeInTheDocument();
  });

  it('should work in multiple selection mode', () => {
    const selectedValues = ['apple', 'banana'];

    render(<OptionGroup {...defaultProps} multiple={true} selectedValues={selectedValues} />);

    // 在多选模式下，应该显示 checkbox
    const checkboxes = screen.getAllByTestId('checkbox');
    expect(checkboxes).toHaveLength(3);
    expect(checkboxes[0]).toBeChecked(); // Apple
    expect(checkboxes[1]).toBeChecked(); // Banana
    expect(checkboxes[2]).not.toBeChecked(); // Cherry
  });

  it('should handle empty selectedValues array', () => {
    render(<OptionGroup {...defaultProps} multiple={true} selectedValues={[]} />);

    const checkboxes = screen.getAllByTestId('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it('should handle undefined selectedValues', () => {
    render(<OptionGroup {...defaultProps} multiple={true} selectedValues={undefined} />);

    const checkboxes = screen.getAllByTestId('checkbox');
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it('should use custom optionRender when provided', () => {
    const customRender = jest.fn((option: Option) => <div data-testid='custom-option'>Custom: {option.label}</div>);

    render(<OptionGroup {...defaultProps} optionRender={customRender} />);

    expect(screen.getAllByTestId('custom-option')).toHaveLength(3);
    expect(screen.getByText('Custom: Apple')).toBeInTheDocument();
    expect(screen.getByText('Custom: Banana')).toBeInTheDocument();
    expect(screen.getByText('Custom: Cherry')).toBeInTheDocument();

    expect(customRender).toHaveBeenCalledTimes(3);
    expect(customRender).toHaveBeenCalledWith(mockGroup.options[0]);
    expect(customRender).toHaveBeenCalledWith(mockGroup.options[1]);
    expect(customRender).toHaveBeenCalledWith(mockGroup.options[2]);
  });

  it('should handle group with empty options array', () => {
    const emptyGroup: OptionGroupType = {
      label: 'Empty Group',
      options: [],
    };

    const { container } = render(<OptionGroup {...defaultProps} group={emptyGroup} />);

    expect(screen.getByText('Empty Group')).toBeInTheDocument();

    const groupOptionsElement = container.querySelector('.test-select__group-options');
    expect(groupOptionsElement).toBeInTheDocument();
    expect(groupOptionsElement?.children).toHaveLength(0);
  });

  it('should handle group with single option', () => {
    const singleOptionGroup: OptionGroupType = {
      label: 'Single Option Group',
      options: [{ value: 'single', label: 'Single Option' }],
    };

    render(<OptionGroup {...defaultProps} group={singleOptionGroup} />);

    expect(screen.getByText('Single Option Group')).toBeInTheDocument();
    expect(screen.getByText('Single Option')).toBeInTheDocument();
  });

  it('should use option value as key when value is defined', () => {
    const { container } = render(<OptionGroup {...defaultProps} />);

    // 验证所有选项都被正确渲染
    const optionElements = container.querySelectorAll('.test-select__option');
    expect(optionElements).toHaveLength(3);
  });

  it('should use index as fallback key when option value is undefined', () => {
    const groupWithUndefinedValues: OptionGroupType = {
      label: 'Group with undefined values',
      options: [{ label: 'Option 1' }, { label: 'Option 2' }, { label: 'Option 3' }],
    };

    render(<OptionGroup {...defaultProps} group={groupWithUndefinedValues} />);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should handle numeric values in selectedValues', () => {
    const groupWithNumericValues: OptionGroupType = {
      label: 'Numeric Group',
      options: [
        { value: 1, label: 'One' },
        { value: 2, label: 'Two' },
        { value: 3, label: 'Three' },
      ],
    };

    const selectedValues = [1, 3];

    render(
      <OptionGroup {...defaultProps} group={groupWithNumericValues} multiple={true} selectedValues={selectedValues} />
    );

    const checkboxes = screen.getAllByTestId('checkbox');
    expect(checkboxes[0]).toBeChecked(); // One
    expect(checkboxes[1]).not.toBeChecked(); // Two
    expect(checkboxes[2]).toBeChecked(); // Three
  });

  it('should handle mixed string and numeric values', () => {
    const groupWithMixedValues: OptionGroupType = {
      label: 'Mixed Group',
      options: [
        { value: 'string', label: 'String Option' },
        { value: 42, label: 'Numeric Option' },
        { value: 'another', label: 'Another String' },
      ],
    };

    const selectedValues = ['string', 42];

    render(
      <OptionGroup {...defaultProps} group={groupWithMixedValues} multiple={true} selectedValues={selectedValues} />
    );

    const checkboxes = screen.getAllByTestId('checkbox');
    expect(checkboxes[0]).toBeChecked(); // String Option
    expect(checkboxes[1]).toBeChecked(); // Numeric Option
    expect(checkboxes[2]).not.toBeChecked(); // Another String
  });

  it('should handle long group labels correctly', () => {
    const longLabelGroup: OptionGroupType = {
      label: 'This is a very long group label that might overflow in some layouts',
      options: [{ value: 'test', label: 'Test Option' }],
    };

    const { container } = render(<OptionGroup {...defaultProps} group={longLabelGroup} />);

    const groupLabelElement = container.querySelector('.test-select__group-label');
    expect(groupLabelElement).toHaveTextContent('This is a very long group label that might overflow in some layouts');
    expect(groupLabelElement).toHaveAttribute('title', longLabelGroup.label);
  });

  it('should handle special characters in group labels', () => {
    const specialCharGroup: OptionGroupType = {
      label: 'Group with special chars: <>&"\'',
      options: [{ value: 'test', label: 'Test Option' }],
    };

    render(<OptionGroup {...defaultProps} group={specialCharGroup} />);

    expect(screen.getByText('Group with special chars: <>&"\'')).toBeInTheDocument();
  });

  it('should maintain proper accessibility attributes', () => {
    const { container } = render(<OptionGroup {...defaultProps} />);

    const groupLabelElement = container.querySelector('.test-select__group-label');

    // 验证 title 属性存在用于可访问性
    expect(groupLabelElement).toHaveAttribute('title', 'Fruits');
  });
});
