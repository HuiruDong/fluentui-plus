import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CascaderColumn from '../CascaderColumn';
import type { CascaderOption, CascaderColumnProps, CheckedStatus } from '../types';

// Mock CascaderOption component
jest.mock('../CascaderOption', () => {
  return function MockCascaderOption({
    option,
    isSelected,
    isActive,
    hasChildren,
    onClick,
    onHover,
    optionRender,
    prefixCls,
    multiple = false,
    checked = 'unchecked',
    onCheckChange,
  }: any) {
    const label = option.label || option.value?.toString() || '';

    return (
      <div
        data-testid={`option-${option.value}`}
        className={`${prefixCls}__option`}
        onClick={onClick}
        onMouseEnter={onHover}
      >
        {multiple && (
          <input
            type='checkbox'
            data-testid={`checkbox-${option.value}`}
            checked={checked === 'checked'}
            onChange={e => onCheckChange?.(e.target.checked)}
          />
        )}
        <span data-testid={`label-${option.value}`}>{optionRender ? optionRender(option) : label}</span>
        {hasChildren && (
          <span data-testid={`arrow-${option.value}`} className={`${prefixCls}__option-arrow`}>
            →
          </span>
        )}
        {isSelected && <span data-testid={`selected-${option.value}`}>✓</span>}
        {isActive && <span data-testid={`active-${option.value}`}>Active</span>}
      </div>
    );
  };
});

// Mock utils
jest.mock('../utils', () => ({
  hasChildren: (option: CascaderOption) => option.children && option.children.length > 0,
  getNodeCheckedStatus: (option: CascaderOption, checkedKeys: Set<string | number>): CheckedStatus => {
    if (checkedKeys.has(option.value!)) return 'checked';
    return 'unchecked';
  },
}));

// 测试数据
const mockOptions: CascaderOption[] = [
  {
    value: '1',
    label: 'Option 1',
    children: [
      { value: '1-1', label: 'Option 1-1' },
      { value: '1-2', label: 'Option 1-2' },
    ],
  },
  {
    value: '2',
    label: 'Option 2',
    children: [{ value: '2-1', label: 'Option 2-1' }],
  },
  {
    value: '3',
    label: 'Option 3',
    // 没有 children，是叶子节点
  },
  {
    value: '4',
    label: 'Disabled Option',
    disabled: true,
  },
];

const defaultProps: CascaderColumnProps = {
  options: mockOptions,
  level: 0,
  onSelect: jest.fn(),
  prefixCls: 'fluentui-plus-cascader',
};

describe('CascaderColumn Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<CascaderColumn {...defaultProps} />);

      const column = document.querySelector('.fluentui-plus-cascader__column');
      expect(column).toBeInTheDocument();
    });

    it('should render all options', () => {
      render(<CascaderColumn {...defaultProps} />);

      mockOptions.forEach(option => {
        expect(screen.getByTestId(`option-${option.value}`)).toBeInTheDocument();
        expect(screen.getByTestId(`label-${option.value}`)).toHaveTextContent(option.label!);
      });
    });

    it('should show arrows for options with children', () => {
      render(<CascaderColumn {...defaultProps} />);

      // Option 1 和 Option 2 有子选项，应该显示箭头
      expect(screen.getByTestId('arrow-1')).toBeInTheDocument();
      expect(screen.getByTestId('arrow-2')).toBeInTheDocument();

      // Option 3 没有子选项，不应该显示箭头
      expect(screen.queryByTestId('arrow-3')).not.toBeInTheDocument();
    });

    it('should handle options without value correctly', () => {
      const optionsWithoutValue = [{ label: 'No Value Option' }, { value: '1', label: 'With Value Option' }];

      render(<CascaderColumn {...defaultProps} options={optionsWithoutValue} />);

      expect(screen.getByText('No Value Option')).toBeInTheDocument();
      expect(screen.getByText('With Value Option')).toBeInTheDocument();
    });
  });

  describe('选中状态', () => {
    it('should show selected state correctly', () => {
      const selectedOption = mockOptions[0];

      render(<CascaderColumn {...defaultProps} selectedOption={selectedOption} />);

      expect(screen.getByTestId('selected-1')).toBeInTheDocument();
      expect(screen.queryByTestId('selected-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('selected-3')).not.toBeInTheDocument();
    });

    it('should show active state correctly', () => {
      const selectedOption = mockOptions[0];

      render(<CascaderColumn {...defaultProps} selectedOption={selectedOption} />);

      // 选中的选项应该同时是活跃状态
      expect(screen.getByTestId('active-1')).toBeInTheDocument();
      expect(screen.queryByTestId('active-2')).not.toBeInTheDocument();
    });

    it('should handle undefined selectedOption correctly', () => {
      render(<CascaderColumn {...defaultProps} selectedOption={undefined} />);

      // 没有选项应该显示为选中状态
      mockOptions.forEach(option => {
        expect(screen.queryByTestId(`selected-${option.value}`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`active-${option.value}`)).not.toBeInTheDocument();
      });
    });
  });

  describe('点击交互', () => {
    it('should handle option click correctly', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();

      render(<CascaderColumn {...defaultProps} onSelect={onSelect} />);

      const option1 = screen.getByTestId('option-1');
      await user.click(option1);

      expect(onSelect).toHaveBeenCalledWith(mockOptions[0], 0);
    });

    it('should handle click on all types of options', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();

      render(<CascaderColumn {...defaultProps} onSelect={onSelect} />);

      // 测试有子选项的选项
      await user.click(screen.getByTestId('option-1'));
      expect(onSelect).toHaveBeenCalledWith(mockOptions[0], 0);

      // 测试叶子节点选项
      await user.click(screen.getByTestId('option-3'));
      expect(onSelect).toHaveBeenCalledWith(mockOptions[2], 0);

      // 测试禁用选项
      await user.click(screen.getByTestId('option-4'));
      expect(onSelect).toHaveBeenCalledWith(mockOptions[3], 0);

      expect(onSelect).toHaveBeenCalledTimes(3);
    });
  });

  describe('悬停交互', () => {
    it('should handle hover with click trigger', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();

      render(<CascaderColumn {...defaultProps} onSelect={onSelect} expandTrigger='click' />);

      const option1 = screen.getByTestId('option-1');
      await user.hover(option1);

      // click 模式下，hover 不应该触发选择
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('should handle hover with hover trigger for options with children', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();

      render(<CascaderColumn {...defaultProps} onSelect={onSelect} expandTrigger='hover' />);

      // 有子选项的选项在 hover 时应该触发展开
      const option1 = screen.getByTestId('option-1');
      await user.hover(option1);

      expect(onSelect).toHaveBeenCalledWith(mockOptions[0], 0);
    });

    it('should not trigger selection on hover for leaf nodes even with hover trigger', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();

      render(<CascaderColumn {...defaultProps} onSelect={onSelect} expandTrigger='hover' />);

      // 叶子节点即使在 hover 模式下也不应该在 hover 时触发选择
      const option3 = screen.getByTestId('option-3');
      await user.hover(option3);

      expect(onSelect).not.toHaveBeenCalled();
    });
  });

  describe('多选模式', () => {
    it('should render checkboxes in multiple mode', () => {
      render(<CascaderColumn {...defaultProps} multiple={true} checkedKeys={new Set(['1', '3'])} />);

      mockOptions.forEach(option => {
        const checkbox = screen.getByTestId(`checkbox-${option.value}`);
        expect(checkbox).toBeInTheDocument();

        // 检查选中状态
        if (option.value === '1' || option.value === '3') {
          expect(checkbox).toBeChecked();
        } else {
          expect(checkbox).not.toBeChecked();
        }
      });
    });

    it('should handle checkbox changes in multiple mode', async () => {
      const user = userEvent.setup();
      const onCheckChange = jest.fn();

      render(
        <CascaderColumn {...defaultProps} multiple={true} onCheckChange={onCheckChange} checkedKeys={new Set()} />
      );

      const checkbox1 = screen.getByTestId('checkbox-1');
      await user.click(checkbox1);

      expect(onCheckChange).toHaveBeenCalledWith(mockOptions[0], true);
    });

    it('should handle unchecking in multiple mode', async () => {
      const user = userEvent.setup();
      const onCheckChange = jest.fn();

      render(
        <CascaderColumn
          {...defaultProps}
          multiple={true}
          onCheckChange={onCheckChange}
          checkedKeys={new Set(['1'])} // Option 1 已选中
        />
      );

      const checkbox1 = screen.getByTestId('checkbox-1');
      await user.click(checkbox1);

      expect(onCheckChange).toHaveBeenCalledWith(mockOptions[0], false);
    });

    it('should work correctly without onCheckChange callback', async () => {
      const user = userEvent.setup();

      render(
        <CascaderColumn
          {...defaultProps}
          multiple={true}
          checkedKeys={new Set(['1'])}
          // 没有传入 onCheckChange
        />
      );

      const checkbox1 = screen.getByTestId('checkbox-1');

      // 应该不会抛出错误
      await user.click(checkbox1);
      expect(checkbox1).toBeInTheDocument();
    });
  });

  describe('自定义渲染', () => {
    it('should use custom optionRender when provided', () => {
      const optionRender = jest.fn(option => `Custom: ${option.label}`);

      render(<CascaderColumn {...defaultProps} optionRender={optionRender} />);

      mockOptions.forEach(option => {
        expect(optionRender).toHaveBeenCalledWith(option);
        expect(screen.getByText(`Custom: ${option.label}`)).toBeInTheDocument();
      });
    });

    it('should fall back to label when optionRender is not provided', () => {
      render(<CascaderColumn {...defaultProps} />);

      mockOptions.forEach(option => {
        expect(screen.getByText(option.label!)).toBeInTheDocument();
      });
    });
  });

  describe('级别传递', () => {
    it('should pass correct level to option selection', async () => {
      const user = userEvent.setup();
      const onSelect = jest.fn();
      const level = 2;

      render(<CascaderColumn {...defaultProps} onSelect={onSelect} level={level} />);

      const option1 = screen.getByTestId('option-1');
      await user.click(option1);

      expect(onSelect).toHaveBeenCalledWith(mockOptions[0], level);
    });
  });

  describe('边界情况', () => {
    it('should handle empty options array', () => {
      render(<CascaderColumn {...defaultProps} options={[]} />);

      const column = document.querySelector('.fluentui-plus-cascader__column');
      expect(column).toBeInTheDocument();
      expect(column).toBeEmptyDOMElement();
    });

    it('should handle options with missing labels', () => {
      const optionsWithoutLabels = [{ value: '1' }, { value: '2', label: '' }, { value: '3', label: 'Option 3' }];

      render(<CascaderColumn {...defaultProps} options={optionsWithoutLabels} />);

      // 应该使用 value 作为显示文本
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should handle options with undefined/null values', () => {
      const optionsWithSpecialValues = [
        { value: undefined, label: 'Undefined Value' },
        { value: 0, label: 'Zero Value' },
        { value: '', label: 'Empty String Value' },
      ];

      render(<CascaderColumn {...defaultProps} options={optionsWithSpecialValues} />);

      expect(screen.getByText('Undefined Value')).toBeInTheDocument();
      expect(screen.getByText('Zero Value')).toBeInTheDocument();
      expect(screen.getByText('Empty String Value')).toBeInTheDocument();
    });
  });

  describe('属性传递', () => {
    it('should pass all required props to CascaderOption', () => {
      const props = {
        ...defaultProps,
        selectedOption: mockOptions[0],
        multiple: true,
        checkedKeys: new Set(['1']),
        onCheckChange: jest.fn(),
        optionRender: jest.fn(option => option.label),
        expandTrigger: 'hover' as const,
      };

      render(<CascaderColumn {...props} />);

      // 验证 optionRender 被调用
      expect(props.optionRender).toHaveBeenCalledTimes(mockOptions.length);

      // 验证多选相关元素存在
      expect(screen.getByTestId('checkbox-1')).toBeInTheDocument();
    });
  });
});
