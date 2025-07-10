import {
  findParentKeys,
  findMenuItem,
  getAllChildKeys,
  hasChildren,
  generateClassName,
  generateKeyPath,
} from '../utils';
import { NavItemType } from '../types';

describe('Nav utils', () => {
  // 测试数据
  const mockNavItems: NavItemType[] = [
    {
      key: 'menu1',
      label: 'Menu 1',
      children: [
        {
          key: 'submenu1-1',
          label: 'Submenu 1-1',
          children: [
            { key: 'item1-1-1', label: 'Item 1-1-1' },
            { key: 'item1-1-2', label: 'Item 1-1-2' },
          ],
        },
        { key: 'item1-2', label: 'Item 1-2' },
      ],
    },
    {
      key: 'group1',
      type: 'group',
      label: 'Group 1',
      children: [
        { key: 'group-item1', label: 'Group Item 1' },
        { key: 'group-item2', label: 'Group Item 2' },
      ],
    },
    { key: 'menu2', label: 'Menu 2' },
    { key: 'divider1', type: 'divider' },
    { key: 'menu3', label: 'Menu 3' },
  ];

  describe('findParentKeys', () => {
    it('should return empty array for root level items', () => {
      expect(findParentKeys(mockNavItems, 'menu1')).toEqual([]);
      expect(findParentKeys(mockNavItems, 'menu2')).toEqual([]);
    });

    it('should return parent keys for nested items', () => {
      expect(findParentKeys(mockNavItems, 'submenu1-1')).toEqual(['menu1']);
      expect(findParentKeys(mockNavItems, 'item1-1-1')).toEqual(['menu1', 'submenu1-1']);
      expect(findParentKeys(mockNavItems, 'item1-2')).toEqual(['menu1']);
    });

    it('should exclude group type from parent keys', () => {
      expect(findParentKeys(mockNavItems, 'group-item1')).toEqual([]);
      expect(findParentKeys(mockNavItems, 'group-item2')).toEqual([]);
    });

    it('should return empty array for non-existent keys', () => {
      expect(findParentKeys(mockNavItems, 'non-existent')).toEqual([]);
    });

    it('should handle empty items array', () => {
      expect(findParentKeys([], 'any-key')).toEqual([]);
    });
  });

  describe('findMenuItem', () => {
    it('should find root level items', () => {
      const result = findMenuItem(mockNavItems, 'menu1');
      expect(result).toEqual({
        key: 'menu1',
        label: 'Menu 1',
        children: expect.any(Array),
      });
    });

    it('should find nested items', () => {
      const result = findMenuItem(mockNavItems, 'item1-1-1');
      expect(result).toEqual({
        key: 'item1-1-1',
        label: 'Item 1-1-1',
      });
    });

    it('should find items in group', () => {
      const result = findMenuItem(mockNavItems, 'group-item1');
      expect(result).toEqual({
        key: 'group-item1',
        label: 'Group Item 1',
      });
    });

    it('should return null for non-existent items', () => {
      expect(findMenuItem(mockNavItems, 'non-existent')).toBeNull();
    });

    it('should handle empty items array', () => {
      expect(findMenuItem([], 'any-key')).toBeNull();
    });
  });

  describe('getAllChildKeys', () => {
    it('should return all child keys recursively', () => {
      const menuItem = mockNavItems[0]; // menu1
      const result = getAllChildKeys(menuItem);
      expect(result).toEqual(['submenu1-1', 'item1-1-1', 'item1-1-2', 'item1-2']);
    });

    it('should return direct child keys only for single level', () => {
      const groupItem = mockNavItems[1]; // group1
      const result = getAllChildKeys(groupItem);
      expect(result).toEqual(['group-item1', 'group-item2']);
    });

    it('should return empty array for items without children', () => {
      const leafItem = { key: 'leaf', label: 'Leaf Item' };
      expect(getAllChildKeys(leafItem)).toEqual([]);
    });

    it('should handle items with empty children array', () => {
      const itemWithEmptyChildren = { key: 'empty', label: 'Empty', children: [] };
      expect(getAllChildKeys(itemWithEmptyChildren)).toEqual([]);
    });
  });

  describe('hasChildren', () => {
    it('should return true for items with children', () => {
      const itemWithChildren = { key: 'parent', label: 'Parent', children: [{ key: 'child', label: 'Child' }] };
      expect(hasChildren(itemWithChildren)).toBe(true);
    });

    it('should return false for items without children', () => {
      const leafItem = { key: 'leaf', label: 'Leaf' };
      expect(hasChildren(leafItem)).toBe(false);
    });

    it('should return false for group type even with children', () => {
      const groupItem = { key: 'group', type: 'group' as const, children: [{ key: 'child', label: 'Child' }] };
      expect(hasChildren(groupItem)).toBe(false);
    });

    it('should return false for divider type', () => {
      const dividerItem = { key: 'divider', type: 'divider' as const };
      expect(hasChildren(dividerItem)).toBe(false);
    });

    it('should return false for items with empty children array', () => {
      const itemWithEmptyChildren = { key: 'empty', label: 'Empty', children: [] };
      expect(hasChildren(itemWithEmptyChildren)).toBe(false);
    });
  });

  describe('generateClassName', () => {
    it('should generate class name with prefix only', () => {
      expect(generateClassName('nav')).toBe('nav');
    });

    it('should generate class name with prefix and suffix', () => {
      expect(generateClassName('nav', 'item')).toBe('nav-item');
    });

    it('should handle empty strings', () => {
      expect(generateClassName('')).toBe('');
      expect(generateClassName('nav', '')).toBe('nav');
    });
  });

  describe('generateKeyPath', () => {
    it('should generate key path for root level items', () => {
      expect(generateKeyPath(mockNavItems, 'menu1')).toEqual(['menu1']);
      expect(generateKeyPath(mockNavItems, 'menu2')).toEqual(['menu2']);
    });

    it('should generate key path for nested items', () => {
      expect(generateKeyPath(mockNavItems, 'item1-1-1')).toEqual(['item1-1-1', 'submenu1-1', 'menu1']);
      expect(generateKeyPath(mockNavItems, 'item1-2')).toEqual(['item1-2', 'menu1']);
    });

    it('should generate key path for items in group (excluding group from path)', () => {
      expect(generateKeyPath(mockNavItems, 'group-item1')).toEqual(['group-item1']);
    });

    it('should return single item array for non-existent keys', () => {
      expect(generateKeyPath(mockNavItems, 'non-existent')).toEqual(['non-existent']);
    });

    it('should handle empty items array', () => {
      expect(generateKeyPath([], 'any-key')).toEqual(['any-key']);
    });
  });
});
