import { renderHook, act } from '@testing-library/react';
import { useCascaderSelection, type UseCascaderSelectionProps } from '../../hooks/useCascaderSelection';
import type { CascaderOption } from '../../types';

// Mock utility functions
jest.mock('../../utils', () => ({
  getValueFromPath: jest.fn(),
  generateDisplayText: jest.fn(),
}));

// Mock lodash
jest.mock('lodash', () => ({
  isEqual: jest.fn(),
}));

import { getValueFromPath, generateDisplayText } from '../../utils';
import _ from 'lodash';

const mockGetValueFromPath = getValueFromPath as jest.MockedFunction<typeof getValueFromPath>;
const mockGenerateDisplayText = generateDisplayText as jest.MockedFunction<typeof generateDisplayText>;
const mockIsEqual = _.isEqual as jest.MockedFunction<typeof _.isEqual>;

describe('useCascaderSelection', () => {
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

  const defaultProps: UseCascaderSelectionProps = {
    selectedPath: [],
    setSelectedPath: jest.fn(),
    activePath: [],
    setActivePath: jest.fn(),
    searchValue: '',
    setSearchValue: jest.fn(),
    currentValue: undefined,
    multiple: false,
    changeOnSelect: false,
    showSearch: false,
    options: mockOptions,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockGetValueFromPath.mockReturnValue(['option1', 'option1-1']);
    mockGenerateDisplayText.mockReturnValue('Option 1 / Option 1-1');
    mockIsEqual.mockReturnValue(false);
  });

  describe('初始化', () => {
    it('应该正确初始化并返回选择相关方法', () => {
      const { result } = renderHook(() => useCascaderSelection(defaultProps));

      expect(result.current.currentSelectedPath).toEqual([]);
      expect(result.current.displayText).toBe('');
      expect(typeof result.current.handlePathChange).toBe('function');
      expect(typeof result.current.handleFinalSelect).toBe('function');
      expect(typeof result.current.isValueSelected).toBe('function');
      expect(typeof result.current.isPathSelected).toBe('function');
      expect(typeof result.current.isPathActive).toBe('function');
    });
  });

  describe('currentSelectedPath', () => {
    it('应该在单选模式下返回选中路径', () => {
      const selectedPath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];
      const props = { ...defaultProps, selectedPath, multiple: false };

      const { result } = renderHook(() => useCascaderSelection(props));

      expect(result.current.currentSelectedPath).toBe(selectedPath);
    });

    it('应该在多选模式下返回空数组', () => {
      const selectedPath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];
      const props = { ...defaultProps, selectedPath, multiple: true };

      const { result } = renderHook(() => useCascaderSelection(props));

      expect(result.current.currentSelectedPath).toEqual([]);
    });
  });

  describe('displayText', () => {
    it('应该在单选模式下生成显示文本', () => {
      const selectedPath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];
      mockGenerateDisplayText.mockReturnValue('Option 1 / Option 1-1');

      const props = { ...defaultProps, selectedPath, multiple: false };
      const { result } = renderHook(() => useCascaderSelection(props));

      expect(result.current.displayText).toBe('Option 1 / Option 1-1');
      expect(mockGenerateDisplayText).toHaveBeenCalledWith(selectedPath);
    });

    it('应该在选中路径为空时返回空字符串', () => {
      const props = { ...defaultProps, selectedPath: [], multiple: false };
      const { result } = renderHook(() => useCascaderSelection(props));

      expect(result.current.displayText).toBe('');
      expect(mockGenerateDisplayText).not.toHaveBeenCalled();
    });

    it('应该在多选模式下返回空字符串', () => {
      const selectedPath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];
      const props = { ...defaultProps, selectedPath, multiple: true };

      const { result } = renderHook(() => useCascaderSelection(props));

      expect(result.current.displayText).toBe('');
      expect(mockGenerateDisplayText).not.toHaveBeenCalled();
    });
  });

  describe('handlePathChange', () => {
    it('应该在单选模式下设置活跃路径', () => {
      const setActivePath = jest.fn();
      const props = { ...defaultProps, setActivePath, multiple: false };

      const { result } = renderHook(() => useCascaderSelection(props));

      const newPath = [{ value: 'option1', label: 'Option 1' }];

      act(() => {
        result.current.handlePathChange(newPath);
      });

      expect(setActivePath).toHaveBeenCalledWith(newPath);
    });

    it('应该在叶子节点时触发选择（单选模式）', () => {
      const setSelectedPath = jest.fn();
      const setActivePath = jest.fn();
      const onChange = jest.fn();
      mockGetValueFromPath.mockReturnValue(['option1', 'option1-1']);

      const props = {
        ...defaultProps,
        setSelectedPath,
        setActivePath,
        onChange,
        multiple: false,
      };

      const { result } = renderHook(() => useCascaderSelection(props));

      const newPath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];

      act(() => {
        result.current.handlePathChange(newPath, true);
      });

      expect(setActivePath).toHaveBeenCalledWith(newPath);
      expect(setSelectedPath).toHaveBeenCalledWith(newPath);
      expect(onChange).toHaveBeenCalledWith(['option1', 'option1-1'], newPath);
    });

    it('应该在开启 changeOnSelect 时触发选择（单选模式）', () => {
      const setSelectedPath = jest.fn();
      const setActivePath = jest.fn();
      const onChange = jest.fn();
      mockGetValueFromPath.mockReturnValue(['option1']);

      const props = {
        ...defaultProps,
        setSelectedPath,
        setActivePath,
        onChange,
        multiple: false,
        changeOnSelect: true,
      };

      const { result } = renderHook(() => useCascaderSelection(props));

      const newPath = [{ value: 'option1', label: 'Option 1' }];

      act(() => {
        result.current.handlePathChange(newPath, false);
      });

      expect(setActivePath).toHaveBeenCalledWith(newPath);
      expect(setSelectedPath).toHaveBeenCalledWith(newPath);
      expect(onChange).toHaveBeenCalledWith(['option1'], newPath);
    });

    it('应该在非叶子节点且未开启 changeOnSelect 时只设置活跃路径', () => {
      const setSelectedPath = jest.fn();
      const setActivePath = jest.fn();
      const onChange = jest.fn();

      const props = {
        ...defaultProps,
        setSelectedPath,
        setActivePath,
        onChange,
        multiple: false,
        changeOnSelect: false,
      };

      const { result } = renderHook(() => useCascaderSelection(props));

      const newPath = [{ value: 'option1', label: 'Option 1' }];

      act(() => {
        result.current.handlePathChange(newPath, false);
      });

      expect(setActivePath).toHaveBeenCalledWith(newPath);
      expect(setSelectedPath).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('应该在多选模式下只设置活跃路径', () => {
      const setSelectedPath = jest.fn();
      const setActivePath = jest.fn();
      const onChange = jest.fn();

      const props = {
        ...defaultProps,
        setSelectedPath,
        setActivePath,
        onChange,
        multiple: true,
      };

      const { result } = renderHook(() => useCascaderSelection(props));

      const newPath = [{ value: 'option1', label: 'Option 1' }];

      act(() => {
        result.current.handlePathChange(newPath, true);
      });

      expect(setActivePath).toHaveBeenCalledWith(newPath);
      expect(setSelectedPath).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('handleFinalSelect', () => {
    it('应该在单选模式下处理最终选择', () => {
      const setSelectedPath = jest.fn();
      const setActivePath = jest.fn();
      const onChange = jest.fn();
      mockGetValueFromPath.mockReturnValue(['option1', 'option1-1']);

      const props = {
        ...defaultProps,
        setSelectedPath,
        setActivePath,
        onChange,
        multiple: false,
      };

      const { result } = renderHook(() => useCascaderSelection(props));

      const option = { value: 'option1-1', label: 'Option 1-1' };
      const path = [{ value: 'option1', label: 'Option 1' }];

      act(() => {
        result.current.handleFinalSelect(option, path);
      });

      const expectedPath = [...path, option];
      expect(setSelectedPath).toHaveBeenCalledWith(expectedPath);
      expect(setActivePath).toHaveBeenCalledWith([]);
      expect(onChange).toHaveBeenCalledWith(['option1', 'option1-1'], expectedPath);
    });

    it('应该在单选模式下清空搜索（showSearch 为 true）', () => {
      const setSelectedPath = jest.fn();
      const setActivePath = jest.fn();
      const setSearchValue = jest.fn();
      const onChange = jest.fn();

      const props = {
        ...defaultProps,
        setSelectedPath,
        setActivePath,
        setSearchValue,
        onChange,
        multiple: false,
        showSearch: true,
      };

      const { result } = renderHook(() => useCascaderSelection(props));

      const option = { value: 'option1-1', label: 'Option 1-1' };
      const path = [{ value: 'option1', label: 'Option 1' }];

      act(() => {
        result.current.handleFinalSelect(option, path);
      });

      expect(setSearchValue).toHaveBeenCalledWith('');
    });

    it('应该在单选模式下不清空搜索（showSearch 为 false）', () => {
      const setSelectedPath = jest.fn();
      const setActivePath = jest.fn();
      const setSearchValue = jest.fn();
      const onChange = jest.fn();

      const props = {
        ...defaultProps,
        setSelectedPath,
        setActivePath,
        setSearchValue,
        onChange,
        multiple: false,
        showSearch: false,
      };

      const { result } = renderHook(() => useCascaderSelection(props));

      const option = { value: 'option1-1', label: 'Option 1-1' };
      const path = [{ value: 'option1', label: 'Option 1' }];

      act(() => {
        result.current.handleFinalSelect(option, path);
      });

      expect(setSearchValue).not.toHaveBeenCalled();
    });

    it('应该在多选模式下不执行任何操作', () => {
      const setSelectedPath = jest.fn();
      const setActivePath = jest.fn();
      const onChange = jest.fn();

      const props = {
        ...defaultProps,
        setSelectedPath,
        setActivePath,
        onChange,
        multiple: true,
      };

      const { result } = renderHook(() => useCascaderSelection(props));

      const option = { value: 'option1-1', label: 'Option 1-1' };
      const path = [{ value: 'option1', label: 'Option 1' }];

      act(() => {
        result.current.handleFinalSelect(option, path);
      });

      expect(setSelectedPath).not.toHaveBeenCalled();
      expect(setActivePath).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('isValueSelected', () => {
    it('应该在单选模式下正确检查值是否选中', () => {
      const currentValue = ['option1', 'option1-1'];
      mockIsEqual.mockReturnValue(true);

      const props = { ...defaultProps, currentValue, multiple: false };
      const { result } = renderHook(() => useCascaderSelection(props));

      const targetValue = ['option1', 'option1-1'];
      const isSelected = result.current.isValueSelected(targetValue);

      expect(isSelected).toBe(true);
      expect(mockIsEqual).toHaveBeenCalledWith(currentValue, targetValue);
    });

    it('应该在单选模式下正确检查值未选中', () => {
      const currentValue = ['option1', 'option1-1'];
      mockIsEqual.mockReturnValue(false);

      const props = { ...defaultProps, currentValue, multiple: false };
      const { result } = renderHook(() => useCascaderSelection(props));

      const targetValue = ['option2', 'option2-1'];
      const isSelected = result.current.isValueSelected(targetValue);

      expect(isSelected).toBe(false);
      expect(mockIsEqual).toHaveBeenCalledWith(currentValue, targetValue);
    });

    it('应该在多选模式下始终返回 false', () => {
      const props = { ...defaultProps, multiple: true };
      const { result } = renderHook(() => useCascaderSelection(props));

      const targetValue = ['option1', 'option1-1'];
      const isSelected = result.current.isValueSelected(targetValue);

      expect(isSelected).toBe(false);
      expect(mockIsEqual).not.toHaveBeenCalled();
    });
  });

  describe('isPathSelected', () => {
    it('应该在单选模式下正确检查路径是否选中', () => {
      mockGetValueFromPath.mockReturnValue(['option1', 'option1-1']);
      mockIsEqual.mockReturnValue(true);

      const currentValue = ['option1', 'option1-1'];
      const props = { ...defaultProps, currentValue, multiple: false };
      const { result } = renderHook(() => useCascaderSelection(props));

      const path = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];
      const isSelected = result.current.isPathSelected(path);

      expect(isSelected).toBe(true);
      expect(mockGetValueFromPath).toHaveBeenCalledWith(path);
    });

    it('应该在多选模式下始终返回 false', () => {
      const props = { ...defaultProps, multiple: true };
      const { result } = renderHook(() => useCascaderSelection(props));

      const path = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];
      const isSelected = result.current.isPathSelected(path);

      expect(isSelected).toBe(false);
      expect(mockGetValueFromPath).not.toHaveBeenCalled();
    });
  });

  describe('isPathActive', () => {
    it('应该正确检查路径是否处于活跃状态', () => {
      const activePath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];
      const props = { ...defaultProps, activePath };

      const { result } = renderHook(() => useCascaderSelection(props));

      const testPath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];

      expect(result.current.isPathActive(testPath, 0)).toBe(true);
      expect(result.current.isPathActive(testPath, 1)).toBe(true);
    });

    it('应该在路径不匹配时返回 false', () => {
      const activePath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];
      const props = { ...defaultProps, activePath };

      const { result } = renderHook(() => useCascaderSelection(props));

      const testPath = [
        { value: 'option2', label: 'Option 2' },
        { value: 'option2-1', label: 'Option 2-1' },
      ];

      expect(result.current.isPathActive(testPath, 0)).toBe(false);
    });

    it('应该在层级超过活跃路径长度时返回 false', () => {
      const activePath = [{ value: 'option1', label: 'Option 1' }];
      const props = { ...defaultProps, activePath };

      const { result } = renderHook(() => useCascaderSelection(props));

      const testPath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];

      expect(result.current.isPathActive(testPath, 1)).toBe(false);
    });

    it('应该在路径或活跃路径中有空项时返回 false', () => {
      const activePath = [{ value: 'option1', label: 'Option 1' }, null as any];
      const props = { ...defaultProps, activePath };

      const { result } = renderHook(() => useCascaderSelection(props));

      const testPath = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option1-1', label: 'Option 1-1' },
      ];

      expect(result.current.isPathActive(testPath, 1)).toBe(false);
    });
  });

  describe('边界情况', () => {
    it('应该处理 undefined 的 onChange 回调', () => {
      const setSelectedPath = jest.fn();
      const setActivePath = jest.fn();

      const props = {
        ...defaultProps,
        setSelectedPath,
        setActivePath,
        onChange: undefined,
        multiple: false,
      };

      const { result } = renderHook(() => useCascaderSelection(props));

      expect(() => {
        act(() => {
          result.current.handlePathChange([{ value: 'option1', label: 'Option 1' }], true);
        });
      }).not.toThrow();
    });

    it('应该处理空的路径数组', () => {
      const { result } = renderHook(() => useCascaderSelection(defaultProps));

      expect(result.current.isPathActive([], 0)).toBe(false);
      expect(result.current.isPathSelected([])).toBe(false);
    });

    it('应该处理 currentValue 为 undefined 的情况', () => {
      const props = { ...defaultProps, currentValue: undefined, multiple: false };
      const { result } = renderHook(() => useCascaderSelection(props));

      const targetValue = ['option1', 'option1-1'];
      const isSelected = result.current.isValueSelected(targetValue);

      expect(isSelected).toBe(false);
      expect(mockIsEqual).toHaveBeenCalledWith(undefined, targetValue);
    });
  });

  describe('性能测试', () => {
    it('应该保持回调函数引用稳定', () => {
      const { result, rerender } = renderHook(() => useCascaderSelection(defaultProps));

      const firstRender = {
        handlePathChange: result.current.handlePathChange,
        handleFinalSelect: result.current.handleFinalSelect,
        isValueSelected: result.current.isValueSelected,
        isPathSelected: result.current.isPathSelected,
        isPathActive: result.current.isPathActive,
      };

      rerender(defaultProps);

      expect(result.current.handlePathChange).toBe(firstRender.handlePathChange);
      expect(result.current.handleFinalSelect).toBe(firstRender.handleFinalSelect);
      expect(result.current.isValueSelected).toBe(firstRender.isValueSelected);
      expect(result.current.isPathSelected).toBe(firstRender.isPathSelected);
      expect(result.current.isPathActive).toBe(firstRender.isPathActive);
    });
  });
});
