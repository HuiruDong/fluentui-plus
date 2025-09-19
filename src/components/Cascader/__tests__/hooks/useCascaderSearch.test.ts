import { renderHook, act } from '@testing-library/react';
import { useCascaderSearch, type UseCascaderSearchProps } from '../../hooks/useCascaderSearch';
import type { CascaderOption, CascaderSearchResult } from '../../types';

// Mock utility functions
jest.mock('../../utils', () => ({
  filterCascaderOptions: jest.fn(),
}));

import { filterCascaderOptions } from '../../utils';

const mockFilterCascaderOptions = filterCascaderOptions as jest.MockedFunction<typeof filterCascaderOptions>;

describe('useCascaderSearch', () => {
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

  const mockSearchResults: CascaderSearchResult[] = [
    {
      option: { value: 'option1-1', label: 'Option 1-1' },
      path: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ],
      value: ['option1', 'option1-1'],
      label: 'Option 1 / Option 1-1',
    },
    {
      option: { value: 'option2-1', label: 'Option 2-1' },
      path: [
        { value: 'option2', label: 'Option 2' },
        { value: 'option2-1', label: 'Option 2-1' },
      ],
      value: ['option2', 'option2-1'],
      label: 'Option 2 / Option 2-1',
    },
  ];

  const defaultProps: UseCascaderSearchProps = {
    searchValue: '',
    setSearchValue: jest.fn(),
    selectedPath: [],
    setSelectedPath: jest.fn(),
    activePath: [],
    setActivePath: jest.fn(),
    checkedKeys: new Set(),
    multiple: false,
    showSearch: true,
    changeOnSelect: false,
    options: mockOptions,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFilterCascaderOptions.mockReturnValue([]);
  });

  describe('初始化', () => {
    it('应该正确初始化并返回搜索方法', () => {
      const { result } = renderHook(() => useCascaderSearch(defaultProps));

      expect(result.current.searchResults).toEqual([]);
      expect(typeof result.current.handleSearchChange).toBe('function');
      expect(typeof result.current.handleSearchSelect).toBe('function');
    });
  });

  describe('searchResults', () => {
    it('应该在非搜索模式下返回空数组', () => {
      const props = { ...defaultProps, showSearch: false };
      const { result } = renderHook(() => useCascaderSearch(props));

      expect(result.current.searchResults).toEqual([]);
      expect(mockFilterCascaderOptions).not.toHaveBeenCalled();
    });

    it('应该在搜索值为空时返回空数组', () => {
      const props = { ...defaultProps, searchValue: '' };
      const { result } = renderHook(() => useCascaderSearch(props));

      expect(result.current.searchResults).toEqual([]);
      expect(mockFilterCascaderOptions).not.toHaveBeenCalled();
    });

    it('应该在搜索值只有空格时返回空数组', () => {
      const props = { ...defaultProps, searchValue: '   ' };
      const { result } = renderHook(() => useCascaderSearch(props));

      expect(result.current.searchResults).toEqual([]);
      expect(mockFilterCascaderOptions).not.toHaveBeenCalled();
    });

    it('应该在有效搜索时返回过滤结果', () => {
      mockFilterCascaderOptions.mockReturnValue(mockSearchResults);

      const props = { ...defaultProps, searchValue: 'option' };
      const { result } = renderHook(() => useCascaderSearch(props));

      expect(result.current.searchResults).toBe(mockSearchResults);
      expect(mockFilterCascaderOptions).toHaveBeenCalledWith(mockOptions, 'option', false);
    });

    it('应该正确传递 changeOnSelect 参数到过滤函数', () => {
      mockFilterCascaderOptions.mockReturnValue(mockSearchResults);

      const props = {
        ...defaultProps,
        searchValue: 'option',
        changeOnSelect: true,
      };
      renderHook(() => useCascaderSearch(props));

      expect(mockFilterCascaderOptions).toHaveBeenCalledWith(mockOptions, 'option', true);
    });

    it('应该在搜索值变化时重新计算结果', () => {
      const searchResults1 = [mockSearchResults[0]];
      const searchResults2 = [mockSearchResults[1]];

      mockFilterCascaderOptions.mockReturnValueOnce(searchResults1).mockReturnValueOnce(searchResults2);

      const initialProps = { ...defaultProps, searchValue: 'option1' };
      const { result, rerender } = renderHook(props => useCascaderSearch(props), { initialProps });

      expect(result.current.searchResults).toBe(searchResults1);

      const updatedProps = { ...defaultProps, searchValue: 'option2' };
      rerender(updatedProps);

      expect(result.current.searchResults).toBe(searchResults2);
      expect(mockFilterCascaderOptions).toHaveBeenCalledTimes(2);
    });
  });

  describe('handleSearchChange', () => {
    it('应该更新搜索值', () => {
      const setSearchValue = jest.fn();
      const props = { ...defaultProps, setSearchValue };

      const { result } = renderHook(() => useCascaderSearch(props));

      act(() => {
        result.current.handleSearchChange('new search');
      });

      expect(setSearchValue).toHaveBeenCalledWith('new search');
    });

    it('应该调用 onSearch 回调', () => {
      const onSearch = jest.fn();
      const props = { ...defaultProps, onSearch };

      const { result } = renderHook(() => useCascaderSearch(props));

      act(() => {
        result.current.handleSearchChange('search term');
      });

      expect(onSearch).toHaveBeenCalledWith('search term');
    });

    it('应该在没有 onSearch 回调时正常工作', () => {
      const setSearchValue = jest.fn();
      const props = { ...defaultProps, setSearchValue, onSearch: undefined };

      const { result } = renderHook(() => useCascaderSearch(props));

      expect(() => {
        act(() => {
          result.current.handleSearchChange('search term');
        });
      }).not.toThrow();

      expect(setSearchValue).toHaveBeenCalledWith('search term');
    });
  });

  describe('handleSearchSelect - 单选模式', () => {
    it('应该在单选模式下设置选中路径和值', () => {
      const setSelectedPath = jest.fn();
      const setActivePath = jest.fn();
      const setSearchValue = jest.fn();
      const onChange = jest.fn();

      const props = {
        ...defaultProps,
        multiple: false,
        setSelectedPath,
        setActivePath,
        setSearchValue,
        onChange,
      };

      const { result } = renderHook(() => useCascaderSearch(props));

      const searchResult = {
        path: mockSearchResults[0].path,
        value: mockSearchResults[0].value,
      };

      act(() => {
        result.current.handleSearchSelect(searchResult);
      });

      expect(setSelectedPath).toHaveBeenCalledWith(searchResult.path);
      expect(setActivePath).toHaveBeenCalledWith([]);
      expect(onChange).toHaveBeenCalledWith(searchResult.value, searchResult.path);
      expect(setSearchValue).toHaveBeenCalledWith('');
    });

    it('应该在单选模式下处理无 onChange 回调的情况', () => {
      const setSelectedPath = jest.fn();
      const setActivePath = jest.fn();
      const setSearchValue = jest.fn();

      const props = {
        ...defaultProps,
        multiple: false,
        setSelectedPath,
        setActivePath,
        setSearchValue,
        onChange: undefined,
      };

      const { result } = renderHook(() => useCascaderSearch(props));

      const searchResult = {
        path: mockSearchResults[0].path,
        value: mockSearchResults[0].value,
      };

      expect(() => {
        act(() => {
          result.current.handleSearchSelect(searchResult);
        });
      }).not.toThrow();

      expect(setSelectedPath).toHaveBeenCalledWith(searchResult.path);
      expect(setActivePath).toHaveBeenCalledWith([]);
      expect(setSearchValue).toHaveBeenCalledWith('');
    });
  });

  describe('handleSearchSelect - 多选模式', () => {
    it('应该在多选模式下切换选中状态（未选中 -> 选中）', () => {
      const handleMultipleSelect = jest.fn();
      const checkedKeys = new Set<string | number>();

      const props = {
        ...defaultProps,
        multiple: true,
        checkedKeys,
        handleMultipleSelect,
      };

      const { result } = renderHook(() => useCascaderSearch(props));

      const searchResult = {
        path: mockSearchResults[0].path,
        value: mockSearchResults[0].value,
      };

      act(() => {
        result.current.handleSearchSelect(searchResult);
      });

      const leafOption = searchResult.path[searchResult.path.length - 1];
      expect(handleMultipleSelect).toHaveBeenCalledWith(leafOption, true);
    });

    it('应该在多选模式下切换选中状态（选中 -> 未选中）', () => {
      const handleMultipleSelect = jest.fn();
      const checkedKeys = new Set<string | number>(['option1-1']);

      const props = {
        ...defaultProps,
        multiple: true,
        checkedKeys,
        handleMultipleSelect,
      };

      const { result } = renderHook(() => useCascaderSearch(props));

      const searchResult = {
        path: mockSearchResults[0].path,
        value: mockSearchResults[0].value,
      };

      act(() => {
        result.current.handleSearchSelect(searchResult);
      });

      const leafOption = searchResult.path[searchResult.path.length - 1];
      expect(handleMultipleSelect).toHaveBeenCalledWith(leafOption, false);
    });

    it('应该在多选模式下处理没有 handleMultipleSelect 的情况', () => {
      const props = {
        ...defaultProps,
        multiple: true,
        handleMultipleSelect: undefined,
      };

      const { result } = renderHook(() => useCascaderSearch(props));

      const searchResult = {
        path: mockSearchResults[0].path,
        value: mockSearchResults[0].value,
      };

      expect(() => {
        act(() => {
          result.current.handleSearchSelect(searchResult);
        });
      }).not.toThrow();
    });

    it('应该在多选模式下处理叶子节点值为 undefined 的情况', () => {
      const handleMultipleSelect = jest.fn();

      const props = {
        ...defaultProps,
        multiple: true,
        handleMultipleSelect,
      };

      const { result } = renderHook(() => useCascaderSearch(props));

      const searchResult = {
        path: [{ label: 'Option without value' }], // 没有 value 属性
        value: [],
      };

      act(() => {
        result.current.handleSearchSelect(searchResult);
      });

      // 应该不会调用 handleMultipleSelect，因为 value 是 undefined
      expect(handleMultipleSelect).not.toHaveBeenCalled();
    });
  });

  describe('边界情况', () => {
    it('应该处理空的 options 数组', () => {
      const props = { ...defaultProps, options: [], searchValue: 'search' };
      renderHook(() => useCascaderSearch(props));

      expect(mockFilterCascaderOptions).toHaveBeenCalledWith([], 'search', false);
    });

    it('应该处理空的搜索结果路径', () => {
      const handleMultipleSelect = jest.fn();

      const props = {
        ...defaultProps,
        multiple: true,
        handleMultipleSelect,
      };

      const { result } = renderHook(() => useCascaderSearch(props));

      const searchResult = {
        path: [],
        value: [],
      };

      act(() => {
        result.current.handleSearchSelect(searchResult);
      });

      expect(handleMultipleSelect).not.toHaveBeenCalled();
    });

    it('应该处理搜索值的前后空格', () => {
      const props = { ...defaultProps, searchValue: '  option  ' };
      renderHook(() => useCascaderSearch(props));

      expect(mockFilterCascaderOptions).toHaveBeenCalledWith(mockOptions, '  option  ', false);
    });
  });

  describe('性能测试', () => {
    it('应该在相同搜索值时避免重复计算', () => {
      const props = { ...defaultProps, searchValue: 'option' };
      const { rerender } = renderHook(props => useCascaderSearch(props), { initialProps: props });

      expect(mockFilterCascaderOptions).toHaveBeenCalledTimes(1);

      // 重新渲染但搜索值相同
      rerender(props);

      // 由于依赖项没有变化，应该不会重新计算
      expect(mockFilterCascaderOptions).toHaveBeenCalledTimes(1);
    });

    it('应该在参数变化时重新计算', () => {
      const initialProps = { ...defaultProps, searchValue: 'option', changeOnSelect: false };
      const { rerender } = renderHook(props => useCascaderSearch(props), { initialProps });

      expect(mockFilterCascaderOptions).toHaveBeenCalledTimes(1);

      // 改变 changeOnSelect 参数
      const updatedProps = { ...defaultProps, searchValue: 'option', changeOnSelect: true };
      rerender(updatedProps);

      expect(mockFilterCascaderOptions).toHaveBeenCalledTimes(2);
      expect(mockFilterCascaderOptions).toHaveBeenLastCalledWith(mockOptions, 'option', true);
    });

    it('应该保持回调函数引用稳定', () => {
      const { result, rerender } = renderHook(() => useCascaderSearch(defaultProps));

      const firstRender = {
        handleSearchChange: result.current.handleSearchChange,
        handleSearchSelect: result.current.handleSearchSelect,
      };

      rerender(defaultProps);

      expect(result.current.handleSearchChange).toBe(firstRender.handleSearchChange);
      expect(result.current.handleSearchSelect).toBe(firstRender.handleSearchSelect);
    });
  });
});
