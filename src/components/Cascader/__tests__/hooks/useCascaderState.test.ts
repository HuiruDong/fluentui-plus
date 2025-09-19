import { renderHook, act } from '@testing-library/react';
import { useCascaderState, type UseCascaderStateProps } from '../../hooks/useCascaderState';
import type { CascaderOption, CascaderValue, CascaderMultipleValue } from '../../types';

// Mock utility functions
jest.mock('../../utils', () => ({
  findPathByValue: jest.fn(),
  getValueFromPath: jest.fn(),
  getHalfCheckedKeys: jest.fn(),
  getCheckedPaths: jest.fn(),
}));

import { findPathByValue, getValueFromPath, getHalfCheckedKeys, getCheckedPaths } from '../../utils';

const mockFindPathByValue = findPathByValue as jest.MockedFunction<typeof findPathByValue>;
const mockGetValueFromPath = getValueFromPath as jest.MockedFunction<typeof getValueFromPath>;
const mockGetHalfCheckedKeys = getHalfCheckedKeys as jest.MockedFunction<typeof getHalfCheckedKeys>;
const mockGetCheckedPaths = getCheckedPaths as jest.MockedFunction<typeof getCheckedPaths>;

describe('useCascaderState', () => {
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

  const defaultProps: UseCascaderStateProps = {
    options: mockOptions,
    multiple: false,
    showSearch: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockFindPathByValue.mockReturnValue([]);
    mockGetValueFromPath.mockReturnValue(['option1', 'option1-1']);
    mockGetHalfCheckedKeys.mockReturnValue(new Set());
    mockGetCheckedPaths.mockReturnValue([]);
  });

  describe('初始化', () => {
    it('应该正确初始化基础状态', () => {
      const { result } = renderHook(() => useCascaderState(defaultProps));

      expect(result.current.selectedPath).toEqual([]);
      expect(result.current.checkedKeys).toEqual(new Set());
      expect(result.current.halfCheckedKeys).toEqual(new Set());
      expect(result.current.activePath).toEqual([]);
      expect(result.current.searchValue).toBe('');
      expect(result.current.isSearching).toBe(false);
      expect(result.current.currentValue).toBeUndefined();

      expect(typeof result.current.setSelectedPath).toBe('function');
      expect(typeof result.current.setCheckedKeys).toBe('function');
      expect(typeof result.current.setHalfCheckedKeys).toBe('function');
      expect(typeof result.current.setActivePath).toBe('function');
      expect(typeof result.current.setSearchValue).toBe('function');
    });
  });

  describe('单选模式初始化', () => {
    it('应该根据 value 初始化选中路径', () => {
      const mockPath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];
      mockFindPathByValue.mockReturnValue(mockPath);

      const props = {
        ...defaultProps,
        value: ['option1', 'option1-1'] as CascaderValue,
        multiple: false,
      };

      const { result } = renderHook(() => useCascaderState(props));

      expect(mockFindPathByValue).toHaveBeenCalledWith(mockOptions, ['option1', 'option1-1']);
      expect(result.current.selectedPath).toBe(mockPath);
    });

    it('应该根据 defaultValue 初始化选中路径', () => {
      const mockPath = [
        { value: 'option2', label: 'Option 2' },
        { value: 'option2-1', label: 'Option 2-1' },
      ];
      mockFindPathByValue.mockReturnValue(mockPath);

      const props = {
        ...defaultProps,
        defaultValue: ['option2', 'option2-1'] as CascaderValue,
        multiple: false,
      };

      const { result } = renderHook(() => useCascaderState(props));

      expect(mockFindPathByValue).toHaveBeenCalledWith(mockOptions, ['option2', 'option2-1']);
      expect(result.current.selectedPath).toBe(mockPath);
    });

    it('应该优先使用 value 而不是 defaultValue', () => {
      const mockPath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];
      mockFindPathByValue.mockReturnValue(mockPath);

      const props = {
        ...defaultProps,
        value: ['option1', 'option1-1'] as CascaderValue,
        defaultValue: ['option2', 'option2-1'] as CascaderValue,
        multiple: false,
      };

      const { result } = renderHook(() => useCascaderState(props));

      expect(mockFindPathByValue).toHaveBeenCalledWith(mockOptions, ['option1', 'option1-1']);
      expect(result.current.selectedPath).toBe(mockPath);
    });

    it('应该处理找不到路径的情况', () => {
      mockFindPathByValue.mockReturnValue(null);

      const props = {
        ...defaultProps,
        value: ['invalid', 'value'] as CascaderValue,
        multiple: false,
      };

      const { result } = renderHook(() => useCascaderState(props));

      expect(result.current.selectedPath).toEqual([]);
    });

    it('应该处理空值的情况', () => {
      const props = {
        ...defaultProps,
        value: [] as CascaderValue,
        multiple: false,
      };

      const { result } = renderHook(() => useCascaderState(props));

      expect(mockFindPathByValue).not.toHaveBeenCalled();
      expect(result.current.selectedPath).toEqual([]);
    });
  });

  describe('多选模式初始化', () => {
    it('应该根据 value 初始化选中键', () => {
      const multipleValue: CascaderMultipleValue = [
        ['option1', 'option1-1'],
        ['option2', 'option2-1'],
      ];

      const props = {
        ...defaultProps,
        value: multipleValue,
        multiple: true,
      };

      const expectedKeys = new Set(['option1-1', 'option2-1']);
      const expectedHalfKeys = new Set(['option1', 'option2']);
      mockGetHalfCheckedKeys.mockReturnValue(expectedHalfKeys);

      const { result } = renderHook(() => useCascaderState(props));

      expect(result.current.checkedKeys).toEqual(expectedKeys);
      expect(mockGetHalfCheckedKeys).toHaveBeenCalledWith(mockOptions, expectedKeys);
      expect(result.current.halfCheckedKeys).toBe(expectedHalfKeys);
    });

    it('应该根据 defaultValue 初始化选中键', () => {
      const multipleValue: CascaderMultipleValue = [['option1', 'option1-2']];

      const props = {
        ...defaultProps,
        defaultValue: multipleValue,
        multiple: true,
      };

      const expectedKeys = new Set(['option1-2']);
      const expectedHalfKeys = new Set(['option1']);
      mockGetHalfCheckedKeys.mockReturnValue(expectedHalfKeys);

      const { result } = renderHook(() => useCascaderState(props));

      expect(result.current.checkedKeys).toEqual(expectedKeys);
      expect(result.current.halfCheckedKeys).toBe(expectedHalfKeys);
    });

    it('应该处理空的多选值', () => {
      const props = {
        ...defaultProps,
        value: [] as CascaderMultipleValue,
        multiple: true,
      };

      const { result } = renderHook(() => useCascaderState(props));

      expect(result.current.checkedKeys).toEqual(new Set());
      expect(result.current.halfCheckedKeys).toEqual(new Set());
    });

    it('应该处理包含空数组的多选值', () => {
      const multipleValue: CascaderMultipleValue = [
        ['option1', 'option1-1'],
        [], // 空数组
        ['option2', 'option2-1'],
      ];

      const props = {
        ...defaultProps,
        value: multipleValue,
        multiple: true,
      };

      const { result } = renderHook(() => useCascaderState(props));

      // 应该忽略空数组，只处理有效的路径
      expect(result.current.checkedKeys).toEqual(new Set(['option1-1', 'option2-1']));
    });

    it('应该处理包含 undefined 值的多选值', () => {
      const multipleValue: CascaderMultipleValue = [
        ['option1', undefined as any, 'option1-1'], // 路径的最后一个值是 'option1-1'
        ['option2', 'option2-1'], // 路径的最后一个值是 'option2-1'
      ];

      const props = {
        ...defaultProps,
        value: multipleValue,
        multiple: true,
      };

      const { result } = renderHook(() => useCascaderState(props));

      // 应该添加路径的最后一个值（叶子节点），即使路径中有 undefined
      expect(result.current.checkedKeys).toEqual(new Set(['option1-1', 'option2-1']));
    });
  });

  describe('isSearching', () => {
    it('应该在 showSearch 为 true 且有搜索值时返回 true', () => {
      const props = { ...defaultProps, showSearch: true };
      const { result } = renderHook(() => useCascaderState(props));

      act(() => {
        result.current.setSearchValue('search term');
      });

      expect(result.current.isSearching).toBe(true);
    });

    it('应该在 showSearch 为 false 时返回 false', () => {
      const props = { ...defaultProps, showSearch: false };
      const { result } = renderHook(() => useCascaderState(props));

      act(() => {
        result.current.setSearchValue('search term');
      });

      expect(result.current.isSearching).toBe(false);
    });

    it('应该在搜索值为空或只有空格时返回 false', () => {
      const props = { ...defaultProps, showSearch: true };
      const { result } = renderHook(() => useCascaderState(props));

      act(() => {
        result.current.setSearchValue('   ');
      });

      expect(result.current.isSearching).toBe(false);

      act(() => {
        result.current.setSearchValue('');
      });

      expect(result.current.isSearching).toBe(false);
    });
  });

  describe('currentValue', () => {
    it('应该优先返回 props.value', () => {
      const propsValue = ['option1', 'option1-1'];
      const props = {
        ...defaultProps,
        value: propsValue as CascaderValue,
        multiple: false,
      };

      const { result } = renderHook(() => useCascaderState(props));

      expect(result.current.currentValue).toBe(propsValue);
    });

    it('应该在单选模式下根据 selectedPath 计算值', () => {
      mockGetValueFromPath.mockReturnValue(['option2', 'option2-1']);

      const { result } = renderHook(() => useCascaderState(defaultProps));

      act(() => {
        result.current.setSelectedPath([
          { value: 'option2', label: 'Option 2' },
          { value: 'option2-1', label: 'Option 2-1' },
        ]);
      });

      expect(result.current.currentValue).toEqual(['option2', 'option2-1']);
      expect(mockGetValueFromPath).toHaveBeenCalledWith([
        { value: 'option2', label: 'Option 2' },
        { value: 'option2-1', label: 'Option 2-1' },
      ]);
    });

    it('应该在单选模式下处理空的 selectedPath', () => {
      const { result } = renderHook(() => useCascaderState(defaultProps));

      expect(result.current.currentValue).toBeUndefined();
    });

    it('应该在多选模式下根据 checkedKeys 计算值', () => {
      // 清除之前的 mock 调用
      jest.clearAllMocks();

      const checkedPaths = [
        [
          { value: 'option1', label: 'Option 1' },
          { value: 'option1-1', label: 'Option 1-1' },
        ],
        [
          { value: 'option2', label: 'Option 2' },
          { value: 'option2-1', label: 'Option 2-1' },
        ],
      ];

      mockGetCheckedPaths.mockReturnValue(checkedPaths);

      // 为每个路径设置对应的返回值
      mockGetValueFromPath.mockImplementation(path => {
        if (path === checkedPaths[0]) {
          return ['option1', 'option1-1'];
        } else if (path === checkedPaths[1]) {
          return ['option2', 'option2-1'];
        }
        return [];
      });

      const props = { ...defaultProps, multiple: true };
      const { result } = renderHook(() => useCascaderState(props));

      act(() => {
        result.current.setCheckedKeys(new Set(['option1-1', 'option2-1']));
      });

      expect(result.current.currentValue).toEqual([
        ['option1', 'option1-1'],
        ['option2', 'option2-1'],
      ]);
      expect(mockGetCheckedPaths).toHaveBeenCalledWith(mockOptions, new Set(['option1-1', 'option2-1']));
    });
  });

  describe('状态更新', () => {
    it('应该正确更新 selectedPath', () => {
      const { result } = renderHook(() => useCascaderState(defaultProps));

      const newPath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-2', label: 'Option 1-2' },
      ];

      act(() => {
        result.current.setSelectedPath(newPath);
      });

      expect(result.current.selectedPath).toBe(newPath);
    });

    it('应该正确更新 checkedKeys', () => {
      const { result } = renderHook(() => useCascaderState(defaultProps));

      const newKeys = new Set(['option1-1', 'option2-1']);

      act(() => {
        result.current.setCheckedKeys(newKeys);
      });

      expect(result.current.checkedKeys).toBe(newKeys);
    });

    it('应该正确更新 activePath', () => {
      const { result } = renderHook(() => useCascaderState(defaultProps));

      const newPath = [{ value: 'option1', label: 'Option 1' }];

      act(() => {
        result.current.setActivePath(newPath);
      });

      expect(result.current.activePath).toBe(newPath);
    });

    it('应该正确更新 searchValue', () => {
      const { result } = renderHook(() => useCascaderState(defaultProps));

      act(() => {
        result.current.setSearchValue('new search');
      });

      expect(result.current.searchValue).toBe('new search');
    });
  });

  describe('props 变化响应', () => {
    it('应该在 value 变化时重新初始化单选状态', () => {
      const mockPath1 = [{ value: 'option1', label: 'Option 1' }];
      const mockPath2 = [{ value: 'option2', label: 'Option 2' }];

      mockFindPathByValue.mockReturnValueOnce(mockPath1).mockReturnValueOnce(mockPath2);

      const initialProps = {
        ...defaultProps,
        value: ['option1'] as CascaderValue,
        multiple: false,
      };

      const { result, rerender } = renderHook(props => useCascaderState(props), { initialProps });

      expect(result.current.selectedPath).toBe(mockPath1);

      const updatedProps = {
        ...defaultProps,
        value: ['option2'] as CascaderValue,
        multiple: false,
      };

      rerender(updatedProps);

      expect(result.current.selectedPath).toBe(mockPath2);
    });

    it('应该在 value 变化时重新初始化多选状态', () => {
      const initialValue: CascaderMultipleValue = [['option1', 'option1-1']];
      const updatedValue: CascaderMultipleValue = [['option2', 'option2-1']];

      const initialProps = {
        ...defaultProps,
        value: initialValue,
        multiple: true,
      };

      const { result, rerender } = renderHook(props => useCascaderState(props), { initialProps });

      expect(result.current.checkedKeys).toEqual(new Set(['option1-1']));

      const updatedProps = {
        ...defaultProps,
        value: updatedValue,
        multiple: true,
      };

      rerender(updatedProps);

      expect(result.current.checkedKeys).toEqual(new Set(['option2-1']));
    });

    it('应该在 options 变化时重新初始化状态', () => {
      const newOptions: CascaderOption[] = [{ value: 'new-option', label: 'New Option' }];

      const initialProps = {
        ...defaultProps,
        value: ['option1', 'option1-1'] as CascaderValue,
        options: mockOptions,
      };

      const { rerender } = renderHook(props => useCascaderState(props), { initialProps });

      const updatedProps = {
        ...defaultProps,
        value: ['option1', 'option1-1'] as CascaderValue,
        options: newOptions,
      };

      rerender(updatedProps);

      // 应该用新的 options 重新调用 findPathByValue
      expect(mockFindPathByValue).toHaveBeenLastCalledWith(newOptions, ['option1', 'option1-1']);
    });
  });

  describe('边界情况', () => {
    it('应该处理空的 options 数组', () => {
      const props = {
        ...defaultProps,
        options: [],
        value: ['option1', 'option1-1'] as CascaderValue,
      };

      renderHook(() => useCascaderState(props));

      expect(mockFindPathByValue).toHaveBeenCalledWith([], ['option1', 'option1-1']);
    });

    it('应该处理 undefined 的 value 和 defaultValue', () => {
      const props = {
        ...defaultProps,
        value: undefined,
        defaultValue: undefined,
      };

      const { result } = renderHook(() => useCascaderState(props));

      expect(result.current.selectedPath).toEqual([]);
      expect(result.current.checkedKeys).toEqual(new Set());
    });

    it('应该处理无效的 value 类型', () => {
      const props = {
        ...defaultProps,
        value: 'invalid' as any,
        multiple: false,
      };

      const { result } = renderHook(() => useCascaderState(props));

      expect(mockFindPathByValue).not.toHaveBeenCalled();
      expect(result.current.selectedPath).toEqual([]);
    });
  });

  describe('性能测试', () => {
    it('应该在相同 props 时避免重复初始化', () => {
      const props = {
        ...defaultProps,
        value: ['option1', 'option1-1'] as CascaderValue,
      };

      const { rerender } = renderHook(props => useCascaderState(props), { initialProps: props });

      expect(mockFindPathByValue).toHaveBeenCalledTimes(1);

      // 重新渲染但 props 相同
      rerender(props);

      // useEffect 的依赖数组应该防止重复调用
      expect(mockFindPathByValue).toHaveBeenCalledTimes(1);
    });
  });
});
