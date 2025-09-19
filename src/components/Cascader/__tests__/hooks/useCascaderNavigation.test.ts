import { renderHook, act } from '@testing-library/react';
import { useCascaderNavigation, type UseCascaderNavigationProps } from '../../hooks/useCascaderNavigation';
import type { CascaderOption } from '../../types';

describe('useCascaderNavigation', () => {
  const mockOptions: CascaderOption[] = [
    {
      value: 'option1',
      label: 'Option 1',
      children: [
        {
          value: 'option1-1',
          label: 'Option 1-1',
          children: [{ value: 'option1-1-1', label: 'Option 1-1-1' }],
        },
        { value: 'option1-2', label: 'Option 1-2' },
      ],
    },
    {
      value: 'option2',
      label: 'Option 2',
      children: [{ value: 'option2-1', label: 'Option 2-1' }],
    },
  ];

  const defaultProps: UseCascaderNavigationProps = {
    activePath: [],
    checkedKeys: new Set(),
    halfCheckedKeys: new Set(),
    searchValue: '',
    setSearchValue: jest.fn(),
    setSelectedPath: jest.fn(),
    setActivePath: jest.fn(),
    setCheckedKeys: jest.fn(),
    setHalfCheckedKeys: jest.fn(),
    multiple: false,
    options: mockOptions,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初始化', () => {
    it('应该正确初始化并返回导航方法', () => {
      const { result } = renderHook(() => useCascaderNavigation(defaultProps));

      expect(typeof result.current.getCurrentLevelOptions).toBe('function');
      expect(typeof result.current.getMaxLevel).toBe('function');
      expect(typeof result.current.handleClear).toBe('function');
    });
  });

  describe('getCurrentLevelOptions', () => {
    it('应该在 level 0 时返回根选项', () => {
      const { result } = renderHook(() => useCascaderNavigation(defaultProps));

      const options = result.current.getCurrentLevelOptions(0);

      expect(options).toBe(mockOptions);
    });

    it('应该在 level 1 时返回第一级子选项', () => {
      const activePath = [{ value: 'option1', label: 'Option 1', children: mockOptions[0].children }];
      const props = { ...defaultProps, activePath };

      const { result } = renderHook(() => useCascaderNavigation(props));

      const options = result.current.getCurrentLevelOptions(1);

      expect(options).toBe(mockOptions[0].children);
    });

    it('应该在 level 2 时返回第二级子选项', () => {
      const activePath = [
        { value: 'option1', label: 'Option 1', children: mockOptions[0].children },
        { value: 'option1-1', label: 'Option 1-1', children: mockOptions[0].children![0].children },
      ];
      const props = { ...defaultProps, activePath };

      const { result } = renderHook(() => useCascaderNavigation(props));

      const options = result.current.getCurrentLevelOptions(2);

      expect(options).toBe(mockOptions[0].children![0].children);
    });

    it('应该在层级超过活跃路径长度时返回空数组', () => {
      const activePath = [{ value: 'option1', label: 'Option 1', children: mockOptions[0].children }];
      const props = { ...defaultProps, activePath };

      const { result } = renderHook(() => useCascaderNavigation(props));

      const options = result.current.getCurrentLevelOptions(3);

      expect(options).toEqual([]);
    });

    it('应该处理没有子选项的情况', () => {
      const activePath = [{ value: 'option1-2', label: 'Option 1-2' }];
      const props = { ...defaultProps, activePath };

      const { result } = renderHook(() => useCascaderNavigation(props));

      const options = result.current.getCurrentLevelOptions(1);

      expect(options).toEqual([]);
    });
  });

  describe('getMaxLevel', () => {
    it('应该返回活跃路径的长度', () => {
      const activePath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];
      const props = { ...defaultProps, activePath };

      const { result } = renderHook(() => useCascaderNavigation(props));

      const maxLevel = result.current.getMaxLevel();

      expect(maxLevel).toBe(2);
    });

    it('应该在空活跃路径时返回 0', () => {
      const { result } = renderHook(() => useCascaderNavigation(defaultProps));

      const maxLevel = result.current.getMaxLevel();

      expect(maxLevel).toBe(0);
    });

    it('应该在活跃路径变化时更新最大层级', () => {
      const initialActivePath = [{ value: 'option1', label: 'Option 1' }];
      const initialProps = { ...defaultProps, activePath: initialActivePath };

      const { result, rerender } = renderHook(props => useCascaderNavigation(props), { initialProps });

      expect(result.current.getMaxLevel()).toBe(1);

      const updatedActivePath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
        { value: 'option1-1-1', label: 'Option 1-1-1' },
      ];
      const updatedProps = { ...defaultProps, activePath: updatedActivePath };

      rerender(updatedProps);

      expect(result.current.getMaxLevel()).toBe(3);
    });
  });

  describe('handleClear - 单选模式', () => {
    it('应该清除单选模式的状态', () => {
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

      const { result } = renderHook(() => useCascaderNavigation(props));

      act(() => {
        result.current.handleClear();
      });

      expect(setSelectedPath).toHaveBeenCalledWith([]);
      expect(setActivePath).toHaveBeenCalledWith([]);
      expect(setSearchValue).toHaveBeenCalledWith('');
      expect(onChange).toHaveBeenCalledWith(undefined, null);
    });
  });

  describe('handleClear - 多选模式', () => {
    it('应该清除多选模式的状态', () => {
      const setCheckedKeys = jest.fn();
      const setHalfCheckedKeys = jest.fn();
      const setSearchValue = jest.fn();
      const onChange = jest.fn();

      const props = {
        ...defaultProps,
        multiple: true,
        setCheckedKeys,
        setHalfCheckedKeys,
        setSearchValue,
        onChange,
      };

      const { result } = renderHook(() => useCascaderNavigation(props));

      act(() => {
        result.current.handleClear();
      });

      expect(setCheckedKeys).toHaveBeenCalledWith(new Set());
      expect(setHalfCheckedKeys).toHaveBeenCalledWith(new Set());
      expect(setSearchValue).toHaveBeenCalledWith('');
      expect(onChange).toHaveBeenCalledWith([], []);
    });
  });

  describe('handleClear - 无 onChange 回调', () => {
    it('应该在没有 onChange 回调时正常工作', () => {
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

      const { result } = renderHook(() => useCascaderNavigation(props));

      expect(() => {
        act(() => {
          result.current.handleClear();
        });
      }).not.toThrow();

      expect(setSelectedPath).toHaveBeenCalledWith([]);
      expect(setActivePath).toHaveBeenCalledWith([]);
      expect(setSearchValue).toHaveBeenCalledWith('');
    });
  });

  describe('状态变化响应', () => {
    it('应该在 activePath 变化时重新计算 getCurrentLevelOptions', () => {
      const initialActivePath = [{ value: 'option1', label: 'Option 1', children: mockOptions[0].children }];
      const initialProps = { ...defaultProps, activePath: initialActivePath };

      const { result, rerender } = renderHook(props => useCascaderNavigation(props), { initialProps });

      const initialOptions = result.current.getCurrentLevelOptions(1);
      expect(initialOptions).toBe(mockOptions[0].children);

      const updatedActivePath = [{ value: 'option2', label: 'Option 2', children: mockOptions[1].children }];
      const updatedProps = { ...defaultProps, activePath: updatedActivePath };

      rerender(updatedProps);

      const updatedOptions = result.current.getCurrentLevelOptions(1);
      expect(updatedOptions).toBe(mockOptions[1].children);
    });

    it('应该在 options 变化时重新计算根选项', () => {
      const newOptions: CascaderOption[] = [{ value: 'new-option', label: 'New Option' }];

      const initialProps = { ...defaultProps, options: mockOptions };
      const { result, rerender } = renderHook(props => useCascaderNavigation(props), { initialProps });

      const initialOptions = result.current.getCurrentLevelOptions(0);
      expect(initialOptions).toBe(mockOptions);

      const updatedProps = { ...defaultProps, options: newOptions };
      rerender(updatedProps);

      const updatedOptions = result.current.getCurrentLevelOptions(0);
      expect(updatedOptions).toBe(newOptions);
    });
  });

  describe('边界情况', () => {
    it('应该处理空的 options 数组', () => {
      const props = { ...defaultProps, options: [] };
      const { result } = renderHook(() => useCascaderNavigation(props));

      const options = result.current.getCurrentLevelOptions(0);
      expect(options).toEqual([]);

      const maxLevel = result.current.getMaxLevel();
      expect(maxLevel).toBe(0);
    });

    it('应该处理负数级别', () => {
      const { result } = renderHook(() => useCascaderNavigation(defaultProps));

      // 负数级别会访问 activePath[-2]，这会导致 undefined
      // 然后访问 undefined.children 会抛出错误
      expect(() => {
        result.current.getCurrentLevelOptions(-1);
      }).toThrow();
    });

    it('应该处理非常大的级别数字', () => {
      const { result } = renderHook(() => useCascaderNavigation(defaultProps));

      const options = result.current.getCurrentLevelOptions(999);
      expect(options).toEqual([]);
    });

    it('应该处理活跃路径中的空选项', () => {
      const activePath = [
        { value: 'option1', label: 'Option 1' },
        null as any, // 模拟空选项
      ];
      const props = { ...defaultProps, activePath };

      const { result } = renderHook(() => useCascaderNavigation(props));

      // 当路径中有空项时，访问 null.children 会抛出错误
      expect(() => {
        result.current.getCurrentLevelOptions(2);
      }).toThrow();
    });
  });

  describe('性能测试', () => {
    it('应该在多次调用时保持方法引用稳定', () => {
      const { result, rerender } = renderHook(() => useCascaderNavigation(defaultProps));

      const firstRender = {
        getCurrentLevelOptions: result.current.getCurrentLevelOptions,
        getMaxLevel: result.current.getMaxLevel,
        handleClear: result.current.handleClear,
      };

      rerender(defaultProps);

      expect(result.current.getCurrentLevelOptions).toBe(firstRender.getCurrentLevelOptions);
      expect(result.current.getMaxLevel).toBe(firstRender.getMaxLevel);
      expect(result.current.handleClear).toBe(firstRender.handleClear);
    });
  });
});
