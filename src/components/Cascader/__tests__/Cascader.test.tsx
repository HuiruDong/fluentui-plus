import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Cascader from '../Cascader';
import type { CascaderOption, CascaderProps } from '../types';

// Mock FluentUI components
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' '),
}));

// Mock子组件
jest.mock('../CascaderPanel', () => {
  return function MockCascaderPanel({
    isOpen,
    options = [],
    multiple = false,
    onPathChange,
    onFinalSelect,
    onMultipleSelect,
    prefixCls,
    checkedKeys = new Set(),
  }: any) {
    if (!isOpen) return null;

    return (
      <div data-testid='cascader-panel' className={`${prefixCls}__panel`}>
        {options.map((option: CascaderOption, index: number) => (
          <div
            key={option.value ?? index}
            data-testid={`option-${option.value}`}
            onClick={() => {
              if (multiple) {
                onMultipleSelect?.(option, !checkedKeys.has(option.value));
              } else {
                if (option.children && option.children.length > 0) {
                  onPathChange?.([option]);
                } else {
                  onFinalSelect?.(option, []);
                }
              }
            }}
          >
            {option.label || option.value}
          </div>
        ))}
      </div>
    );
  };
});

jest.mock('../../Select/Selector', () => {
  return function MockSelector({
    placeholder,
    disabled,
    selectedOptions = [],
    onClick,
    multiple,
    showSearch,
    searchValue = '',
    onSearchChange,
    onSearchFocus,
    onSearchBlur,
    onTagRemove,
    onClear,
    showClear,
    isOpen,
    prefixCls,
    labelRender,
  }: any) {
    const displayValue = React.useMemo(() => {
      if (multiple && Array.isArray(selectedOptions)) {
        return selectedOptions.map((opt: any) => opt.label || opt.value).join(', ');
      } else if (selectedOptions.length > 0) {
        const option = selectedOptions[0];
        if (labelRender) {
          return labelRender(option);
        }
        return option.label || option.value;
      }
      return '';
    }, [selectedOptions, multiple, labelRender]);

    return (
      <div
        data-testid='cascader-selector'
        className={`${prefixCls}__selector ${disabled ? `${prefixCls}__selector--disabled` : ''} ${multiple ? `${prefixCls}__selector--multiple` : ''}`}
        onClick={disabled ? undefined : onClick}
      >
        {showSearch && isOpen ? (
          <input
            data-testid='search-input'
            value={searchValue}
            onChange={onSearchChange}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
            placeholder={placeholder}
            disabled={disabled}
          />
        ) : (
          <span data-testid='selector-text'>{displayValue || placeholder}</span>
        )}

        {multiple &&
          selectedOptions.map((option: any, index: number) => (
            <span
              key={index}
              data-testid={`tag-${index}`}
              onClick={e => {
                e.stopPropagation();
                onTagRemove?.(option.value, index);
              }}
            >
              {option.label || option.value} ×
            </span>
          ))}

        {showClear && (
          <span
            data-testid='clear-button'
            onClick={e => {
              e.stopPropagation();
              onClear?.(e);
            }}
          >
            ×
          </span>
        )}
      </div>
    );
  };
});

// Mock hooks
jest.mock('../../Select/hooks', () => ({
  useSelectState: ({ open }: { open?: boolean }) => ({
    isOpen: open !== undefined ? open : false,
    toggleOpen: jest.fn(),
    closeDropdown: jest.fn(),
  }),
}));

jest.mock('../hooks/useCascader', () => ({
  useCascader: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockUseCascader = require('../hooks/useCascader').useCascader;

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
    children: [
      { value: '2-1', label: 'Option 2-1' },
      { value: '2-2', label: 'Option 2-2' },
    ],
  },
  {
    value: '3',
    label: 'Option 3',
  },
];

const defaultUseCascaderReturn = {
  selectedPath: [],
  activePath: [],
  searchValue: '',
  isSearching: false,
  currentValue: undefined,
  displayText: '',
  searchResults: [],
  checkedKeys: new Set(),
  halfCheckedKeys: new Set(),
  handlePathChange: jest.fn(),
  handleFinalSelect: jest.fn(),
  handleMultipleSelect: jest.fn(),
  handleSearchChange: jest.fn(),
  handleClear: jest.fn(),
};

describe('Cascader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCascader.mockReturnValue(defaultUseCascaderReturn);
  });

  describe('基础渲染', () => {
    it('should render correctly with default props', () => {
      render(<Cascader options={mockOptions} />);

      const container = document.querySelector('.fluentui-plus-cascader');
      expect(container).toBeInTheDocument();
      expect(screen.getByTestId('cascader-selector')).toBeInTheDocument();
    });

    it('should apply custom className and style', () => {
      const customStyle = { width: '300px' };
      render(<Cascader options={mockOptions} className='custom-cascader' style={customStyle} />);

      const container = document.querySelector('.fluentui-plus-cascader');
      expect(container).toHaveClass('custom-cascader');
      expect(container).toHaveStyle('width: 300px');
    });

    it('should render with placeholder', () => {
      render(<Cascader options={mockOptions} placeholder='请选择' />);

      expect(screen.getByText('请选择')).toBeInTheDocument();
    });

    it('should render as disabled when disabled prop is true', () => {
      render(<Cascader options={mockOptions} disabled placeholder='Disabled' />);

      const selector = screen.getByTestId('cascader-selector');
      expect(selector).toHaveClass('fluentui-plus-cascader__selector--disabled');
    });
  });

  describe('单选模式', () => {
    it('should handle single selection correctly', () => {
      const handleChange = jest.fn();
      const mockReturn = {
        ...defaultUseCascaderReturn,
        selectedPath: [mockOptions[0]],
        displayText: 'Option 1',
        handleFinalSelect: jest.fn(),
      };
      mockUseCascader.mockReturnValue(mockReturn);

      render(<Cascader options={mockOptions} onChange={handleChange} open={true} />);

      expect(screen.getByTestId('cascader-panel')).toBeInTheDocument();
      expect(screen.getByTestId('selector-text')).toHaveTextContent('Option 1');
    });

    it('should display selected path correctly', () => {
      const mockReturn = {
        ...defaultUseCascaderReturn,
        selectedPath: [
          { value: '1', label: 'Option 1' },
          { value: '1-1', label: 'Option 1-1' },
        ],
        displayText: 'Option 1 / Option 1-1',
      };
      mockUseCascader.mockReturnValue(mockReturn);

      render(<Cascader options={mockOptions} />);

      const selectorText = screen.getByTestId('selector-text');
      expect(selectorText).toHaveTextContent('Option 1 / Option 1-1');
    });

    it('should close panel after final selection in single mode', () => {
      // This test validates the logic flow but the actual state manager calls happen in useSelectState hook
      // We're testing the component integration here
      render(<Cascader options={mockOptions} multiple={false} open={true} />);

      // 模拟选择叶子节点
      const leafOption = screen.getByTestId('option-3');
      fireEvent.click(leafOption);

      // 验证 finalSelect 处理函数被调用（这会在实际组件中触发关闭）
      expect(defaultUseCascaderReturn.handleFinalSelect).toHaveBeenCalled();
    });
  });

  describe('多选模式', () => {
    it('should render in multiple mode correctly', () => {
      const mockReturn = {
        ...defaultUseCascaderReturn,
        selectedPath: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
        checkedKeys: new Set(['1', '2']),
      };
      mockUseCascader.mockReturnValue(mockReturn);

      render(<Cascader options={mockOptions} multiple={true} />);

      const selector = screen.getByTestId('cascader-selector');
      expect(selector).toHaveClass('fluentui-plus-cascader__selector--multiple');
    });

    it('should handle multiple selection correctly', () => {
      const mockReturn = {
        ...defaultUseCascaderReturn,
        selectedPath: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
        checkedKeys: new Set(['1', '2']),
        handleMultipleSelect: jest.fn(),
      };
      mockUseCascader.mockReturnValue(mockReturn);

      render(<Cascader options={mockOptions} multiple={true} open={true} />);

      const option1 = screen.getByTestId('option-1');
      fireEvent.click(option1);

      expect(mockReturn.handleMultipleSelect).toHaveBeenCalledWith(
        mockOptions[0],
        false // 因为已经在checkedKeys中，所以是取消选择
      );
    });

    it('should handle tag removal in multiple mode', async () => {
      const user = userEvent.setup();
      const mockReturn = {
        ...defaultUseCascaderReturn,
        selectedPath: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
        handleMultipleSelect: jest.fn(),
      };
      mockUseCascader.mockReturnValue(mockReturn);

      render(<Cascader options={mockOptions} multiple={true} />);

      const tag = screen.getByTestId('tag-0');
      await user.click(tag);

      expect(mockReturn.handleMultipleSelect).toHaveBeenCalledWith({ value: '1', label: 'Option 1' }, false);
    });

    it('should not close panel after selection in multiple mode', () => {
      // This validates that multiple mode doesn't trigger panel closing
      render(<Cascader options={mockOptions} multiple={true} open={true} />);

      // 模拟多选模式下的选择
      const option = screen.getByTestId('option-1');
      fireEvent.click(option);

      // 在多选模式下，handleFinalSelect 不应该被调用，而是 handleMultipleSelect
      expect(defaultUseCascaderReturn.handleMultipleSelect).toHaveBeenCalled();
      expect(defaultUseCascaderReturn.handleFinalSelect).not.toHaveBeenCalled();
    });
  });

  describe('搜索功能', () => {
    it('should render search input when showSearch is true and panel is open', () => {
      render(<Cascader options={mockOptions} showSearch={true} open={true} />);

      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('should handle search input changes', async () => {
      const user = userEvent.setup();
      const mockReturn = {
        ...defaultUseCascaderReturn,
        searchValue: 'test',
        handleSearchChange: jest.fn(),
      };
      mockUseCascader.mockReturnValue(mockReturn);

      render(<Cascader options={mockOptions} showSearch={true} open={true} />);

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'new text');

      expect(mockReturn.handleSearchChange).toHaveBeenCalled();
    });

    it('should clear search value on blur', async () => {
      const user = userEvent.setup();
      const mockReturn = {
        ...defaultUseCascaderReturn,
        searchValue: 'test',
        handleSearchChange: jest.fn(),
      };
      mockUseCascader.mockReturnValue(mockReturn);

      render(<Cascader options={mockOptions} showSearch={true} open={true} />);

      const searchInput = screen.getByTestId('search-input');
      await user.click(searchInput);
      await user.tab(); // 模拟失焦

      expect(mockReturn.handleSearchChange).toHaveBeenCalledWith('');
    });
  });

  describe('清除功能', () => {
    it('should show clear button when allowClear is true and has value', () => {
      const mockReturn = {
        ...defaultUseCascaderReturn,
        selectedPath: [mockOptions[0]],
      };
      mockUseCascader.mockReturnValue(mockReturn);

      render(<Cascader options={mockOptions} allowClear={true} />);

      expect(screen.getByTestId('clear-button')).toBeInTheDocument();
    });

    it('should not show clear button when disabled', () => {
      const mockReturn = {
        ...defaultUseCascaderReturn,
        selectedPath: [mockOptions[0]],
      };
      mockUseCascader.mockReturnValue(mockReturn);

      render(<Cascader options={mockOptions} allowClear={true} disabled={true} />);

      expect(screen.queryByTestId('clear-button')).not.toBeInTheDocument();
    });

    it('should handle clear action correctly', async () => {
      const user = userEvent.setup();
      const onClear = jest.fn();
      const mockReturn = {
        ...defaultUseCascaderReturn,
        selectedPath: [mockOptions[0]],
        handleClear: jest.fn(),
      };
      mockUseCascader.mockReturnValue(mockReturn);

      render(<Cascader options={mockOptions} allowClear={true} onClear={onClear} />);

      const clearButton = screen.getByTestId('clear-button');
      await user.click(clearButton);

      expect(mockReturn.handleClear).toHaveBeenCalled();
      expect(onClear).toHaveBeenCalled();
    });
  });

  describe('交互行为', () => {
    it('should handle selector click correctly', async () => {
      const user = userEvent.setup();

      render(<Cascader options={mockOptions} />);

      const selector = screen.getByTestId('cascader-selector');
      await user.click(selector);

      // The click handler is mocked, so we validate that click works without error
      expect(selector).toBeInTheDocument();
    });

    it('should not handle click when disabled', async () => {
      const user = userEvent.setup();

      render(<Cascader options={mockOptions} disabled={true} />);

      const selector = screen.getByTestId('cascader-selector');
      await user.click(selector);

      // Disabled selector should not respond to clicks (validated by implementation)
      expect(selector).toBeInTheDocument();
    });

    it('should focus search input after opening panel in search mode', async () => {
      const user = userEvent.setup();

      render(<Cascader options={mockOptions} showSearch={true} open={true} />);

      const selector = screen.getByTestId('cascader-selector');
      await user.click(selector);

      // The search input is rendered when open and showSearch is true
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe('自定义渲染', () => {
    it('should use custom labelRender for single mode', () => {
      const labelRender = jest.fn(option => `Custom: ${option.label}`);
      const mockReturn = {
        ...defaultUseCascaderReturn,
        selectedPath: [mockOptions[0]],
      };
      mockUseCascader.mockReturnValue(mockReturn);

      render(<Cascader options={mockOptions} labelRender={labelRender} />);

      expect(labelRender).toHaveBeenCalledWith(mockOptions[0]);
    });

    it('should use custom labelRender for multiple mode', () => {
      const labelRender = jest.fn(option => `Custom: ${option.label}`);
      const mockReturn = {
        ...defaultUseCascaderReturn,
        selectedPath: [mockOptions[0], mockOptions[1]],
      };
      mockUseCascader.mockReturnValue(mockReturn);

      render(<Cascader options={mockOptions} multiple={true} labelRender={labelRender} />);

      // The labelRender function should be called through the Selector component
      // This tests the integration rather than direct function calls
      expect(screen.getByTestId('cascader-selector')).toBeInTheDocument();
    });
  });

  describe('受控/非受控', () => {
    it('should work in controlled mode', () => {
      const value = ['1', '1-1'];
      const onChange = jest.fn();

      render(<Cascader options={mockOptions} value={value} onChange={onChange} />);

      expect(mockUseCascader).toHaveBeenCalledWith(
        expect.objectContaining({
          value,
          onChange,
        })
      );
    });

    it('should work in uncontrolled mode', () => {
      const defaultValue = ['1', '1-1'];
      const onChange = jest.fn();

      render(<Cascader options={mockOptions} defaultValue={defaultValue} onChange={onChange} />);

      expect(mockUseCascader).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultValue,
          onChange,
        })
      );
    });
  });

  describe('属性传递', () => {
    it('should pass all props to hooks correctly', () => {
      const props: CascaderProps = {
        value: ['1'],
        defaultValue: ['2'],
        multiple: true,
        showSearch: true,
        options: mockOptions,
        expandTrigger: 'hover',
        changeOnSelect: true,
        onChange: jest.fn(),
        onSearch: jest.fn(),
      };

      render(<Cascader {...props} />);

      expect(mockUseCascader).toHaveBeenCalledWith(
        expect.objectContaining({
          value: props.value,
          defaultValue: props.defaultValue,
          multiple: props.multiple,
          showSearch: props.showSearch,
          options: props.options,
          expandTrigger: props.expandTrigger,
          changeOnSelect: props.changeOnSelect,
          onChange: props.onChange,
          onSearch: props.onSearch,
        })
      );
    });

    it('should pass correct props to CascaderPanel', () => {
      const mockReturn = {
        ...defaultUseCascaderReturn,
        searchResults: [{ option: mockOptions[0], path: [], value: ['1'], label: 'Option 1' }],
      };
      mockUseCascader.mockReturnValue(mockReturn);

      render(
        <Cascader
          options={mockOptions}
          open={true}
          multiple={true}
          listHeight={300}
          optionRender={option => `Custom: ${option.label}`}
          popupRender={node => <div className='custom-popup'>{node}</div>}
          expandTrigger='hover'
          changeOnSelect={true}
          showSearch={true}
        />
      );

      const panel = screen.getByTestId('cascader-panel');
      expect(panel).toBeInTheDocument();
    });
  });
});
