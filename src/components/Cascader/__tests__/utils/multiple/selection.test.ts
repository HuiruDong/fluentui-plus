import { updateCheckedKeys } from '../../../utils/multiple/selection';
import type { CascaderOption } from '../../../types';

// Mock the getDescendantLeafKeys function
jest.mock('../../../utils/core/tree', () => ({
  getDescendantLeafKeys: jest.fn(),
}));

import { getDescendantLeafKeys } from '../../../utils/core/tree';

const mockGetDescendantLeafKeys = getDescendantLeafKeys as jest.MockedFunction<typeof getDescendantLeafKeys>;

describe('selection utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateCheckedKeys', () => {
    const leafOption: CascaderOption = {
      label: 'Leaf Item',
      value: 'leaf',
    };

    const parentOption: CascaderOption = {
      label: 'Parent Item',
      value: 'parent',
      children: [
        { label: 'Child 1', value: 'child1' },
        { label: 'Child 2', value: 'child2' },
      ],
    };

    it('should return unchanged keys when option has undefined value', () => {
      const optionWithoutValue: CascaderOption = {
        label: 'No Value Option',
      };

      const currentCheckedKeys = new Set(['existing']);
      mockGetDescendantLeafKeys.mockReturnValue(new Set());

      const result = updateCheckedKeys(optionWithoutValue, true, currentCheckedKeys);

      expect(result).toEqual(currentCheckedKeys);
      expect(result).not.toBe(currentCheckedKeys); // Should be a new Set
      expect(mockGetDescendantLeafKeys).not.toHaveBeenCalled();
    });

    it('should add descendant leaf keys when checking an option', () => {
      const currentCheckedKeys = new Set(['existing']);
      const descendantKeys = new Set(['child1', 'child2']);
      mockGetDescendantLeafKeys.mockReturnValue(descendantKeys);

      const result = updateCheckedKeys(parentOption, true, currentCheckedKeys);

      expect(result).toContain('existing');
      expect(result).toContain('child1');
      expect(result).toContain('child2');
      expect(result.size).toBe(3);
      expect(mockGetDescendantLeafKeys).toHaveBeenCalledWith(parentOption);
    });

    it('should remove descendant leaf keys when unchecking an option', () => {
      const currentCheckedKeys = new Set(['existing', 'child1', 'child2', 'other']);
      const descendantKeys = new Set(['child1', 'child2']);
      mockGetDescendantLeafKeys.mockReturnValue(descendantKeys);

      const result = updateCheckedKeys(parentOption, false, currentCheckedKeys);

      expect(result).toContain('existing');
      expect(result).toContain('other');
      expect(result).not.toContain('child1');
      expect(result).not.toContain('child2');
      expect(result.size).toBe(2);
      expect(mockGetDescendantLeafKeys).toHaveBeenCalledWith(parentOption);
    });

    it('should handle leaf node selection (add its own key)', () => {
      const currentCheckedKeys = new Set(['existing']);
      const leafKeys = new Set(['leaf']);
      mockGetDescendantLeafKeys.mockReturnValue(leafKeys);

      const result = updateCheckedKeys(leafOption, true, currentCheckedKeys);

      expect(result).toContain('existing');
      expect(result).toContain('leaf');
      expect(result.size).toBe(2);
      expect(mockGetDescendantLeafKeys).toHaveBeenCalledWith(leafOption);
    });

    it('should handle leaf node deselection (remove its own key)', () => {
      const currentCheckedKeys = new Set(['existing', 'leaf']);
      const leafKeys = new Set(['leaf']);
      mockGetDescendantLeafKeys.mockReturnValue(leafKeys);

      const result = updateCheckedKeys(leafOption, false, currentCheckedKeys);

      expect(result).toContain('existing');
      expect(result).not.toContain('leaf');
      expect(result.size).toBe(1);
      expect(mockGetDescendantLeafKeys).toHaveBeenCalledWith(leafOption);
    });

    it('should handle empty current checked keys when checking', () => {
      const currentCheckedKeys = new Set<string | number>();
      const descendantKeys = new Set(['child1', 'child2']);
      mockGetDescendantLeafKeys.mockReturnValue(descendantKeys);

      const result = updateCheckedKeys(parentOption, true, currentCheckedKeys);

      expect(result).toContain('child1');
      expect(result).toContain('child2');
      expect(result.size).toBe(2);
    });

    it('should handle empty current checked keys when unchecking', () => {
      const currentCheckedKeys = new Set<string | number>();
      const descendantKeys = new Set(['child1', 'child2']);
      mockGetDescendantLeafKeys.mockReturnValue(descendantKeys);

      const result = updateCheckedKeys(parentOption, false, currentCheckedKeys);

      expect(result.size).toBe(0);
    });

    it('should handle option with no descendant leaf keys', () => {
      const emptyOption: CascaderOption = {
        label: 'Empty Option',
        value: 'empty',
      };

      const currentCheckedKeys = new Set(['existing']);
      const emptyDescendantKeys = new Set<string | number>();
      mockGetDescendantLeafKeys.mockReturnValue(emptyDescendantKeys);

      const result = updateCheckedKeys(emptyOption, true, currentCheckedKeys);

      expect(result).toContain('existing');
      expect(result.size).toBe(1);
      expect(mockGetDescendantLeafKeys).toHaveBeenCalledWith(emptyOption);
    });

    it('should handle numeric values', () => {
      const numericOption: CascaderOption = {
        label: 'Numeric Option',
        value: 123,
      };

      const currentCheckedKeys = new Set([456]);
      const numericDescendantKeys = new Set([123]);
      mockGetDescendantLeafKeys.mockReturnValue(numericDescendantKeys);

      const result = updateCheckedKeys(numericOption, true, currentCheckedKeys);

      expect(result).toContain(456);
      expect(result).toContain(123);
      expect(result.size).toBe(2);
    });

    it('should handle mixed string and numeric values', () => {
      const mixedOption: CascaderOption = {
        label: 'Mixed Option',
        value: 'parent',
      };

      const currentCheckedKeys = new Set(['existing', 789]);
      const mixedDescendantKeys = new Set(['child1', 456]);
      mockGetDescendantLeafKeys.mockReturnValue(mixedDescendantKeys);

      const result = updateCheckedKeys(mixedOption, true, currentCheckedKeys);

      expect(result).toContain('existing');
      expect(result).toContain(789);
      expect(result).toContain('child1');
      expect(result).toContain(456);
      expect(result.size).toBe(4);
    });

    it('should not modify the original checked keys set', () => {
      const currentCheckedKeys = new Set(['existing']);
      const originalSize = currentCheckedKeys.size;
      const descendantKeys = new Set(['child1']);
      mockGetDescendantLeafKeys.mockReturnValue(descendantKeys);

      const result = updateCheckedKeys(parentOption, true, currentCheckedKeys);

      expect(currentCheckedKeys.size).toBe(originalSize);
      expect(currentCheckedKeys).toContain('existing');
      expect(currentCheckedKeys).not.toContain('child1');
      expect(result).not.toBe(currentCheckedKeys);
    });
  });
});
