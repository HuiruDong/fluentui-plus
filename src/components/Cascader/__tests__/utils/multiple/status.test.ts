import { getNodeCheckedStatus, getHalfCheckedKeys } from '../../../utils/multiple/status';
import type { CascaderOption } from '../../../types';

// Mock the getDescendantLeafKeys function
jest.mock('../../../utils/core/tree', () => ({
  getDescendantLeafKeys: jest.fn(),
}));

import { getDescendantLeafKeys } from '../../../utils/core/tree';

const mockGetDescendantLeafKeys = getDescendantLeafKeys as jest.MockedFunction<typeof getDescendantLeafKeys>;

describe('status utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNodeCheckedStatus', () => {
    it('should return unchecked when option has undefined value', () => {
      const optionWithoutValue: CascaderOption = {
        label: 'No Value Option',
      };

      const checkedKeys = new Set(['any']);
      const result = getNodeCheckedStatus(optionWithoutValue, checkedKeys);

      expect(result).toBe('unchecked');
      expect(mockGetDescendantLeafKeys).not.toHaveBeenCalled();
    });

    it('should return checked for checked leaf node', () => {
      const leafOption: CascaderOption = {
        label: 'Leaf Item',
        value: 'leaf',
      };

      const checkedKeys = new Set(['leaf', 'other']);
      const result = getNodeCheckedStatus(leafOption, checkedKeys);

      expect(result).toBe('checked');
      expect(mockGetDescendantLeafKeys).not.toHaveBeenCalled();
    });

    it('should return unchecked for unchecked leaf node', () => {
      const leafOption: CascaderOption = {
        label: 'Leaf Item',
        value: 'leaf',
      };

      const checkedKeys = new Set(['other']);
      const result = getNodeCheckedStatus(leafOption, checkedKeys);

      expect(result).toBe('unchecked');
      expect(mockGetDescendantLeafKeys).not.toHaveBeenCalled();
    });

    it('should return checked when all descendant leaves are checked', () => {
      const parentOption: CascaderOption = {
        label: 'Parent Item',
        value: 'parent',
        children: [
          { label: 'Child 1', value: 'child1' },
          { label: 'Child 2', value: 'child2' },
        ],
      };

      const descendantKeys = new Set(['child1', 'child2']);
      const checkedKeys = new Set(['child1', 'child2', 'other']);
      mockGetDescendantLeafKeys.mockReturnValue(descendantKeys);

      const result = getNodeCheckedStatus(parentOption, checkedKeys);

      expect(result).toBe('checked');
      expect(mockGetDescendantLeafKeys).toHaveBeenCalledWith(parentOption);
    });

    it('should return unchecked when no descendant leaves are checked', () => {
      const parentOption: CascaderOption = {
        label: 'Parent Item',
        value: 'parent',
        children: [
          { label: 'Child 1', value: 'child1' },
          { label: 'Child 2', value: 'child2' },
        ],
      };

      const descendantKeys = new Set(['child1', 'child2']);
      const checkedKeys = new Set(['other']);
      mockGetDescendantLeafKeys.mockReturnValue(descendantKeys);

      const result = getNodeCheckedStatus(parentOption, checkedKeys);

      expect(result).toBe('unchecked');
      expect(mockGetDescendantLeafKeys).toHaveBeenCalledWith(parentOption);
    });

    it('should return indeterminate when some descendant leaves are checked', () => {
      const parentOption: CascaderOption = {
        label: 'Parent Item',
        value: 'parent',
        children: [
          { label: 'Child 1', value: 'child1' },
          { label: 'Child 2', value: 'child2' },
          { label: 'Child 3', value: 'child3' },
        ],
      };

      const descendantKeys = new Set(['child1', 'child2', 'child3']);
      const checkedKeys = new Set(['child1', 'child3', 'other']);
      mockGetDescendantLeafKeys.mockReturnValue(descendantKeys);

      const result = getNodeCheckedStatus(parentOption, checkedKeys);

      expect(result).toBe('indeterminate');
      expect(mockGetDescendantLeafKeys).toHaveBeenCalledWith(parentOption);
    });

    it('should handle option with empty children array', () => {
      const emptyParentOption: CascaderOption = {
        label: 'Empty Parent',
        value: 'empty',
        children: [],
      };

      const checkedKeys = new Set(['empty']);
      const result = getNodeCheckedStatus(emptyParentOption, checkedKeys);

      expect(result).toBe('checked');
      expect(mockGetDescendantLeafKeys).not.toHaveBeenCalled();
    });

    it('should handle numeric values', () => {
      const numericOption: CascaderOption = {
        label: 'Numeric Option',
        value: 123,
      };

      const checkedKeys = new Set([123, 456]);
      const result = getNodeCheckedStatus(numericOption, checkedKeys);

      expect(result).toBe('checked');
    });

    it('should handle parent with no descendant leaves', () => {
      const parentOption: CascaderOption = {
        label: 'Parent Item',
        value: 'parent',
        children: [{ label: 'Child 1', value: 'child1' }],
      };

      const emptyDescendantKeys = new Set<string | number>();
      const checkedKeys = new Set(['other']);
      mockGetDescendantLeafKeys.mockReturnValue(emptyDescendantKeys);

      const result = getNodeCheckedStatus(parentOption, checkedKeys);

      expect(result).toBe('unchecked');
      expect(mockGetDescendantLeafKeys).toHaveBeenCalledWith(parentOption);
    });
  });

  describe('getHalfCheckedKeys', () => {
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

    beforeEach(() => {
      // Setup mock returns for getDescendantLeafKeys
      mockGetDescendantLeafKeys.mockImplementation((option: CascaderOption) => {
        if (option.value === 'a') {
          return new Set(['a1', 'a2', 'a3-1', 'a3-2']);
        }
        if (option.value === 'a3') {
          return new Set(['a3-1', 'a3-2']);
        }
        if (option.value === 'b') {
          return new Set(['b1', 'b2']);
        }
        return new Set();
      });
    });

    it('should return empty set when no keys are checked', () => {
      const checkedKeys = new Set<string | number>();
      const result = getHalfCheckedKeys(mockOptions, checkedKeys);
      expect(result.size).toBe(0);
    });

    it('should return empty set when all leaf nodes are checked', () => {
      const checkedKeys = new Set(['a1', 'a2', 'a3-1', 'a3-2', 'b1', 'b2', 'single']);
      const result = getHalfCheckedKeys(mockOptions, checkedKeys);
      expect(result.size).toBe(0);
    });

    it('should return parent keys when some children are checked', () => {
      const checkedKeys = new Set(['a1', 'a3-1']);
      const result = getHalfCheckedKeys(mockOptions, checkedKeys);

      expect(result).toContain('a'); // Category A is indeterminate
      expect(result).toContain('a3'); // Group A3 is indeterminate
      expect(result.size).toBe(2);
    });

    it('should not include parent when all children are checked', () => {
      const checkedKeys = new Set(['a3-1', 'a3-2']);
      const result = getHalfCheckedKeys(mockOptions, checkedKeys);

      expect(result).toContain('a'); // Category A is indeterminate (a1, a2 not checked)
      expect(result).not.toContain('a3'); // Group A3 is fully checked
      expect(result.size).toBe(1);
    });

    it('should handle multiple indeterminate branches', () => {
      const checkedKeys = new Set(['a1', 'b1']);
      const result = getHalfCheckedKeys(mockOptions, checkedKeys);

      expect(result).toContain('a'); // Category A is indeterminate
      expect(result).toContain('b'); // Category B is indeterminate
      expect(result.size).toBe(2);
    });

    it('should handle options with undefined values', () => {
      const optionsWithUndefined: CascaderOption[] = [
        {
          label: 'No Value Group',
          children: [
            { label: 'Valid Item', value: 'valid' },
            { label: 'Another Item', value: 'another' },
          ],
        },
        {
          label: 'Normal Group',
          value: 'normal',
          children: [{ label: 'Child', value: 'child' }],
        },
      ];

      mockGetDescendantLeafKeys.mockImplementation((option: CascaderOption) => {
        if (option.value === 'normal') {
          return new Set(['child']);
        }
        return new Set();
      });

      const checkedKeys = new Set(['valid']);
      const result = getHalfCheckedKeys(optionsWithUndefined, checkedKeys);

      expect(result.size).toBe(0); // No value group should not be included
    });

    it('should handle empty options array', () => {
      const checkedKeys = new Set(['any']);
      const result = getHalfCheckedKeys([], checkedKeys);
      expect(result.size).toBe(0);
    });

    it('should handle leaf nodes only (no indeterminate states)', () => {
      const leafOnlyOptions: CascaderOption[] = [
        { label: 'Leaf 1', value: 'leaf1' },
        { label: 'Leaf 2', value: 'leaf2' },
      ];

      const checkedKeys = new Set(['leaf1']);
      const result = getHalfCheckedKeys(leafOnlyOptions, checkedKeys);
      expect(result.size).toBe(0);
    });

    it('should handle deeply nested structure', () => {
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
                  children: [
                    { label: 'Leaf 1', value: 'leaf1' },
                    { label: 'Leaf 2', value: 'leaf2' },
                  ],
                },
              ],
            },
          ],
        },
      ];

      mockGetDescendantLeafKeys.mockImplementation((option: CascaderOption) => {
        if (option.value === 'l1') {
          return new Set(['leaf1', 'leaf2']);
        }
        if (option.value === 'l2') {
          return new Set(['leaf1', 'leaf2']);
        }
        if (option.value === 'l3') {
          return new Set(['leaf1', 'leaf2']);
        }
        return new Set();
      });

      const checkedKeys = new Set(['leaf1']);
      const result = getHalfCheckedKeys(deepOptions, checkedKeys);

      expect(result).toContain('l1');
      expect(result).toContain('l2');
      expect(result).toContain('l3');
      expect(result.size).toBe(3);
    });

    it('should handle numeric values', () => {
      const numericOptions: CascaderOption[] = [
        {
          label: 'Numeric Parent',
          value: 100,
          children: [
            { label: 'Child 1', value: 101 },
            { label: 'Child 2', value: 102 },
          ],
        },
      ];

      mockGetDescendantLeafKeys.mockImplementation((option: CascaderOption) => {
        if (option.value === 100) {
          return new Set([101, 102]);
        }
        return new Set();
      });

      const checkedKeys = new Set([101]);
      const result = getHalfCheckedKeys(numericOptions, checkedKeys);

      expect(result).toContain(100);
      expect(result.size).toBe(1);
    });
  });
});
