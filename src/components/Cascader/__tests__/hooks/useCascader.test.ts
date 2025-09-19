import { renderHook } from '@testing-library/react';
import { useCascader } from '../../hooks/useCascader';
import type { CascaderOption, CascaderValue, CascaderMultipleValue, UseCascaderProps } from '../../types';

// Mock the child hooks
jest.mock('../../hooks/useCascaderState');
jest.mock('../../hooks/useCascaderSelection');
jest.mock('../../hooks/useCascaderMultiple');
jest.mock('../../hooks/useCascaderSearch');
jest.mock('../../hooks/useCascaderNavigation');

import { useCascaderState } from '../../hooks/useCascaderState';
import { useCascaderSelection } from '../../hooks/useCascaderSelection';
import { useCascaderMultiple } from '../../hooks/useCascaderMultiple';
import { useCascaderSearch } from '../../hooks/useCascaderSearch';
import { useCascaderNavigation } from '../../hooks/useCascaderNavigation';

const mockUseCascaderState = useCascaderState as jest.MockedFunction<typeof useCascaderState>;
const mockUseCascaderSelection = useCascaderSelection as jest.MockedFunction<typeof useCascaderSelection>;
const mockUseCascaderMultiple = useCascaderMultiple as jest.MockedFunction<typeof useCascaderMultiple>;
const mockUseCascaderSearch = useCascaderSearch as jest.MockedFunction<typeof useCascaderSearch>;
const mockUseCascaderNavigation = useCascaderNavigation as jest.MockedFunction<typeof useCascaderNavigation>;

describe('useCascader', () => {
  const mockOptions: CascaderOption[] = [
    {
      value: 'option1',
      label: 'Option 1',
      children: [
        { value: 'option1-1', label: 'Option 1-1' },
        { value: 'option1-2', label: 'Option 1-2' },
      ],
    },
    {
      value: 'option2',
      label: 'Option 2',
      children: [{ value: 'option2-1', label: 'Option 2-1' }],
    },
  ];

  const defaultStateHookReturn = {
    selectedPath: [] as CascaderOption[],
    setSelectedPath: jest.fn(),
    checkedKeys: new Set<string | number>(),
    setCheckedKeys: jest.fn(),
    halfCheckedKeys: new Set<string | number>(),
    setHalfCheckedKeys: jest.fn(),
    activePath: [] as CascaderOption[],
    setActivePath: jest.fn(),
    searchValue: '',
    setSearchValue: jest.fn(),
    isSearching: false,
    currentValue: undefined as CascaderValue | CascaderMultipleValue | undefined,
  };

  const defaultSelectionHookReturn = {
    currentSelectedPath: [] as CascaderOption[],
    displayText: '',
    handlePathChange: jest.fn(),
    handleFinalSelect: jest.fn(),
    isValueSelected: jest.fn(),
    isPathSelected: jest.fn(),
    isPathActive: jest.fn(),
  };

  const defaultMultipleHookReturn = {
    currentSelectedPath: [] as CascaderOption[],
    currentValue: [] as CascaderMultipleValue,
    displayText: '',
    handleMultipleSelect: jest.fn(),
    getOptionCheckedStatus: jest.fn(),
  };

  const defaultSearchHookReturn = {
    searchResults: [] as any[],
    handleSearchChange: jest.fn(),
    handleSearchSelect: jest.fn(),
  };

  const defaultNavigationHookReturn = {
    getCurrentLevelOptions: jest.fn(),
    getMaxLevel: jest.fn(),
    handleClear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCascaderState.mockReturnValue(defaultStateHookReturn);
    mockUseCascaderSelection.mockReturnValue(defaultSelectionHookReturn);
    mockUseCascaderMultiple.mockReturnValue(defaultMultipleHookReturn);
    mockUseCascaderSearch.mockReturnValue(defaultSearchHookReturn);
    mockUseCascaderNavigation.mockReturnValue(defaultNavigationHookReturn);
  });

  describe('初始化', () => {
    it('应该正确初始化单选模式', () => {
      const props: UseCascaderProps = {
        options: mockOptions,
        multiple: false,
        value: ['option1', 'option1-1'],
      };

      renderHook(() => useCascader(props));

      expect(mockUseCascaderState).toHaveBeenCalledWith({
        value: ['option1', 'option1-1'],
        defaultValue: undefined,
        multiple: false,
        showSearch: false,
        options: mockOptions,
      });
    });

    it('应该正确初始化多选模式', () => {
      const props: UseCascaderProps = {
        options: mockOptions,
        multiple: true,
        value: [
          ['option1', 'option1-1'],
          ['option2', 'option2-1'],
        ],
      };

      renderHook(() => useCascader(props));

      expect(mockUseCascaderState).toHaveBeenCalledWith({
        value: [
          ['option1', 'option1-1'],
          ['option2', 'option2-1'],
        ],
        defaultValue: undefined,
        multiple: true,
        showSearch: false,
        options: mockOptions,
      });
    });

    it('应该正确处理默认参数', () => {
      const props: UseCascaderProps = {
        options: mockOptions,
      };

      renderHook(() => useCascader(props));

      expect(mockUseCascaderState).toHaveBeenCalledWith({
        value: undefined,
        defaultValue: undefined,
        multiple: false,
        showSearch: false,
        options: mockOptions,
      });
    });
  });

  describe('子 Hook 调用', () => {
    it('应该正确调用所有子 Hook', () => {
      const onChange = jest.fn();
      const onSearch = jest.fn();

      const props: UseCascaderProps = {
        options: mockOptions,
        multiple: false,
        showSearch: true,
        expandTrigger: 'hover',
        changeOnSelect: true,
        onChange,
        onSearch,
      };

      renderHook(() => useCascader(props));

      expect(mockUseCascaderSelection).toHaveBeenCalledWith({
        selectedPath: defaultStateHookReturn.selectedPath,
        setSelectedPath: defaultStateHookReturn.setSelectedPath,
        activePath: defaultStateHookReturn.activePath,
        setActivePath: defaultStateHookReturn.setActivePath,
        searchValue: defaultStateHookReturn.searchValue,
        setSearchValue: defaultStateHookReturn.setSearchValue,
        currentValue: defaultStateHookReturn.currentValue,
        multiple: false,
        changeOnSelect: true,
        showSearch: true,
        options: mockOptions,
        onChange: expect.any(Function),
      });

      expect(mockUseCascaderMultiple).toHaveBeenCalledWith({
        checkedKeys: defaultStateHookReturn.checkedKeys,
        setCheckedKeys: defaultStateHookReturn.setCheckedKeys,
        halfCheckedKeys: defaultStateHookReturn.halfCheckedKeys,
        setHalfCheckedKeys: defaultStateHookReturn.setHalfCheckedKeys,
        searchValue: defaultStateHookReturn.searchValue,
        setSearchValue: defaultStateHookReturn.setSearchValue,
        multiple: false,
        showSearch: true,
        options: mockOptions,
        onChange: expect.any(Function),
      });

      expect(mockUseCascaderSearch).toHaveBeenCalledWith({
        searchValue: defaultStateHookReturn.searchValue,
        setSearchValue: defaultStateHookReturn.setSearchValue,
        selectedPath: defaultStateHookReturn.selectedPath,
        setSelectedPath: defaultStateHookReturn.setSelectedPath,
        activePath: defaultStateHookReturn.activePath,
        setActivePath: defaultStateHookReturn.setActivePath,
        checkedKeys: defaultStateHookReturn.checkedKeys,
        multiple: false,
        showSearch: true,
        changeOnSelect: true,
        options: mockOptions,
        onSearch,
        onChange: expect.any(Function),
        handleMultipleSelect: defaultMultipleHookReturn.handleMultipleSelect,
      });

      expect(mockUseCascaderNavigation).toHaveBeenCalledWith({
        activePath: defaultStateHookReturn.activePath,
        checkedKeys: defaultStateHookReturn.checkedKeys,
        halfCheckedKeys: defaultStateHookReturn.halfCheckedKeys,
        searchValue: defaultStateHookReturn.searchValue,
        setSearchValue: defaultStateHookReturn.setSearchValue,
        setSelectedPath: defaultStateHookReturn.setSelectedPath,
        setActivePath: defaultStateHookReturn.setActivePath,
        setCheckedKeys: defaultStateHookReturn.setCheckedKeys,
        setHalfCheckedKeys: defaultStateHookReturn.setHalfCheckedKeys,
        multiple: false,
        options: mockOptions,
        onChange,
      });
    });
  });

  describe('返回值 - 单选模式', () => {
    it('应该返回正确的单选模式状态和方法', () => {
      const mockSelectionReturn = {
        ...defaultSelectionHookReturn,
        currentSelectedPath: [{ value: 'option1', label: 'Option 1' }],
        displayText: 'Option 1',
      };

      mockUseCascaderSelection.mockReturnValue(mockSelectionReturn);

      const { result } = renderHook(() =>
        useCascader({
          options: mockOptions,
          multiple: false,
        })
      );

      expect(result.current.selectedPath).toBe(mockSelectionReturn.currentSelectedPath);
      expect(result.current.currentValue).toBe(defaultStateHookReturn.currentValue);
      expect(result.current.displayText).toBe(mockSelectionReturn.displayText);
      expect(result.current.multiple).toBe(false);
      expect(result.current.expandTrigger).toBe('click');
      expect(result.current.changeOnSelect).toBe(false);
    });
  });

  describe('返回值 - 多选模式', () => {
    it('应该返回正确的多选模式状态和方法', () => {
      const mockMultipleReturn = {
        ...defaultMultipleHookReturn,
        currentSelectedPath: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
        currentValue: [
          ['option1', 'option1-1'],
          ['option2', 'option2-1'],
        ],
        displayText: '已选择 2 项',
      };

      mockUseCascaderMultiple.mockReturnValue(mockMultipleReturn);

      const { result } = renderHook(() =>
        useCascader({
          options: mockOptions,
          multiple: true,
        })
      );

      expect(result.current.selectedPath).toBe(mockMultipleReturn.currentSelectedPath);
      expect(result.current.currentValue).toBe(mockMultipleReturn.currentValue);
      expect(result.current.displayText).toBe(mockMultipleReturn.displayText);
      expect(result.current.multiple).toBe(true);
    });
  });

  describe('事件处理方法', () => {
    it('应该暴露所有必要的事件处理方法', () => {
      const { result } = renderHook(() =>
        useCascader({
          options: mockOptions,
        })
      );

      expect(typeof result.current.handlePathChange).toBe('function');
      expect(typeof result.current.handleFinalSelect).toBe('function');
      expect(typeof result.current.handleMultipleSelect).toBe('function');
      expect(typeof result.current.handleSearchSelect).toBe('function');
      expect(typeof result.current.handleSearchChange).toBe('function');
      expect(typeof result.current.handleClear).toBe('function');
    });
  });

  describe('状态检查方法', () => {
    it('应该暴露所有必要的状态检查方法', () => {
      const { result } = renderHook(() =>
        useCascader({
          options: mockOptions,
        })
      );

      expect(typeof result.current.getCurrentLevelOptions).toBe('function');
      expect(typeof result.current.getMaxLevel).toBe('function');
      expect(typeof result.current.isValueSelected).toBe('function');
      expect(typeof result.current.isPathSelected).toBe('function');
      expect(typeof result.current.isPathActive).toBe('function');
      expect(typeof result.current.getOptionCheckedStatus).toBe('function');
    });
  });

  describe('搜索功能', () => {
    it('应该正确处理搜索相关状态', () => {
      const mockSearchReturn = {
        ...defaultSearchHookReturn,
        searchResults: [
          {
            option: { value: 'option1-1', label: 'Option 1-1' },
            path: [
              { value: 'option1', label: 'Option 1' },
              { value: 'option1-1', label: 'Option 1-1' },
            ],
            value: ['option1', 'option1-1'],
            label: 'Option 1 / Option 1-1',
          },
        ],
      };

      mockUseCascaderSearch.mockReturnValue(mockSearchReturn);

      const { result } = renderHook(() =>
        useCascader({
          options: mockOptions,
          showSearch: true,
        })
      );

      expect(result.current.searchResults).toBe(mockSearchReturn.searchResults);
      expect(result.current.searchValue).toBe(defaultStateHookReturn.searchValue);
      expect(result.current.isSearching).toBe(defaultStateHookReturn.isSearching);
    });
  });

  describe('配置参数传递', () => {
    it('应该正确传递 expandTrigger 配置', () => {
      const { result } = renderHook(() =>
        useCascader({
          options: mockOptions,
          expandTrigger: 'hover',
        })
      );

      expect(result.current.expandTrigger).toBe('hover');
    });

    it('应该正确传递 changeOnSelect 配置', () => {
      const { result } = renderHook(() =>
        useCascader({
          options: mockOptions,
          changeOnSelect: true,
        })
      );

      expect(result.current.changeOnSelect).toBe(true);
    });

    it('应该正确传递默认配置', () => {
      const { result } = renderHook(() =>
        useCascader({
          options: mockOptions,
        })
      );

      expect(result.current.expandTrigger).toBe('click');
      expect(result.current.changeOnSelect).toBe(false);
      expect(result.current.multiple).toBe(false);
    });
  });
});
