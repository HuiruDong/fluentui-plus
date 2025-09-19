import { defaultFilterOption, filterCascaderOptions } from '../../../utils/core/search';
import type { CascaderOption, CascaderSearchResult } from '../../../types';

// Mock the tree module functions
jest.mock('../../../utils/core/tree', () => ({
  flattenOptions: jest.fn(),
  hasChildren: jest.fn(),
}));

// Mock the path module functions
jest.mock('../../../utils/core/path', () => ({
  getLabelsFromPath: jest.fn(),
}));

import { flattenOptions, hasChildren } from '../../../utils/core/tree';
import { getLabelsFromPath } from '../../../utils/core/path';

const mockFlattenOptions = flattenOptions as jest.MockedFunction<typeof flattenOptions>;
const mockHasChildren = hasChildren as jest.MockedFunction<typeof hasChildren>;
const mockGetLabelsFromPath = getLabelsFromPath as jest.MockedFunction<typeof getLabelsFromPath>;

describe('search.ts', () => {
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
            {
              value: 'xihu',
              label: '西湖',
            },
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
        },
      ],
    },
  ];

  const mockSearchResults: CascaderSearchResult[] = [
    {
      option: { value: 'zhejiang', label: '浙江' },
      path: [{ value: 'zhejiang', label: '浙江' }],
      value: ['zhejiang'],
      label: '浙江',
    },
    {
      option: { value: 'hangzhou', label: '杭州' },
      path: [
        { value: 'zhejiang', label: '浙江' },
        { value: 'hangzhou', label: '杭州' },
      ],
      value: ['zhejiang', 'hangzhou'],
      label: '浙江 / 杭州',
    },
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
      option: { value: 'jiangsu', label: '江苏' },
      path: [{ value: 'jiangsu', label: '江苏' }],
      value: ['jiangsu'],
      label: '江苏',
    },
    {
      option: { value: 'nanjing', label: '南京' },
      path: [
        { value: 'jiangsu', label: '江苏' },
        { value: 'nanjing', label: '南京' },
      ],
      value: ['jiangsu', 'nanjing'],
      label: '江苏 / 南京',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('defaultFilterOption', () => {
    test('should return true for empty input', () => {
      const path = [{ value: 'test', label: 'Test' }];
      mockGetLabelsFromPath.mockReturnValue(['Test']);

      const result = defaultFilterOption('', path);
      expect(result).toBe(true);
    });

    test('should return true for null input', () => {
      const path = [{ value: 'test', label: 'Test' }];
      mockGetLabelsFromPath.mockReturnValue(['Test']);

      const result = defaultFilterOption(null as any, path);
      expect(result).toBe(true);
    });

    test('should return true for undefined input', () => {
      const path = [{ value: 'test', label: 'Test' }];
      mockGetLabelsFromPath.mockReturnValue(['Test']);

      const result = defaultFilterOption(undefined as any, path);
      expect(result).toBe(true);
    });

    test('should match case-insensitive search', () => {
      const path = [
        { value: 'zhejiang', label: '浙江' },
        { value: 'hangzhou', label: '杭州' },
      ];
      mockGetLabelsFromPath.mockReturnValue(['浙江', '杭州']);

      expect(defaultFilterOption('浙江', path)).toBe(true);
      expect(defaultFilterOption('HANGZHOU', path)).toBe(false); // 中文没有大小写，所以这里检查英文
    });

    test('should match partial strings', () => {
      const path = [{ value: 'hangzhou', label: '杭州市' }];
      mockGetLabelsFromPath.mockReturnValue(['杭州市']);

      expect(defaultFilterOption('杭州', path)).toBe(true);
      expect(defaultFilterOption('州市', path)).toBe(true);
      expect(defaultFilterOption('市', path)).toBe(true);
    });

    test('should return false for non-matching search', () => {
      const path = [{ value: 'hangzhou', label: '杭州' }];
      mockGetLabelsFromPath.mockReturnValue(['杭州']);

      expect(defaultFilterOption('北京', path)).toBe(false);
      expect(defaultFilterOption('shanghai', path)).toBe(false);
    });

    test('should match any label in the path', () => {
      const path = [
        { value: 'zhejiang', label: '浙江' },
        { value: 'hangzhou', label: '杭州' },
        { value: 'xihu', label: '西湖' },
      ];
      mockGetLabelsFromPath.mockReturnValue(['浙江', '杭州', '西湖']);

      expect(defaultFilterOption('浙江', path)).toBe(true);
      expect(defaultFilterOption('杭州', path)).toBe(true);
      expect(defaultFilterOption('西湖', path)).toBe(true);
    });

    test('should handle empty labels array', () => {
      const path = [{ value: 'test', label: 'Test' }];
      mockGetLabelsFromPath.mockReturnValue([]);

      expect(defaultFilterOption('test', path)).toBe(false);
    });

    test('should handle labels with empty strings', () => {
      const path = [{ value: 'test' }];
      mockGetLabelsFromPath.mockReturnValue(['', 'Test', '']);

      expect(defaultFilterOption('test', path)).toBe(true); // 'Test' contains 'test' case-insensitively
      expect(defaultFilterOption('nonexistent', path)).toBe(false);
    });

    test('should handle mixed language search', () => {
      const path = [
        { value: 'china', label: 'China' },
        { value: 'zhejiang', label: '浙江' },
      ];
      mockGetLabelsFromPath.mockReturnValue(['China', '浙江']);

      expect(defaultFilterOption('china', path)).toBe(true);
      expect(defaultFilterOption('浙江', path)).toBe(true);
    });
  });

  describe('filterCascaderOptions', () => {
    beforeEach(() => {
      mockFlattenOptions.mockReturnValue(mockSearchResults);
    });

    test('should return empty array for empty input', () => {
      const result = filterCascaderOptions(mockOptions, '');
      expect(result).toEqual([]);
    });

    test('should return empty array for null input', () => {
      const result = filterCascaderOptions(mockOptions, null as any);
      expect(result).toEqual([]);
    });

    test('should return empty array for undefined input', () => {
      const result = filterCascaderOptions(mockOptions, undefined as any);
      expect(result).toEqual([]);
    });

    test('should call flattenOptions with correct parameters', () => {
      filterCascaderOptions(mockOptions, 'test');
      expect(mockFlattenOptions).toHaveBeenCalledWith(mockOptions);
    });

    test('should filter options based on defaultFilterOption', () => {
      // Mock getLabelsFromPath to return labels for filtering
      mockGetLabelsFromPath
        .mockReturnValueOnce(['浙江'])
        .mockReturnValueOnce(['浙江', '杭州'])
        .mockReturnValueOnce(['浙江', '杭州', '西湖'])
        .mockReturnValueOnce(['江苏'])
        .mockReturnValueOnce(['江苏', '南京']);

      const result = filterCascaderOptions(mockOptions, '江');

      // Should call getLabelsFromPath for each search result
      expect(mockGetLabelsFromPath).toHaveBeenCalledTimes(5);

      // Should return all items that match '江' (浙江, 江苏 and their children)
      expect(result).toHaveLength(5); // All items match because they all contain '江'
    });

    test('should return only leaf nodes when changeOnSelect is false', () => {
      // Mock getLabelsFromPath to return all matching
      mockGetLabelsFromPath.mockReturnValue(['test']);

      // Mock hasChildren - only xihu and nanjing are leaf nodes
      mockHasChildren
        .mockReturnValueOnce(true) // zhejiang has children
        .mockReturnValueOnce(true) // hangzhou has children
        .mockReturnValueOnce(false) // xihu is leaf
        .mockReturnValueOnce(true) // jiangsu has children
        .mockReturnValueOnce(false); // nanjing is leaf

      const result = filterCascaderOptions(mockOptions, 'test', false);

      expect(mockHasChildren).toHaveBeenCalledTimes(5);
      expect(result).toHaveLength(2); // Only leaf nodes
    });

    test('should return all matching options when changeOnSelect is true', () => {
      // Mock getLabelsFromPath to return all matching
      mockGetLabelsFromPath.mockReturnValue(['test']);

      const result = filterCascaderOptions(mockOptions, 'test', true);

      // Should not call hasChildren when changeOnSelect is true
      expect(mockHasChildren).not.toHaveBeenCalled();
      expect(result).toHaveLength(5); // All matching options
    });

    test('should handle options with no matches', () => {
      // Mock getLabelsFromPath to return no matches
      mockGetLabelsFromPath.mockReturnValue(['nomatch']);

      const result = filterCascaderOptions(mockOptions, 'nonexistent');
      expect(result).toEqual([]);
    });

    test('should work with empty options array', () => {
      mockFlattenOptions.mockReturnValue([]);

      const result = filterCascaderOptions([], 'test');
      expect(result).toEqual([]);
      expect(mockFlattenOptions).toHaveBeenCalledWith([]);
    });

    test('should preserve search result structure', () => {
      mockGetLabelsFromPath.mockReturnValue(['match']);

      const result = filterCascaderOptions(mockOptions, 'test', true);

      // Each result should have the correct structure
      result.forEach(item => {
        expect(item).toHaveProperty('option');
        expect(item).toHaveProperty('path');
        expect(item).toHaveProperty('value');
        expect(item).toHaveProperty('label');
      });
    });

    test('should handle complex filtering scenarios', () => {
      // Create a scenario where some items match and some don't
      mockGetLabelsFromPath
        .mockReturnValueOnce(['浙江']) // matches '浙'
        .mockReturnValueOnce(['浙江', '杭州']) // matches '浙'
        .mockReturnValueOnce(['浙江', '杭州', '西湖']) // matches '浙'
        .mockReturnValueOnce(['江苏']) // doesn't match '浙'
        .mockReturnValueOnce(['江苏', '南京']); // doesn't match '浙'

      mockHasChildren
        .mockReturnValueOnce(true) // zhejiang has children
        .mockReturnValueOnce(true) // hangzhou has children
        .mockReturnValueOnce(false); // xihu is leaf

      const result = filterCascaderOptions(mockOptions, '浙', false);

      expect(result).toHaveLength(1); // Only xihu (leaf node that matches)
      expect(result[0].option.value).toBe('xihu');
    });
  });
});
