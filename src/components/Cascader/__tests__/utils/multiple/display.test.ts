import { getCheckedOptions, getCheckedPaths, getDisplayPaths } from '../../../utils/multiple/display';
import type { CascaderOption } from '../../../types';

describe('display utils', () => {
  // 测试数据
  const mockOptions: CascaderOption[] = [
    {
      label: 'Category A',
      value: 'a',
      children: [
        { label: 'Item A1', value: 'a1' },
        { label: 'Item A2', value: 'a2' },
        {
          label: 'Group A3',
          value: 'a3',
          children: [
            { label: 'Item A3-1', value: 'a3-1' },
            { label: 'Item A3-2', value: 'a3-2' },
          ],
        },
      ],
    },
    {
      label: 'Category B',
      value: 'b',
      children: [
        { label: 'Item B1', value: 'b1' },
        { label: 'Item B2', value: 'b2' },
      ],
    },
    {
      label: 'Single Item',
      value: 'single',
    },
  ];

  describe('getCheckedOptions', () => {
    it('should return empty array when no keys are checked', () => {
      const checkedKeys = new Set<string | number>();
      const result = getCheckedOptions(mockOptions, checkedKeys);
      expect(result).toEqual([]);
    });

    it('should return only leaf nodes that are checked', () => {
      const checkedKeys = new Set(['a1', 'a3-1', 'b2', 'single']);
      const result = getCheckedOptions(mockOptions, checkedKeys);

      expect(result).toHaveLength(4);
      expect(result.map(option => option.value)).toEqual(['a1', 'a3-1', 'b2', 'single']);
      expect(result.map(option => option.label)).toEqual(['Item A1', 'Item A3-1', 'Item B2', 'Single Item']);
    });

    it('should not return non-leaf nodes even if they are checked', () => {
      const checkedKeys = new Set(['a', 'a3', 'b1']);
      const result = getCheckedOptions(mockOptions, checkedKeys);

      expect(result).toHaveLength(1);
      expect(result[0].value).toBe('b1');
      expect(result[0].label).toBe('Item B1');
    });

    it('should not traverse children of nodes with undefined values', () => {
      const optionsWithUndefined: CascaderOption[] = [
        {
          label: 'No Value Group',
          // no value property - children will not be traversed
          children: [{ label: 'Valid Item', value: 'valid' }],
        },
        { label: 'Another Valid', value: 'another' },
      ];

      const checkedKeys = new Set(['valid', 'another']);
      const result = getCheckedOptions(optionsWithUndefined, checkedKeys);

      // Should only find 'another' since 'valid' is under a node with no value
      expect(result).toHaveLength(1);
      expect(result.map(option => option.value)).toEqual(['another']);
    });

    it('should handle empty options array', () => {
      const checkedKeys = new Set(['any']);
      const result = getCheckedOptions([], checkedKeys);
      expect(result).toEqual([]);
    });

    it('should handle deeply nested options', () => {
      const deepOptions: CascaderOption[] = [
        {
          label: 'Level 1',
          value: 'l1',
          children: [
            {
              label: 'Level 2',
              value: 'l2',
              children: [
                {
                  label: 'Level 3',
                  value: 'l3',
                  children: [{ label: 'Leaf', value: 'leaf' }],
                },
              ],
            },
          ],
        },
      ];

      const checkedKeys = new Set(['leaf']);
      const result = getCheckedOptions(deepOptions, checkedKeys);

      expect(result).toHaveLength(1);
      expect(result[0].value).toBe('leaf');
    });
  });

  describe('getCheckedPaths', () => {
    it('should return empty array when no keys are checked', () => {
      const checkedKeys = new Set<string | number>();
      const result = getCheckedPaths(mockOptions, checkedKeys);
      expect(result).toEqual([]);
    });

    it('should return complete paths for checked leaf nodes', () => {
      const checkedKeys = new Set(['a1', 'a3-1']);
      const result = getCheckedPaths(mockOptions, checkedKeys);

      expect(result).toHaveLength(2);

      // Path for a1: [Category A, Item A1]
      expect(result[0]).toHaveLength(2);
      expect(result[0][0].value).toBe('a');
      expect(result[0][1].value).toBe('a1');

      // Path for a3-1: [Category A, Group A3, Item A3-1]
      expect(result[1]).toHaveLength(3);
      expect(result[1][0].value).toBe('a');
      expect(result[1][1].value).toBe('a3');
      expect(result[1][2].value).toBe('a3-1');
    });

    it('should include path for single-level checked leaf', () => {
      const checkedKeys = new Set(['single']);
      const result = getCheckedPaths(mockOptions, checkedKeys);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
      expect(result[0][0].value).toBe('single');
      expect(result[0][0].label).toBe('Single Item');
    });

    it('should not return paths for non-leaf nodes', () => {
      const checkedKeys = new Set(['a', 'a3']);
      const result = getCheckedPaths(mockOptions, checkedKeys);
      expect(result).toEqual([]);
    });

    it('should not traverse children of nodes with undefined values', () => {
      const optionsWithUndefined: CascaderOption[] = [
        {
          label: 'No Value Group',
          // no value property - will not traverse children
          children: [{ label: 'Valid Item', value: 'valid' }],
        },
        { label: 'Direct Valid', value: 'direct' },
      ];

      const checkedKeys = new Set(['valid', 'direct']);
      const result = getCheckedPaths(optionsWithUndefined, checkedKeys);

      // Should only find the direct valid item, not the nested one
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
      expect(result[0][0].value).toBe('direct');
    });

    it('should handle multiple checked items across different branches', () => {
      const checkedKeys = new Set(['a1', 'b2', 'single']);
      const result = getCheckedPaths(mockOptions, checkedKeys);

      expect(result).toHaveLength(3);

      // Verify all paths are correct
      const pathValues = result.map(path => path.map(node => node.value));
      expect(pathValues).toContainEqual(['a', 'a1']);
      expect(pathValues).toContainEqual(['b', 'b2']);
      expect(pathValues).toContainEqual(['single']);
    });

    it('should handle empty options array', () => {
      const checkedKeys = new Set(['any']);
      const result = getCheckedPaths([], checkedKeys);
      expect(result).toEqual([]);
    });
  });

  describe('getDisplayPaths', () => {
    it('should return the same paths as input', () => {
      const paths: CascaderOption[][] = [
        [
          { label: 'Category A', value: 'a' },
          { label: 'Item A1', value: 'a1' },
        ],
        [
          { label: 'Category B', value: 'b' },
          { label: 'Item B1', value: 'b1' },
        ],
      ];

      const result = getDisplayPaths(paths);
      expect(result).toEqual(paths);
      expect(result).toBe(paths); // Should return the same reference
    });

    it('should handle empty paths array', () => {
      const paths: CascaderOption[][] = [];
      const result = getDisplayPaths(paths);
      expect(result).toEqual([]);
      expect(result).toBe(paths);
    });

    it('should handle single path', () => {
      const paths: CascaderOption[][] = [[{ label: 'Single Item', value: 'single' }]];

      const result = getDisplayPaths(paths);
      expect(result).toEqual(paths);
      expect(result).toBe(paths);
    });

    it('should handle paths with different depths', () => {
      const paths: CascaderOption[][] = [
        [{ label: 'Single', value: 'single' }],
        [
          { label: 'Category', value: 'cat' },
          { label: 'Subcategory', value: 'sub' },
          { label: 'Item', value: 'item' },
        ],
      ];

      const result = getDisplayPaths(paths);
      expect(result).toEqual(paths);
      expect(result).toBe(paths);
    });
  });
});
