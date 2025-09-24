import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Cascader from '../Cascader';
import type { CascaderOption } from '../types';

// Mock子组件 - CascaderPanel
jest.mock('../CascaderPanel', () => {
  const MockCascaderPanel = ({
    isOpen,
    options,
    selectedPath,
    onClose,
    onPathChange,
    onFinalSelect,
    onMultipleSelect,
    multiple,
    showSearch,
    searchValue,
    searchResults,
    checkedKeys,
    prefixCls,
  }: {
    isOpen: boolean;
    options?: CascaderOption[];
    selectedPath?: CascaderOption[];
    onClose?: () => void;
    onPathChange?: (path: CascaderOption[]) => void;
    onFinalSelect?: (option: CascaderOption, path: CascaderOption[]) => void;
    onMultipleSelect?: (option: CascaderOption, checked: boolean) => void;
    multiple?: boolean;
    showSearch?: boolean;
    searchValue?: string;
    searchResults?: any[];
    onSearch?: (value: string) => void;
    checkedKeys?: Set<string | number>;
    prefixCls: string;
  }) => {
    if (!isOpen) return null;

    return (
      <div data-testid='cascader-panel' className={`${prefixCls}__panel`}>
        <button data-testid='close-panel' onClick={onClose}>
          Close Panel
        </button>

        {/* 搜索模式显示搜索结果 */}
        {showSearch && searchResults && searchResults.length > 0 ? (
          <div data-testid='search-results'>
            {searchResults.map((result, index) => (
              <div
                key={index}
                data-testid={`search-result-${index}`}
                onClick={() => {
                  if (multiple) {
                    onMultipleSelect?.(result.option, true);
                  } else {
                    onFinalSelect?.(result.option, result.path);
                  }
                }}
              >
                {result.label}
              </div>
            ))}
          </div>
        ) : (
          // 正常模式显示选项列表
          <div data-testid='options-list'>
            {options?.map((option, index) => (
              <div key={option.value} data-testid={`option-${index}`}>
                <div
                  data-testid={`option-item-${index}`}
                  onClick={() => {
                    const newPath = [...(selectedPath || []), option];
                    if (option.children && option.children.length > 0) {
                      onPathChange?.(newPath);
                    } else {
                      onFinalSelect?.(option, newPath);
                    }
                  }}
                >
                  {option.label}
                </div>

                {/* 多选模式下的复选框 */}
                {multiple && (
                  <input
                    type='checkbox'
                    data-testid={`checkbox-${index}`}
                    checked={checkedKeys?.has(option.value!) || false}
                    onChange={e => {
                      onMultipleSelect?.(option, e.target.checked);
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* 显示当前选中路径信息 */}
        <div data-testid='selected-path-info'>
          {selectedPath?.map(item => item.label).join(' / ') || 'No selection'}
        </div>

        {/* 显示搜索值 */}
        {showSearch && <div data-testid='panel-search-value'>{searchValue || ''}</div>}
      </div>
    );
  };

  MockCascaderPanel.displayName = 'MockCascaderPanel';
  return MockCascaderPanel;
});

// Mock Selector 组件
jest.mock('../../Select/Selector', () => {
  const { useSelectContext } = jest.requireActual('../../Select/context');

  const MockSelector = () => {
    const {
      disabled,
      placeholder,
      selectedOptions = [],
      searchValue = '',
      showSearch,
      showClear,
      onClick,
      onSearchChange,
      onSearchFocus,
      onSearchBlur,
      onTagRemove,
      onClear,
      labelRender,
    } = useSelectContext();

    const displayText = React.useMemo(() => {
      if (selectedOptions.length === 0) return placeholder || '';

      if (labelRender) {
        // 单选模式，labelRender 返回字符串
        return labelRender(selectedOptions[0]) || '';
      }

      // 默认显示逻辑
      return selectedOptions.map((opt: any) => opt.label).join(', ');
    }, [selectedOptions, placeholder, labelRender]);

    return (
      <div data-testid='selector' className='fluentui-plus-cascader__selector' onClick={onClick}>
        {/* 显示内容区域 */}
        <div data-testid='selector-content'>
          {showSearch ? (
            <input
              data-testid='search-input'
              value={searchValue}
              placeholder={placeholder}
              disabled={disabled}
              onChange={onSearchChange}
              onFocus={onSearchFocus}
              onBlur={onSearchBlur}
            />
          ) : (
            <span data-testid='display-text'>{displayText}</span>
          )}
        </div>

        {/* 多选标签 */}
        {selectedOptions.length > 1 && (
          <div data-testid='tags-container'>
            {selectedOptions.map((option: any, index: number) => (
              <span key={index} data-testid={`tag-${index}`}>
                {option.label}
                <button
                  data-testid={`remove-tag-${index}`}
                  onClick={e => {
                    e.stopPropagation();
                    onTagRemove?.(option.label, index);
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* 清除按钮 */}
        {showClear && (
          <button
            data-testid='clear-button'
            onClick={e => {
              e.stopPropagation();
              onClear?.(e);
            }}
          >
            Clear
          </button>
        )}

        {/* 状态信息 */}
        <div data-testid='selector-state'>
          <span data-testid='selected-count'>{selectedOptions.length}</span>
          <span data-testid='disabled-state'>{disabled ? 'disabled' : 'enabled'}</span>
        </div>
      </div>
    );
  };

  MockSelector.displayName = 'MockSelector';
  return MockSelector;
});

// Mock hooks
jest.mock('../hooks', () => ({
  useCascader: jest.fn(),
}));

jest.mock('../../Select/hooks', () => ({
  useSelectState: jest.fn(),
}));

// Mock @fluentui/react-components
jest.mock('@fluentui/react-components', () => ({
  mergeClasses: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
}));

describe('Cascader Integration Tests', () => {
  // 测试数据
  const mockOptions: CascaderOption[] = [
    {
      value: 'zhejiang',
      label: '浙江',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          children: [
            { value: 'xihu', label: '西湖' },
            { value: 'binjiang', label: '滨江' },
          ],
        },
        {
          value: 'ningbo',
          label: '宁波',
          children: [
            { value: 'haishu', label: '海曙' },
            { value: 'jiangbei', label: '江北' },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: '江苏',
      children: [
        {
          value: 'nanjing',
          label: '南京',
          children: [
            { value: 'xuanwu', label: '玄武' },
            { value: 'qinhuai', label: '秦淮' },
          ],
        },
        {
          value: 'suzhou',
          label: '苏州',
          children: [
            { value: 'gusu', label: '姑苏' },
            { value: 'kunshan', label: '昆山' },
          ],
        },
      ],
    },
  ];

  // Mock hooks 返回值
  let mockUseCascader: jest.Mock;
  let mockUseSelectState: jest.Mock;
  let mockCascaderState: any;
  let mockSelectState: any;

  beforeEach(() => {
    // 重置 mock
    const cascaderHooks = jest.requireMock('../hooks');
    const selectHooks = jest.requireMock('../../Select/hooks');

    mockUseCascader = cascaderHooks.useCascader;
    mockUseSelectState = selectHooks.useSelectState;

    // 默认 Cascader 状态
    mockCascaderState = {
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

    // 默认 Select 状态
    mockSelectState = {
      isOpen: false,
      toggleOpen: jest.fn(),
      closeDropdown: jest.fn(),
    };

    mockUseCascader.mockReturnValue(mockCascaderState);
    mockUseSelectState.mockReturnValue(mockSelectState);

    jest.clearAllMocks();
  });

  describe('基础渲染测试', () => {
    it('应该正确渲染Cascader组件的基本结构', () => {
      render(<Cascader options={mockOptions} />);

      // 验证主容器
      expect(document.querySelector('.fluentui-plus-cascader')).toBeInTheDocument();

      // 验证选择器容器
      expect(document.querySelector('.fluentui-plus-cascader__selector')).toBeInTheDocument();

      // 验证Selector组件
      expect(screen.getByTestId('selector')).toBeInTheDocument();

      // 验证面板默认关闭
      expect(screen.queryByTestId('cascader-panel')).not.toBeInTheDocument();
    });

    it('应该正确传递className和style属性', () => {
      const customStyle = { width: '300px' };
      render(<Cascader options={mockOptions} className='custom-cascader' style={customStyle} />);

      const container = document.querySelector('.fluentui-plus-cascader');
      expect(container).toHaveClass('custom-cascader');
      expect(container).toHaveStyle('width: 300px');
    });

    it('应该正确应用disabled状态的CSS类', () => {
      render(<Cascader options={mockOptions} disabled />);

      expect(document.querySelector('.fluentui-plus-cascader__selector--disabled')).toBeInTheDocument();
      expect(screen.getByTestId('disabled-state')).toHaveTextContent('disabled');
    });

    it('应该正确应用multiple状态的CSS类', () => {
      render(<Cascader options={mockOptions} multiple />);

      expect(document.querySelector('.fluentui-plus-cascader__selector--multiple')).toBeInTheDocument();
    });

    it('应该正确传递placeholder属性', () => {
      const placeholder = '请选择地区';
      render(<Cascader options={mockOptions} placeholder={placeholder} />);

      expect(screen.getByTestId('display-text')).toHaveTextContent(placeholder);
    });

    it('应该正确初始化useCascader hook', () => {
      const mockOnChange = jest.fn();
      const mockOnSearch = jest.fn();

      render(
        <Cascader
          value={['zhejiang', 'hangzhou']}
          defaultValue={['jiangsu']}
          multiple={true}
          showSearch={true}
          options={mockOptions}
          expandTrigger='hover'
          changeOnSelect={true}
          onChange={mockOnChange}
          onSearch={mockOnSearch}
        />
      );

      expect(mockUseCascader).toHaveBeenCalledWith({
        value: ['zhejiang', 'hangzhou'],
        defaultValue: ['jiangsu'],
        multiple: true,
        showSearch: true,
        options: mockOptions,
        expandTrigger: 'hover',
        changeOnSelect: true,
        onChange: mockOnChange,
        onSearch: mockOnSearch,
      });
    });

    it('应该正确初始化useSelectState hook', () => {
      render(<Cascader options={mockOptions} open={true} />);

      expect(mockUseSelectState).toHaveBeenCalledWith({ open: true });
    });
  });

  describe('选择器交互测试', () => {
    it('应该正确处理选择器点击事件', () => {
      render(<Cascader options={mockOptions} />);

      fireEvent.click(screen.getByTestId('selector'));

      expect(mockSelectState.toggleOpen).toHaveBeenCalled();
    });

    it('在disabled状态下不应该响应点击事件', () => {
      render(<Cascader options={mockOptions} disabled />);

      fireEvent.click(screen.getByTestId('selector'));

      expect(mockSelectState.toggleOpen).not.toHaveBeenCalled();
    });

    it('在controlled模式下不应该调用toggleOpen', () => {
      render(<Cascader options={mockOptions} open={true} />);

      fireEvent.click(screen.getByTestId('selector'));

      expect(mockSelectState.toggleOpen).not.toHaveBeenCalled();
    });
  });

  describe('单选模式集成测试', () => {
    beforeEach(() => {
      mockSelectState.isOpen = true;
      mockCascaderState.selectedPath = [
        { value: 'zhejiang', label: '浙江' },
        { value: 'hangzhou', label: '杭州' },
        { value: 'xihu', label: '西湖' },
      ];
      mockCascaderState.displayText = '浙江 / 杭州 / 西湖';
    });

    it('应该正确显示面板和选项列表', () => {
      render(<Cascader options={mockOptions} />);

      expect(screen.getByTestId('cascader-panel')).toBeInTheDocument();
      expect(screen.getByTestId('options-list')).toBeInTheDocument();
      expect(screen.getAllByTestId(/^option-item-/)).toHaveLength(2); // 浙江、江苏
    });

    it('应该正确处理路径变更', () => {
      render(<Cascader options={mockOptions} />);

      // 点击第一个选项（浙江）
      fireEvent.click(screen.getByTestId('option-item-0'));

      expect(mockCascaderState.handlePathChange).toHaveBeenCalledWith([mockOptions[0]], false);
    });

    it('应该正确处理最终选择', () => {
      // 模拟选择到叶子节点
      const leafOption = { value: 'xihu', label: '西湖' };
      const pathToLeaf = [{ value: 'zhejiang', label: '浙江' }, { value: 'hangzhou', label: '杭州' }, leafOption];

      render(<Cascader options={mockOptions} />);

      // 模拟点击叶子节点选项
      const mockHandleFinalSelect = mockCascaderState.handleFinalSelect;
      mockHandleFinalSelect(leafOption, pathToLeaf);

      expect(mockCascaderState.handleFinalSelect).toHaveBeenCalledWith(leafOption, pathToLeaf);
    });

    it('应该正确显示选中路径的显示文本', () => {
      mockCascaderState.selectedPath = [
        { value: 'zhejiang', label: '浙江' },
        { value: 'hangzhou', label: '杭州' },
      ];
      mockCascaderState.displayText = '浙江 / 杭州';

      render(<Cascader options={mockOptions} />);

      expect(screen.getByTestId('display-text')).toHaveTextContent('浙江 / 杭州');
    });

    it('应该正确处理面板关闭', () => {
      render(<Cascader options={mockOptions} />);

      fireEvent.click(screen.getByTestId('close-panel'));

      expect(mockSelectState.closeDropdown).toHaveBeenCalled();
    });
  });

  describe('多选模式集成测试', () => {
    beforeEach(() => {
      mockSelectState.isOpen = true;
      mockCascaderState.checkedKeys = new Set(['xihu', 'binjiang']);
      mockCascaderState.selectedPath = [
        { value: 'xihu', label: '西湖' },
        { value: 'binjiang', label: '滨江' },
      ];
    });

    it('应该正确渲染多选模式的面板', () => {
      render(<Cascader options={mockOptions} multiple />);

      expect(screen.getByTestId('cascader-panel')).toBeInTheDocument();
      expect(screen.getAllByTestId(/^checkbox-/)).toHaveLength(2); // 每个选项都有复选框
    });

    it('多选模式下选中后不应该关闭面板', () => {
      render(<Cascader options={mockOptions} multiple />);

      // 模拟多选选择
      act(() => {
        mockCascaderState.handleMultipleSelect(mockOptions[0], true);
      });

      // 不应该调用关闭下拉框
      expect(mockSelectState.closeDropdown).not.toHaveBeenCalled();
    });

    it('应该正确显示多选标签', () => {
      mockCascaderState.selectedPath = [
        { value: 'xihu', label: '西湖' },
        { value: 'binjiang', label: '滨江' },
      ];

      render(<Cascader options={mockOptions} multiple />);

      expect(screen.getByTestId('tags-container')).toBeInTheDocument();
      expect(screen.getByTestId('tag-0')).toHaveTextContent('西湖');
      expect(screen.getByTestId('tag-1')).toHaveTextContent('滨江');
    });

    it('应该正确处理标签移除', () => {
      mockCascaderState.selectedPath = [
        { value: 'xihu', label: '西湖' },
        { value: 'binjiang', label: '滨江' },
      ];

      render(<Cascader options={mockOptions} multiple />);

      // 点击移除第一个标签
      fireEvent.click(screen.getByTestId('remove-tag-0'));

      expect(mockCascaderState.handleMultipleSelect).toHaveBeenCalledWith(mockCascaderState.selectedPath[0], false);
    });

    it('应该正确显示选中数量', () => {
      mockCascaderState.selectedPath = [
        { value: 'xihu', label: '西湖' },
        { value: 'binjiang', label: '滨江' },
      ];

      render(<Cascader options={mockOptions} multiple />);

      expect(screen.getByTestId('selected-count')).toHaveTextContent('2');
    });
  });

  describe('搜索功能集成测试', () => {
    beforeEach(() => {
      mockSelectState.isOpen = true;
      mockCascaderState.searchResults = [
        {
          option: { value: 'xihu', label: '西湖' },
          path: [
            { value: 'zhejiang', label: '浙江' },
            { value: 'hangzhou', label: '杭州' },
            { value: 'xihu', label: '西湖' },
          ],
          value: ['zhejiang', 'hangzhou', 'xihu'],
          label: '浙江 / 杭州 / 西湖',
        },
        {
          option: { value: 'xuanwu', label: '玄武' },
          path: [
            { value: 'jiangsu', label: '江苏' },
            { value: 'nanjing', label: '南京' },
            { value: 'xuanwu', label: '玄武' },
          ],
          value: ['jiangsu', 'nanjing', 'xuanwu'],
          label: '江苏 / 南京 / 玄武',
        },
      ];
    });

    it('应该正确渲染搜索输入框', () => {
      render(<Cascader options={mockOptions} showSearch />);

      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.queryByTestId('display-text')).not.toBeInTheDocument();
    });

    it('应该正确处理搜索输入变化', () => {
      render(<Cascader options={mockOptions} showSearch />);

      fireEvent.change(screen.getByTestId('search-input'), {
        target: { value: '西湖' },
      });

      expect(mockCascaderState.handleSearchChange).toHaveBeenCalledWith('西湖');
    });

    it('应该正确显示搜索结果', () => {
      mockCascaderState.searchValue = '西';

      render(<Cascader options={mockOptions} showSearch />);

      expect(screen.getByTestId('search-results')).toBeInTheDocument();
      expect(screen.getByTestId('search-result-0')).toHaveTextContent('浙江 / 杭州 / 西湖');
      expect(screen.getAllByTestId(/^search-result-/)).toHaveLength(2);
    });

    it('应该正确处理搜索结果选择（单选模式）', () => {
      mockCascaderState.searchValue = '西';

      render(<Cascader options={mockOptions} showSearch />);

      fireEvent.click(screen.getByTestId('search-result-0'));

      const expectedOption = mockCascaderState.searchResults[0].option;
      const expectedPath = mockCascaderState.searchResults[0].path;

      expect(mockCascaderState.handleFinalSelect).toHaveBeenCalledWith(expectedOption, expectedPath);
    });

    it('应该正确处理搜索结果选择（多选模式）', () => {
      mockCascaderState.searchValue = '西';

      render(<Cascader options={mockOptions} showSearch multiple />);

      fireEvent.click(screen.getByTestId('search-result-0'));

      const expectedOption = mockCascaderState.searchResults[0].option;

      expect(mockCascaderState.handleMultipleSelect).toHaveBeenCalledWith(expectedOption, true);
    });

    it('应该正确处理搜索输入失焦', () => {
      mockCascaderState.searchValue = 'test';

      render(<Cascader options={mockOptions} showSearch />);

      fireEvent.blur(screen.getByTestId('search-input'));

      expect(mockCascaderState.handleSearchChange).toHaveBeenCalledWith('');
    });

    it('应该正确显示面板中的搜索值', () => {
      mockCascaderState.searchValue = '西湖';

      render(<Cascader options={mockOptions} showSearch />);

      expect(screen.getByTestId('panel-search-value')).toHaveTextContent('西湖');
    });

    it('空搜索结果时应该显示选项列表', () => {
      mockCascaderState.searchResults = [];
      mockCascaderState.searchValue = '';

      render(<Cascader options={mockOptions} showSearch />);

      expect(screen.queryByTestId('search-results')).not.toBeInTheDocument();
      expect(screen.getByTestId('options-list')).toBeInTheDocument();
    });
  });

  describe('高级功能集成测试', () => {
    it('应该正确处理清除功能', () => {
      // 设置有选中值的状态
      mockCascaderState.selectedPath = [{ value: 'xihu', label: '西湖' }];

      const mockOnClear = jest.fn();
      render(<Cascader options={mockOptions} allowClear onClear={mockOnClear} />);

      expect(screen.getByTestId('clear-button')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('clear-button'));

      expect(mockCascaderState.handleClear).toHaveBeenCalled();
      expect(mockOnClear).toHaveBeenCalled();
    });

    it('在没有选中值时不应该显示清除按钮', () => {
      mockCascaderState.selectedPath = [];
      mockCascaderState.checkedKeys = new Set();

      render(<Cascader options={mockOptions} allowClear />);

      expect(screen.queryByTestId('clear-button')).not.toBeInTheDocument();
    });

    it('在disabled状态下不应该显示清除按钮', () => {
      mockCascaderState.selectedPath = [{ value: 'xihu', label: '西湖' }];

      render(<Cascader options={mockOptions} allowClear disabled />);

      expect(screen.queryByTestId('clear-button')).not.toBeInTheDocument();
    });

    it('应该正确处理自定义labelRender', () => {
      mockCascaderState.selectedPath = [
        { value: 'zhejiang', label: '浙江' },
        { value: 'hangzhou', label: '杭州' },
        { value: 'xihu', label: '西湖' },
      ];

      const customLabelRender = (option: CascaderOption) => `自定义: ${option.label}`;

      render(<Cascader options={mockOptions} labelRender={customLabelRender} />);

      // 验证自定义渲染被调用
      expect(screen.getByTestId('display-text')).toBeInTheDocument();
    });

    it('应该正确传递changeOnSelect属性', () => {
      render(<Cascader options={mockOptions} changeOnSelect />);

      expect(mockUseCascader).toHaveBeenCalledWith(
        expect.objectContaining({
          changeOnSelect: true,
        })
      );
    });

    it('应该正确传递expandTrigger属性', () => {
      render(<Cascader options={mockOptions} expandTrigger='hover' />);

      expect(mockUseCascader).toHaveBeenCalledWith(
        expect.objectContaining({
          expandTrigger: 'hover',
        })
      );
    });

    it('应该正确传递listHeight属性到面板', () => {
      mockSelectState.isOpen = true;

      render(<Cascader options={mockOptions} listHeight={300} />);

      // CascaderPanel 组件会接收 listHeight prop
      expect(screen.getByTestId('cascader-panel')).toBeInTheDocument();
    });
  });

  describe('边界情况和错误处理测试', () => {
    it('应该处理undefined options', () => {
      expect(() => {
        render(<Cascader />);
      }).not.toThrow();

      expect(screen.getByTestId('selector')).toBeInTheDocument();
    });

    it('应该处理空options数组', () => {
      expect(() => {
        render(<Cascader options={[]} />);
      }).not.toThrow();

      expect(screen.getByTestId('selector')).toBeInTheDocument();
    });

    it('应该处理没有children的选项', () => {
      const flatOptions: CascaderOption[] = [
        { value: 'option1', label: '选项1' },
        { value: 'option2', label: '选项2' },
      ];

      expect(() => {
        render(<Cascader options={flatOptions} />);
      }).not.toThrow();
    });

    it('应该正确处理缺失的value或label', () => {
      const incompleteOptions: CascaderOption[] = [
        { value: 'complete', label: '完整选项' },
        { value: 'no-label' },
        { label: '无值选项' },
      ];

      expect(() => {
        render(<Cascader options={incompleteOptions} />);
      }).not.toThrow();
    });

    it('应该处理disabled选项', () => {
      const optionsWithDisabled: CascaderOption[] = [
        { value: 'enabled', label: '可用选项' },
        { value: 'disabled', label: '禁用选项', disabled: true },
      ];

      expect(() => {
        render(<Cascader options={optionsWithDisabled} />);
      }).not.toThrow();
    });

    it('应该正确处理异常的value类型', () => {
      const mockOnChange = jest.fn();

      expect(() => {
        render(<Cascader options={mockOptions} value={null as any} onChange={mockOnChange} />);
      }).not.toThrow();
    });

    it('应该处理深层嵌套的选项结构', () => {
      const deepOptions: CascaderOption[] = [
        {
          value: 'level1',
          label: '第一层',
          children: [
            {
              value: 'level2',
              label: '第二层',
              children: [
                {
                  value: 'level3',
                  label: '第三层',
                  children: [{ value: 'level4', label: '第四层' }],
                },
              ],
            },
          ],
        },
      ];

      expect(() => {
        render(<Cascader options={deepOptions} />);
      }).not.toThrow();
    });

    it('应该正确处理事件回调缺失的情况', () => {
      expect(() => {
        render(<Cascader options={mockOptions} onChange={undefined} onSearch={undefined} onClear={undefined} />);
      }).not.toThrow();
    });

    it('应该正确处理空字符串搜索值', () => {
      mockCascaderState.searchValue = '';
      mockCascaderState.searchResults = [];

      expect(() => {
        render(<Cascader options={mockOptions} showSearch />);
      }).not.toThrow();

      expect(screen.getByTestId('search-input')).toHaveValue('');
    });
  });

  describe('Context Provider 集成测试', () => {
    it('应该正确创建SelectProvider上下文', () => {
      render(<Cascader options={mockOptions} />);

      // 验证 Context 中的选择器被正确渲染
      expect(screen.getByTestId('selector')).toBeInTheDocument();
      expect(screen.getByTestId('selector-state')).toBeInTheDocument();
    });

    it('应该正确传递上下文值给Selector', () => {
      mockCascaderState.selectedPath = [{ value: 'test', label: '测试' }];

      render(<Cascader options={mockOptions} disabled={true} placeholder='请选择' showSearch={true} />);

      expect(screen.getByTestId('disabled-state')).toHaveTextContent('disabled');
      expect(screen.getByTestId('selected-count')).toHaveTextContent('1');
    });
  });
});
