import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptionGroup from '../OptionGroup';
import { SelectProvider } from '../context';
import type { SelectContextValue } from '../context/SelectContext';
import type { OptionGroup as OptionGroupType, Option } from '../types';

// Mock OptionItem component
jest.mock('../OptionItem', () => {
  return function MockOptionItem({
    option,
    index,
    isSelected,
  }: {
    option: Option;
    index: number;
    isSelected: boolean;
  }) {
    return (
      <div data-testid={`option-item-${option.value || index}`} data-selected={isSelected} data-index={index}>
        {option.label || option.value}
      </div>
    );
  };
});

// Mock useSelectContext
jest.mock('../context', () => ({
  ...jest.requireActual('../context'),
  useSelectContext: jest.fn(),
}));

describe('OptionGroup', () => {
  const mockOptions: Option[] = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' },
  ];

  const mockGroup: OptionGroupType = {
    label: 'Fruits',
    options: mockOptions,
  };

  const defaultProps = {
    group: mockGroup,
    selectedValues: [],
  };

  // Mock context value
  const mockContextValue: SelectContextValue = {
    prefixCls: 'test-select',
    multiple: false,
  };

  const mockUseSelectContext = jest.requireMock('../context').useSelectContext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSelectContext.mockReturnValue(mockContextValue);
  });

  const renderWithProvider = (props: any, contextValue: SelectContextValue = mockContextValue) => {
    mockUseSelectContext.mockReturnValue(contextValue);
    return render(
      <SelectProvider value={contextValue}>
        <OptionGroup {...props} />
      </SelectProvider>
    );
  };

  describe('基础渲染', () => {
    it('should render group label correctly', () => {
      renderWithProvider(defaultProps);

      expect(screen.getByText('Fruits')).toBeInTheDocument();
    });

    it('should render all options in the group', () => {
      renderWithProvider(defaultProps);

      expect(screen.getByTestId('option-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('option-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('option-item-3')).toBeInTheDocument();
    });

    it('should apply correct CSS classes', () => {
      const { container } = renderWithProvider(defaultProps);

      const groupElement = container.querySelector('.test-select__group');
      expect(groupElement).toBeInTheDocument();

      const labelElement = container.querySelector('.test-select__group-label');
      expect(labelElement).toBeInTheDocument();

      const optionsElement = container.querySelector('.test-select__group-options');
      expect(optionsElement).toBeInTheDocument();
    });

    it('should set title attribute on group label', () => {
      const { container } = renderWithProvider(defaultProps);

      const labelElement = container.querySelector('.test-select__group-label');
      expect(labelElement).toHaveAttribute('title', 'Fruits');
    });
  });

  describe('选中状态处理', () => {
    it('should pass correct isSelected prop to OptionItem when no values are selected', () => {
      renderWithProvider(defaultProps);

      expect(screen.getByTestId('option-item-1')).toHaveAttribute('data-selected', 'false');
      expect(screen.getByTestId('option-item-2')).toHaveAttribute('data-selected', 'false');
      expect(screen.getByTestId('option-item-3')).toHaveAttribute('data-selected', 'false');
    });

    it('should pass correct isSelected prop when some values are selected', () => {
      const propsWithSelection = {
        ...defaultProps,
        selectedValues: ['1', '3'],
      };

      renderWithProvider(propsWithSelection);

      expect(screen.getByTestId('option-item-1')).toHaveAttribute('data-selected', 'true');
      expect(screen.getByTestId('option-item-2')).toHaveAttribute('data-selected', 'false');
      expect(screen.getByTestId('option-item-3')).toHaveAttribute('data-selected', 'true');
    });

    it('should handle numeric selected values', () => {
      const numericGroup: OptionGroupType = {
        label: 'Numbers',
        options: [
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
          { value: 3, label: 'Three' },
        ],
      };

      const propsWithNumericSelection = {
        group: numericGroup,
        selectedValues: [1, 3],
      };

      renderWithProvider(propsWithNumericSelection);

      expect(screen.getByTestId('option-item-1')).toHaveAttribute('data-selected', 'true');
      expect(screen.getByTestId('option-item-2')).toHaveAttribute('data-selected', 'false');
      expect(screen.getByTestId('option-item-3')).toHaveAttribute('data-selected', 'true');
    });

    it('should handle empty selectedValues array', () => {
      const propsWithEmptySelection = {
        ...defaultProps,
        selectedValues: [],
      };

      renderWithProvider(propsWithEmptySelection);

      expect(screen.getByTestId('option-item-1')).toHaveAttribute('data-selected', 'false');
      expect(screen.getByTestId('option-item-2')).toHaveAttribute('data-selected', 'false');
      expect(screen.getByTestId('option-item-3')).toHaveAttribute('data-selected', 'false');
    });

    it('should use empty array as default when selectedValues is undefined', () => {
      const propsWithoutSelection = {
        group: mockGroup,
        // selectedValues 未传递，应该使用默认值 []
      };

      renderWithProvider(propsWithoutSelection);

      expect(screen.getByTestId('option-item-1')).toHaveAttribute('data-selected', 'false');
      expect(screen.getByTestId('option-item-2')).toHaveAttribute('data-selected', 'false');
      expect(screen.getByTestId('option-item-3')).toHaveAttribute('data-selected', 'false');
    });
  });

  describe('选项处理', () => {
    it('should pass correct index to each OptionItem', () => {
      renderWithProvider(defaultProps);

      expect(screen.getByTestId('option-item-1')).toHaveAttribute('data-index', '0');
      expect(screen.getByTestId('option-item-2')).toHaveAttribute('data-index', '1');
      expect(screen.getByTestId('option-item-3')).toHaveAttribute('data-index', '2');
    });

    it('should handle options without value', () => {
      const groupWithoutValues: OptionGroupType = {
        label: 'Items',
        options: [{ label: 'Item One' }, { label: 'Item Two' }],
      };

      const props = {
        group: groupWithoutValues,
        selectedValues: [],
      };

      renderWithProvider(props);

      expect(screen.getByTestId('option-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('option-item-1')).toBeInTheDocument();
    });

    it('should handle empty options array', () => {
      const emptyGroup: OptionGroupType = {
        label: 'Empty Group',
        options: [],
      };

      const props = {
        group: emptyGroup,
        selectedValues: [],
      };

      renderWithProvider(props);

      expect(screen.getByText('Empty Group')).toBeInTheDocument();
      expect(screen.queryByTestId(/option-item/)).not.toBeInTheDocument();
    });

    it('should handle mixed value types in options', () => {
      const mixedGroup: OptionGroupType = {
        label: 'Mixed Types',
        options: [{ value: 'string-value', label: 'String' }, { value: 123, label: 'Number' }, { label: 'No Value' }],
      };

      const props = {
        group: mixedGroup,
        selectedValues: ['string-value', 123],
      };

      renderWithProvider(props);

      expect(screen.getByTestId('option-item-string-value')).toHaveAttribute('data-selected', 'true');
      expect(screen.getByTestId('option-item-123')).toHaveAttribute('data-selected', 'true');
      expect(screen.getByTestId('option-item-2')).toHaveAttribute('data-selected', 'false');
    });
  });

  describe('Context 集成', () => {
    it('should use prefixCls from context', () => {
      const customContext = {
        ...mockContextValue,
        prefixCls: 'custom-select',
      };

      const { container } = renderWithProvider(defaultProps, customContext);

      expect(container.querySelector('.custom-select__group')).toBeInTheDocument();
      expect(container.querySelector('.custom-select__group-label')).toBeInTheDocument();
      expect(container.querySelector('.custom-select__group-options')).toBeInTheDocument();
    });

    it('should throw error when used outside SelectProvider', () => {
      // 模拟 useSelectContext 抛出错误
      mockUseSelectContext.mockImplementation(() => {
        throw new Error('useSelectContext must be used within SelectProvider');
      });

      // 使用 console.error mock 来避免测试输出中的错误信息
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<OptionGroup {...defaultProps} />);
      }).toThrow('useSelectContext must be used within SelectProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('边界情况', () => {
    it('should handle very long group label', () => {
      const longLabelGroup: OptionGroupType = {
        label: 'This is a very long group label that might cause layout issues',
        options: [{ value: '1', label: 'Option' }],
      };

      const props = {
        group: longLabelGroup,
        selectedValues: [],
      };

      renderWithProvider(props);

      expect(screen.getByText('This is a very long group label that might cause layout issues')).toBeInTheDocument();
    });

    it('should handle special characters in group label', () => {
      const specialCharGroup: OptionGroupType = {
        label: 'Group & <Special> "Characters" 你好',
        options: [{ value: '1', label: 'Option' }],
      };

      const props = {
        group: specialCharGroup,
        selectedValues: [],
      };

      renderWithProvider(props);

      expect(screen.getByText('Group & <Special> "Characters" 你好')).toBeInTheDocument();
    });

    it('should handle large number of options', () => {
      const largeOptions = Array.from({ length: 100 }, (_, i) => ({
        value: `option-${i}`,
        label: `Option ${i}`,
      }));

      const largeGroup: OptionGroupType = {
        label: 'Large Group',
        options: largeOptions,
      };

      const props = {
        group: largeGroup,
        selectedValues: ['option-0', 'option-50', 'option-99'],
      };

      renderWithProvider(props);

      expect(screen.getByTestId('option-item-option-0')).toHaveAttribute('data-selected', 'true');
      expect(screen.getByTestId('option-item-option-50')).toHaveAttribute('data-selected', 'true');
      expect(screen.getByTestId('option-item-option-99')).toHaveAttribute('data-selected', 'true');
      expect(screen.getByTestId('option-item-option-1')).toHaveAttribute('data-selected', 'false');
    });
  });
});
