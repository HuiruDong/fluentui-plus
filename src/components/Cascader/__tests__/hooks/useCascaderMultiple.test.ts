import { renderHook, act } from '@testing-library/react';
import { useCascaderMultiple, type UseCascaderMultipleProps } from '../../hooks/useCascaderMultiple';
import type { CascaderOption, CheckedStatus } from '../../types';

// Mock utility functions
jest.mock('../../utils', () => ({
  getValueFromPath: jest.fn(),
  getNodeCheckedStatus: jest.fn(),
  updateCheckedKeys: jest.fn(),
  getHalfCheckedKeys: jest.fn(),
  getCheckedOptions: jest.fn(),
  getCheckedPaths: jest.fn(),
}));

import {
  getValueFromPath,
  getNodeCheckedStatus,
  updateCheckedKeys,
  getHalfCheckedKeys,
  getCheckedOptions,
  getCheckedPaths,
} from '../../utils';

const mockGetValueFromPath = getValueFromPath as jest.MockedFunction<typeof getValueFromPath>;
const mockGetNodeCheckedStatus = getNodeCheckedStatus as jest.MockedFunction<typeof getNodeCheckedStatus>;
const mockUpdateCheckedKeys = updateCheckedKeys as jest.MockedFunction<typeof updateCheckedKeys>;
const mockGetHalfCheckedKeys = getHalfCheckedKeys as jest.MockedFunction<typeof getHalfCheckedKeys>;
const mockGetCheckedOptions = getCheckedOptions as jest.MockedFunction<typeof getCheckedOptions>;
const mockGetCheckedPaths = getCheckedPaths as jest.MockedFunction<typeof getCheckedPaths>;

describe('useCascaderMultiple', () => {
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

  const defaultProps: UseCascaderMultipleProps = {
    checkedKeys: new Set(),
    setCheckedKeys: jest.fn(),
    halfCheckedKeys: new Set(),
    setHalfCheckedKeys: jest.fn(),
    searchValue: '',
    setSearchValue: jest.fn(),
    multiple: true,
    showSearch: false,
    options: mockOptions,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockGetValueFromPath.mockReturnValue(['option1', 'option1-1']);
    mockGetNodeCheckedStatus.mockReturnValue('unchecked');
    mockUpdateCheckedKeys.mockReturnValue(new Set(['option1-1']));
    mockGetHalfCheckedKeys.mockReturnValue(new Set());
    mockGetCheckedOptions.mockReturnValue([]);
    mockGetCheckedPaths.mockReturnValue([]);
  });

  describe('初始化', () => {
    it('应该正确初始化多选模式', () => {
      const { result } = renderHook(() => useCascaderMultiple(defaultProps));

      expect(result.current.currentSelectedPath).toEqual([]);
      expect(result.current.currentValue).toEqual([]);
      expect(result.current.displayText).toBe('');
      expect(typeof result.current.handleMultipleSelect).toBe('function');
      expect(typeof result.current.getOptionCheckedStatus).toBe('function');
    });

    it('应该在非多选模式下返回空值', () => {
      const props = { ...defaultProps, multiple: false };
      const { result } = renderHook(() => useCascaderMultiple(props));

      expect(result.current.currentSelectedPath).toEqual([]);
      expect(result.current.currentValue).toEqual([]);
      expect(result.current.displayText).toBe('');
    });
  });

  describe('currentSelectedPath', () => {
    it('应该在多选模式下返回选中的选项', () => {
      const checkedOptions = [
        { value: 'option1-1', label: 'Option 1-1' },
        { value: 'option2-1', label: 'Option 2-1' },
      ];

      mockGetCheckedOptions.mockReturnValue(checkedOptions);

      const props = { ...defaultProps, checkedKeys: new Set(['option1-1', 'option2-1']) };
      const { result } = renderHook(() => useCascaderMultiple(props));

      expect(result.current.currentSelectedPath).toBe(checkedOptions);
      expect(mockGetCheckedOptions).toHaveBeenCalledWith(mockOptions, new Set(['option1-1', 'option2-1']));
    });

    it('应该在非多选模式下返回空数组', () => {
      const props = { ...defaultProps, multiple: false };
      const { result } = renderHook(() => useCascaderMultiple(props));

      expect(result.current.currentSelectedPath).toEqual([]);
    });
  });

  describe('currentValue', () => {
    it('应该在多选模式下返回所有选中路径的值数组', () => {
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
      mockGetValueFromPath.mockReturnValueOnce(['option1', 'option1-1']).mockReturnValueOnce(['option2', 'option2-1']);

      const props = { ...defaultProps, checkedKeys: new Set(['option1-1', 'option2-1']) };
      const { result } = renderHook(() => useCascaderMultiple(props));

      expect(result.current.currentValue).toEqual([
        ['option1', 'option1-1'],
        ['option2', 'option2-1'],
      ]);
      expect(mockGetCheckedPaths).toHaveBeenCalledWith(mockOptions, new Set(['option1-1', 'option2-1']));
    });

    it('应该在非多选模式下返回空数组', () => {
      const props = { ...defaultProps, multiple: false };
      const { result } = renderHook(() => useCascaderMultiple(props));

      expect(result.current.currentValue).toEqual([]);
    });
  });

  describe('displayText', () => {
    it('应该在多选模式下显示选中项数量', () => {
      const checkedOptions = [
        { value: 'option1-1', label: 'Option 1-1' },
        { value: 'option2-1', label: 'Option 2-1' },
      ];

      mockGetCheckedOptions.mockReturnValue(checkedOptions);

      const props = { ...defaultProps, checkedKeys: new Set(['option1-1', 'option2-1']) };
      const { result } = renderHook(() => useCascaderMultiple(props));

      expect(result.current.displayText).toBe('已选择 2 项');
    });

    it('应该在没有选中项时返回空字符串', () => {
      mockGetCheckedOptions.mockReturnValue([]);

      const { result } = renderHook(() => useCascaderMultiple(defaultProps));

      expect(result.current.displayText).toBe('');
    });

    it('应该在非多选模式下返回空字符串', () => {
      const props = { ...defaultProps, multiple: false };
      const { result } = renderHook(() => useCascaderMultiple(props));

      expect(result.current.displayText).toBe('');
    });
  });

  describe('handleMultipleSelect', () => {
    it('应该正确处理多选状态变化', () => {
      const setCheckedKeys = jest.fn();
      const setHalfCheckedKeys = jest.fn();
      const onChange = jest.fn();

      const newCheckedKeys = new Set(['option1-1']);
      const newHalfCheckedKeys = new Set(['option1']);
      const checkedPaths = [
        [
          { value: 'option1', label: 'Option 1' },
          { value: 'option1-1', label: 'Option 1-1' },
        ],
      ];

      mockUpdateCheckedKeys.mockReturnValue(newCheckedKeys);
      mockGetHalfCheckedKeys.mockReturnValue(newHalfCheckedKeys);
      mockGetCheckedPaths.mockReturnValue(checkedPaths);
      mockGetValueFromPath.mockReturnValue(['option1', 'option1-1']);

      const props = {
        ...defaultProps,
        setCheckedKeys,
        setHalfCheckedKeys,
        onChange,
      };

      const { result } = renderHook(() => useCascaderMultiple(props));

      const option = { value: 'option1-1', label: 'Option 1-1' };

      act(() => {
        result.current.handleMultipleSelect(option, true);
      });

      expect(mockUpdateCheckedKeys).toHaveBeenCalledWith(option, true, new Set());
      expect(mockGetHalfCheckedKeys).toHaveBeenCalledWith(mockOptions, newCheckedKeys);
      expect(setCheckedKeys).toHaveBeenCalledWith(newCheckedKeys);
      expect(setHalfCheckedKeys).toHaveBeenCalledWith(newHalfCheckedKeys);
      expect(onChange).toHaveBeenCalledWith([['option1', 'option1-1']], checkedPaths);
    });

    it('应该在搜索模式下选择项目后清空搜索', () => {
      const setSearchValue = jest.fn();
      const onChange = jest.fn();

      const props = {
        ...defaultProps,
        showSearch: true,
        searchValue: 'search term',
        setSearchValue,
        onChange,
      };

      const { result } = renderHook(() => useCascaderMultiple(props));

      const option = { value: 'option1-1', label: 'Option 1-1' };

      act(() => {
        result.current.handleMultipleSelect(option, true);
      });

      expect(setSearchValue).toHaveBeenCalledWith('');
    });

    it('应该在非多选模式下不执行任何操作', () => {
      const setCheckedKeys = jest.fn();
      const onChange = jest.fn();

      const props = {
        ...defaultProps,
        multiple: false,
        setCheckedKeys,
        onChange,
      };

      const { result } = renderHook(() => useCascaderMultiple(props));

      const option = { value: 'option1-1', label: 'Option 1-1' };

      act(() => {
        result.current.handleMultipleSelect(option, true);
      });

      expect(setCheckedKeys).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('getOptionCheckedStatus', () => {
    it('应该在多选模式下返回正确的选中状态', () => {
      mockGetNodeCheckedStatus.mockReturnValue('checked');

      const props = { ...defaultProps, checkedKeys: new Set(['option1-1']) };
      const { result } = renderHook(() => useCascaderMultiple(props));

      const option = { value: 'option1-1', label: 'Option 1-1' };
      const status = result.current.getOptionCheckedStatus(option);

      expect(status).toBe('checked');
      expect(mockGetNodeCheckedStatus).toHaveBeenCalledWith(option, new Set(['option1-1']));
    });

    it('应该在非多选模式下返回 unchecked', () => {
      const props = { ...defaultProps, multiple: false };
      const { result } = renderHook(() => useCascaderMultiple(props));

      const option = { value: 'option1-1', label: 'Option 1-1' };
      const status = result.current.getOptionCheckedStatus(option);

      expect(status).toBe('unchecked');
    });

    it('应该正确处理不同的选中状态', () => {
      const testCases: CheckedStatus[] = ['checked', 'unchecked', 'indeterminate'];

      testCases.forEach(expectedStatus => {
        mockGetNodeCheckedStatus.mockReturnValue(expectedStatus);

        const { result } = renderHook(() => useCascaderMultiple(defaultProps));

        const option = { value: 'option1-1', label: 'Option 1-1' };
        const status = result.current.getOptionCheckedStatus(option);

        expect(status).toBe(expectedStatus);
      });
    });
  });

  describe('状态变化响应', () => {
    it('应该在 checkedKeys 变化时重新计算值', () => {
      const checkedPaths1 = [
        [
          { value: 'option1', label: 'Option 1' },
          { value: 'option1-1', label: 'Option 1-1' },
        ],
      ];
      const checkedPaths2 = [
        [
          { value: 'option1', label: 'Option 1' },
          { value: 'option1-1', label: 'Option 1-1' },
        ],
        [
          { value: 'option2', label: 'Option 2' },
          { value: 'option2-1', label: 'Option 2-1' },
        ],
      ];

      mockGetCheckedPaths.mockReturnValueOnce(checkedPaths1).mockReturnValueOnce(checkedPaths2);

      mockGetValueFromPath
        .mockReturnValueOnce(['option1', 'option1-1'])
        .mockReturnValueOnce(['option1', 'option1-1'])
        .mockReturnValueOnce(['option2', 'option2-1']);

      const initialProps = { ...defaultProps, checkedKeys: new Set(['option1-1']) };
      const { result, rerender } = renderHook(props => useCascaderMultiple(props), { initialProps });

      expect(result.current.currentValue).toEqual([['option1', 'option1-1']]);

      const updatedProps = { ...defaultProps, checkedKeys: new Set(['option1-1', 'option2-1']) };
      rerender(updatedProps);

      expect(result.current.currentValue).toEqual([
        ['option1', 'option1-1'],
        ['option2', 'option2-1'],
      ]);
    });
  });

  describe('边界情况', () => {
    it('应该处理空的 options 数组', () => {
      const props = { ...defaultProps, options: [] };
      const { result } = renderHook(() => useCascaderMultiple(props));

      expect(result.current.currentSelectedPath).toEqual([]);
      expect(result.current.currentValue).toEqual([]);
      expect(result.current.displayText).toBe('');
    });

    it('应该处理 undefined 的 onChange 回调', () => {
      const props = { ...defaultProps, onChange: undefined };
      const { result } = renderHook(() => useCascaderMultiple(props));

      const option = { value: 'option1-1', label: 'Option 1-1' };

      act(() => {
        result.current.handleMultipleSelect(option, true);
      });

      // 应该不会抛出错误
      expect(() => {
        result.current.handleMultipleSelect(option, true);
      }).not.toThrow();
    });
  });
});
