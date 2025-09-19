import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CascaderOption from '../CascaderOption';
import type { CascaderOption as CascaderOptionType, CascaderOptionProps } from '../types';

// Mock FluentUI components
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' '),
  Checkbox: ({ checked, disabled, onClick, className }: any) => (
    <input
      type='checkbox'
      data-testid='checkbox'
      checked={checked === true}
      disabled={disabled}
      onChange={() => {}} // controlled by onClick
      onClick={onClick}
      className={className}
      // Handle mixed state for visual testing
      data-mixed={checked === 'mixed'}
    />
  ),
}));

// Mock FluentUI icons
jest.mock('@fluentui/react-icons', () => ({
  ChevronRightFilled: ({ className }: any) => (
    <svg className={className} data-testid='chevron-right-icon'>
      <path d='M8.293 4.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L11.586 9 8.293 5.707a1 1 0 010-1.414z' />
    </svg>
  ),
}));

// 测试数据
const mockOption: CascaderOptionType = {
  value: '1',
  label: 'Test Option',
  disabled: false,
};

const mockOptionWithChildren: CascaderOptionType = {
  value: '2',
  label: 'Parent Option',
  children: [
    { value: '2-1', label: 'Child Option 1' },
    { value: '2-2', label: 'Child Option 2' },
  ],
};

const mockDisabledOption: CascaderOptionType = {
  value: '3',
  label: 'Disabled Option',
  disabled: true,
};

const defaultProps: CascaderOptionProps = {
  option: mockOption,
  level: 0,
  isSelected: false,
  isActive: false,
  hasChildren: false,
  onClick: jest.fn(),
  prefixCls: 'fluentui-plus-cascader',
};

describe('CascaderOption Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<CascaderOption {...defaultProps} />);

      const option = screen.getByText('Test Option');
      expect(option).toBeInTheDocument();

      const container = option.closest('.fluentui-plus-cascader__option');
      expect(container).toBeInTheDocument();
    });

    it('should display option label correctly', () => {
      render(<CascaderOption {...defaultProps} />);

      expect(screen.getByText('Test Option')).toBeInTheDocument();
    });

    it('should fall back to value when label is missing', () => {
      const optionWithoutLabel = { value: 'test-value' };

      render(<CascaderOption {...defaultProps} option={optionWithoutLabel} />);

      expect(screen.getByText('test-value')).toBeInTheDocument();
    });

    it('should handle option without value and label', () => {
      const emptyOption = {};

      render(<CascaderOption {...defaultProps} option={emptyOption} />);

      // 应该显示空字符串，但元素仍然存在
      const labelElement = document.querySelector('.fluentui-plus-cascader__option-label');
      expect(labelElement).toBeInTheDocument();
    });

    it('should show arrow for options with children', () => {
      render(<CascaderOption {...defaultProps} option={mockOptionWithChildren} hasChildren={true} />);

      const arrow = document.querySelector('.fluentui-plus-cascader__option-arrow');
      expect(arrow).toBeInTheDocument();

      // 检查 SVG 元素 - 由于我们 mock 了 ChevronRightFilled，它本身就是 SVG
      expect(arrow?.tagName.toLowerCase()).toBe('svg');
    });

    it('should not show arrow for leaf options', () => {
      render(<CascaderOption {...defaultProps} hasChildren={false} />);

      const arrow = document.querySelector('.fluentui-plus-cascader__option-arrow');
      expect(arrow).not.toBeInTheDocument();
    });

    it('should apply title attribute when provided', () => {
      const optionWithTitle = {
        ...mockOption,
        title: 'Custom tooltip text',
      };

      render(<CascaderOption {...defaultProps} option={optionWithTitle} />);

      const container = document.querySelector('.fluentui-plus-cascader__option');
      expect(container).toHaveAttribute('title', 'Custom tooltip text');
    });
  });

  describe('状态样式', () => {
    it('should apply selected class when isSelected is true', () => {
      render(<CascaderOption {...defaultProps} isSelected={true} />);

      const container = document.querySelector('.fluentui-plus-cascader__option');
      expect(container).toHaveClass('fluentui-plus-cascader__option--selected');
    });

    it('should apply selected class when isActive is true', () => {
      render(<CascaderOption {...defaultProps} isActive={true} />);

      const container = document.querySelector('.fluentui-plus-cascader__option');
      expect(container).toHaveClass('fluentui-plus-cascader__option--selected');
    });

    it('should apply disabled class when option is disabled', () => {
      render(<CascaderOption {...defaultProps} option={mockDisabledOption} />);

      const container = document.querySelector('.fluentui-plus-cascader__option');
      expect(container).toHaveClass('fluentui-plus-cascader__option--disabled');
    });

    it('should apply multiple class in multiple mode', () => {
      render(<CascaderOption {...defaultProps} multiple={true} />);

      const container = document.querySelector('.fluentui-plus-cascader__option');
      expect(container).toHaveClass('fluentui-plus-cascader__option--multiple');
    });
  });

  describe('单选模式交互', () => {
    it('should handle click in single mode', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();

      render(<CascaderOption {...defaultProps} onClick={onClick} multiple={false} />);

      const option = screen.getByText('Test Option');
      await user.click(option);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger click when disabled', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();

      render(<CascaderOption {...defaultProps} option={mockDisabledOption} onClick={onClick} />);

      const option = screen.getByText('Disabled Option');
      await user.click(option);

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should handle hover correctly', async () => {
      const user = userEvent.setup();
      const onHover = jest.fn();

      render(<CascaderOption {...defaultProps} onHover={onHover} />);

      const option = screen.getByText('Test Option');
      await user.hover(option);

      expect(onHover).toHaveBeenCalledTimes(1);
    });

    it('should not trigger hover when disabled', async () => {
      const user = userEvent.setup();
      const onHover = jest.fn();

      render(<CascaderOption {...defaultProps} option={mockDisabledOption} onHover={onHover} />);

      const option = screen.getByText('Disabled Option');
      await user.hover(option);

      expect(onHover).not.toHaveBeenCalled();
    });
  });

  describe('多选模式', () => {
    it('should render checkbox in multiple mode', () => {
      render(<CascaderOption {...defaultProps} multiple={true} />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toBeInTheDocument();
    });

    it('should not render checkbox in single mode', () => {
      render(<CascaderOption {...defaultProps} multiple={false} />);

      const checkbox = screen.queryByTestId('checkbox');
      expect(checkbox).not.toBeInTheDocument();
    });

    it('should handle checked state correctly', () => {
      render(<CascaderOption {...defaultProps} multiple={true} checked='checked' />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should handle unchecked state correctly', () => {
      render(<CascaderOption {...defaultProps} multiple={true} checked='unchecked' />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should handle indeterminate state correctly', () => {
      render(<CascaderOption {...defaultProps} multiple={true} checked='indeterminate' />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveAttribute('data-mixed', 'true');
    });

    it('should handle disabled checkbox correctly', () => {
      render(<CascaderOption {...defaultProps} option={mockDisabledOption} multiple={true} />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toBeDisabled();
    });
  });

  describe('多选模式交互', () => {
    it('should handle click on leaf node in multiple mode', async () => {
      const user = userEvent.setup();
      const onCheckChange = jest.fn();

      render(
        <CascaderOption
          {...defaultProps}
          multiple={true}
          hasChildren={false}
          checked='unchecked'
          onCheckChange={onCheckChange}
        />
      );

      const option = screen.getByText('Test Option');
      await user.click(option);

      expect(onCheckChange).toHaveBeenCalledWith(true);
    });

    it('should handle click on parent node in multiple mode', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      const onCheckChange = jest.fn();

      render(
        <CascaderOption
          {...defaultProps}
          option={mockOptionWithChildren}
          multiple={true}
          hasChildren={true}
          onClick={onClick}
          onCheckChange={onCheckChange}
        />
      );

      const option = screen.getByText('Parent Option');
      await user.click(option);

      // 有子节点的选项点击应该展开，而不是切换选中状态
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onCheckChange).not.toHaveBeenCalled();
    });

    it('should handle checkbox click on parent node', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      const onCheckChange = jest.fn();

      render(
        <CascaderOption
          {...defaultProps}
          option={mockOptionWithChildren}
          multiple={true}
          hasChildren={true}
          checked='unchecked'
          onClick={onClick}
          onCheckChange={onCheckChange}
        />
      );

      const checkbox = screen.getByTestId('checkbox');
      await user.click(checkbox);

      // 复选框点击应该切换选中状态，但不展开
      expect(onCheckChange).toHaveBeenCalledWith(true);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should prevent event propagation on checkbox click', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      const onCheckChange = jest.fn();

      render(
        <CascaderOption
          {...defaultProps}
          option={mockOptionWithChildren}
          multiple={true}
          hasChildren={true}
          onClick={onClick}
          onCheckChange={onCheckChange}
        />
      );

      const checkbox = screen.getByTestId('checkbox');
      await user.click(checkbox);

      // 复选框点击不应该触发选项的点击事件
      expect(onClick).not.toHaveBeenCalled();
      expect(onCheckChange).toHaveBeenCalled();
    });

    it('should handle toggle from checked to unchecked', async () => {
      const user = userEvent.setup();
      const onCheckChange = jest.fn();

      render(
        <CascaderOption
          {...defaultProps}
          multiple={true}
          hasChildren={false}
          checked='checked'
          onCheckChange={onCheckChange}
        />
      );

      const option = screen.getByText('Test Option');
      await user.click(option);

      expect(onCheckChange).toHaveBeenCalledWith(false);
    });

    it('should not handle checkbox events when disabled', async () => {
      const user = userEvent.setup();
      const onCheckChange = jest.fn();

      render(
        <CascaderOption
          {...defaultProps}
          option={mockDisabledOption}
          multiple={true}
          hasChildren={true}
          onCheckChange={onCheckChange}
        />
      );

      const checkbox = screen.getByTestId('checkbox');
      await user.click(checkbox);

      expect(onCheckChange).not.toHaveBeenCalled();
    });
  });

  describe('自定义渲染', () => {
    it('should use custom optionRender when provided', () => {
      const optionRender = jest.fn(option => <span data-testid='custom-render'>Custom: {option.label}</span>);

      render(<CascaderOption {...defaultProps} optionRender={optionRender} />);

      expect(optionRender).toHaveBeenCalledWith(mockOption);
      expect(screen.getByTestId('custom-render')).toBeInTheDocument();
      expect(screen.getByText('Custom: Test Option')).toBeInTheDocument();
    });

    it('should fall back to default rendering when optionRender is not provided', () => {
      render(<CascaderOption {...defaultProps} />);

      expect(screen.getByText('Test Option')).toBeInTheDocument();
      expect(screen.queryByTestId('custom-render')).not.toBeInTheDocument();
    });
  });

  describe('回调函数', () => {
    it('should work without onHover callback', async () => {
      const user = userEvent.setup();

      render(
        <CascaderOption
          {...defaultProps}
          // 没有传入 onHover
        />
      );

      const option = screen.getByText('Test Option');

      // 应该不会抛出错误
      await user.hover(option);
      expect(option).toBeInTheDocument();
    });

    it('should work without onCheckChange callback in multiple mode', async () => {
      const user = userEvent.setup();

      render(
        <CascaderOption
          {...defaultProps}
          multiple={true}
          hasChildren={false}
          // 没有传入 onCheckChange
        />
      );

      const option = screen.getByText('Test Option');

      // 应该不会抛出错误
      await user.click(option);
      expect(option).toBeInTheDocument();
    });
  });

  describe('边界情况', () => {
    it('should handle option with numeric value', () => {
      const numericOption = {
        value: 123,
        label: 'Numeric Option',
      };

      render(<CascaderOption {...defaultProps} option={numericOption} />);

      expect(screen.getByText('Numeric Option')).toBeInTheDocument();
    });

    it('should handle option with zero value', () => {
      const zeroValueOption = {
        value: 0,
        label: 'Zero Value',
      };

      render(<CascaderOption {...defaultProps} option={zeroValueOption} />);

      expect(screen.getByText('Zero Value')).toBeInTheDocument();
    });

    it('should handle option with empty string value', () => {
      const emptyStringOption = {
        value: '',
        label: 'Empty String Value',
      };

      render(<CascaderOption {...defaultProps} option={emptyStringOption} />);

      expect(screen.getByText('Empty String Value')).toBeInTheDocument();
    });

    it('should handle option with undefined value but with label', () => {
      const undefinedValueOption = {
        value: undefined,
        label: 'Undefined Value',
      };

      render(<CascaderOption {...defaultProps} option={undefinedValueOption} />);

      expect(screen.getByText('Undefined Value')).toBeInTheDocument();
    });
  });

  describe('CSS 类名', () => {
    it('should apply correct CSS classes based on props', () => {
      render(<CascaderOption {...defaultProps} isSelected={true} multiple={true} option={mockDisabledOption} />);

      const container = document.querySelector('.fluentui-plus-cascader__option');
      expect(container).toHaveClass('fluentui-plus-cascader__option--selected');
      expect(container).toHaveClass('fluentui-plus-cascader__option--disabled');
      expect(container).toHaveClass('fluentui-plus-cascader__option--multiple');
    });

    it('should apply checkbox CSS class', () => {
      render(<CascaderOption {...defaultProps} multiple={true} />);

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).toHaveClass('fluentui-plus-cascader__option-checkbox');
    });

    it('should apply label CSS class', () => {
      render(<CascaderOption {...defaultProps} />);

      const label = document.querySelector('.fluentui-plus-cascader__option-label');
      expect(label).toBeInTheDocument();
      expect(label).toHaveTextContent('Test Option');
    });
  });
});
